#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quản lý Nhận Diện Sóng Wi-Fi & Tự Động Nạp Thông Tin AP (Wi-Fi Provisioning Engine)
Quy trình chuẩn KTV:
  1. Kiểm tra nếu máy đã cắm dây mạng LAN (Ethernet) hoặc đã có kết nối Internet -> Bỏ qua nạp Wi-Fi.
  2. Nếu chưa có mạng (hoặc KTV bấm nạp chủ động) -> Quét danh sách AP đang phát sóng xung quanh.
  3. Đối chiếu với danh sách AP trong toolkit_config.json -> Chỉ nạp những AP thực sự đang có sóng tại chỗ.
  4. Tự động kết nối vào AP khớp có độ ưu tiên / cường độ sóng cao nhất rồi chuyển sang bước tiếp theo.
"""

import os
import re
import socket
import subprocess
import tempfile
import time
import xml.sax.saxutils as saxutils

from scripts import config_manager as cm
from scripts import network_service as ns


def _run_netsh_wlan(args: list, timeout: int = 8) -> str:
    cmd = ["netsh.exe", "wlan"] + args
    creation_flags = getattr(subprocess, "CREATE_NO_WINDOW", 0) if os.name == "nt" else 0
    try:
        res = subprocess.run(
            cmd,
            capture_output=True,
            timeout=timeout,
            creationflags=creation_flags,
        )
        raw = res.stdout or b""
        for enc in ("utf-8", "cp65001", "cp1258", "cp1252"):
            try:
                return raw.decode(enc)
            except UnicodeDecodeError:
                continue
        return raw.decode("utf-8", errors="replace")
    except Exception:
        return ""


def get_wlan_interface_state() -> dict:
    """Đọc trạng thái giao diện Wi-Fi hiện tại qua netsh wlan show interfaces."""
    out = _run_netsh_wlan(["show", "interfaces"])
    info = {
        "has_wifi_hardware": False,
        "interface_name": "",
        "state": "disconnected",
        "connected": False,
        "connected_ssid": "",
        "bssid": "",
        "signal_percent": 0,
        "radio_type": "",
    }
    if not out or "there is no wireless interface" in out.lower() or "không có giao diện" in out.lower():
        return info

    info["has_wifi_hardware"] = True
    for raw_line in out.splitlines():
        line = raw_line.strip()
        if ":" not in line:
            continue
        k, _, v = line.partition(":")
        k_low = k.strip().lower()
        val = v.strip()
        if not info["interface_name"] and ("name" in k_low or "tên" in k_low):
            info["interface_name"] = val
        elif "state" in k_low or "trạng thái" in k_low:
            info["state"] = val.lower()
            if "connected" in val.lower() and "disconnected" not in val.lower():
                info["connected"] = True
        elif k_low == "ssid":
            info["connected_ssid"] = val
        elif "bssid" in k_low:
            info["bssid"] = val
        elif "signal" in k_low or "tín hiệu" in k_low:
            m = re.search(r"(\d+)\s*%", val)
            if m:
                info["signal_percent"] = int(m.group(1))
        elif "radio" in k_low:
            info["radio_type"] = val

    return info


def get_saved_windows_wifi_profiles() -> set:
    """Lấy danh sách tên các Profile Wi-Fi đã lưu sẵn trong Windows."""
    out = _run_netsh_wlan(["show", "profiles"])
    saved = set()
    for line in out.splitlines():
        if ":" in line:
            _, _, right = line.partition(":")
            name = right.strip()
            if name and len(name) <= 64:
                saved.add(name.lower())
    return saved


def scan_nearby_wifi_networks() -> list:
    """
    Quét danh sách các trạm phát Wi-Fi (AP) đang phát sóng xung quanh máy tính.
    Trả về danh sách đã gộp theo SSID, sắp xếp theo cường độ sóng giảm dần.
    """
    out = _run_netsh_wlan(["show", "networks", "mode=bssid"], timeout=10)
    networks_by_ssid = {}
    current_ssid = None
    current_auth = ""
    current_cipher = ""

    for raw_line in out.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        m_ssid = re.match(r"^SSID\s+\d+\s*:\s*(.*)$", line, re.IGNORECASE)
        if m_ssid:
            ssid_val = m_ssid.group(1).strip()
            current_ssid = ssid_val if ssid_val else None
            current_auth = ""
            current_cipher = ""
            if current_ssid and current_ssid not in networks_by_ssid:
                networks_by_ssid[current_ssid] = {
                    "ssid": current_ssid,
                    "auth": "WPA2-Personal",
                    "encryption": "CCMP",
                    "signal_percent": 0,
                    "radio_type": "",
                    "channel": "",
                    "bssid_count": 0,
                }
            continue

        if not current_ssid or current_ssid not in networks_by_ssid:
            continue

        entry = networks_by_ssid[current_ssid]
        if ":" in line:
            k, _, v = line.partition(":")
            k_low = k.strip().lower()
            val = v.strip()
            if "authentication" in k_low or "xác thực" in k_low:
                current_auth = val
                entry["auth"] = val
            elif "encryption" in k_low or "mã hóa" in k_low:
                current_cipher = val
                entry["encryption"] = val
            elif "bssid" in k_low:
                entry["bssid_count"] += 1
            elif "signal" in k_low or "tín hiệu" in k_low:
                m_sig = re.search(r"(\d+)\s*%", val)
                if m_sig:
                    sig = int(m_sig.group(1))
                    if sig > entry["signal_percent"]:
                        entry["signal_percent"] = sig
            elif "radio" in k_low and not entry["radio_type"]:
                entry["radio_type"] = val
            elif ("channel" in k_low or "kênh" in k_low) and not entry["channel"]:
                entry["channel"] = val

    result = list(networks_by_ssid.values())
    result.sort(key=lambda x: x.get("signal_percent", 0), reverse=True)
    return result


def check_internet_socket(timeout: float = 1.5) -> tuple:
    """Kiểm tra nhanh kết nối mạng ra ngoài và lấy địa chỉ IP nội bộ đang hoạt động."""
    for host, port in (("8.8.8.8", 53), ("1.1.1.1", 53)):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.settimeout(timeout)
            s.connect((host, port))
            local_ip = s.getsockname()[0]
            s.close()
            if local_ip and not local_ip.startswith("127.") and not local_ip.startswith("169.254."):
                return True, local_ip
        except Exception:
            continue
    return False, ""


def _parse_ipconfig_adapters() -> dict:
    """
    Phân tích nhanh đầu ra ipconfig.exe (< 20ms) để nhận diện chính xác
    cổng dây mạng LAN (Ethernet) hay Wi-Fi đang có IPv4 và Default Gateway hợp lệ.
    """
    res = {
        "ethernet_up": False,
        "ethernet_list": [],
        "wifi_up": False,
        "wifi_list": [],
        "active_ip": "",
        "gateway_ip": "",
    }
    creation_flags = getattr(subprocess, "CREATE_NO_WINDOW", 0) if os.name == "nt" else 0
    try:
        proc = subprocess.run(
            ["ipconfig.exe"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=5,
            creationflags=creation_flags,
        )
        out = proc.stdout or ""
    except Exception:
        return res

    current_header = ""
    current_type = ""
    current_ip = ""
    current_gw = ""
    disconnected = False

    def _flush():
        nonlocal current_header, current_type, current_ip, current_gw, disconnected
        if not current_header or disconnected or not current_ip:
            return
        if current_ip.startswith("169.254.") or current_ip.startswith("127."):
            return
        item = {"name": current_header, "ip": current_ip, "gateway": current_gw}
        if current_type == "ethernet":
            res["ethernet_list"].append(item)
            if current_gw:
                res["ethernet_up"] = True
        elif current_type == "wifi":
            res["wifi_list"].append(item)
            if current_gw:
                res["wifi_up"] = True
        if current_gw and not res["active_ip"]:
            res["active_ip"] = current_ip
            res["gateway_ip"] = current_gw

    for raw in out.splitlines():
        if not raw.strip():
            continue
        if not raw.startswith(" ") and not raw.startswith("\t") and raw.strip().endswith(":"):
            _flush()
            current_header = raw.strip().rstrip(":")
            h_low = current_header.lower()
            current_ip = ""
            current_gw = ""
            disconnected = False
            if "wireless" in h_low or "wi-fi" in h_low or "wlan" in h_low:
                current_type = "wifi"
            elif "bluetooth" in h_low or "tailscale" in h_low or "vpn" in h_low or "virtual" in h_low or "loopback" in h_low or "vethernet" in h_low:
                current_type = "virtual"
            elif "ethernet" in h_low:
                current_type = "ethernet"
            else:
                current_type = "other"
            continue

        line = raw.strip()
        low = line.lower()
        if "media disconnected" in low or "ngắt kết nối" in low:
            disconnected = True
        elif ("ipv4" in low or "ip address" in low) and ":" in line:
            _, _, v = line.partition(":")
            m = re.search(r"(\d+\.\d+\.\d+\.\d+)", v)
            if m:
                current_ip = m.group(1)
        elif ("default gateway" in low or "cổng mặc định" in low) and ":" in line:
            _, _, v = line.partition(":")
            m = re.search(r"(\d+\.\d+\.\d+\.\d+)", v)
            if m:
                current_gw = m.group(1)

    _flush()
    return res


def check_network_readiness(cfg: dict = None, force_adapter_refresh: bool = False) -> dict:
    """
    Kiểm tra tổng thể trạng thái dây mạng LAN (Ethernet), Wi-Fi và Internet.
    Quyết định xem có tự động bỏ qua bước nạp Wi-Fi AP hay không.
    """
    if cfg is None:
        cfg = cm.load_toolkit_config()

    wifi_cfg = cfg.get("wifi_config", {})
    wf_cfg = cfg.get("general_workflow", {})
    skip_if_eth = bool(wifi_cfg.get("skip_if_ethernet_plugged", wf_cfg.get("skip_wifi_if_ethernet_connected", True)))
    skip_if_online = bool(wifi_cfg.get("skip_if_already_online", wf_cfg.get("skip_wifi_if_internet_available", True)))

    ipcfg = _parse_ipconfig_adapters()
    adapter_scan = ns.scan_network_adapters(force_refresh=force_adapter_refresh)
    adapters = adapter_scan.get("adapters", []) if isinstance(adapter_scan, dict) else []

    ethernet_up_list = [a for a in adapters if a.get("card_type") == "ethernet" and a.get("is_up")]
    if not ethernet_up_list and ipcfg["ethernet_list"]:
        ethernet_up_list = [
            {"name": e["name"], "speed": "Connected", "ip": e["ip"], "gateway": e["gateway"], "card_type": "ethernet", "is_up": True}
            for e in ipcfg["ethernet_list"]
        ]

    wifi_up_list = [a for a in adapters if a.get("card_type") == "wifi" and a.get("is_up")]
    if not wifi_up_list and ipcfg["wifi_list"]:
        wifi_up_list = [
            {"name": w["name"], "speed": "Connected", "ip": w["ip"], "gateway": w["gateway"], "card_type": "wifi", "is_up": True}
            for w in ipcfg["wifi_list"]
        ]

    wlan_info = get_wlan_interface_state()
    has_internet_sock, sock_ip = check_internet_socket()
    active_ip = sock_ip or ipcfg.get("active_ip", "")
    has_internet = bool(has_internet_sock or ipcfg.get("gateway_ip"))

    ethernet_connected = bool(len(ethernet_up_list) > 0 or ipcfg.get("ethernet_up"))
    wifi_connected = bool(wlan_info.get("connected") or len(wifi_up_list) > 0 or ipcfg.get("wifi_up"))
    connected_ssid = wlan_info.get("connected_ssid", "")
    if not connected_ssid and wifi_connected and wifi_up_list:
        connected_ssid = wifi_up_list[0].get("name", "Wi-Fi Connected")

    should_skip_wifi = False
    skip_reason = ""

    if ethernet_connected and skip_if_eth:
        eth_names = ", ".join(f"{a.get('name')} ({a.get('speed') or a.get('ip') or 'Connected'})" for a in ethernet_up_list)
        should_skip_wifi = True
        skip_reason = f"Đã cắm dây mạng LAN ({eth_names}) — Tự động bỏ qua bước nạp Wi-Fi AP."
    elif (has_internet or wifi_connected) and skip_if_online:
        should_skip_wifi = True
        if connected_ssid:
            skip_reason = f"Máy đã có mạng qua '{connected_ssid}' (IP: {active_ip or 'Online'}) — Tự động bỏ qua bước nạp Wi-Fi AP."
        else:
            skip_reason = f"Máy đã có kết nối mạng (IP: {active_ip or 'Online'}) — Tự động bỏ qua bước nạp Wi-Fi AP."
    else:
        skip_reason = "Chưa có kết nối mạng — Sẵn sàng quét sóng & tự động nạp Wi-Fi AP từ Config."

    return {
        "ethernet_connected": ethernet_connected,
        "ethernet_adapters": ethernet_up_list,
        "wifi_connected": wifi_connected,
        "connected_ssid": connected_ssid,
        "wifi_signal": wlan_info.get("signal_percent", 0),
        "has_wifi_hardware": bool(wlan_info.get("has_wifi_hardware") or wifi_connected),
        "wifi_interface_name": wlan_info.get("interface_name", ""),
        "internet_online": has_internet,
        "already_online": bool(has_internet or wifi_connected or ethernet_connected),
        "active_ip": active_ip,
        "local_ip": active_ip,
        "gateway_ip": ipcfg.get("gateway_ip", ""),
        "should_skip_wifi": should_skip_wifi,
        "should_skip_wifi_import": should_skip_wifi,
        "skip_reason": skip_reason,
        "wlan": {
            "has_adapter": bool(wlan_info.get("has_wifi_hardware") or wifi_connected),
            "interface_name": wlan_info.get("interface_name", "") or (wifi_up_list[0].get("name") if wifi_up_list else "Wi-Fi"),
            "connected": wifi_connected,
            "current_ssid": connected_ssid,
            "signal": f"{wlan_info.get('signal_percent', 100)}%" if wlan_info.get("signal_percent") else "Tốt",
        },
    }


def _build_wlan_profile_xml(ssid: str, password: str, auth: str = "WPA2PSK", cipher: str = "AES", auto_connect: bool = True, hidden: bool = False) -> str:
    """Tạo nội dung XML chuẩn của Windows WLAN Profile."""
    safe_ssid = saxutils.escape(ssid)
    ssid_hex = ssid.encode("utf-8").hex().upper()
    conn_mode = "auto" if auto_connect else "manual"
    non_broadcast = "true" if hidden else "false"

    auth_norm = (auth or "WPA2PSK").upper().replace("-", "").replace(" ", "")
    if "OPEN" in auth_norm or not password:
        auth_xml = "open"
        enc_xml = "none"
        key_block = ""
    elif "WPA3" in auth_norm or "SAE" in auth_norm:
        auth_xml = "WPA3SAE"
        enc_xml = "AES"
        safe_pwd = saxutils.escape(password)
        key_block = f"""
            <sharedKey>
                <keyType>passPhrase</keyType>
                <protected>false</protected>
                <keyMaterial>{safe_pwd}</keyMaterial>
            </sharedKey>"""
    else:
        auth_xml = "WPA2PSK"
        enc_xml = "AES" if "TKIP" not in (cipher or "").upper() else "TKIP"
        safe_pwd = saxutils.escape(password)
        key_block = f"""
            <sharedKey>
                <keyType>passPhrase</keyType>
                <protected>false</protected>
                <keyMaterial>{safe_pwd}</keyMaterial>
            </sharedKey>"""

    return f"""<?xml version="1.0"?>
