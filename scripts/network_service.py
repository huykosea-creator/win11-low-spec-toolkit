# -*- coding: utf-8 -*-
"""
Network Diagnostics, Real ICMP/TCP Ping & Link Speed Service
Nhan dien card mang, toc do dam phan vat ly (Link Speed 10M/100M/1G/2.5G/10G),
chan doan benh dut cap 4 soi/8 soi va do do tre Ping ICMP/TCP chinh xac cho ky thuat vien.
"""

from concurrent.futures import ThreadPoolExecutor
import json
import os
import re
import socket
import subprocess
import sys
import time

_cache_adapters = None
_cache_time = 0


def _format_link_speed(speed_bps, card_type="ethernet", is_up=True):
    """Chuyen doi SpeedBps sang chuoi hien thi chuan va gia tri Mbps."""
    try:
        bps = int(speed_bps or 0)
    except Exception:
        bps = 0

    if bps <= 0 or not is_up:
        return ("Chưa kết nối", 0)

    # Cac card VPN ao nhu Tailscale/WireGuard thuong bao 100 Gbps (100_000_000_000)
    if card_type == "virtual" and bps >= 10_000_000_000:
        return ("VPN Tunnel (Ảo)", 1000)

    mbps = bps / 1_000_000.0
    if mbps >= 1000:
        gbps = mbps / 1000.0
        if abs(gbps - round(gbps)) < 0.05:
            return (f"{gbps:.1f} Gbps", int(round(mbps)))
        return (f"{gbps:.2f} Gbps".rstrip("0").rstrip(".") + " Gbps" if not f"{gbps:.1f}".endswith(".5") else f"{gbps:.1f} Gbps", int(round(mbps)))
    elif mbps >= 1:
        return (f"{int(round(mbps))} Mbps", int(round(mbps)))
    else:
        kbps = max(1, int(round(bps / 1000.0)))
        return (f"{kbps} Kbps", 1)


def _format_mac(raw_mac):
    """Chuan hoa dia chi MAC sang dang XX-XX-XX-XX-XX-XX."""
    clean = re.sub(r"[^0-9A-Fa-f]", "", str(raw_mac or "")).upper()
    if len(clean) == 12:
        return "-".join(clean[i:i + 2] for i in range(0, 12, 2))
    return str(raw_mac or "").strip()


def _query_dotnet_network_interfaces():
    """
    Truy van danh sach card mang qua .NET NetworkInterface (khong phu thuoc WMI/CIM,
    hoat dong ca khi dịch vu WMI bi loi hoac bi gioi han quyen).
    """
    ps_script = (
        "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; "
        "[System.Net.NetworkInformation.NetworkInterface]::GetAllNetworkInterfaces() | "
        "Where-Object { $_.NetworkInterfaceType -ne 'Loopback' } | "
        "ForEach-Object { "
        "$ipProps = $_.GetIPProperties(); "
        "$ipv4 = ($ipProps.UnicastAddresses | Where-Object { $_.Address.AddressFamily -eq 'InterNetwork' } | "
        "Select-Object -First 1).Address.IPAddressToString; "
        "$gw = ($ipProps.GatewayAddresses | Where-Object { $_.Address.AddressFamily -eq 'InterNetwork' -and "
        "$_.Address.IPAddressToString -ne '0.0.0.0' } | Select-Object -First 1).Address.IPAddressToString; "
        "[PSCustomObject]@{ "
        "Name = $_.Name; "
        "Desc = $_.Description; "
        "Status = $_.OperationalStatus.ToString(); "
        "SpeedBps = [int64]$_.Speed; "
        "Type = $_.NetworkInterfaceType.ToString(); "
        "Mac = $_.GetPhysicalAddress().ToString(); "
        "IP = [string]$ipv4; "
        "Gateway = [string]$gw "
        "} } | ConvertTo-Json -Compress"
    )
    proc = subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_script],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=8,
        creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
    )
    raw_out = (proc.stdout or "").strip()
    if not raw_out:
        return []
    parsed = json.loads(raw_out)
    return [parsed] if isinstance(parsed, dict) else (parsed if isinstance(parsed, list) else [])


