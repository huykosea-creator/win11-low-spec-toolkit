#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quản lý File Cấu Hình Trung Tâm (toolkit_config.json) cho Windows 11 Toolkit & Hub.
Đồng bộ tự động giữa:
  1. <root>/toolkit_config.json
  2. <root>/software/toolkit_config.json
  3. <root>/config/toolkit_config.json
Giúp kỹ thuật viên có thể mở và chỉnh sửa file config ở bất kỳ thư mục nguồn nào.
"""

import copy
import datetime
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)

CONFIG_PATHS = [
    os.path.join(ROOT_DIR, "toolkit_config.json"),
    os.path.join(ROOT_DIR, "software", "toolkit_config.json"),
    os.path.join(ROOT_DIR, "config", "toolkit_config.json"),
]

DEFAULT_TOOLKIT_CONFIG = {
    "_comment": "FILE CẤU HÌNH TRUNG TÂM - WINDOWS 11 TOOLKIT & HUB (Có thể sửa trực tiếp bằng Notepad/VS Code hoặc chỉnh trên giao diện WebUI)",
    "version": "2.1.0",
    "updated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "general_workflow": {
        "default_install_mode": "enterprise",
        "filter_apps_by_mode": False,
        "auto_check_network_on_startup": True,
        "auto_provision_wifi_before_install": True,
        "skip_wifi_if_ethernet_connected": True,
        "skip_wifi_if_internet_available": True,
        "install_delay_seconds": 3,
        "create_desktop_shortcuts": True,
        "timezone_default": "SE Asia Standard Time",
    },
    "wifi_config": {
        "enabled": True,
        "skip_if_ethernet_plugged": True,
        "skip_if_already_online": True,
        "only_import_detected_ap": True,
        "auto_connect_matched_ap": True,
        "connection_timeout_seconds": 12,
        "access_points": [
            {
                "id": "ap_company_main",
                "ssid": "CongTy_WiFi_5G",
                "password": "MatKhauWiFiCongTy123@",
                "auth": "WPA2PSK",
                "cipher": "AES",
                "priority": 1,
                "auto_connect": True,
                "hidden": False,
                "scope": "enterprise",
                "note": "Wi-Fi Văn phòng / Công ty chính (Chỉ tự nạp khi quét thấy sóng)",
            },
            {
                "id": "ap_company_floor2",
                "ssid": "VanPhong_Tang2",
                "password": "12345678",
                "auth": "WPA2PSK",
                "cipher": "AES",
                "priority": 2,
                "auto_connect": True,
                "hidden": False,
                "scope": "enterprise",
                "note": "Wi-Fi Chi nhánh / Tầng 2 (Chỉ tự nạp khi quét thấy sóng)",
            },
            {
                "id": "ap_ktv_bench",
                "ssid": "KTV_Test_WiFi",
                "password": "88888888",
                "auth": "WPA2PSK",
                "cipher": "AES",
                "priority": 3,
                "auto_connect": True,
                "hidden": False,
                "scope": "all",
                "note": "Wi-Fi Bàn Kỹ Thuật Viên cài máy",
            },
        ],
    },
    "install_profiles": {
        "default_mode": "enterprise",
        "enterprise": {
            "id": "enterprise",
            "name": "Doanh Nghiệp (Công ty / Văn phòng - 100% Miễn Phí Thương Mại)",
            "badge": "🏢 Doanh Nghiệp",
            "description": "Bộ 10 phần mềm & thư viện chuẩn văn phòng 100% miễn phí thương mại / mã nguồn mở (Không cần mua license): UniKey, Chrome, Firefox, LibreOffice (thay Office 365), 7-Zip (thay WinRAR), RustDesk (thay AnyDesk/TeamViewer), Foxit PDF Reader, VLC, cùng 2 gói thư viện nền tảng VC++ Redistributables (x64 & x86). Các phần mềm cần license (Office 365, WinRAR, AnyDesk, TeamViewer, Geek Uninstaller) chỉ tích chọn riêng khi công ty có mua bản quyền.",
            "apps": [
                "unikey",
                "chrome",
                "firefox",
                "libreoffice",
                "7zip",
                "rustdesk",
                "foxit-reader",
                "vlc",
                "vcredist-x64",
                "vcredist-x86",
            ],
        },
        "personal": {
            "id": "personal",
            "name": "Cá Nhân (Gia đình / Học tập / Giải trí)",
            "badge": "👤 Cá Nhân",
            "description": "Bộ 15 phần mềm & thư viện tiện dụng cho máy tính cá nhân, sinh viên và gia đình (Được phép dùng bản Personal Free): UniKey, Chrome, Cốc Cốc, 7-Zip, WinRAR, WPS Office (Văn phòng gọn nhẹ), UltraViewer, AnyDesk, TeamViewer, Foxit PDF Reader, VLC, Mem Reduct, Geek Uninstaller, cùng 2 gói thư viện nền tảng VC++ Redistributables (x64 & x86).",
            "apps": [
                "unikey",
                "chrome",
                "coccoc",
                "7zip",
                "winrar",
                "wps-office",
                "ultraviewer",
                "anydesk",
                "teamviewer",
                "foxit-reader",
                "vlc",
                "mem-reduct",
                "geek-uninstaller",
                "vcredist-x64",
                "vcredist-x86",
            ],
        },
    },
    "tweaks_config": {
        "menu_show_delay_ms": 20,
        "disable_transparency": True,
        "hide_widgets_and_copilot": True,
        "enable_game_mode": True,
        "enable_ultimate_power": False,
    },
}


def _deep_merge(base: dict, override: dict) -> dict:
    result = copy.deepcopy(base)
    if not isinstance(override, dict):
        return result
    for k, v in override.items():
        if isinstance(v, dict) and isinstance(result.get(k), dict):
            result[k] = _deep_merge(result[k], v)
        else:
            result[k] = copy.deepcopy(v)
    return result


def get_primary_config_path() -> str:
    return CONFIG_PATHS[1]  # software/toolkit_config.json


def load_toolkit_config() -> dict:
    """
    Đọc cấu hình từ file có thời gian chỉnh sửa mới nhất trong 3 vị trí:
      - toolkit_config.json (thư mục gốc)
      - software/toolkit_config.json (thư mục nguồn phần mềm)
      - config/toolkit_config.json (thư mục config)
    Nếu chưa tồn tại, tự động khởi tạo file mẫu chuẩn.
    """
    existing = []
    for p in CONFIG_PATHS:
        if os.path.isfile(p):
            try:
                mtime = os.path.getmtime(p)
                existing.append((mtime, p))
            except OSError:
                pass

    if not existing:
        save_toolkit_config(DEFAULT_TOOLKIT_CONFIG)
        return copy.deepcopy(DEFAULT_TOOLKIT_CONFIG)

    # Ưu tiên đọc từ file vừa được người dùng sửa mới nhất
    existing.sort(key=lambda x: x[0], reverse=True)
    for _, path in existing:
        try:
            with open(path, "r", encoding="utf-8") as f:
                raw = json.load(f)
            merged = _deep_merge(DEFAULT_TOOLKIT_CONFIG, raw)
            # Đồng bộ default_mode giữa top-level, general_workflow và install_profiles
            mode = (
                raw.get("default_install_mode")
                or merged.get("general_workflow", {}).get("default_install_mode")
                or merged.get("install_profiles", {}).get("default_mode")
                or "enterprise"
            )
            if mode not in ("enterprise", "personal"):
                mode = "enterprise"
            merged["default_install_mode"] = mode
            merged["general_workflow"]["default_install_mode"] = mode
            merged["install_profiles"]["default_mode"] = mode
            merged["wifi_settings"] = merged.get("wifi_config", {})
            merged["wifi_access_points"] = merged.get("wifi_config", {}).get("access_points", [])
            merged["workflow"] = {
                "step0_auto_wifi_before_install": merged["general_workflow"].get("auto_provision_wifi_before_install", True),
                "install_delay_seconds": merged["general_workflow"].get("install_delay_seconds", 3),
            }
            return merged
        except Exception:
            continue

    return copy.deepcopy(DEFAULT_TOOLKIT_CONFIG)


def save_toolkit_config(new_config: dict) -> dict:
    """Lưu và đồng bộ cấu hình ra cả 3 vị trí để người dùng mở ở đâu cũng thấy bản mới nhất."""
    nc = copy.deepcopy(new_config or {})
    # Đồng bộ từ các trường rút gọn của UI nếu có
    if "wifi_settings" in nc and isinstance(nc["wifi_settings"], dict):
        nc.setdefault("wifi_config", {}).update(nc["wifi_settings"])
    if "wifi_access_points" in nc and isinstance(nc["wifi_access_points"], list):
        nc.setdefault("wifi_config", {})["access_points"] = nc["wifi_access_points"]
    if "workflow" in nc and isinstance(nc["workflow"], dict):
        wf = nc["workflow"]
        if "step0_auto_wifi_before_install" in wf:
            nc.setdefault("general_workflow", {})["auto_provision_wifi_before_install"] = bool(wf["step0_auto_wifi_before_install"])
        if "install_delay_seconds" in wf:
            nc.setdefault("general_workflow", {})["install_delay_seconds"] = int(wf["install_delay_seconds"])

    merged = _deep_merge(DEFAULT_TOOLKIT_CONFIG, nc)
    mode = (
        nc.get("default_install_mode")
        or merged.get("general_workflow", {}).get("default_install_mode")
        or merged.get("install_profiles", {}).get("default_mode")
        or "enterprise"
    )
    if mode not in ("enterprise", "personal"):
        mode = "enterprise"
    merged["default_install_mode"] = mode
    merged["general_workflow"]["default_install_mode"] = mode
    merged["install_profiles"]["default_mode"] = mode
    merged["updated_at"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    merged["wifi_settings"] = merged.get("wifi_config", {})
    merged["wifi_access_points"] = merged.get("wifi_config", {}).get("access_points", [])
    merged["workflow"] = {
        "step0_auto_wifi_before_install": merged["general_workflow"].get("auto_provision_wifi_before_install", True),
        "install_delay_seconds": merged["general_workflow"].get("install_delay_seconds", 3),
    }

    for p in CONFIG_PATHS:
        try:
            parent = os.path.dirname(p)
            if parent:
                os.makedirs(parent, exist_ok=True)
            with open(p, "w", encoding="utf-8") as f:
                json.dump(merged, f, ensure_ascii=False, indent=2)
        except Exception:
            pass

    return merged