<WLANProfile xmlns="http://www.microsoft.com/networking/WLAN/profile/v1">
    <name>{safe_ssid}</name>
    <SSIDConfig>
        <SSID>
            <hex>{ssid_hex}</hex>
            <name>{safe_ssid}</name>
        </SSID>
        <nonBroadcast>{non_broadcast}</nonBroadcast>
    </SSIDConfig>
    <connectionType>ESS</connectionType>
    <connectionMode>{conn_mode}</connectionMode>
    <MSM>
        <security>
            <authEncryption>
                <authentication>{auth_xml}</authentication>
                <encryption>{enc_xml}</encryption>
                <useOneX>false</useOneX>
            </authEncryption>{key_block}
        </security>
    </MSM>
</WLANProfile>
"""


def import_and_connect_ap(ap: dict, connect_now: bool = True) -> tuple:
    """
    Nạp 1 thông tin AP vào Windows WLAN Profile qua netsh wlan add profile
    và kết nối ngay nếu connect_now=True.
    """
    ssid = (ap.get("ssid") or "").strip()
    if not ssid:
        return False, "Thiếu tên Wi-Fi (SSID)!"

    password = ap.get("password") or ""
    auth = ap.get("auth") or "WPA2PSK"
    cipher = ap.get("cipher") or "AES"
    auto_connect = bool(ap.get("auto_connect", True))
    hidden = bool(ap.get("hidden", False))

    xml_content = _build_wlan_profile_xml(
        ssid=ssid,
        password=password,
        auth=auth,
        cipher=cipher,
        auto_connect=auto_connect,
        hidden=hidden,
    )

    temp_dir = tempfile.gettempdir()
    safe_tag = re.sub(r"[^a-zA-Z0-9_\-]", "_", ssid)[:32]
    xml_path = os.path.join(temp_dir, f"win11_toolkit_wifi_{safe_tag}.xml")

    try:
        with open(xml_path, "w", encoding="utf-8") as f:
            f.write(xml_content)

        out_add = _run_netsh_wlan(["add", "profile", f"filename={xml_path}", "user=all"])
        added_ok = ("is added on interface" in out_add.lower()) or ("đã được thêm" in out_add.lower()) or ("profile" in out_add.lower() and "error" not in out_add.lower())

        if not added_ok:
            return False, f"Không thể nạp Profile Wi-Fi '{ssid}': {out_add.strip() or 'Không có card Wi-Fi'}"

        if connect_now:
            out_conn = _run_netsh_wlan(["connect", f"name={ssid}", f"ssid={ssid}"])
            return True, f"Đã nạp Profile Wi-Fi '{ssid}' vào máy và gửi lệnh kết nối thành công! ({out_conn.strip()})"

        return True, f"Đã lưu sẵn Profile Wi-Fi '{ssid}' vào máy tính thành công!"
    finally:
        if os.path.isfile(xml_path):
            try:
                os.remove(xml_path)
            except OSError:
                pass


def get_wifi_full_status(force_scan: bool = False) -> dict:
    """
    Trả về bức tranh toàn cảnh cho Tab Wi-Fi & Config:
      - Trạng thái mạng LAN / Wi-Fi / Internet & quyết định tự động bỏ qua
      - Danh sách các mạng Wi-Fi đang phát sóng thực tế xung quanh
      - Danh sách các AP trong toolkit_config.json kèm trạng thái khớp sóng (detected_nearby)
    """
    cfg = cm.load_toolkit_config()
    readiness = check_network_readiness(cfg=cfg, force_adapter_refresh=force_scan)
    nearby = scan_nearby_wifi_networks()
    saved_profiles = get_saved_windows_wifi_profiles()

    nearby_map = {n["ssid"].lower(): n for n in nearby if n.get("ssid")}
    configured_aps = []

    for idx, ap in enumerate(cfg.get("wifi_config", {}).get("access_points", [])):
        ssid = (ap.get("ssid") or "").strip()
        ssid_low = ssid.lower()
        matched_live = nearby_map.get(ssid_low)
        is_connected = bool(readiness.get("connected_ssid") and readiness["connected_ssid"].lower() == ssid_low)

        enriched = dict(ap)
        if not enriched.get("id"):
            enriched["id"] = f"ap_{idx + 1}"
        enriched["detected_nearby"] = matched_live is not None
        enriched["signal_percent"] = matched_live.get("signal_percent", 0) if matched_live else (readiness.get("wifi_signal", 0) if is_connected else 0)
        enriched["live_auth"] = matched_live.get("auth", "") if matched_live else ""
        enriched["already_connected"] = is_connected
        enriched["is_currently_connected"] = is_connected
        enriched["saved_in_windows"] = ssid_low in saved_profiles
        configured_aps.append(enriched)

    for n in nearby:
        if "authentication" not in n:
            n["authentication"] = n.get("auth", "WPA2-Personal")

    matched_count = sum(1 for a in configured_aps if a.get("detected_nearby"))

    payload = {
        "ok": True,
        "status": "ok",
        "readiness": readiness,
        "nearby_networks": nearby,
        "configured_aps": configured_aps,
        "matched_ap_count": matched_count,
        "default_install_mode": cfg.get("default_install_mode", "enterprise"),
        "install_profiles": cfg.get("install_profiles", {}),
        "wifi_config": cfg.get("wifi_config", {}),
        "wifi_settings": cfg.get("wifi_config", {}),
        "general_workflow": cfg.get("general_workflow", {}),
        "workflow": cfg.get("workflow", {}),
    }
    return payload


def run_smart_wifi_provisioning(force: bool = False, target_ssid: str = None, log_callback=None) -> dict:
    """
    Thực thi quy trình tự động nhận diện & nạp thông tin AP trước khi chuyển sang bước tiếp theo:
      - Bước 1: Nếu máy đã cắm dây mạng LAN hoặc đã có mạng (và force=False, không chỉ định target_ssid) -> Bỏ qua nạp Wi-Fi.
      - Bước 2: Quét danh sách Wi-Fi đang phát sóng xung quanh máy tính của user.
      - Bước 3: Đối chiếu với danh sách AP trong toolkit_config.json -> Chỉ nạp những AP có sóng thực tế tại chỗ.
      - Bước 4: Tự động kết nối vào AP khớp có độ ưu tiên cao nhất và xác nhận sẵn sàng cho bước tiếp theo.
    """
    logs = []

    def _log(msg: str):
        logs.append(msg)
        if callable(log_callback):
            try:
                log_callback(msg)
            except Exception:
                pass

    cfg = cm.load_toolkit_config()
    readiness = check_network_readiness(cfg=cfg, force_adapter_refresh=True)

    # 1. Nếu chỉ định nạp 1 SSID cụ thể từ giao diện
    if target_ssid:
        target_low = target_ssid.strip().lower()
        ap_list = cfg.get("wifi_config", {}).get("access_points", [])
        target_ap = next((a for a in ap_list if (a.get("ssid") or "").strip().lower() == target_low), None)
        if not target_ap:
            msg = f"Không tìm thấy cấu hình cho AP '{target_ssid}' trong toolkit_config.json!"
            _log(f"[WIFI] {msg}")
            return {
                "status": "error",
                "skipped": False,
                "ready_for_next_step": readiness.get("internet_online", False),
                "message": msg,
                "logs": logs,
                "readiness": readiness,
            }

        nearby = scan_nearby_wifi_networks()
        nearby_map = {n["ssid"].lower(): n for n in nearby if n.get("ssid")}
        is_detected = target_low in nearby_map
        _log(
            f"[WIFI] Kiểm tra AP '{target_ssid}': "
            + (f"Đang phát sóng ({nearby_map[target_low]['signal_percent']}%)" if is_detected else "Không thấy sóng tại chỗ (Nạp lưu sẵn Profile)")
        )
        ok, msg = import_and_connect_ap(target_ap, connect_now=is_detected)
        _log(f"[WIFI] {msg}")
        time.sleep(1.0)
        new_readiness = check_network_readiness(cfg=cfg, force_adapter_refresh=True)
        return {
            "status": "ok" if ok else "error",
            "skipped": False,
            "imported_aps": [target_ap.get("ssid")] if ok else [],
            "connected_ssid": new_readiness.get("connected_ssid", ""),
            "ready_for_next_step": True,
            "message": msg,
            "logs": logs,
            "readiness": new_readiness,
        }

    # 2. Kiểm tra điều kiện tự động bỏ qua nếu đã cắm dây mạng hoặc đã có mạng
    if not force and readiness.get("should_skip_wifi"):
        reason = readiness.get("skip_reason") or "Đã có kết nối mạng — Bỏ qua bước nạp Wi-Fi AP."
        _log(f"[WIFI] {reason}")
        return {
            "status": "skipped",
            "skipped": True,
            "imported_aps": [],
            "connected_ssid": readiness.get("connected_ssid", ""),
            "ready_for_next_step": True,
            "message": reason,
            "logs": logs,
            "readiness": readiness,
        }

    # 3. Quét sóng Wi-Fi thực tế xung quanh
    _log("[WIFI] Đang quét các trạm phát Wi-Fi (AP) đang phát sóng xung quanh máy tính...")
    nearby = scan_nearby_wifi_networks()
    nearby_map = {n["ssid"].lower(): n for n in nearby if n.get("ssid")}
    _log(f"[WIFI] Phát hiện {len(nearby)} mạng Wi-Fi đang phát sóng trong khu vực.")

    configured_aps = cfg.get("wifi_config", {}).get("access_points", [])
    only_detected = bool(cfg.get("wifi_config", {}).get("only_import_detected_ap", True))

    matched_aps = []
    for ap in configured_aps:
        ssid = (ap.get("ssid") or "").strip()
        if not ssid:
            continue
        live = nearby_map.get(ssid.lower())
        if live is not None:
            item = dict(ap)
            item["ssid"] = live["ssid"]  # Giữ nguyên hoa/thường chuẩn của AP thực tế
            item["signal_percent"] = live.get("signal_percent", 0)
            matched_aps.append(item)
        elif not only_detected or ap.get("hidden"):
            item = dict(ap)
            item["signal_percent"] = 0
            matched_aps.append(item)
        else:
            _log(f"[WIFI] -> Bỏ qua AP '{ssid}' (Không có sóng tại đây, không nạp dư thừa vào máy).")

    if not matched_aps:
        msg = (
            f"Đã quét {len(nearby)} mạng Wi-Fi xung quanh nhưng không có AP nào trùng khớp với danh sách trong toolkit_config.json."
        )
        _log(f"[WIFI] {msg}")
        return {
            "status": "no_match",
            "skipped": False,
            "imported_aps": [],
            "connected_ssid": readiness.get("connected_ssid", ""),
            "ready_for_next_step": readiness.get("internet_online", False),
            "message": msg,
            "logs": logs,
            "readiness": readiness,
        }

    # Sắp xếp ưu tiên: priority nhỏ hơn đứng trước, cùng priority thì sóng mạnh hơn đứng trước
    matched_aps.sort(key=lambda x: (int(x.get("priority", 99)), -int(x.get("signal_percent", 0))))

    imported_names = []
    auto_connect_cfg = bool(cfg.get("wifi_config", {}).get("auto_connect_matched_ap", True))

    for idx, ap in enumerate(matched_aps):
        ssid = ap["ssid"]
        sig = ap.get("signal_percent", 0)
        should_connect_this = auto_connect_cfg and (idx == 0)
        _log(f"[WIFI] -> Phát hiện AP khớp Config: '{ssid}' (Sóng: {sig}%) — Đang nạp thông tin AP vào máy...")
        ok, res_msg = import_and_connect_ap(ap, connect_now=should_connect_this)
        _log(f"[WIFI]    {res_msg}")
        if ok:
            imported_names.append(ssid)

    if imported_names and auto_connect_cfg:
        _log("[WIFI] Đang chờ xác nhận kết nối Wi-Fi ổn định...")
        for _ in range(4):
            time.sleep(1.0)
            post_check = check_network_readiness(cfg=cfg, force_adapter_refresh=True)
            if post_check.get("wifi_connected") or post_check.get("internet_online"):
                readiness = post_check
                break

    summary_msg = (
        f"Đã nhận diện và nạp thành công {len(imported_names)} AP đang có sóng ({', '.join(imported_names)})! Sẵn sàng cho các bước tiếp theo."
        if imported_names
        else "Không thể nạp thông tin AP vào card Wi-Fi của máy."
    )
    _log(f"[WIFI] {summary_msg}")

    return {
        "status": "ok" if imported_names else "error",
        "skipped": False,
        "imported_aps": imported_names,
        "connected_ssid": readiness.get("connected_ssid", ""),
        "ready_for_next_step": True,
        "message": summary_msg,
        "logs": logs,
        "readiness": readiness,
    }