def _query_get_netadapter_fallback():
    """Fallback qua Get-NetAdapter neu can."""
    ps_script = (
        "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; "
        "Get-NetAdapter | Select-Object Name, InterfaceDescription, Status, LinkSpeed, MediaType, MacAddress | "
        "ConvertTo-Json -Compress"
    )
    proc = subprocess.run(
        ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_script],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        timeout=8,
        creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
    )
    raw_out = (proc.stdout or "").strip()
    if not raw_out:
        return []
    parsed = json.loads(raw_out)
    return [parsed] if isinstance(parsed, dict) else (parsed if isinstance(parsed, list) else [])


def scan_network_adapters(force_refresh=False):
    """
    Quet toan bo card mang qua .NET NetworkInterface + PowerShell va phan tich Link Speed.
    Tra ve danh sach cac card mang kem chan doan chi tiet.
    Co cache 15 giay de phan hoi tuc thi khi chuyen tab.
    """
    global _cache_adapters, _cache_time
    now = time.time()
    if not force_refresh and _cache_adapters and (now - _cache_time < 15):
        return _cache_adapters

    active_ip = ""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        active_ip = s.getsockname()[0]
        s.close()
    except Exception:
        active_ip = ""

    try:
        raw_list = []
        try:
            raw_list = _query_dotnet_network_interfaces()
        except Exception:
            raw_list = []

        if not raw_list:
            raw_list = _query_get_netadapter_fallback()

        if not raw_list:
            return {
                "status": "error",
                "message": "Không có dữ liệu card mạng trả về từ hệ thống.",
                "adapters": [],
                "total": 0,
                "connected_count": 0,
            }

        adapters = []
        noise_keywords = (
            "wan miniport",
            "microsoft wi-fi direct virtual adapter",
            "microsoft hosted network virtual adapter",
            "kernel debug network adapter",
            "teredo tunneling",
            "isatap",
            "6to4 adapter",
        )

        for item in raw_list:
            name = str(item.get("Name") or "").strip()
            desc = str(item.get("Desc") or item.get("InterfaceDescription") or "").strip()
            status_raw = str(item.get("Status") or "").strip()
            media = str(item.get("Type") or item.get("MediaType") or "").strip()
            mac = _format_mac(item.get("Mac") or item.get("MacAddress") or "")
            is_up = status_raw.lower() == "up"

            name_lower = name.lower()
            desc_lower = desc.lower()
            media_lower = media.lower()

            # Bo qua cac adapter ao he thong cua Windows khi dang Down de danh sach gon gang
            if not is_up and any(k in desc_lower or k in name_lower for k in noise_keywords):
                continue

            # Phan loai Card mang
            if (
                "wireless80211" in media_lower
                or "802.11" in media_lower
                or "wi-fi" in name_lower
                or "wifi" in name_lower
                or "wireless" in desc_lower
                or "wlan" in desc_lower
                or "wi-fi" in desc_lower
            ):
                card_type = "wifi"
                type_label = "Mạng Không Dây (Wi-Fi)"
                icon = "📶"
            elif "bluetooth" in name_lower or "bluetooth" in desc_lower:
                card_type = "bluetooth"
                type_label = "Bluetooth PAN"
                icon = "🔷"
            elif (
                "tailscale" in name_lower
                or "tailscale" in desc_lower
                or "wireguard" in name_lower
                or "wireguard" in desc_lower
                or "openvpn" in desc_lower
                or "tap-windows" in desc_lower
                or "wintun" in desc_lower
                or "zerotier" in desc_lower
                or "radmin" in desc_lower
                or "vmware" in desc_lower
                or "virtualbox" in desc_lower
                or "hyper-v" in desc_lower
                or "vethernet" in name_lower
                or "vpn" in name_lower
                or "tunnel" in media_lower
                or "ppp" in media_lower
                or media_lower == "unknown"
            ):
                card_type = "virtual"
                type_label = "Mạng Ảo / VPN Tunnel"
                icon = "🔒"
            else:
                card_type = "ethernet"
                type_label = "Cáp Mạng LAN (RJ45 Ethernet)"
                icon = "🔌"

            # Tinh toc do Link Speed
            speed_bps = item.get("SpeedBps")
            speed_str = str(item.get("LinkSpeed") or item.get("Speed") or "").strip()
            speed_mbps = 0

            if speed_bps is not None:
                speed_str, speed_mbps = _format_link_speed(speed_bps, card_type=card_type, is_up=is_up)
            else:
                s_lower = speed_str.lower()
                if "gbps" in s_lower:
                    try:
                        num = float(s_lower.replace("gbps", "").strip())
                        speed_mbps = int(num * 1000)
                    except Exception:
                        speed_mbps = 1000
                elif "mbps" in s_lower:
                    try:
                        num = float(s_lower.replace("mbps", "").strip())
                        speed_mbps = int(num)
                    except Exception:
                        speed_mbps = 100
                elif "kbps" in s_lower:
                    speed_mbps = 1
                if not speed_str:
                    speed_str = "Chưa kết nối" if not is_up else "Đang kết nối"

            ip = str(item.get("IP") or "").strip()
            if not ip and is_up and card_type in ("ethernet", "wifi") and active_ip:
                ip = active_ip
            gw = str(item.get("Gateway") or "").strip()

            # Chan doan ky thuat vien
            diag_level = "info"
            diag_title = ""
            diag_advice = ""

            if not is_up:
                diag_level = "muted"
                diag_title = "Đang Ngắt Kết Nối / Chưa Cắm Dây"
                diag_advice = "Cổng mạng đang để trống, chưa cắm dây LAN RJ45 hoặc chưa bật kết nối."
            else:
                if card_type == "ethernet":
                    if speed_mbps >= 2500:
                        diag_level = "primary"
                        diag_title = f"Siêu Tốc Đa Gigabit ({speed_str})"
                        diag_advice = "Card mạng 2.5G/10G cực nhanh, khai thác tối đa băng thông Router/NAS/Switch cao cấp."
                    elif speed_mbps >= 1000:
                        diag_level = "success"
                        diag_title = f"Gigabit Hoàn Hảo ({speed_str})"
                        diag_advice = "Đạt chuẩn Gigabit! Cáp mạng đủ 8 sợi tiếp xúc tốt, đàm phán Full Duplex tối ưu."
                    elif speed_mbps == 100:
                        diag_level = "warning"
                        diag_title = "CẢNH BÁO NGHẼN: Tụt Về 100 Mbps"
                        diag_advice = "90% DO DÂY MẠNG: Dây chỉ có 4 sợi hoặc đứt ngầm sợi 4,5,7,8! Cần bấm lại hạt mạng RJ45 chuẩn 8 sợi Cat5e/Cat6 hoặc kiểm tra Switch cũ."
                    elif 0 < speed_mbps <= 10:
                        diag_level = "danger"
                        diag_title = "BÁO ĐỘNG HỎNG: Tụt Về 10 Mbps"
                        diag_advice = "NGUY HIỂM: Tín hiệu cực kém do dây dập nát, rỉ sét chân đồng hoặc cổng LAN bị rò điện!"
                    else:
                        diag_level = "info"
                        diag_title = f"Tốc độ: {speed_str}"
                        diag_advice = "Đang hoạt động bình thường."
                elif card_type == "wifi":
                    diag_level = "success" if speed_mbps >= 100 else "info"
                    diag_title = f"Wi-Fi Link Speed: {speed_str}"
                    diag_advice = f"Tốc độ đàm phán không dây giữa Card Wi-Fi và Router đang là {speed_str}."
                else:
                    diag_level = "info"
                    diag_title = f"Liên Kết: {speed_str}"
                    diag_advice = "Giao diện mạng ảo / VPN Tunnel đang hoạt động."

            adapters.append({
                "name": name,
                "desc": desc,
                "status": "Up" if is_up else "Disconnected",
                "is_up": is_up,
                "speed": speed_str,
                "speed_mbps": speed_mbps,
                "card_type": card_type,
                "type_label": type_label,
                "icon": icon,
                "mac": mac,
                "ip": ip,
                "gateway": gw,
                "media_type": media,
                "diag_level": diag_level,
                "diag_title": diag_title,
                "diag_advice": diag_advice,
            })

        def sort_key(a):
            rank = 0
            if a["is_up"]:
                rank += 10
            if a["card_type"] == "ethernet":
                rank += 5
            elif a["card_type"] == "wifi":
                rank += 4
            elif a["card_type"] == "virtual":
                rank += 2
            elif a["card_type"] == "bluetooth":
                rank += 1
            return rank

        adapters.sort(key=sort_key, reverse=True)

        res_data = {
            "status": "ok",
            "adapters": adapters,
            "total": len(adapters),
            "connected_count": sum(1 for a in adapters if a["is_up"]),
        }
        _cache_adapters = res_data
        _cache_time = time.time()
        return res_data

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "adapters": [],
            "total": 0,
            "connected_count": 0,
        }


