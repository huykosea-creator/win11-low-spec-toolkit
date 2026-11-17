#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quản lý đọc trạng thái múi giờ và đồng bộ giờ chuẩn qua công cụ chính thống Windows (tzutil.exe & w32tm.exe).
Chỉ đọc trạng thái khi khởi động; chỉ đồng bộ khi kỹ thuật viên bấm nút yêu cầu trực tiếp.
"""

import datetime
import subprocess
import sys
import winreg

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

COMMON_TIMEZONES = [
    {"id": "SE Asia Standard Time", "name": "(UTC+07:00) Bangkok, Hanoi, Jakarta", "utc_offset": "+07:00"},
    {"id": "Singapore Standard Time", "name": "(UTC+08:00) Kuala Lumpur, Singapore", "utc_offset": "+08:00"},
    {"id": "China Standard Time", "name": "(UTC+08:00) Beijing, Chongqing, Hong Kong", "utc_offset": "+08:00"},
    {"id": "Tokyo Standard Time", "name": "(UTC+09:00) Osaka, Sapporo, Tokyo", "utc_offset": "+09:00"},
    {"id": "Korea Standard Time", "name": "(UTC+09:00) Seoul", "utc_offset": "+09:00"},
    {"id": "GMT Standard Time", "name": "(UTC+00:00) Dublin, Edinburgh, Lisbon, London", "utc_offset": "+00:00"},
    {"id": "W. Europe Standard Time", "name": "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Paris", "utc_offset": "+01:00"},
    {"id": "Eastern Standard Time", "name": "(UTC-05:00) Eastern Time (US & Canada)", "utc_offset": "-05:00"},
    {"id": "Pacific Standard Time", "name": "(UTC-08:00) Pacific Time (US & Canada)", "utc_offset": "-08:00"},
    {"id": "Australia Eastern Standard Time", "name": "(UTC+10:00) Canberra, Melbourne, Sydney", "utc_offset": "+10:00"},
    {"id": "India Standard Time", "name": "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi", "utc_offset": "+05:30"},
]


def get_current_timezone_name() -> str:
    """Đọc mã múi giờ hiện tại trực tiếp từ Windows Registry (nhanh và không sinh tiến trình con)."""
    try:
        with winreg.OpenKey(
            winreg.HKEY_LOCAL_MACHINE,
            r"SYSTEM\CurrentControlSet\Control\TimeZoneInformation",
            0,
            winreg.KEY_READ,
        ) as key:
            val, _ = winreg.QueryValueEx(key, "TimeZoneKeyName")
            if val:
                return str(val).strip("\x00").strip()
    except OSError:
        pass

    try:
        res = subprocess.run(["tzutil.exe", "/g"], capture_output=True, text=True, timeout=5)
        if res.returncode == 0 and res.stdout.strip():
            return res.stdout.strip()
    except Exception:
        pass
    return "Unknown"


def get_time_info() -> dict:
    """Lấy thông tin thời gian và múi giờ hiện tại của hệ thống (Chỉ đọc)."""
    now = datetime.datetime.now()
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    tz_id = get_current_timezone_name()
    is_utc7 = tz_id == "SE Asia Standard Time"

    w32time_configured = False
    try:
        with winreg.OpenKey(
            winreg.HKEY_LOCAL_MACHINE,
            r"SYSTEM\CurrentControlSet\Services\W32Time",
            0,
            winreg.KEY_READ,
        ) as key:
            start_type, _ = winreg.QueryValueEx(key, "Start")
            w32time_configured = int(start_type) in (2, 3)
    except OSError:
        pass

    return {
        "local_time": now.strftime("%Y-%m-%d %H:%M:%S"),
        "utc_time": now_utc.strftime("%Y-%m-%d %H:%M:%S"),
        "timezone_id": tz_id,
        "timezone_display": "(UTC+07:00) Bangkok, Hanoi, Jakarta" if is_utc7 else tz_id,
        "is_utc7": is_utc7,
        "w32time_running": w32time_configured,
        "formatted_display": f"{now.strftime('%H:%M:%S - %d/%m/%Y')} (Múi giờ {tz_id})",
    }


def set_timezone_utc7():
    """Thiết lập múi giờ Việt Nam SE Asia Standard Time (UTC+07:00) bằng tzutil.exe chính thống."""
    target = "SE Asia Standard Time"
    try:
        res = subprocess.run(["tzutil.exe", "/s", target], capture_output=True, text=True, timeout=5)
        if res.returncode == 0:
            return True, "Đã thiết lập múi giờ UTC+07:00 (Bangkok, Hanoi, Jakarta) thành công qua tzutil."
        err_detail = (res.stderr or res.stdout or "").strip()
        return False, f"Không thể đổi múi giờ qua tzutil: {err_detail}"
    except Exception as exc:
        return False, f"Lỗi thiết lập múi giờ: {exc}"


def sync_ntp_w32tm(peer_list: str = "time.windows.com,0x9 time.google.com,0x9 pool.ntp.org,0x9"):
    """Đồng bộ giờ chuẩn qua công cụ Windows Time (w32tm.exe) chính thống."""
    logs = []
    try:
        subprocess.run(["net.exe", "start", "w32time"], capture_output=True, text=True, timeout=6)
    except Exception:
        pass

    try:
        cmd_cfg = [
            "w32tm.exe",
            "/config",
            f"/manualpeerlist:{peer_list}",
            "/syncfromflags:manual",
            "/reliable:YES",
            "/update",
        ]
        subprocess.run(cmd_cfg, capture_output=True, text=True, timeout=8)
        logs.append("Đã cập nhật danh sách máy chủ NTP chuẩn (Windows / Google / NTP Pool).")
    except Exception as exc:
        logs.append(f"Lưu ý cấu hình NTP: {exc}")

    try:
        res_sync = subprocess.run(["w32tm.exe", "/resync", "/force"], capture_output=True, text=True, timeout=10)
        if res_sync.returncode == 0:
            logs.append("Đồng bộ giờ chuẩn Windows Time (w32tm) thành công!")
            return True, logs
        detail = (res_sync.stdout or res_sync.stderr or "").strip()
        logs.append(f"w32tm trả về mã {res_sync.returncode}: {detail}")
    except Exception as exc:
        logs.append(f"Lỗi khi chạy w32tm resync: {exc}")

    return False, logs


def sync_all() -> dict:
    """Đồng bộ múi giờ UTC+07:00 và giờ chuẩn Windows Time khi người dùng bấm nút."""
    results = {"status": "ok", "steps": [], "errors": []}

    tz_ok, tz_msg = set_timezone_utc7()
    results["steps"].append(tz_msg)
    if not tz_ok:
        results["errors"].append(tz_msg)

    ntp_ok, ntp_logs = sync_ntp_w32tm()
    results["steps"].extend(ntp_logs)
    if not ntp_ok:
        results["status"] = "partial" if tz_ok else "error"

    results["info"] = get_time_info()
    return results


def apply_custom_config(cfg: dict) -> dict:
    """Áp dụng cấu hình thời gian tùy chỉnh từ hộp thoại cài đặt của người dùng."""
    results = {"status": "ok", "steps": [], "errors": []}
    target_tz = cfg.get("timezone", "SE Asia Standard Time")

    try:
        res = subprocess.run(["tzutil.exe", "/s", target_tz], capture_output=True, text=True, timeout=5)
        if res.returncode == 0:
            results["steps"].append(f"Đã đặt múi giờ thành: {target_tz}")
        else:
            results["errors"].append(f"Không thể đổi múi giờ sang {target_tz} (cần quyền Administrator).")
    except Exception as exc:
        results["errors"].append(f"Lỗi đặt múi giờ: {exc}")

    ntp_raw = cfg.get("ntp_servers", "time.windows.com, time.google.com, pool.ntp.org")
    peer_list = "time.windows.com,0x9 time.google.com,0x9 pool.ntp.org,0x9"
    if ntp_raw:
        server_list = [s.strip() for s in ntp_raw.replace(";", ",").split(",") if s.strip()]
        if server_list:
            peer_list = " ".join([f"{s},0x9" if not s.endswith(",0x9") else s for s in server_list])

    if cfg.get("auto_sync", True):
        ntp_ok, ntp_logs = sync_ntp_w32tm(peer_list=peer_list)
        results["steps"].extend(ntp_logs)
        if not ntp_ok and results["errors"]:
            results["status"] = "error"

    results["info"] = get_time_info()
    return results


if __name__ == "__main__":
    info = get_time_info()
    print(f"Thời gian hiện tại: {info['formatted_display']}")
    print(f"Múi giờ chuẩn:     {info['timezone_display']}")