def _classify_latency_badge(ms):
    """Phan loai trang thai Ping theo nguong ky thuat vien mang."""
    if ms is None or ms < 0:
        return {
            "badge_text": "Mất Gói / Timeout",
            "badge_class": "badge badge-danger",
            "color": "#ef4444",
        }
    if ms <= 35:
        return {
            "badge_text": "Cực Tốt",
            "badge_class": "badge badge-mint",
            "color": "#10b981",
        }
    if ms <= 80:
        return {
            "badge_text": "Ổn Định",
            "badge_class": "badge badge-primary",
            "color": "#0284c7",
        }
    if ms <= 180:
        return {
            "badge_text": "Hơi Chậm",
            "badge_class": "badge badge-warning",
            "color": "#f59e0b",
        }
    return {
        "badge_text": "Độ Trễ Cao",
        "badge_class": "badge badge-danger",
        "color": "#ef4444",
    }


def _icmp_ping_host(host, count=2, timeout_ms=1000):
    """
    Chay ping.exe thuc te cua Windows (ICMP Echo) va tra ve do tre nho nhat (ms).
    Neu bi chan ICMP hoac timeout thi tra ve None.
    """
    try:
        proc = subprocess.run(
            ["ping", "-n", str(count), "-w", str(timeout_ms), host],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=max(3.0, (count * timeout_ms / 1000.0) + 1.5),
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
        )
        out = (proc.stdout or "") + "\n" + (proc.stderr or "")
        samples = []
        for m in re.finditer(r"(?:time|thời gian|zeit|temps)\s*([=<])\s*(\d+)\s*ms", out, re.IGNORECASE):
            op, val = m.group(1), int(m.group(2))
            samples.append(1 if (op == "<" and val <= 1) else max(1, val))
        if samples:
            return min(samples)
        avg_m = re.search(r"(?:Average|Trung bình|Mittelwert)\s*=\s*(\d+)\s*ms", out, re.IGNORECASE)
        if avg_m:
            return max(1, int(avg_m.group(1)))
    except Exception:
        pass
    return None


def _tcp_ping_host(host, ports=(53, 443), timeout_sec=1.2):
    """
    Do thoi gian bat tay TCP (SYN -> SYN-ACK) thuan tuy (sau khi da phan giai DNS)
    trong truong hop nha mang hoac Firewall chan ICMP Echo.
    """
    try:
        target_ip = socket.gethostbyname(host)
    except Exception:
        target_ip = host

    samples = []
    for port in ports:
        for _ in range(2):
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(timeout_sec)
            t0 = time.perf_counter()
            try:
                sock.connect((target_ip, int(port)))
                elapsed_ms = max(1, int(round((time.perf_counter() - t0) * 1000.0)))
                samples.append(elapsed_ms)
            except Exception:
                pass
            finally:
                try:
                    sock.close()
                except Exception:
                    pass
        if samples:
            return min(samples)
    return None


def ping_single_target(key, label, primary_host, fallback_hosts=None, tcp_ports=(53, 443)):
    """Do Ping cho 1 muc tieu (ICMP truoc, TCP handshake fallback sau)."""
    candidates = [primary_host] + list(fallback_hosts or [])

    # 1. Thu ICMP Ping
    for host in candidates:
        ms = _icmp_ping_host(host, count=2, timeout_ms=900)
        if ms is not None:
            meta = _classify_latency_badge(ms)
            return {
                "key": key,
                "label": label,
                "host": host,
                "ok": True,
                "ms": ms,
                "method": "ICMP",
                **meta,
            }

    # 2. Thu TCP Handshake RTT (khong tinh DNS va TLS)
    for host in candidates:
        ms = _tcp_ping_host(host, ports=tcp_ports, timeout_sec=1.1)
        if ms is not None:
            meta = _classify_latency_badge(ms)
            return {
                "key": key,
                "label": label,
                "host": host,
                "ok": True,
                "ms": ms,
                "method": "TCP",
                **meta,
            }

    meta = _classify_latency_badge(None)
    return {
        "key": key,
        "label": label,
        "host": primary_host,
        "ok": False,
        "ms": None,
        "method": "TIMEOUT",
        **meta,
    }


def ping_all_targets():
    """
    Do Ping song song den 3 ha tang mang lon:
    - Google DNS (8.8.8.8 / 8.8.4.4)
    - Cloudflare DNS (1.1.1.1 / 1.0.0.1)
    - Microsoft Azure (13.107.42.14 / azure.microsoft.com)
    """
    targets = [
        ("google", "Google DNS (8.8.8.8)", "8.8.8.8", ["8.8.4.4", "dns.google"], (53, 443)),
        ("cloudflare", "Cloudflare (1.1.1.1)", "1.1.1.1", ["1.0.0.1", "one.one.one.one"], (53, 443, 80)),
        ("microsoft", "Microsoft Azure", "13.107.42.14", ["azure.microsoft.com", "www.microsoft.com"], (443, 80)),
    ]

    results = {}
    with ThreadPoolExecutor(max_workers=3) as pool:
        futures = {
            t[0]: pool.submit(ping_single_target, t[0], t[1], t[2], t[3], t[4])
            for t in targets
        }
        for key, fut in futures.items():
            try:
                results[key] = fut.result(timeout=6)
            except Exception as e:
                meta = _classify_latency_badge(None)
                results[key] = {
                    "key": key,
                    "ok": False,
                    "ms": None,
                    "method": "ERROR",
                    "error": str(e),
                    **meta,
                }

    any_ok = any(r.get("ok") for r in results.values())
    return {
        "status": "ok",
        "reachable": any_ok,
        "timestamp": int(time.time()),
        "results": results,
    }


def open_ncpa():
    """Mo truc tiep Network Connections (ncpa.cpl)"""
    try:
        subprocess.Popen(["cmd.exe", "/c", "start", "ncpa.cpl"], shell=True)
        return True, "Đã mở Network Connections (ncpa.cpl)"
    except Exception as e:
        return False, str(e)


def flush_dns():
    """Xoa cache DNS va reset stack"""
    try:
        subprocess.run(
            ["ipconfig", "/flushdns"],
            capture_output=True,
            text=True,
            timeout=5,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
        )
        return True, "Đã xóa sạch DNS Cache (ipconfig /flushdns)"
    except Exception as e:
        return False, str(e)


if __name__ == "__main__":
    res = scan_network_adapters(force_refresh=True)
    print(json.dumps(res, indent=2, ensure_ascii=False))
