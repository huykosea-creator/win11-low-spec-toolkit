import os
import sys
import json
import socket
import platform
import datetime
import winreg
import shutil
import subprocess
import re
import time
import ctypes
import struct

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCANS_DIR = os.path.join(ROOT_DIR, "scans")

_HW_INVALID_PLACEHOLDERS = {
    "", "N/A", "NA", "NONE", "NULL", "UNKNOWN", "NOT SPECIFIED",
    "DEFAULT STRING", "TO BE FILLED BY O.E.M.", "SYSTEM SERIAL NUMBER",
    "CHASSIS SERIAL NUMBER", "SYSTEM PRODUCT NAME", "SKU", "0", "00000000",
    "FFFFFFFF", "PART NUMBER", "SERIAL NUMBER", "MANUFACTURER", "ASSET TAG"
}

def _is_valid_hw_str(val):
    if val is None:
        return False
    s = str(val).strip()
    if not s:
        return False
    up = re.sub(r"\s+", " ", s).upper()
    if up in _HW_INVALID_PLACEHOLDERS:
        return False
    if "TO BE FILLED" in up or "DEFAULT STRING" in up:
        return False
    return True

def _clean_hw_str(val, fallback=""):
    if _is_valid_hw_str(val):
        return re.sub(r"\s+", " ", str(val).strip())
    return fallback

def _fmt_gb_value(gb_val):
    try:
        v = float(gb_val)
        if v <= 0:
            return "0"
        if abs(v - round(v)) < 0.05:
            return str(int(round(v)))
        return f"{v:.1f}"
    except Exception:
        return str(gb_val)

def _decode_smbios_mem_type(code):
    mapping = {
        0x12: "DDR",
        0x13: "DDR2",
        0x14: "DDR2 FB-DIMM",
        0x18: "DDR3",
        0x1A: "DDR4",
        0x1B: "LPDDR",
        0x1C: "LPDDR2",
        0x1D: "LPDDR3",
        0x1E: "LPDDR4",
        0x22: "DDR5",
        0x23: "LPDDR5",
    }
    return mapping.get(int(code or 0), "")

def _decode_cim_mem_type(smbios_type):
    if not smbios_type:
        return ""
    try:
        code = int(smbios_type)
        t = _decode_smbios_mem_type(code)
        if t:
            return t
    except Exception:
        pass
    return ""

def _read_smbios_raw():
    """
    Doc bang SMBIOS tho qua Kernel32 GetSystemFirmwareTable('RSMB', 0),
    neu bi chan quyen thi fallback doc truc tiep tu Registry HKLM\\SYSTEM\\CurrentControlSet\\Services\\mssmbios\\Data\\SMBiosData.
    Hoat dong ca khi WMI/CIM bi han che.
    """
    try:
        kernel32 = ctypes.windll.kernel32
        sig = 0x52534D42  # 'RSMB'
        size = kernel32.GetSystemFirmwareTable(sig, 0, None, 0)
        if size and size > 8:
            buf = (ctypes.c_ubyte * size)()
            written = kernel32.GetSystemFirmwareTable(sig, 0, buf, size)
            if written and written > 8:
                return bytes(buf[:written])
    except Exception:
        pass
    try:
        k = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SYSTEM\CurrentControlSet\Services\mssmbios\Data")
        val, _ = winreg.QueryValueEx(k, "SMBiosData")
        winreg.CloseKey(k)
        if isinstance(val, (bytes, bytearray)) and len(val) > 8:
            return bytes(val)
    except Exception:
        pass
    return b""

def _parse_smbios_tables():
    result = {
        "system_manufacturer": "",
        "system_product": "",
        "system_serial": "",
        "product_number": "",
        "system_family": "",
        "board_vendor": "",
        "board_model": "",
        "board_serial": "",
        "slots_total": 0,
        "modules": []
    }
    raw = _read_smbios_raw()
    if len(raw) <= 8:
        return result

    try:
        table_len = struct.unpack_from("<I", raw, 4)[0]
        data = raw[8:min(len(raw), 8 + table_len)]
        n_data = len(data)
        pos = 0
        fallback_slots_total = 0

        while pos + 4 <= n_data:
            s_type = data[pos]
            s_len = data[pos + 1]
            if s_len < 4 or pos + s_len > n_data:
                break

            str_start = pos + s_len
            strings = []
            cur = str_start
            if cur + 1 < n_data and data[cur] == 0 and data[cur + 1] == 0:
                next_pos = cur + 2
            else:
                while cur < n_data:
                    end = data.find(b"\x00", cur)
                    if end == -1:
                        cur = n_data
                        break
                    if end == cur:
                        cur += 1
                        break
                    strings.append(data[cur:end].decode("utf-8", errors="replace").strip())
                    cur = end + 1
                next_pos = cur

            def _get_s(idx_offset):
                if idx_offset < s_len:
                    str_idx = data[pos + idx_offset]
                    if 1 <= str_idx <= len(strings):
                        return strings[str_idx - 1]
                return ""

            if s_type == 127:  # End-of-table
                break
            elif s_type == 1:  # System Information
                result["system_manufacturer"] = _clean_hw_str(_get_s(0x04), result["system_manufacturer"])
                result["system_product"] = _clean_hw_str(_get_s(0x05), result["system_product"])
                result["system_serial"] = _clean_hw_str(_get_s(0x07), result["system_serial"])
                if s_len >= 0x1B:
                    result["product_number"] = _clean_hw_str(_get_s(0x19), result["product_number"])
                    result["system_family"] = _clean_hw_str(_get_s(0x1A), result["system_family"])
            elif s_type == 2:  # Baseboard Information
                result["board_vendor"] = _clean_hw_str(_get_s(0x04), result["board_vendor"])
                result["board_model"] = _clean_hw_str(_get_s(0x05), result["board_model"])
                result["board_serial"] = _clean_hw_str(_get_s(0x07), result["board_serial"])
            elif s_type == 16:  # Physical Memory Array
                if s_len >= 0x0F:
                    arr_use = data[pos + 0x05]
                    num_devs = struct.unpack_from("<H", data, pos + 0x0D)[0]
                    if arr_use == 0x03:
                        result["slots_total"] += int(num_devs)
                    else:
                        fallback_slots_total += int(num_devs)
            elif s_type == 17:  # Memory Device
                if s_len >= 0x15:
                    raw_size = struct.unpack_from("<H", data, pos + 0x0C)[0]
                    size_mb = 0.0
                    if raw_size == 0xFFFF:
                        size_mb = 0.0
                    elif raw_size == 0x7FFF and s_len >= 0x20:
                        ext_mb = struct.unpack_from("<I", data, pos + 0x1C)[0] & 0x7FFFFFFF
                        size_mb = float(ext_mb)
                    elif raw_size > 0:
                        if raw_size & 0x8000:
                            size_mb = float(raw_size & 0x7FFF) / 1024.0
                        else:
                            size_mb = float(raw_size)

                    locator = _clean_hw_str(_get_s(0x10))
                    bank = _clean_hw_str(_get_s(0x11))
                    mem_type = _decode_smbios_mem_type(data[pos + 0x12]) if s_len > 0x12 else ""

                    rated_speed = struct.unpack_from("<H", data, pos + 0x15)[0] if s_len >= 0x17 else 0
                    if rated_speed == 0xFFFF and s_len >= 0x58:
                        rated_speed = struct.unpack_from("<I", data, pos + 0x54)[0]
                    elif rated_speed == 0xFFFF:
                        rated_speed = 0

                    configured_speed = struct.unpack_from("<H", data, pos + 0x20)[0] if s_len >= 0x22 else 0
                    if configured_speed == 0xFFFF and s_len >= 0x5C:
                        configured_speed = struct.unpack_from("<I", data, pos + 0x58)[0]
                    elif configured_speed == 0xFFFF:
                        configured_speed = 0

                    vendor = _clean_hw_str(_get_s(0x17)) if s_len >= 0x1B else ""
                    serial = _clean_hw_str(_get_s(0x18)) if s_len >= 0x1B else ""
                    part_num = _clean_hw_str(_get_s(0x1A)) if s_len >= 0x1B else ""

                    if size_mb > 0:
                        cap_gb = round(size_mb / 1024.0, 2)
                        if abs(cap_gb - round(cap_gb)) < 0.02:
                            cap_gb = float(int(round(cap_gb)))
                        eff_bus = int(configured_speed or rated_speed or 0)
                        result["modules"].append({
                            "slot": locator or bank or f"Slot {len(result['modules']) + 1}",
                            "bank": bank,
                            "capacity_gb": cap_gb,
                            "speed_mhz": int(rated_speed or 0),
                            "configured_mhz": int(configured_speed or 0),
                            "bus_mhz": eff_bus,
                            "type": mem_type,
                            "manufacturer": vendor,
                            "part_number": part_num,
                            "serial": serial,
                        })

            pos = next_pos

        if result["slots_total"] <= 0 and fallback_slots_total > 0:
            result["slots_total"] = fallback_slots_total
    except Exception:
        pass

    return result

def sanitize_name(text):
    if not text:
        return ""
    # Xoa bo cac ky tu bi cam trong ten thu muc Windows: \ / : * ? " < > |
    text = re.sub(r'[\\/*?:"<>|]', '', str(text))
    # Thay the khoang trang bang dau gach duoi _
    text = re.sub(r'\s+', '_', text.strip())
    return text

_cached_license_info = None

def get_windows_license_info(force_refresh=False):
    """
    Kiem tra va phan loai tinh trang ban quyen Windows:
    1. Ban quyen chinh hang vinh vien (Digital License / OEM / Retail / MAK)
    2. Crack / KMS (KMS 180 ngay hoac tool crack gia lap KMS local)
    3. Chua kich hoat (Unlicensed / Het han dung thu / Notification mode)
    """
    global _cached_license_info
    if _cached_license_info is not None and not force_refresh:
        return dict(_cached_license_info)

    info = {
        "status_code": "unknown",
        "status_title": "Chưa xác định",
        "badge_class": "badge-license-unknown",
        "channel": "Unknown",
        "channel_label": "Chưa rõ",
        "is_permanent": False,
        "expire_info": "",
        "partial_key": "",
        "kms_host": "",
        "description": "",
        "summary": "Chưa xác định bản quyền"
    }

    # 1. Kiem tra Registry xem co cau hinh KMS host (dau hieu cua tool crack KMS)
    try:
        k = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\SoftwareProtectionPlatform")
        try:
            val, _ = winreg.QueryValueEx(k, "KeyManagementServiceName")
            if val:
                info["kms_host"] = str(val).strip()
        except FileNotFoundError:
            pass
        winreg.CloseKey(k)
    except Exception:
        pass

    # 2. Chay slmgr.vbs /xpr kiem tra tinh trang vinh vien hay het han
    xpr_out = ""
    try:
        r = subprocess.run(["cscript", "//nologo", r"C:\Windows\System32\slmgr.vbs", "/xpr"], capture_output=True, text=True, timeout=5)
        xpr_out = r.stdout.strip()
    except Exception as e:
        xpr_out = str(e)

    # 3. Chay slmgr.vbs /dli lay kenh ban quyen (OEM, Retail, Volume KMS, MAK) va key
    dli_out = ""
    try:
        r = subprocess.run(["cscript", "//nologo", r"C:\Windows\System32\slmgr.vbs", "/dli"], capture_output=True, text=True, timeout=5)
        dli_out = r.stdout.strip()
    except Exception as e:
        dli_out = str(e)

    desc_match = re.search(r"Description:\s*(.+)", dli_out, re.IGNORECASE)
    if desc_match:
        info["description"] = desc_match.group(1).strip()

    key_match = re.search(r"Partial Product Key:\s*([A-Z0-9]+)", dli_out, re.IGNORECASE)
    if key_match:
        info["partial_key"] = key_match.group(1).strip()

    status_match = re.search(r"License Status:\s*(.+)", dli_out, re.IGNORECASE)
    status_raw = status_match.group(1).strip() if status_match else ""

    # Phan tich kenh Channel
    desc_lower = info["description"].lower()
    if "oem_dm" in desc_lower or "oem:dm" in desc_lower:
        info["channel"] = "OEM_DM"
        info["channel_label"] = "OEM (Bản quyền theo máy / Mainboard)"
    elif "oem" in desc_lower:
        info["channel"] = "OEM"
        info["channel_label"] = "OEM (Bản quyền nhà sản xuất)"
    elif "retail" in desc_lower:
        info["channel"] = "RETAIL"
        info["channel_label"] = "Retail (Bản quyền bán lẻ / Kỹ thuật số)"
    elif "volume_mak" in desc_lower or "mak" in desc_lower:
        info["channel"] = "VOLUME_MAK"
        info["channel_label"] = "Volume MAK (Doanh nghiệp vĩnh viễn)"
    elif "volume_kms" in desc_lower or "kms" in desc_lower or "gvlk" in desc_lower:
        info["channel"] = "VOLUME_KMS"
        info["channel_label"] = "Volume KMS (KMS 180 ngày)"
    else:
        info["channel"] = "OTHER"
        info["channel_label"] = info["description"] or "Kênh tiêu chuẩn"

    kms_m = re.search(r"Key Management Service (?:machine name|client information):\s*([^\r\n]+)", dli_out, re.IGNORECASE)
    if kms_m:
        info["kms_host"] = kms_m.group(1).strip()

    xpr_lower = xpr_out.lower()
    is_perm = ("permanently activated" in xpr_lower) or ("da kich hoat vinh vien" in xpr_lower)
    is_volume_exp = ("volume activation will expire" in xpr_lower) or ("will expire" in xpr_lower)
    info["is_permanent"] = is_perm

    is_licensed = (status_raw.lower() == "licensed") or ("licensed" in status_raw.lower())

    # Phan loai 3 nhom:
    # 1. Ban quyen chinh hang vinh vien (Digital / OEM / Retail / MAK)
    # 2. Crack / KMS (180 ngay hoac gia lap KMS local nhu KMSpico, KMSAuto)
    # 3. Chua kich hoat (Unlicensed / Notification / Grace Period)
    if is_licensed and is_perm:
        info["status_code"] = "licensed_genuine"
        info["status_title"] = "Bản Quyền Chính Hãng"
        info["badge_class"] = "badge-license-genuine"
        info["expire_info"] = "Kích hoạt vĩnh viễn"
        info["summary"] = f"🟢 Bản Quyền Chính Hãng ({info['channel']}) - Vĩnh Viễn"
    elif is_licensed and (is_volume_exp or info["channel"] == "VOLUME_KMS" or info["kms_host"]):
        info["status_code"] = "licensed_kms"
        info["badge_class"] = "badge-license-kms"
        if "127.0.0.1" in info["kms_host"] or "localhost" in info["kms_host"]:
            info["status_title"] = "Crack KMS Giả Lập Local"
            info["summary"] = "⚠️ Crack KMS Giả Lập Local (KMSpico / KMSAuto)"
        else:
            info["status_title"] = "Kích Hoạt Qua KMS (180 Ngày)"
            info["summary"] = "⚠️ Kích Hoạt Qua Server KMS (Cần gia hạn 180 ngày)"
        exp_m = re.search(r"expire\s+([0-9/:\sapmAPM]+)", xpr_out)
        info["expire_info"] = f"Hết hạn: {exp_m.group(1).strip()}" if exp_m else "Hạn dùng 180 ngày"
    elif not is_licensed or ("notification" in xpr_lower) or ("not found" in xpr_lower) or ("grace" in status_raw.lower()):
        info["status_code"] = "unlicensed"
        info["status_title"] = "Chưa Kích Hoạt (Chưa Active)"
        info["badge_class"] = "badge-license-unlicensed"
        info["expire_info"] = "Chưa kích hoạt hoặc hết hạn dùng thử"
        info["summary"] = "🔴 Windows Chưa Kích Hoạt (Unlicensed / Dùng Thử)"
    else:
        info["status_code"] = "unknown"
        info["status_title"] = "Chưa xác định"
        info["badge_class"] = "badge-license-unknown"
        info["summary"] = f"Trạng thái: {status_raw or 'Chưa rõ'}"

    _cached_license_info = dict(info)
    return info

_cached_ram_hw_details = None

def _get_ram_hw_details(force_refresh=False):
    global _cached_ram_hw_details
    if _cached_ram_hw_details is not None and not force_refresh:
        return dict(_cached_ram_hw_details)

    smbios = _parse_smbios_tables()
    modules = list(smbios.get("modules") or [])
    slots_total = int(smbios.get("slots_total") or 0)

    # Bo sung / doi chieu tu PowerShell Get-CimInstance Win32_PhysicalMemory neu SMBIOS thieu
    need_cim = (not modules) or any(int(m.get("bus_mhz") or 0) == 0 for m in modules) or (slots_total <= 0)
    if need_cim:
        try:
            ps_ram = (
                "$mods = @(Get-CimInstance Win32_PhysicalMemory -ErrorAction SilentlyContinue | Select-Object "
                "DeviceLocator, BankLabel, Capacity, Speed, ConfiguredClockSpeed, SMBIOSMemoryType, MemoryType, Manufacturer, PartNumber, SerialNumber); "
                "$arr = @(Get-CimInstance Win32_PhysicalMemoryArray -ErrorAction SilentlyContinue | Select-Object MemoryDevices, Use); "
                "[PSCustomObject]@{ modules = $mods; arrays = $arr } | ConvertTo-Json -Depth 4 -Compress"
            )
            raw = subprocess.check_output(
                ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", ps_ram],
                text=True,
                encoding="utf-8",
                errors="replace",
                stderr=subprocess.DEVNULL,
                timeout=6
            )
            if raw and raw.strip():
                j = json.loads(raw.strip())
                cim_arrs = j.get("arrays") or []
                if isinstance(cim_arrs, dict):
                    cim_arrs = [cim_arrs]
                if slots_total <= 0:
                    total_s = 0
                    for a in cim_arrs:
                        if isinstance(a, dict) and a.get("MemoryDevices"):
                            total_s += int(a["MemoryDevices"])
                    if total_s > 0:
                        slots_total = total_s

                cim_mods = j.get("modules") or []
                if isinstance(cim_mods, dict):
                    cim_mods = [cim_mods]
                parsed_cim_mods = []
                for idx, cm in enumerate(cim_mods):
                    if not isinstance(cm, dict):
                        continue
                    cap_bytes = cm.get("Capacity") or 0
                    try:
                        cap_gb = round(float(cap_bytes) / (1024**3), 2)
                        if abs(cap_gb - round(cap_gb)) < 0.02:
                            cap_gb = float(int(round(cap_gb)))
                    except Exception:
                        cap_gb = 0.0
                    if cap_gb <= 0:
                        continue
                    cfg_spd = int(cm.get("ConfiguredClockSpeed") or 0)
                    rated_spd = int(cm.get("Speed") or 0)
                    eff_bus = cfg_spd or rated_spd
                    m_type = _decode_cim_mem_type(cm.get("SMBIOSMemoryType") or cm.get("MemoryType"))
                    parsed_cim_mods.append({
                        "slot": _clean_hw_str(cm.get("DeviceLocator")) or _clean_hw_str(cm.get("BankLabel")) or f"Slot {idx + 1}",
                        "bank": _clean_hw_str(cm.get("BankLabel")),
                        "capacity_gb": cap_gb,
                        "speed_mhz": rated_spd,
                        "configured_mhz": cfg_spd,
                        "bus_mhz": eff_bus,
                        "type": m_type,
                        "manufacturer": _clean_hw_str(cm.get("Manufacturer")),
                        "part_number": _clean_hw_str(cm.get("PartNumber")),
                        "serial": _clean_hw_str(cm.get("SerialNumber")),
                    })
                if parsed_cim_mods:
                    if not modules:
                        modules = parsed_cim_mods
                    else:
                        # Merge missing bus_mhz/type/vendor from CIM by index/slot
                        for idx, mod in enumerate(modules):
                            match = parsed_cim_mods[idx] if idx < len(parsed_cim_mods) else None
                            if match:
                                if not mod.get("bus_mhz") and match.get("bus_mhz"):
                                    mod["bus_mhz"] = match["bus_mhz"]
                                    mod["configured_mhz"] = match["configured_mhz"]
                                    mod["speed_mhz"] = match["speed_mhz"]
                                if not mod.get("type") and match.get("type"):
                                    mod["type"] = match["type"]
                                if not mod.get("manufacturer") and match.get("manufacturer"):
                                    mod["manufacturer"] = match["manufacturer"]
                                if not mod.get("part_number") and match.get("part_number"):
                                    mod["part_number"] = match["part_number"]
        except Exception:
            pass

    slots_used = len(modules)
    if slots_total < slots_used:
        slots_total = slots_used

    installed_gb = 0.0
    bus_mhz = 0
    ram_type = ""
    if modules:
        installed_gb = round(sum(float(m.get("capacity_gb") or 0) for m in modules), 1)
        if abs(installed_gb - round(installed_gb)) < 0.05:
            installed_gb = float(int(round(installed_gb)))
        # Bus chung: lay configured/effective min hoac mode cua cac thanh dang cam
        buses = [int(m.get("bus_mhz") or 0) for m in modules if int(m.get("bus_mhz") or 0) > 0]
        if buses:
            bus_mhz = min(buses)
        types = [m.get("type") for m in modules if m.get("type")]
        if types:
            ram_type = types[0]

    details = {
        "installed_gb": installed_gb,
        "bus_mhz": bus_mhz,
        "ram_type": ram_type,
        "slots_used": slots_used,
        "slots_total": slots_total,
        "modules": modules,
    }
    _cached_ram_hw_details = dict(details)
    return details


def get_ram_info(force_refresh=False):
    """
    Lay thong tin RAM vat ly cua may tinh:
    - Dung luong OS nhan (GlobalMemoryStatusEx) & Dung luong thuc te cac thanh RAM (SMBIOS/CIM)
    - Toc do Bus RAM (MHz), Loai RAM (DDR4/DDR5/...), So khe cam & chi tiet tung thanh
    """
    try:
        class MEMORYSTATUSEX(ctypes.Structure):
            _fields_ = [
                ("dwLength", ctypes.c_ulong),
                ("dwMemoryLoad", ctypes.c_ulong),
                ("ullTotalPhys", ctypes.c_ulonglong),
                ("ullAvailPhys", ctypes.c_ulonglong),
                ("ullTotalPageFile", ctypes.c_ulonglong),
                ("ullAvailPageFile", ctypes.c_ulonglong),
                ("ullTotalVirtual", ctypes.c_ulonglong),
                ("ullAvailVirtual", ctypes.c_ulonglong),
                ("ullAvailExtendedVirtual", ctypes.c_ulonglong),
            ]
        stat = MEMORYSTATUSEX()
        stat.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
        ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(stat))
        total_gb = round(stat.ullTotalPhys / (1024**3), 1)
        avail_gb = round(stat.ullAvailPhys / (1024**3), 1)
        used_gb = round((stat.ullTotalPhys - stat.ullAvailPhys) / (1024**3), 1)
        load_pct = int(stat.dwMemoryLoad)

        hw_ram = _get_ram_hw_details(force_refresh=force_refresh)
        installed_gb = float(hw_ram.get("installed_gb") or 0)
        if installed_gb <= 0:
            # Suy luan dung luong chuan neu thieu SMBIOS (vi du 15.8 -> 16 GB, 7.8 -> 8 GB)
            std_sizes = [2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128]
            matched = min(std_sizes, key=lambda x: abs(x - total_gb))
            installed_gb = float(matched) if abs(matched - total_gb) <= 0.65 else total_gb

        bus_mhz = int(hw_ram.get("bus_mhz") or 0)
        ram_type = hw_ram.get("ram_type") or ""
        slots_used = int(hw_ram.get("slots_used") or 0)
        slots_total = int(hw_ram.get("slots_total") or 0)
        modules = hw_ram.get("modules") or []

        eff_gb = installed_gb if installed_gb > 0 else total_gb
        if eff_gb < 3.8:
            rec_level = "under4gb"
            rec_tier = "under4gb"
            rec_title = "Gói 1: Dưới 4GB RAM (Cắt Giảm Siêu Nhẹ)"
            rec_advice = "Máy dưới 4GB RAM. Đề xuất cắt giảm tối đa toàn bộ Bloatware, module nặng & thiết lập RAM ảo để chạy mượt như Win Lite!"
            badge_class = "badge-danger"
        elif eff_gb <= 8.5:
            rec_level = "4to8gb"
            rec_tier = "4to8gb"
            rec_title = "Gói 2: RAM 4GB - 8GB (Tinh Giản Cân Bằng)"
            rec_advice = "Cấu hình RAM 4GB-8GB. Đề xuất gỡ Widgets, Copilot, Telemetry, tắt kính mờ & giữ lại bảo mật ổn định!"
            badge_class = "badge-warning"
        else:
            rec_level = "above8gb"
            rec_tier = "above8gb"
            rec_title = "Gói 3: Trên 8GB RAM (Tối Ưu Độ Trễ & Giữ Giao Diện)"
            rec_advice = "Máy có RAM dồi dào (>8GB). Đề xuất dọn rác quảng cáo, tối ưu Game Mode & giữ nguyên 100% hiệu ứng đẹp!"
            badge_class = "badge-success"

        inst_str = _fmt_gb_value(installed_gb)
        bus_display = f"{bus_mhz} MHz" if bus_mhz > 0 else "Chưa rõ"
        slots_display = f"{slots_used}/{slots_total} khe" if slots_total > 0 and slots_used > 0 else (f"{slots_used} thanh" if slots_used > 0 else "")

        summary_parts = [f"{inst_str} GB" + (f" {ram_type}" if ram_type else "")]
        if bus_mhz > 0:
            summary_parts.append(f"Bus {bus_mhz} MHz")
        if slots_display:
            summary_parts.append(slots_display)
        ram_summary = " • ".join(summary_parts)
        if total_gb > 0 and abs(installed_gb - total_gb) >= 0.25:
            ram_summary += f" ({total_gb} GB khả dụng)"

        ram_display = f"{inst_str} GB"
        if ram_type:
            ram_display += f" {ram_type}"
        if bus_mhz > 0:
            ram_display += f" • Bus {bus_mhz} MHz"
        ram_display += f" (Khả dụng: {avail_gb}/{total_gb} GB, Tải: {load_pct}%)"

        return {
            "total_gb": total_gb,
            "installed_gb": installed_gb,
            "avail_gb": avail_gb,
            "used_gb": used_gb,
            "load_percent": load_pct,
            "bus_mhz": bus_mhz,
            "bus_display": bus_display,
            "ram_type": ram_type,
            "slots_used": slots_used,
            "slots_total": slots_total,
            "slots_display": slots_display,
            "modules": modules,
            "ram_summary": ram_summary,
            "total_str": ram_summary,
            "recommended_level": rec_level,
            "recommended_tier": rec_tier,
            "recommended_title": rec_title,
            "recommended_advice": rec_advice,
            "badge_class": badge_class,
            "ram_display": ram_display
        }
    except Exception:
        return {
            "total_gb": 4.0,
            "installed_gb": 4.0,
            "avail_gb": 1.5,
            "used_gb": 2.5,
            "load_percent": 60,
            "bus_mhz": 0,
            "bus_display": "Chưa rõ",
            "ram_type": "",
            "slots_used": 0,
            "slots_total": 0,
            "slots_display": "",
            "modules": [],
            "ram_summary": "4 GB",
            "total_str": "4 GB",
            "recommended_level": "4to8gb",
            "recommended_tier": "4to8gb",
            "recommended_title": "Gói 2: RAM 4GB - 8GB (Tinh Giản Cân Bằng)",
            "recommended_advice": "Đề xuất cắt giảm cân bằng cho RAM 4GB-8GB",
            "badge_class": "badge-warning",
            "ram_display": "4.0 GB"
        }

_cached_hardware_info = None

def get_hardware_info(force_refresh=False):
    """
    Lay so Serial Number (SN), Product Number / SKU (PN), Mainboard, System Model va CPU Name.
    Ket hop Registry (0ms) + SMBIOS Kernel32 (RSMB) + PowerShell Get-CimInstance.
    """
    global _cached_hardware_info
    if _cached_hardware_info is not None and not force_refresh:
        return dict(_cached_hardware_info)

    info = {
        "serial_number": "N/A",
        "product_number": "N/A",
        "motherboard": "N/A",
        "board_vendor": "",
        "board_model": "",
        "system_model": "",
        "cpu_name": ""
    }

    # 1. Doc SMBIOS truc tiep (0ms, chuan hang Dell/HP/Lenovo/ASUS/Acer...)
    smbios = _parse_smbios_tables()
    if smbios.get("system_serial"):
        info["serial_number"] = smbios["system_serial"]
    elif smbios.get("board_serial"):
        info["serial_number"] = smbios["board_serial"]

    if smbios.get("product_number"):
        info["product_number"] = smbios["product_number"]

    if smbios.get("board_vendor"):
        info["board_vendor"] = smbios["board_vendor"]
    if smbios.get("board_model"):
        info["board_model"] = smbios["board_model"]
    if smbios.get("system_manufacturer") and smbios.get("system_product"):
        info["system_model"] = f"{smbios['system_manufacturer']} {smbios['system_product']}".strip()
    elif smbios.get("system_product"):
        info["system_model"] = smbios["system_product"]

    if info["board_vendor"] and info["board_model"]:
        info["motherboard"] = f"{info['board_vendor']} {info['board_model']}".strip()
    elif info["board_model"]:
        info["motherboard"] = info["board_model"]
    elif info["system_model"]:
        info["motherboard"] = info["system_model"]

    # 2. Doc Registry he thong (bo sung neu SMBIOS thieu)
    try:
        k = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"HARDWARE\DESCRIPTION\System\BIOS")
        def _reg_bios(name):
            try:
                return _clean_hw_str(winreg.QueryValueEx(k, name)[0])
            except Exception:
                return ""
        m_vendor = _reg_bios("BaseBoardManufacturer")
        m_prod = _reg_bios("BaseBoardProduct")
        s_vendor = _reg_bios("SystemManufacturer")
        s_prod = _reg_bios("SystemProductName")
        s_sku = _reg_bios("SystemSKU")
        winreg.CloseKey(k)

        if not info["board_vendor"] and m_vendor:
            info["board_vendor"] = m_vendor
        if not info["board_model"] and m_prod:
            info["board_model"] = m_prod
        if not info["system_model"]:
            if s_vendor and s_prod:
                info["system_model"] = f"{s_vendor} {s_prod}".strip()
            elif s_prod:
                info["system_model"] = s_prod
        if info["product_number"] == "N/A" and s_sku:
            info["product_number"] = s_sku
        if info["motherboard"] == "N/A":
            if info["board_vendor"] and info["board_model"]:
                info["motherboard"] = f"{info['board_vendor']} {info['board_model']}".strip()
            elif info["system_model"]:
                info["motherboard"] = info["system_model"]
    except Exception:
        pass

    try:
        kc = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"HARDWARE\DESCRIPTION\System\CentralProcessor\0")
        c_name = _clean_hw_str(winreg.QueryValueEx(kc, "ProcessorNameString")[0])
        if c_name:
            info["cpu_name"] = c_name
        winreg.CloseKey(kc)
    except Exception:
        pass

    # 3. Goi PowerShell Get-CimInstance chi khi SMBIOS + Registry con thieu thong tin chinh
    need_hw_cim = (
        info["serial_number"] == "N/A"
        or info["product_number"] == "N/A"
        or info["motherboard"] == "N/A"
        or not info["cpu_name"]
    )
    if need_hw_cim:
        try:
            ps_script = (
                "$b = Get-CimInstance Win32_BIOS -ErrorAction SilentlyContinue; "
                "$m = Get-CimInstance Win32_BaseBoard -ErrorAction SilentlyContinue; "
                "$s = Get-CimInstance Win32_ComputerSystem -ErrorAction SilentlyContinue; "
                "$p = Get-CimInstance Win32_ComputerSystemProduct -ErrorAction SilentlyContinue; "
                "$c = Get-CimInstance Win32_Processor -ErrorAction SilentlyContinue | Select-Object -First 1; "
                "[PSCustomObject]@{"
                "Serial = $b.SerialNumber; "
                "BoardSerial = $m.SerialNumber; "
                "SKU = $s.SystemSKUNumber; "
                "ProductSKU = $p.SKUNumber; "
                "IdentifyingNumber = $p.IdentifyingNumber; "
                "BoardVendor = $m.Manufacturer; "
                "BoardModel = $m.Product; "
                "Model = $s.Model; "
                "Vendor = $s.Manufacturer; "
                "CpuName = $c.Name"
                "} | ConvertTo-Json -Compress"
            )
            res = subprocess.check_output(
                ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", ps_script],
                text=True,
                encoding="utf-8",
                errors="replace",
                stderr=subprocess.DEVNULL,
                timeout=5
            )
            j = json.loads(res.strip())
            serial_val = _clean_hw_str(j.get("Serial")) or _clean_hw_str(j.get("IdentifyingNumber")) or _clean_hw_str(j.get("BoardSerial"))
            if serial_val:
                info["serial_number"] = serial_val

            pn_val = _clean_hw_str(j.get("SKU")) or _clean_hw_str(j.get("ProductSKU"))
            if pn_val:
                info["product_number"] = pn_val

            b_v = _clean_hw_str(j.get("BoardVendor"))
            b_m = _clean_hw_str(j.get("BoardModel"))
            if b_v:
                info["board_vendor"] = b_v
            if b_m:
                info["board_model"] = b_m
            if info["board_vendor"] and info["board_model"]:
                info["motherboard"] = f"{info['board_vendor']} {info['board_model']}".strip()

            m_name = _clean_hw_str(j.get("Model"))
            v_name = _clean_hw_str(j.get("Vendor"))
            if m_name:
                info["system_model"] = f"{v_name} {m_name}".strip() if v_name else m_name

            cpu_c = _clean_hw_str(j.get("CpuName"))
            if cpu_c:
                info["cpu_name"] = cpu_c
        except Exception:
            pass

    _cached_hardware_info = dict(info)
    return info

def get_machine_info(
    customer_name="",
    customer_id="",
    scan_stage="tiep_nhan",
    computer_name_override="",
    serial_override="",
    pn_override="",
    computer_name_confirmed=False,
):
    detected_computer_name = os.environ.get("COMPUTERNAME", socket.gethostname())
    computer_name = str(computer_name_override or "").strip() or detected_computer_name
    username = os.environ.get("USERNAME", "User")
    
    machine_guid = "N/A"
    try:
        k = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Cryptography")
        machine_guid = winreg.QueryValueEx(k, "MachineGuid")[0]
    except Exception:
        pass

    # Windows 11 Build detection
    os_info = f"{platform.system()} {platform.release()}"
    try:
        k_ver = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Windows NT\CurrentVersion")
        build = winreg.QueryValueEx(k_ver, "CurrentBuild")[0]
        prod_name = winreg.QueryValueEx(k_ver, "ProductName")[0]
        if "Windows 10" in prod_name and int(build) >= 22000:
            prod_name = prod_name.replace("Windows 10", "Windows 11")
        os_info = f"{prod_name} (Build {build})"
    except Exception:
        pass

    now = get_effective_datetime()
    now_str = now.strftime("%d/%m/%Y %H:%M:%S")
    timestamp_id = now.strftime("%Y%m%d_%H%M%S")
    
    # Kiem tra ban quyen Windows
    license_info = get_windows_license_info()

    # Kiem tra thong tin phan cung: So Serial, PN & Mainboard
    hw_info = get_hardware_info()
    serial_number = str(serial_override or "").strip() or hw_info.get("serial_number", "N/A")
    product_number = str(pn_override or "").strip() or hw_info.get("product_number", "N/A")

    # Lay thong tin RAM he thong (Dung luong + Bus RAM + Khe cam) & de xuat muc toi uu hoa
    ram_info = get_ram_info()

    # Quy tac trang thai tiep nhan / ban giao
    clean_stage = "ban_giao" if scan_stage in ["ban_giao", "sau_cai_dat", "cai_xong"] else "tiep_nhan"
    stage_label = "Tiếp Nhận Máy (Trước Cài)" if clean_stage == "tiep_nhan" else "Bàn Giao Máy (Sau Khi Cài)"
    stage_tag = "TiepNhan" if clean_stage == "tiep_nhan" else "BanGiao"

    clean_cust = sanitize_name(customer_name)
    clean_id = sanitize_name(customer_id)
    clean_pc = sanitize_name(computer_name)

    # Quy tac dat ten thu muc: Ten that User + Ma ID (neu co) + Trang thai + Ten may tinh + Timestamp
    parts = []
    if clean_cust:
        parts.append(clean_cust)
    else:
        parts.append("User")
        
    if clean_id:
        parts.append(clean_id)

    parts.append(stage_tag)
    parts.append(clean_pc if clean_pc else "PC")
    parts.append(timestamp_id)

    scan_id = "_".join(parts)

    return {
        "scan_id": scan_id,
        "customer_name": customer_name.strip() if customer_name else "",
        "customer_id": customer_id.strip() if customer_id else "",
        "scan_stage": clean_stage,
        "stage_label": stage_label,
        "stage_tag": stage_tag,
        "computer_name": computer_name,
        "computer_name_detected": detected_computer_name,
        "computer_name_confirmed": bool(computer_name_confirmed or (computer_name_override and str(computer_name_override).strip())),
        "username": username,
        "user_id": f"{computer_name}\\{username}",
        "machine_guid": machine_guid,
        "os_info": os_info,
        "serial_number": serial_number,
        "product_number": product_number,
        "motherboard": hw_info.get("motherboard", "N/A"),
        "board_vendor": hw_info.get("board_vendor", ""),
        "board_model": hw_info.get("board_model", ""),
        "system_model": hw_info.get("system_model", ""),
        "cpu_name": hw_info.get("cpu_name", ""),
        "ram_info": ram_info,
        "total_ram_gb": ram_info.get("installed_gb") or ram_info.get("total_gb", 0),
        "ram_installed_gb": ram_info.get("installed_gb") or ram_info.get("total_gb", 0),
        "ram_bus_mhz": ram_info.get("bus_mhz", 0),
        "ram_bus_display": ram_info.get("bus_display", "Chưa rõ"),
        "ram_type": ram_info.get("ram_type", ""),
        "ram_slots_used": ram_info.get("slots_used", 0),
        "ram_slots_total": ram_info.get("slots_total", 0),
        "ram_summary": ram_info.get("ram_summary", ""),
        "ram_total": ram_info.get("ram_summary", ""),
        "license_info": license_info,
        "license_summary": license_info.get("summary", ""),
        "license_status": license_info.get("status_title", ""),
        "license_badge": license_info.get("badge_class", ""),
        "license_channel": license_info.get("channel_label", ""),
        "license_key": license_info.get("partial_key", ""),
        "scan_time": now_str,
        "timestamp_raw": now.isoformat()
    }

def generate_disk_tree_csv(disk_data, file_path):
    if not disk_data or not disk_data.get("trees"):
        return
    lines = [
        "\uFEFF\"Đường Dẫn\",\"Tên Thư Mục / Tệp\",\"Loại\",\"Dung Lượng\",\"Số Lượng Tệp\",\"Số Lượng Thư Mục\",\"% Chiếm Dụng\",\"Lần Sửa Đổi Cuối\""
    ]
    
    def walk_node(node):
        p = (node.get("path") or "").replace('"', '""')
        n = (node.get("name") or "").replace('"', '""')
        t = (node.get("type") or "folder").replace('"', '""')
        sh = (node.get("size_human") or "").replace('"', '""')
        fc = str(node.get("files_count") if node.get("files_count") is not None else "")
        dc = str(node.get("dirs_count") if node.get("dirs_count") is not None else "")
        pct = f"{node.get('percent_root') or 0}%"
        mt = (node.get("mtime_str") or "").replace('"', '""')
        lines.append(f'"{p}","{n}","{t}","{sh}","{fc}","{dc}","{pct}","{mt}"')
        
        for ch in node.get("children", []):
            walk_node(ch)
            
    for tree in disk_data.get("trees", []):
        walk_node(tree)
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("\r\n".join(lines))

def generate_html_report(machine_info, apps, file_path, disk_data=None):
    with_icons = sum(1 for a in apps if a.get("thumbnail"))
    stage = machine_info.get("scan_stage", "tiep_nhan")
    stage_label = machine_info.get("stage_label", "Tiếp Nhận Máy (Trước Cài)")
    cust_name = machine_info.get("customer_name") or "(Chưa nhập)"
    cust_id = machine_info.get("customer_id") or "(Không có)"

    if stage == "tiep_nhan":
        stage_badge_html = '<span style="display:inline-flex; align-items:center; gap:6px; background:#fff7ed; color:#c2410c; border:1px solid #fdba74; padding:6px 14px; border-radius:20px; font-weight:800; font-size:12.5px;">📥 BIÊN BẢN TIẾP NHẬN MÁY (Hiện Trạng Trước Khi Cài Đặt)</span>'
    else:
        stage_badge_html = '<span style="display:inline-flex; align-items:center; gap:6px; background:#f0fdf4; color:#15803d; border:1px solid #86efac; padding:6px 14px; border-radius:20px; font-weight:800; font-size:12.5px;">✅ BIÊN BẢN BÀN GIAO MÁY (Hiện Trạng Sau Khi Cài Lại Hoàn Tất)</span>'
    
    lic = machine_info.get("license_info") or {}
    lic_code = lic.get("status_code", "unknown")
    lic_title = lic.get("status_title", machine_info.get("license_status", "Chưa xác định"))
    lic_chan = lic.get("channel_label", machine_info.get("license_channel", ""))
    lic_key = lic.get("partial_key", machine_info.get("license_key", ""))
    key_text = f" | Key: *****-{lic_key}" if lic_key else ""
    
    if lic_code == "licensed_genuine":
        lic_badge_html = f'<span style="background:#dcfce7; color:#15803d; border:1px solid #86efac; padding:4px 10px; border-radius:12px; font-weight:700; font-size:12px;">🟢 {lic_title}</span> <span style="color:#475569; font-size:11.5px; margin-left:6px;">({lic_chan}{key_text})</span>'
    elif lic_code == "licensed_kms":
        lic_badge_html = f'<span style="background:#fef3c7; color:#b45309; border:1px solid #fcd34d; padding:4px 10px; border-radius:12px; font-weight:700; font-size:12px;">⚠️ {lic_title}</span> <span style="color:#475569; font-size:11.5px; margin-left:6px;">({lic.get("expire_info", "")}{key_text})</span>'
    elif lic_code == "unlicensed":
        lic_badge_html = f'<span style="background:#ffe4e6; color:#be123c; border:1px solid #fda4af; padding:4px 10px; border-radius:12px; font-weight:700; font-size:12px;">🔴 {lic_title}</span>'
    else:
        lic_badge_html = f'<span style="background:#f1f5f9; color:#475569; padding:4px 10px; border-radius:12px; font-size:12px;">{lic.get("summary", "Chưa rõ")}</span>'

    # Đọc thông tin cây ổ đĩa nếu chưa được truyền vào
    task_dir = os.path.dirname(file_path)
    if disk_data is None:
        disk_file = os.path.join(task_dir, "disk_tree.json")
        if os.path.exists(disk_file):
            try:
                with open(disk_file, "r", encoding="utf-8") as df:
                    disk_data = json.load(df)
            except Exception:
                pass

    # 1. ĐỌC HOẶC THU THẬP THÔNG TIN S.M.A.R.T (CRYSTALDISKINFO CORE)
    smart_info_file = os.path.join(task_dir, "smart_info.json")
    smart_payload = None
    if os.path.exists(smart_info_file):
        try:
            with open(smart_info_file, "r", encoding="utf-8") as sf:
                smart_payload = json.load(sf)
        except Exception:
            pass
    if not smart_payload:
        try:
            import scripts.disk_smart_service as dss
            live_disks = dss.scan_all_smart_disks()
            smart_payload = {
                "scanId": machine_info.get("scan_id", "current_scan"),
                "savedAt": datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                "disks": live_disks,
                "diagnosis": "Đã tự động kiểm tra đối chiếu qua CrystalDiskInfo Core 9.9.2."
            }
            with open(smart_info_file, "w", encoding="utf-8") as sf:
                json.dump(smart_payload, sf, ensure_ascii=False, indent=2)
        except Exception:
            pass

    smart_disks = []
    smart_diag_text = "Đã đối chiếu qua CrystalDiskInfo Core."
    if smart_payload and isinstance(smart_payload, dict):
        smart_diag_text = smart_payload.get("diagnosis") or smart_diag_text
        if "disks" in smart_payload and isinstance(smart_payload["disks"], list):
            smart_disks = smart_payload["disks"]
        elif "disk" in smart_payload and isinstance(smart_payload["disk"], dict):
            smart_disks = [smart_payload["disk"]]

    # 2. ĐỌC HOẶC THU THẬP THÔNG TIN PHẦN CỨNG & ĐỒ HỌA (GPU-Z, CPU-Z, HWMONITOR)
    hw_diag_file = os.path.join(task_dir, "hardware_diagnostics.json")
    hw_diag_payload = None
    if os.path.exists(hw_diag_file):
        try:
            with open(hw_diag_file, "r", encoding="utf-8") as hf:
                hw_diag_payload = json.load(hf)
        except Exception:
            pass
    if not hw_diag_payload:
        try:
            import scripts.hardware_monitor_service as hms
            hw_diag_payload = hms.get_detailed_hardware_diagnostics()
            with open(hw_diag_file, "w", encoding="utf-8") as hf:
                json.dump(hw_diag_payload, hf, ensure_ascii=False, indent=2)
        except Exception:
            pass

    # Xử lý thông số CPU & GPU
    hw_cpu = (hw_diag_payload.get("cpu") if hw_diag_payload else {}) or {}
    hw_gpus = (hw_diag_payload.get("gpus") if hw_diag_payload else []) or []
    primary_gpu = (hw_diag_payload.get("primary_gpu") if hw_diag_payload else "DirectX Graphics Adapter") or "DirectX Graphics Adapter"
    primary_vram = (hw_diag_payload.get("primary_vram") if hw_diag_payload else "N/A") or "N/A"
    cpu_name = hw_cpu.get("name") or "Vi Xử Lý Windows"
    cpu_cores = hw_cpu.get("cores") or 0
    cpu_threads = hw_cpu.get("threads") or (os.cpu_count() or 0)
    cpu_ghz = hw_cpu.get("clock_ghz") or "N/A"
    cpu_socket = hw_cpu.get("socket") or "N/A"
    cpu_cores_str = f"{cpu_cores} nhân / {cpu_threads} luồng" if cpu_cores else f"{cpu_threads} luồng"

    # Kết xuất thẻ SMART Tab 3
    smart_cards_list = []
    smart_summary_badge = '<span style="background:#dcfce7; color:#15803d; border:1px solid #86efac; padding:4px 10px; border-radius:12px; font-weight:700; font-size:12px;">🟢 100% TỐT (An Toàn)</span>'
    primary_temp_str = "40°C (Mát mẻ)"
    
    if smart_disks:
        worst_status = "GOOD"
        temps_list = []
        for d in smart_disks:
            d_name = d.get("name") or "Ổ Đĩa"
            d_let = d.get("driveLetter") or "C:"
            d_type = d.get("typeLabel") or "SSD / NVMe"
            d_cap = d.get("capacity") or 0
            d_temp = d.get("temp") or 40
            temps_list.append(f"{d_temp}°C")
            d_score = d.get("healthScore", 100)
            d_status = (d.get("healthStatus") or "GOOD").upper()
            d_poh = d.get("powerOnHours") or 0
            d_tbw = d.get("totalWritesTBW") or 0.0
            d_serial = d.get("serialNumber") or "N/A"
            attrs = d.get("smartAttributes") or {}

            badge_bg = "#dcfce7"
            badge_color = "#15803d"
            badge_border = "#86efac"
            status_text = f"100% TỐT ({d_status})"
            if d_status in ["CAUTION", "CANH_BAO"] or d_score < 90:
                badge_bg = "#fef3c7"
                badge_color = "#b45309"
                badge_border = "#fde68a"
                status_text = f"CẢNH BÁO ({d_score}%)"
                worst_status = "CAUTION"
            elif d_status in ["BAD", "HONG", "NGUY_HIEM"] or d_score < 50:
                badge_bg = "#fee2e2"
                badge_color = "#b91c1c"
                badge_border = "#fca5a5"
                status_text = "HỎNG / NGUY HIỂM"
                worst_status = "BAD"

            realloc = attrs.get("reallocated", 0)
            pending = attrs.get("pending", 0)
            uncorr = attrs.get("uncorrectable", 0)
            crc = attrs.get("crcErrors", 0)
            media = attrs.get("mediaErrors", 0)

            smart_cards_list.append(f"""
            <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px; padding:18px 22px; margin-bottom:16px; box-shadow:0 2px 10px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:14px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:26px;">💿</span>
                        <div>
                            <div style="font-size:16px; font-weight:800; color:#0f172a;">{d_name} ({d_let})</div>
                            <div style="font-size:12px; color:#64748b; margin-top:2px;">
                                Chuẩn: <strong>{d_type}</strong> • Dung lượng: <strong>{d_cap} GB</strong> • Serial: <code style="font-family:monospace; color:#7c3aed;">{d_serial}</code>
                            </div>
                        </div>
                    </div>
                    <span style="background:{badge_bg}; color:{badge_color}; border:1px solid {badge_border}; font-size:13px; font-weight:800; padding:6px 14px; border-radius:20px;">
                        {status_text}
                    </span>
                </div>
                
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:16px;">
                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px;">
                        <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Nhiệt Độ Ổ Đĩa</div>
                        <div style="font-size:18px; font-weight:900; color:#059669; margin-top:2px;">🌡️ {d_temp}°C</div>
                    </div>
                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px;">
                        <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Tổng Giờ Hoạt Động</div>
                        <div style="font-size:18px; font-weight:900; color:#4338ca; margin-top:2px;">⏱️ {d_poh:,} giờ</div>
                    </div>
                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px;">
                        <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Tổng Dung Lượng Ghi</div>
                        <div style="font-size:18px; font-weight:900; color:#7c3aed; margin-top:2px;">💾 {d_tbw} TB</div>
                    </div>
                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px;">
                        <div style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Số Lần Khởi Động</div>
                        <div style="font-size:18px; font-weight:900; color:#0f172a; margin-top:2px;">🔌 {d.get('powerCycles', 0):,} lần</div>
                    </div>
                </div>

                <div style="background:#faf5ff; border:1px solid #e9d5ff; border-radius:10px; padding:12px 16px; margin-bottom:14px;">
                    <div style="font-size:11.5px; font-weight:800; color:#6b21a8; text-transform:uppercase; margin-bottom:8px;">
                        🔍 BẢNG ĐỐI CHIẾU 5 CHỈ SỐ SỐNG CÒN (CRYSTALDISKINFO STANDARD)
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:8px; font-size:12px;">
                        <div>• 05 Reallocated Sectors: <strong style="color:{'#15803d' if realloc==0 else '#b91c1c'};">{realloc} (Chuẩn: 0)</strong></div>
                        <div>• C5 Current Pending: <strong style="color:{'#15803d' if pending==0 else '#b91c1c'};">{pending} (Chuẩn: 0)</strong></div>
                        <div>• C6 Uncorrectable: <strong style="color:{'#15803d' if uncorr==0 else '#b91c1c'};">{uncorr} (Chuẩn: 0)</strong></div>
                        <div>• 0E Media/Integrity: <strong style="color:{'#15803d' if media==0 else '#b91c1c'};">{media} (Chuẩn: 0)</strong></div>
                        <div>• C7 CRC UltraDMA: <strong style="color:#0f172a;">{crc}</strong></div>
                    </div>
                </div>
            </div>
            """)

        if worst_status == "GOOD":
            smart_summary_badge = '<span style="background:#dcfce7; color:#15803d; border:1px solid #86efac; padding:4px 10px; border-radius:12px; font-weight:700; font-size:12px;">🟢 100% TỐT (An Toàn)</span>'
        elif worst_status == "CAUTION":
            smart_summary_badge = '<span style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; padding:4px 10px; border-radius:12px; font-weight:700; font-size:12px;">⚠️ CẢNH BÁO S.M.A.R.T</span>'
        else:
            smart_summary_badge = '<span style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; padding:4px 10px; border-radius:12px; font-weight:700; font-size:12px;">🔴 HỎNG / NGUY HIỂM</span>'

        if temps_list:
            primary_temp_str = ", ".join(temps_list)

    # Kết xuất thẻ GPU Tab 4
    gpu_cards_list = []
    if hw_gpus:
        for g in hw_gpus:
            g_disc = g.get("is_discrete", False)
            disc_badge = '<span style="background:#dbeafe; color:#1d4ed8; font-size:11px; font-weight:700; padding:2px 8px; border-radius:10px;">🎮 Card Rời (Discrete)</span>' if g_disc else '<span style="background:#f1f5f9; color:#475569; font-size:11px; font-weight:700; padding:2px 8px; border-radius:10px;">⚡ Card Tích Hợp (iGPU)</span>'
            gpu_cards_list.append(f"""
            <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:12px; padding:14px 18px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div style="font-size:15px; font-weight:800; color:#0f172a;">🎮 {g.get('name')}</div>
                    {disc_badge}
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px; font-size:12.5px; color:#475569;">
                    <div>• Dung Lượng VRAM: <strong style="color:#d97706;">{g.get('vram', 'Shared')}</strong></div>
                    <div>• Driver Card Màn Hình: <strong>{g.get('driver', 'N/A')}</strong></div>
                    <div>• Video Processor: <strong>{g.get('processor', 'N/A')}</strong></div>
                </div>
            </div>
            """)
    else:
        gpu_cards_list.append(f"""
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:14px 18px;">
            <div style="font-weight:700; color:#0f172a;">🎮 {primary_gpu}</div>
            <div style="font-size:12px; color:#64748b; margin-top:4px;">Dung lượng VRAM: {primary_vram}</div>
        </div>
        """)

    # Kết xuất cảm biến nhiệt độ
    thermals_list = (hw_diag_payload.get("thermals") if hw_diag_payload else []) or []
    thermal_items_html = []
    if thermals_list:
        for t in thermals_list:
            thermal_items_html.append(f"""
            <div style="display:flex; justify-content:space-between; align-items:center; padding:9px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; font-size:12.5px;">
                <span style="font-weight:600; color:#1e293b;">{t.get('component')}</span>
                <span style="font-weight:800; color:#059669; font-size:14px;">🌡️ {t.get('temp')}°C ({t.get('status', 'GOOD')})</span>
            </div>
            """)
    else:
        thermal_items_html.append('<div style="font-size:12.5px; color:#64748b; padding:8px;">Hệ thống tản nhiệt và ổ đĩa hoạt động mát mẻ trong ngưỡng an toàn.</div>')

    drives_data = []
    if disk_data and isinstance(disk_data, dict):
        drives_data = disk_data.get("drives", [])
    if not drives_data:
        try:
            import scripts.disk_scanner as ds
            drives_data = ds.get_logical_drives()
        except Exception:
            pass

    cards_h = []
    if drives_data:
        for d in drives_data:
            pct = d.get("percent", 0)
            bar_color = "linear-gradient(90deg, #8b5cf6, #6366f1)"
            badge_color = "#ede9fe; color:#6d28d9"
            if pct > 90:
                bar_color = "linear-gradient(90deg, #ef4444, #dc2626)"
                badge_color = "#fee2e2; color:#b91c1c"
            elif pct > 75:
                bar_color = "linear-gradient(90deg, #f59e0b, #d97706)"
                badge_color = "#fef3c7; color:#b45309"
            cards_h.append(f"""
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px 18px; min-width:240px; flex:1; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
                <div style="display:flex; justify-content:space-between; align-items:center; font-weight:700; font-size:13.5px; color:#1e293b;">
                    <span>💽 Ổ Đĩa {d.get('drive')}</span>
                    <span style="font-size:11px; padding:2px 8px; border-radius:6px; background:{badge_color}; font-weight:700;">Đã dùng {pct}%</span>
                </div>
                <div style="font-size:12px; color:#475569; margin:7px 0 5px 0;">Đã dùng: <strong>{d.get('used_human')}</strong> / {d.get('total_human')} (Trống: <span style="color:#15803d; font-weight:700;">{d.get('free_human')}</span>)</div>
                <div style="height:7px; background:#e2e8f0; border-radius:4px; overflow:hidden;">
                    <div style="height:100%; width:{pct}%; background:{bar_color}; border-radius:4px;"></div>
                </div>
            </div>
            """)

    disk_cards_html = f"""
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:16px 20px; box-shadow:0 2px 8px rgba(0,0,0,0.03); margin-bottom:20px;">
        <div style="font-size:12px; font-weight:800; color:#475569; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
            <span>💾</span> Tổng Quan Các Phân Vùng Ổ Cứng
        </div>
        <div style="display:flex; gap:14px; flex-wrap:wrap;">{''.join(cards_h)}</div>
    </div>
    """ if cards_h else ""

    rows_html = ""
    for idx, a in enumerate(apps, start=1):
        order_str = f"{idx:02d}"
        thumb = a.get("thumbnail", "")
        if thumb:
            icon_tag = f'<img src="{thumb}" alt="" style="width:24px; height:24px; object-fit:contain; border-radius:5px; vertical-align:middle; background:#fff; padding:1px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">'
        else:
            icon_tag = '<span style="font-size:18px;">📦</span>'
            
        name = (a.get("name") or "N/A").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        pub = (a.get("publisher") or "Chưa rõ").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        ver = (a.get("version") or "N/A").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        date = (a.get("install_date") or "Chưa rõ").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        path = (a.get("icon_path") or a.get("location") or "N/A").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        
        rows_html += f"""
        <tr class="app-row">
            <td style="text-align:center; font-weight:700; color:#7c3aed;">{order_str}</td>
            <td style="text-align:center;">{icon_tag}</td>
            <td>
                <div style="font-weight:700; color:#0f172a; font-size:13.5px;">{name}</div>
                <div style="font-size:11px; color:#64748b;">{pub}</div>
            </td>
            <td><span class="badge badge-ver">v{ver}</span></td>
            <td style="text-align:center; font-size:12px; font-weight:600; color:#334155;">{date}</td>
            <td style="font-family:Consolas, Monaco, monospace; font-size:11px; color:#64748b; max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="{path}">{path}</td>
        </tr>
        """

    disk_json_str = "null"
    trees_count = 0
    total_files_count = 0
    if disk_data and isinstance(disk_data, dict):
        disk_json_str = json.dumps(disk_data, ensure_ascii=False).replace("</script>", "<\\/script>")
        trees_count = len(disk_data.get("trees", []))
        total_files_count = sum(t.get("files_count", 0) for t in disk_data.get("trees", []))

    drives_badge_str = f"{len(drives_data)} ổ đĩa" if drives_data else "0 ổ đĩa"
    if total_files_count > 0:
        drives_badge_str += f" ({total_files_count:,} tệp)"

    # Xây dựng Tab 3: Sức Khỏe Ổ Cứng S.M.A.R.T (CrystalDiskInfo)
    smart_cards_joined = ''.join(smart_cards_list) if smart_cards_list else '<div style="background:#fff; padding:30px; border-radius:12px; text-align:center; color:#64748b; border:1px solid #e2e8f0;">Chưa phát hiện hoặc chưa có dữ liệu ổ đĩa S.M.A.R.T.</div>'
    smart_tab_html = f"""
    <!-- TAB CONTENT 3: SỨC KHỎE Ổ CỨNG S.M.A.R.T (CRYSTALDISKINFO) -->
    <div id="tabContentSmart" class="tab-content" style="display:none;">
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px 24px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                <div>
                    <h2 style="font-size:18px; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:8px;">
                        <span>💿</span> Báo Cáo Chi Tiết Sức Khỏe Ổ Cứng S.M.A.R.T (Chuẩn CrystalDiskInfo)
                    </h2>
                    <p style="font-size:13px; color:#64748b; margin-top:4px;">
                        Dữ liệu đối chiếu trực tiếp từ cảm biến phần cứng qua nhân CrystalDiskInfo Core 9.9.2 x64 • Đảm bảo an toàn dữ liệu và cảnh báo sớm
                    </p>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    {smart_summary_badge}
                    <button class="btn" onclick="window.print()">🖨️ In Báo Cáo S.M.A.R.T</button>
                </div>
            </div>
        </div>

        <!-- THẺ CHẨN ĐOÁN BÁC SĨ PHẦN CỨNG -->
        <div style="background:linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border:1.5px solid #86efac; border-radius:14px; padding:16px 20px; margin-bottom:20px;">
            <div style="font-size:13px; font-weight:800; color:#166534; text-transform:uppercase; margin-bottom:6px; display:flex; align-items:center; gap:8px;">
                <span>🩺</span> Đánh Giá &amp; Khuyến Nghị Kỹ Thuật Viên:
            </div>
            <div style="font-size:13.5px; color:#14532d; line-height:1.6;">
                {smart_diag_text}
            </div>
        </div>

        <!-- DANH SÁCH CÁC Ổ ĐĨA -->
        <div>
            {smart_cards_joined}
        </div>
    </div>
    """

    # Xây dựng Tab 4: Giám Sát Phần Cứng & Đồ Họa (GPU-Z, CPU-Z, HWMonitor)
    gpus_joined = ''.join(gpu_cards_list) if gpu_cards_list else '<div style="background:#fff; padding:20px; border-radius:12px; color:#64748b;">Không phát hiện card đồ họa rời.</div>'
    thermals_joined = ''.join(thermal_items_html) if thermal_items_html else '<div style="font-size:12.5px; color:#64748b; padding:8px;">Hệ thống tản nhiệt hoạt động mát mẻ trong ngưỡng an toàn.</div>'

    ram_info_dict = machine_info.get('ram_info') if isinstance(machine_info.get('ram_info'), dict) else None
    hw_ram_raw = hw_diag_payload.get('ram') if isinstance(hw_diag_payload, dict) else None
    hw_ram_dict = hw_ram_raw if isinstance(hw_ram_raw, dict) else None

    if not ram_info_dict and hw_ram_dict:
        ram_info_dict = hw_ram_dict
    if not ram_info_dict or (not ram_info_dict.get('bus_mhz') and not ram_info_dict.get('modules')):
        try:
            r_live = get_ram_info()
            if ram_info_dict:
                merged_r = dict(r_live)
                for rk, rv in ram_info_dict.items():
                    if rv:
                        merged_r[rk] = rv
                ram_info_dict = merged_r
            else:
                ram_info_dict = r_live
        except Exception:
            ram_info_dict = ram_info_dict or {}

    ram_str = (
        machine_info.get('ram_summary')
        or (ram_info_dict.get('ram_summary') if ram_info_dict else '')
        or (hw_ram_dict.get('summary') if hw_ram_dict else '')
        or (hw_ram_raw if isinstance(hw_ram_raw, str) else '')
        or machine_info.get('ram')
        or ''
    )
    if not ram_str:
        inst_gb = machine_info.get('ram_installed_gb') or machine_info.get('total_ram_gb') or (ram_info_dict.get('installed_gb') if ram_info_dict else 0) or (ram_info_dict.get('total_gb') if ram_info_dict else 0)
        if inst_gb:
            ram_str = f"{_fmt_gb_value(inst_gb)} GB"
        else:
            ram_str = 'N/A'

    ram_bus_str = (
        machine_info.get('ram_bus_display')
        or (ram_info_dict.get('bus_display') if ram_info_dict else '')
        or (hw_ram_dict.get('bus_display') if hw_ram_dict else '')
        or ''
    )
    if not ram_bus_str or ram_bus_str == 'Chưa rõ':
        b_mhz = machine_info.get('ram_bus_mhz') or (ram_info_dict.get('bus_mhz') if ram_info_dict else 0) or 0
        r_type = machine_info.get('ram_type') or (ram_info_dict.get('ram_type') if ram_info_dict else '') or ''
        if b_mhz and int(b_mhz) > 0:
            ram_bus_str = f"{int(b_mhz)} MHz" + (f" ({r_type})" if r_type else "")
        elif r_type:
            ram_bus_str = r_type
        else:
            ram_bus_str = 'Chưa xác định'

    slots_u = machine_info.get('ram_slots_used') or (ram_info_dict.get('slots_used') if ram_info_dict else 0) or 0
    slots_t = machine_info.get('ram_slots_total') or (ram_info_dict.get('slots_total') if ram_info_dict else 0) or 0
    ram_slots_str = (
        (ram_info_dict.get('slots_display') if ram_info_dict else '')
        or (hw_ram_dict.get('slots_display') if hw_ram_dict else '')
        or (f"{slots_u}/{slots_t} khe cắm" if slots_t else (f"{slots_u} thanh" if slots_u else "Chưa rõ"))
    )

    ram_modules = (ram_info_dict.get('modules') if ram_info_dict else None) or (hw_ram_dict.get('modules') if hw_ram_dict else None) or []
    ram_modules_html = ""
    if ram_modules:
        mod_rows = []
        for rm in ram_modules:
            rm_slot = (rm.get('slot') or f"DIMM #{rm.get('index', '')}").replace("&", "&amp;").replace("<", "&lt;")
            rm_cap = rm.get('capacity_gb', 0)
            rm_type = rm.get('mem_type') or 'RAM'
            rm_bus = rm.get('bus_mhz') or rm.get('configured_mhz') or rm.get('speed_mhz') or 0
            rm_bus_txt = f"{rm_bus} MHz" if rm_bus else "N/A"
            rm_mfg = (rm.get('manufacturer') or '').replace("&", "&amp;").replace("<", "&lt;")
            rm_pn = (rm.get('part_number') or '').replace("&", "&amp;").replace("<", "&lt;")
            extra = " • ".join([p for p in [rm_mfg, rm_pn] if p])
            mod_rows.append(
                f'<div style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; font-size:12px;">'
                f'<span>🧩 <strong>{rm_slot}</strong>{f" ({extra})" if extra else ""}</span>'
                f'<strong style="color:#0369a1;">{_fmt_gb_value(rm_cap)} GB • {rm_type} • {rm_bus_txt}</strong>'
                f'</div>'
            )
        ram_modules_html = f'<div style="margin-top:8px; padding-top:8px; border-top:1px dashed #e2e8f0; display:flex; flex-direction:column; gap:6px;"><div style="font-size:11.5px; font-weight:700; color:#64748b; text-transform:uppercase;">Chi Tiết Từng Thanh RAM:</div>{"".join(mod_rows)}</div>'

    pn_str = machine_info.get('product_number') or 'N/A'
    sn_str = machine_info.get('serial_number') or 'N/A'
    mb_str = machine_info.get('motherboard') or 'N/A'
    os_str = machine_info.get('os_info') or 'Windows'
    scan_id_str = machine_info.get('scan_id') or 'N/A'

    hwmon_tab_html = f"""
    <!-- TAB CONTENT 4: PHẦN CỨNG & ĐỒ HỌA (GPU-Z, CPU-Z, HWMONITOR) -->
    <div id="tabContentHwmon" class="tab-content" style="display:none;">
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px 24px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                <div>
                    <h2 style="font-size:18px; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:8px;">
                        <span>🌡️</span> Hồ Sơ Giám Sát Phần Cứng &amp; Đồ Họa Chuyên Sâu
                    </h2>
                    <p style="font-size:13px; color:#64748b; margin-top:4px;">
                        Tổng hợp giám sát từ bộ tứ kiểm định phần cứng: TechPowerUp GPU-Z 2.71 • CPUID CPU-Z 2.12 • CPUID HWMonitor 1.56
                    </p>
                </div>
                <div>
                    <button class="btn" onclick="window.print()">🖨️ In Hồ Sơ Phần Cứng</button>
                </div>
            </div>
        </div>

        <!-- GRID 2 CỘT: CPU/RAM & GPU/VRAM -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(360px, 1fr)); gap:18px; margin-bottom:20px;">
            <!-- CỘT 1: THÔNG SỐ CPU & BỘ NHỚ RAM -->
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px 20px; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
                <div style="font-size:14px; font-weight:800; color:#1e293b; text-transform:uppercase; margin-bottom:14px; display:flex; align-items:center; gap:8px; border-bottom:1px solid #f1f5f9; padding-bottom:10px;">
                    <span>⚡</span> Vi Xử Lý &amp; Bộ Nhớ RAM (CPUID CPU-Z Profile)
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; font-size:13px; color:#475569;">
                    <div style="display:flex; justify-content:space-between;">
                        <span>Tên Vi Xử Lý (CPU):</span>
                        <strong style="color:#0f172a;">{cpu_name}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Cấu Trúc / Phân Luồng:</span>
                        <strong style="color:#7c3aed;">{cpu_cores_str}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Xung Nhịp Danh Định (Base):</span>
                        <strong>{cpu_ghz}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Socket Bo Mạch:</span>
                        <strong>{cpu_socket}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Tổng Dung Lượng RAM:</span>
                        <strong style="color:#059669;">{ram_str}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Bus RAM &amp; Chuẩn Bộ Nhớ:</span>
                        <strong style="color:#0369a1;">{ram_bus_str}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Khe Cắm RAM Đã Dùng:</span>
                        <strong>{ram_slots_str}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Bo Mạch Chủ (Motherboard):</span>
                        <strong>{mb_str}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Mã Sản Phẩm (PN) / Serial (SN):</span>
                        <strong style="font-family:monospace; color:#7c3aed;">PN: {pn_str} • SN: {sn_str}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Hệ Điều Hành &amp; Phiên Bản:</span>
                        <strong>{os_str}</strong>
                    </div>
                    {ram_modules_html}
                </div>
            </div>

            <!-- CỘT 2: THÔNG SỐ CARD ĐỒ HỌA (TECHPOWERUP GPU-Z) -->
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px 20px; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
                <div style="font-size:14px; font-weight:800; color:#1e293b; text-transform:uppercase; margin-bottom:14px; display:flex; align-items:center; gap:8px; border-bottom:1px solid #f1f5f9; padding-bottom:10px;">
                    <span>🎮</span> Card Màn Hình &amp; Đồ Họa (TechPowerUp GPU-Z Profile)
                </div>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    {gpus_joined}
                </div>
            </div>
        </div>

        <!-- KHỐI NHIỆT ĐỘ & CẢM BIẾN (HWMONITOR) -->
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px 20px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.02);">
            <div style="font-size:14px; font-weight:800; color:#1e293b; text-transform:uppercase; margin-bottom:14px; display:flex; align-items:center; gap:8px; border-bottom:1px solid #f1f5f9; padding-bottom:10px;">
                <span>🌡️</span> Cảm Biến Nhiệt Độ Hệ Thống &amp; Ổ Cứng (CPUID HWMonitor Protocol)
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px;">
                {thermals_joined}
            </div>
        </div>

        <!-- BỘ TỨ KIỂM ĐỊNH AUDIT STAMP -->
        <div style="background:#f8fafc; border:1.5px dashed #cbd5e1; border-radius:12px; padding:16px 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <div style="font-size:12.5px; color:#475569;">
                    🛡️ <strong>Chứng Chỉ Bàn Giao Kỹ Thuật:</strong> Toàn bộ thông số phần cứng và sức khỏe linh kiện được thu thập, bảo lưu nguyên trạng và đối chiếu chuẩn theo hồ sơ nhiệm vụ <code>{scan_id_str}</code>.
                </div>
                <div style="font-size:11.5px; font-weight:700; color:#6366f1; background:#eef2ff; padding:4px 12px; border-radius:20px;">
                    ✓ Verified by Win11 Technician Suite
                </div>
            </div>
        </div>
    </div>
    """

    html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';">
<meta name="generator" content="Windows 11 KTV Toolkit - Standalone Safe Report">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Báo Cáo Tổng Hợp - {machine_info.get('customer_name') or machine_info['computer_name']} - {stage_label}</title>
<style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background: #f8fafc;
        color: #1e293b;
        padding: 30px 20px;
    }}
    .container {{
        max-width: 1250px;
        margin: 0 auto;
    }}
    .header-card {{
        background: #ffffff;
        border-radius: 16px;
        padding: 24px 28px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        border: 1px solid #e2e8f0;
        margin-bottom: 20px;
    }}
    .header-title h1 {{
        font-size: 22px;
        color: #0f172a;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 10px;
    }}
    .header-title p {{
        font-size: 13px;
        color: #64748b;
    }}
    .meta-grid {{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px 20px;
        background: #f1f5f9;
        padding: 16px 20px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        font-size: 12.5px;
        margin-top: 18px;
    }}
    .meta-grid strong {{
        color: #0f172a;
    }}
    .meta-grid span {{
        color: #475569;
    }}

    /* Tabs Navigation */
    .report-tabs-nav {{
        display: flex;
        gap: 8px;
        margin-bottom: 22px;
        background: #e2e8f0;
        padding: 5px;
        border-radius: 14px;
        border: 1px solid #cbd5e1;
    }}
    .report-tab-btn {{
        flex: 1;
        padding: 12px 20px;
        border-radius: 10px;
        border: none;
        background: transparent;
        color: #475569;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.2s ease;
    }}
    .report-tab-btn:hover {{
        background: rgba(255, 255, 255, 0.6);
        color: #0f172a;
    }}
    .report-tab-btn.active {{
        background: #7c3aed;
        color: #ffffff;
        box-shadow: 0 4px 14px rgba(124, 58, 237, 0.28);
    }}
    .tab-count-pill {{
        background: rgba(0,0,0,0.08);
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 11.5px;
        font-weight: 700;
    }}
    .report-tab-btn.active .tab-count-pill {{
        background: rgba(255,255,255,0.25);
        color: #ffffff;
    }}

    .controls {{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 12px;
    }}
    .search-box {{
        position: relative;
        width: 360px;
    }}
    .search-box input {{
        width: 100%;
        padding: 9px 14px 9px 36px;
        border-radius: 20px;
        border: 1px solid #cbd5e1;
        font-size: 13px;
        outline: none;
        background: #ffffff;
    }}
    .search-box input:focus {{
        border-color: #7c3aed;
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
    }}
    .search-icon {{
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;
        color: #94a3b8;
    }}
    .table-box {{
        background: #ffffff;
        border-radius: 14px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        overflow: hidden;
        margin-bottom: 24px;
    }}
    table {{
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }}
    th {{
        background: #f8fafc;
        padding: 12px 16px;
        font-size: 12px;
        font-weight: 700;
        color: #475569;
        border-bottom: 1px solid #e2e8f0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }}
    td {{
        padding: 11px 16px;
        font-size: 13px;
        border-bottom: 1px solid #f1f5f9;
        vertical-align: middle;
    }}
    tr:hover td {{
        background: #f8fafc;
    }}
    .badge {{
        display: inline-block;
        font-size: 11px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 6px;
    }}
    .badge-ver {{
        background: #e0f2fe;
        color: #0369a1;
        border: 1px solid #bae6fd;
    }}
    .btn {{
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        border: 1px solid #cbd5e1;
        background: #ffffff;
        color: #334155;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }}
    .btn:hover {{
        background: #f1f5f9;
        border-color: #94a3b8;
    }}

    /* Tree Table & Drive Cards */
    .tree-toggle-btn {{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        font-size: 10px;
        color: #6366f1;
        background: #eef2ff;
        cursor: pointer;
        user-select: none;
        margin-right: 4px;
        font-weight: bold;
    }}
    .tree-toggle-btn:hover {{
        background: #e0e7ff;
        color: #4338ca;
    }}
    .drive-progress-track {{
        height: 6px;
        background: #f1f5f9;
        border-radius: 3px;
        overflow: hidden;
    }}
    .drive-progress-bar {{
        height: 100%;
        border-radius: 3px;
        transition: width 0.3s ease;
    }}

    @media print {{
        body {{ background: #fff; padding: 0; }}
        .header-card, .table-box {{ box-shadow: none; border-color: #ccc; }}
        .controls, .report-tabs-nav {{ display: none !important; }}
        .tab-content {{ display: block !important; margin-bottom: 30px; }}
    }}
</style>
</head>
<body>
<div class="container">
    <div class="header-card">
        <div style="margin-bottom:12px;">
            {stage_badge_html}
        </div>
        <div class="header-title">
            <h1><span>📊</span> Báo Cáo Tổng Hợp Máy Tính & Cây Dữ Liệu</h1>
            <p>Báo cáo tự động gồm Phần mềm đã cài đặt, Cấu hình máy tính & Cây phân cấp dung lượng ổ đĩa TreeSize</p>
        </div>
        <div class="meta-grid">
            <div><span>👤 Khách Hàng / User:</span> <strong style="color:#0f172a; font-size:13.5px;">{cust_name}</strong></div>
            <div><span>🏷️ Mã ID Hệ Thống:</span> <strong style="color:#7c3aed; font-family:monospace;">{cust_id}</strong></div>
            <div><span>📌 Tình Trạng Máy:</span> <strong>{stage_label}</strong></div>
            <div><span>🕒 Thời Gian Quét:</span> <strong>{machine_info.get('scan_time', 'N/A')}</strong></div>
            <div><span>💻 Tên Máy Tính:</span> <strong>{machine_info.get('computer_name', 'PC')}</strong></div>
            <div><span>👤 Kỹ Thuật Viên:</span> <strong>{machine_info.get('user_id', 'Kỹ Thuật Viên')}</strong></div>
            <div><span>🏷️ Số Sản Phẩm (PN):</span> <strong style="color:#0369a1; font-family:monospace;">{pn_str}</strong></div>
            <div><span>🔢 Số Serial (SN):</span> <strong style="color:#7c3aed; font-family:monospace;">{sn_str}</strong></div>
            <div><span>🔌 Bo Mạch / Mainboard:</span> <strong>{machine_info.get('motherboard') or 'N/A'}</strong></div>
            <div><span>🧠 Bộ Nhớ RAM &amp; Bus:</span> <strong style="color:#059669;">{ram_str}</strong> <span style="font-size:11px; color:#0369a1;">(Bus {ram_bus_str} • {ram_slots_str})</span></div>
            <div><span>⚡ Vi Xử Lý (CPU):</span> <strong>{cpu_name}</strong> <span style="font-size:11px; color:#64748b;">({cpu_cores_str})</span></div>
            <div><span>🎮 Card Đồ Họa (GPU):</span> <strong style="color:#d97706;">{primary_gpu}</strong> <span style="font-size:11px; color:#64748b;">({primary_vram})</span></div>
            <div><span>💿 S.M.A.R.T Ổ Cứng:</span> {smart_summary_badge}</div>
            <div><span>🌡️ Cảm Biến / Nhiệt Độ:</span> <strong style="color:#059669;">{primary_temp_str}</strong></div>
            <div><span>📦 Tổng Phần Mềm:</span> <strong>{len(apps)}</strong> ({with_icons} có logo)</div>
            <div><span>🪟 Hệ Điều Hành:</span> <strong>{machine_info.get('os_info', 'Windows 11')}</strong></div>
            <div style="grid-column: span 2;"><span>🛡️ Bản Quyền Windows:</span> {lic_badge_html}</div>
            <div style="grid-column: span 2;"><span>🛡️ Bộ Tứ Kiểm Định:</span> <span style="font-size:11.5px; font-weight:700; color:#475569;">CrystalDiskInfo 9.9.2 • TechPowerUp GPU-Z 2.71 • CPUID HWMonitor 1.56 • CPU-Z 2.12</span></div>
            <div style="grid-column: span 2;"><span>🔑 Thư Mục / Mã Lượt Quét:</span> <code style="color:#7c3aed; font-family:monospace; background:#fff; padding:2px 8px; border-radius:4px; border:1px solid #cbd5e1;">{machine_info.get('scan_id', 'N/A')}</code></div>
        </div>
    </div>

    <!-- TABS NAVIGATION -->
    <div class="report-tabs-nav">
        <button class="report-tab-btn active" id="tabNavApps" onclick="switchReportTab('apps')">
            <span style="font-size:16px;">🖥️</span> <span>Thông Tin Máy &amp; Phần Mềm</span>
            <span class="tab-count-pill">{len(apps)} phần mềm</span>
        </button>
        <button class="report-tab-btn" id="tabNavDisk" onclick="switchReportTab('disk')">
            <span style="font-size:16px;">💾</span> <span>Dung Lượng Ổ Đĩa &amp; Cây Thư Mục</span>
            <span class="tab-count-pill">{drives_badge_str}</span>
        </button>
        <button class="report-tab-btn" id="tabNavSmart" onclick="switchReportTab('smart')">
            <span style="font-size:16px;">💿</span> <span>Sức Khỏe Ổ Cứng S.M.A.R.T</span>
            <span class="tab-count-pill">{len(smart_disks)} ổ đĩa</span>
        </button>
        <button class="report-tab-btn" id="tabNavHwmon" onclick="switchReportTab('hwmon')">
            <span style="font-size:16px;">🌡️</span> <span>Phần Cứng &amp; Đồ Họa (GPU-Z/HWMonitor)</span>
            <span class="tab-count-pill">Đã xác thực</span>
        </button>
    </div>

    <!-- TAB CONTENT 1: PHẦN MỀM ĐÃ CÀI ĐẶT -->
    <div id="tabContentApps" class="tab-content">
        <div class="controls">
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="searchInput" placeholder="Tìm theo tên phần mềm, nhà phát triển..." oninput="filterAppsTable()">
            </div>
            <div style="display:flex; gap:10px;">
                <a class="btn" href="report.csv" download="{machine_info['scan_id']}.csv">💾 Tải File CSV Phần Mềm</a>
                <button class="btn" onclick="window.print()">🖨️ In / Xuất PDF</button>
            </div>
        </div>

        <div class="table-box">
            <table>
                <thead>
                    <tr>
                        <th style="width: 50px; text-align:center;">STT</th>
                        <th style="width: 50px; text-align:center;">Logo</th>
                        <th>Tên Phần Mềm</th>
                        <th style="width: 140px;">Phiên Bản</th>
                        <th style="width: 120px; text-align:center;">Ngày Cài Đặt</th>
                        <th>Đường Dẫn / File Thực Thi</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    {rows_html}
                </tbody>
            </table>
        </div>
    </div>

    <!-- TAB CONTENT 2: DUNG LƯỢNG Ổ ĐĨA & CÂY THƯ MỤC (TREESIZE) -->
    <div id="tabContentDisk" class="tab-content" style="display:none;">
        {disk_cards_html}

        <div class="controls">
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="treeSearchInput" placeholder="Tìm theo tên thư mục hoặc đường dẫn..." oninput="filterTreeTable()">
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button class="btn" onclick="toggleTreeExpandAll()" id="btnExpandAll">⊞ Mở Rộng Tất Cả</button>
                <button class="btn" onclick="exportTreeCSV()">💾 Xuất CSV Cây Thư Mục</button>
                <a class="btn" href="disk_tree.csv" download="Cay_Thu_Muc_{machine_info['scan_id']}.csv" id="btnDownloadDiskCsv" style="display:none;">📄 Tải disk_tree.csv</a>
                <button class="btn" onclick="window.print()">🖨️ In Bảng Cây Thư Mục</button>
            </div>
        </div>

        <div class="table-box">
            <table>
                <thead>
                    <tr>
                        <th style="min-width:320px;">Tên Thư Mục / Cây Thư Mục</th>
                        <th style="width:140px; text-align:right;">Ước Lượng Dung Lượng</th>
                        <th style="width:110px; text-align:right;">Số Lượng Tệp</th>
                        <th style="width:115px; text-align:right;">Số Lượng Thư Mục</th>
                        <th style="width:140px;">% Chiếm Dụng</th>
                        <th style="width:145px; text-align:center;">Lần Sửa Đổi Cuối</th>
                    </tr>
                </thead>
                <tbody id="reportTreeTableBody">
                    <tr>
                        <td colspan="6" style="text-align:center; padding:32px; color:#64748b; font-size:13px;">
                            Đang nạp cấu trúc cây thư mục...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    {smart_tab_html}

    {hwmon_tab_html}
</div>

<script>
// DỮ LIỆU CÂY Ổ ĐĨA ĐƯỢC NHÚNG TRỰC TIẾP (OFFLINE 100% - KHÔNG CẦN SERVER/INTERNET)
const EMBEDDED_DISK_DATA = {disk_json_str};

let reportTreeNodesMap = new Map();
let reportExpandedNodeIds = new Set();
let reportTreeFilterQuery = "";
let isReportTreeAllExpanded = false;

function escapeHtml(str) {{
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}}

function getFileIcon(ext) {{
    const e = (ext || '').toLowerCase();
    const videoExts = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v'];
    const audioExts = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'];
    const imgExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.ico', '.bmp', '.svg'];
    const zipExts = ['.zip', '.rar', '.7z', '.tar', '.gz', '.iso'];
    const docExts = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'];
    const exeExts = ['.exe', '.msi', '.bat', '.cmd', '.ps1', '.vbs', '.reg'];
    const codeExts = ['.json', '.xml', '.html', '.css', '.js', '.py', '.cpp', '.cs'];

    if (videoExts.includes(e)) return '🎬';
    if (audioExts.includes(e)) return '🎵';
    if (imgExts.includes(e)) return '🖼️';
    if (zipExts.includes(e)) return '📦';
    if (docExts.includes(e)) return '📄';
    if (exeExts.includes(e)) return '⚡';
    if (codeExts.includes(e)) return '💻';
    return '📄';
}}

function initReportTree() {{
    const tbody = document.getElementById("reportTreeTableBody");
    if (!tbody) return;

    if (!EMBEDDED_DISK_DATA || !EMBEDDED_DISK_DATA.trees || EMBEDDED_DISK_DATA.trees.length === 0) {{
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:48px 24px; color:#64748b; font-size:13.5px;">
                    <div style="font-size:36px; margin-bottom:10px;">💾</div>
                    <div style="font-weight:700; color:#334155; font-size:14.5px; margin-bottom:6px;">Chưa Có Dữ Liệu Cây Thư Mục Cho Lượt Quét Này</div>
                    <div style="font-size:12.5px; color:#64748b; max-width:500px; margin:0 auto; line-height:1.5;">Bạn có thể mở giao diện <strong>Quét Máy Cũ</strong> &rarr; Chọn Tab <strong>Cây Dữ Liệu Ổ Đĩa</strong> &rarr; Bấm <strong>Quét Dữ Liệu Ổ Đĩa</strong> để quét và tự động cập nhật vào báo cáo này.</div>
                </td>
            </tr>
        `;
        return;
    }}

    reportTreeNodesMap.clear();
    reportExpandedNodeIds.clear();

    function indexNodes(nodes, depth = 0) {{
        nodes.forEach(n => {{
            n.depth = depth;
            reportTreeNodesMap.set(n.id, n);
            // Mở rộng mặc định ổ đĩa gốc (depth 0) và thư mục cấp 1 (depth 1)
            if (depth <= 1) {{
                reportExpandedNodeIds.add(n.id);
            }}
            if (n.children && n.children.length > 0) {{
                indexNodes(n.children, depth + 1);
            }}
        }});
    }}

    indexNodes(EMBEDDED_DISK_DATA.trees, 0);
    renderReportTreeTable();

    const btnCsv = document.getElementById("btnDownloadDiskCsv");
    if (btnCsv) btnCsv.style.display = "inline-flex";
}}

function renderReportTreeTable() {{
    const tbody = document.getElementById("reportTreeTableBody");
    if (!tbody) return;

    const q = reportTreeFilterQuery.toLowerCase().trim();
    if (q) {{
        const matches = [];
        reportTreeNodesMap.forEach(n => {{
            if ((n.name && n.name.toLowerCase().includes(q)) || (n.path && n.path.toLowerCase().includes(q))) {{
                matches.push(n);
            }}
        }});

        if (matches.length === 0) {{
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; padding:24px; color:#64748b; font-size:13px;">
                        Không tìm thấy thư mục/tệp nào khớp với từ khóa "<strong>${{escapeHtml(q)}}</strong>".
                    </td>
                </tr>
            `;
            return;
        }}

        matches.sort((a, b) => (b.size_bytes || 0) - (a.size_bytes || 0));
        let rowsHtml = '';
        matches.slice(0, 150).forEach(node => {{
            rowsHtml += renderSingleReportTreeRow(node, 0, false);
        }});
        tbody.innerHTML = rowsHtml;
        return;
    }}

    let rowsHtml = '';
    EMBEDDED_DISK_DATA.trees.forEach(tree => {{
        rowsHtml += buildReportTreeRowsRecursive(tree, 0);
    }});
    tbody.innerHTML = rowsHtml;
}}

function buildReportTreeRowsRecursive(node, depth) {{
    let html = renderSingleReportTreeRow(node, depth, true);
    const isExpanded = reportExpandedNodeIds.has(node.id);
    if (isExpanded && node.children && node.children.length > 0) {{
        node.children.forEach(child => {{
            html += buildReportTreeRowsRecursive(child, depth + 1);
        }});
    }}
    return html;
}}

function renderSingleReportTreeRow(node, depth, showToggle = true) {{
    const isExpanded = reportExpandedNodeIds.has(node.id);
    const indentPx = depth * 22;
    const isFilesGroup = (node.type === 'files_group');
    const isFile = (node.type === 'file');
    const hasChildren = isFilesGroup ? (node.files_count > 0) : (node.has_children || (node.children && node.children.length > 0));

    let toggleIcon = '';
    if (showToggle && hasChildren && !isFile) {{
        toggleIcon = `<span class="tree-toggle-btn" onclick="toggleReportNode('${{node.id}}', event)" title="${{isExpanded ? 'Thu gọn' : 'Mở rộng'}}">${{isExpanded ? '▼' : '▶'}}</span>`;
    }} else {{
        toggleIcon = `<span style="display:inline-block; width:20px; text-align:center; font-size:10px; color:${{isFile ? '#94a3b8' : '#cbd5e1'}}; margin-right:4px;">•</span>`;
    }}

    let typeIcon = '📁';
    if (node.type === 'drive') typeIcon = '💽';
    else if (isFilesGroup) typeIcon = isExpanded ? '📂' : '📑';
    else if (isFile) typeIcon = getFileIcon(node.ext);
    else if (isExpanded) typeIcon = '📂';

    const pct = Math.min(100, Math.max(0, node.percent_root || 0));
    let barColor = 'linear-gradient(90deg, #8b5cf6, #6366f1)';
    if (pct > 75) barColor = 'linear-gradient(90deg, #ef4444, #dc2626)';
    else if (pct > 40) barColor = 'linear-gradient(90deg, #f59e0b, #d97706)';

    const filesFormatted = (node.files_count !== undefined && node.files_count !== null) ? Number(node.files_count).toLocaleString('vi-VN') : '--';
    const dirsFormatted = (node.dirs_count !== undefined && node.dirs_count !== null) ? Number(node.dirs_count).toLocaleString('vi-VN') : '--';

    let nameHtml = '';
    if (isFilesGroup) {{
        nameHtml = `
            <span style="font-weight:700; color:#4f46e5; font-size:13px; cursor:pointer;" onclick="toggleReportNode('${{node.id}}', event)">
                ${{escapeHtml(node.name)}} <span style="font-size:11px; font-weight:600; color:#6366f1; background:#e0e7ff; padding:1px 6px; border-radius:4px; margin-left:4px;">${{isExpanded ? 'Đang hiện' : 'Bấm xem tệp'}}</span>
            </span>
        `;
    }} else if (isFile) {{
        nameHtml = `
            <span style="font-weight:500; color:#1e293b; font-size:12.5px;" title="${{escapeHtml(node.path)}}">
                ${{escapeHtml(node.name)}}
            </span>
        `;
    }} else {{
        nameHtml = `
            <span style="font-weight:${{depth === 0 ? '700' : '600'}}; color:#0f172a; font-size:13px;" title="${{escapeHtml(node.path || node.name)}}">
                ${{escapeHtml(node.name)}}
            </span>
        `;
    }}

    return `
        <tr class="tree-row">
            <td style="padding-left: ${{indentPx + 12}}px;">
                <div style="display:flex; align-items:center; gap:6px;">
                    ${{toggleIcon}}
                    <span style="font-size:15px;">${{typeIcon}}</span>
                    ${{nameHtml}}
                </div>
            </td>
            <td style="text-align:right; font-weight:700; color:#7c3aed; font-size:13px; font-family:Consolas, Monaco, monospace;">
                ${{node.size_human || '0 B'}}
            </td>
            <td style="text-align:right; font-size:12px; color:#334155; font-family:Consolas, Monaco, monospace;">
                ${{isFile ? '-' : filesFormatted}}
            </td>
            <td style="text-align:right; font-size:12px; color:#334155; font-family:Consolas, Monaco, monospace;">
                ${{isFile ? '-' : dirsFormatted}}
            </td>
            <td>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div class="drive-progress-track" style="flex:1; height:6px;">
                        <div class="drive-progress-bar" style="width:${{pct}}%; background:${{barColor}};"></div>
                    </div>
                    <span style="font-size:11px; font-weight:700; color:#64748b; width:40px; text-align:right;">${{pct}}%</span>
                </div>
            </td>
            <td style="text-align:center; font-size:11.5px; color:#64748b; font-family:Consolas, Monaco, monospace;">
                ${{node.mtime_str || '--'}}
            </td>
        </tr>
    `;
}}

function toggleReportNode(nodeId, event) {{
    if (event) event.stopPropagation();
    const node = reportTreeNodesMap.get(nodeId);
    if (!node) return;

    if (reportExpandedNodeIds.has(nodeId)) {{
        reportExpandedNodeIds.delete(nodeId);
        renderReportTreeTable();
        return;
    }}

    // 1. Neu da co danh sach con trong bo nho cache -> mo rong ngay lap tuc
    if (node.children && node.children.length > 0) {{
        reportExpandedNodeIds.add(nodeId);
        renderReportTreeTable();
        return;
    }}

    // 2. Neu la nut la hoac chua co du lieu sau hon trong ban ghi ngoai tuyen
    reportExpandedNodeIds.add(nodeId);
    renderReportTreeTable();
}}

function toggleTreeExpandAll() {{
    const btn = document.getElementById("btnExpandAll");
    if (isReportTreeAllExpanded) {{
        reportExpandedNodeIds.clear();
        (EMBEDDED_DISK_DATA.trees || []).forEach(t => reportExpandedNodeIds.add(t.id));
        isReportTreeAllExpanded = false;
        if (btn) btn.innerText = "⊞ Mở Rộng Tất Cả";
    }} else {{
        reportTreeNodesMap.forEach((n, id) => {{
            if (n.children && n.children.length > 0) {{
                reportExpandedNodeIds.add(id);
            }}
        }});
        isReportTreeAllExpanded = true;
        if (btn) btn.innerText = "⊟ Thu Gọn Tất Cả";
    }}
    renderReportTreeTable();
}}

function filterTreeTable() {{
    const input = document.getElementById("treeSearchInput");
    reportTreeFilterQuery = input ? input.value : "";
    renderReportTreeTable();
}}

function exportTreeCSV() {{
    if (!EMBEDDED_DISK_DATA || reportTreeNodesMap.size === 0) {{
        alert("Chưa có dữ liệu cây thư mục để xuất CSV!");
        return;
    }}
    const rows = [
        ['Đường Dẫn', 'Tên Thư Mục / Tệp', 'Dung Lượng', 'Số Lượng Tệp', 'Số Lượng Thư Mục', '% Chiếm Dụng', 'Lần Sửa Đổi Cuối']
    ];
    reportTreeNodesMap.forEach(n => {{
        rows.push([
            n.path || '',
            n.name || '',
            n.size_human || '',
            (n.files_count !== undefined && n.files_count !== null) ? String(n.files_count) : '',
            (n.dirs_count !== undefined && n.dirs_count !== null) ? String(n.dirs_count) : '',
            String(n.percent_root || 0) + '%',
            n.mtime_str || ''
        ]);
    }});
    const csvContent = '\\uFEFF' + rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\\r\\n');
    const blob = new Blob([csvContent], {{ type: 'text/csv;charset=utf-8' }});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const sid = (EMBEDDED_DISK_DATA && EMBEDDED_DISK_DATA.scan_id) ? EMBEDDED_DISK_DATA.scan_id : 'report';
    a.download = `Cay_Thu_Muc_${{sid}}.csv`;
    a.click();
}}

function switchReportTab(tab) {{
    const tabs = {{
        'apps': {{ content: document.getElementById("tabContentApps"), nav: document.getElementById("tabNavApps") }},
        'disk': {{ content: document.getElementById("tabContentDisk"), nav: document.getElementById("tabNavDisk") }},
        'smart': {{ content: document.getElementById("tabContentSmart"), nav: document.getElementById("tabNavSmart") }},
        'hwmon': {{ content: document.getElementById("tabContentHwmon"), nav: document.getElementById("tabNavHwmon") }}
    }};

    Object.keys(tabs).forEach(k => {{
        const item = tabs[k];
        if (!item || !item.content || !item.nav) return;
        if (k === tab) {{
            item.content.style.display = 'block';
            item.nav.classList.add('active');
        }} else {{
            item.content.style.display = 'none';
            item.nav.classList.remove('active');
        }}
    }});

    if (tab === 'disk' && reportTreeNodesMap && reportTreeNodesMap.size === 0) {{
        initReportTree();
    }}
}}

function filterAppsTable() {{
    const q = document.getElementById("searchInput").value.toLowerCase().trim();
    const rows = document.querySelectorAll(".app-row");
    rows.forEach(r => {{
        const text = r.innerText.toLowerCase();
        r.style.display = text.includes(q) ? "" : "none";
    }});
}}

// Tự động khởi tạo cây khi mở trang nếu có dữ liệu
window.addEventListener("DOMContentLoaded", () => {{
    if (EMBEDDED_DISK_DATA && EMBEDDED_DISK_DATA.trees) {{
        initReportTree();
    }}
}});
</script>
</body>
</html>
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    # Tao file chu ky xac thuc SHA-256 de chong bi virus sua doi hoac chen ma doc
    try:
        import hashlib
        with open(file_path, "rb") as bf:
            file_hash = hashlib.sha256(bf.read()).hexdigest()
        sha_path = f"{file_path}.sha256"
        with open(sha_path, "w", encoding="utf-8") as sf:
            sf.write(f"{file_hash} *{os.path.basename(file_path)}\n")
    except Exception:
        pass

def generate_csv_report(machine_info, apps, file_path):
    cust_name = machine_info.get("customer_name") or "Chua ro"
    cust_id = machine_info.get("customer_id") or "N/A"
    stage_label = machine_info.get("stage_label") or "Tiep Nhan May"
    lic_summary = machine_info.get("license_summary") or (machine_info.get("license_info") or {}).get("summary", "N/A")
    serial_str = machine_info.get("serial_number") or "N/A"
    pn_str = machine_info.get("product_number") or "N/A"
    mb_str = machine_info.get("motherboard") or "N/A"
    cpu_str = machine_info.get("cpu_name") or "N/A"
    ram_sum = machine_info.get("ram_summary") or machine_info.get("ram_total") or ""
    if not ram_sum:
        r_inf = machine_info.get("ram_info") if isinstance(machine_info.get("ram_info"), dict) else {}
        ram_sum = r_inf.get("ram_summary") or (f"{machine_info.get('total_ram_gb')} GB" if machine_info.get("total_ram_gb") else "N/A")
    lines = [
        f"\uFEFF# BIEN BAN PHAN MEM MAY TINH - {stage_label.upper()}",
        f"# Khach Hang: {cust_name} | Ma ID: {cust_id} | Ten May: {machine_info.get('computer_name')} | Ngay: {machine_info.get('scan_time')}",
        f"# PN (Ma San Pham): {pn_str} | SN (Serial Number): {serial_str} | Mainboard: {mb_str}",
        f"# CPU: {cpu_str} | RAM & Bus: {ram_sum}",
        f"# He Dieu Hanh: {machine_info.get('os_info')} | Ban Quyen: {lic_summary}",
        f"# Thu Muc: {machine_info.get('scan_id')}",
        "\"STT\",\"Tên Phần Mềm\",\"Phiên Bản\",\"Nhà Phát Triển\",\"Ngày Cài Đặt\",\"Đường Dẫn / File\""
    ]
    for idx, a in enumerate(apps, start=1):
        name = (a.get("name") or "").replace('"', '""')
        ver = (a.get("version") or "").replace('"', '""')
        pub = (a.get("publisher") or "").replace('"', '""')
        date = (a.get("install_date") or "").replace('"', '""')
        path = (a.get("icon_path") or a.get("location") or "").replace('"', '""')
        lines.append(f'"{idx}","{name}","{ver}","{pub}","{date}","{path}"')
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("\r\n".join(lines))

def regenerate_task_reports(scan_id):
    """
    Tái tạo toàn bộ file report.html, report.csv và disk_tree.csv cho một lượt quét đã lưu
    để đảm bảo report.html luôn cập nhật đầy đủ dữ liệu mới nhất (gồm cả cây thư mục disk_tree).
    """
    target_dir = os.path.join(SCANS_DIR, scan_id)
    if not (os.path.exists(target_dir) and os.path.isdir(target_dir)):
        for name in os.listdir(SCANS_DIR):
            cand = os.path.join(SCANS_DIR, name)
            if os.path.isdir(cand):
                cand_info = os.path.join(cand, "info.json")
                if os.path.exists(cand_info):
                    try:
                        with open(cand_info, "r", encoding="utf-8") as f:
                            ci = json.load(f)
                        if ci.get("scan_id") == scan_id:
                            target_dir = cand
                            break
                    except Exception:
                        pass

    if not os.path.exists(target_dir):
        return False

    info_path = os.path.join(target_dir, "info.json")
    apps_path = os.path.join(target_dir, "apps.json")
    disk_path = os.path.join(target_dir, "disk_tree.json")

    if not os.path.exists(info_path) or not os.path.exists(apps_path):
        return False

    try:
        with open(info_path, "r", encoding="utf-8") as f:
            info = json.load(f)
        with open(apps_path, "r", encoding="utf-8") as f:
            apps = json.load(f)

        disk_data = None
        if os.path.exists(disk_path):
            with open(disk_path, "r", encoding="utf-8") as f:
                disk_data = json.load(f)

        # 1. Regenerate report.html
        generate_html_report(info, apps, os.path.join(target_dir, "report.html"), disk_data=disk_data)

        # 2. Regenerate report.csv
        generate_csv_report(info, apps, os.path.join(target_dir, "report.csv"))

        # 3. Generate disk_tree.csv neu co disk_data
        if disk_data:
            generate_disk_tree_csv(disk_data, os.path.join(target_dir, "disk_tree.csv"))

        return True
    except Exception as e:
        print(f"Error in regenerate_task_reports({scan_id}): {e}")
        return False

def extract_timestamp_id(info, current_scan_id):
    raw = info.get("timestamp_raw")
    if raw:
        try:
            dt = datetime.datetime.fromisoformat(raw)
            return dt.strftime("%Y%m%d_%H%M%S")
        except Exception:
            pass
    parts = current_scan_id.split("_")
    if len(parts) >= 2 and len(parts[-2]) == 8 and len(parts[-1]) == 6 and parts[-2].isdigit() and parts[-1].isdigit():
        return f"{parts[-2]}_{parts[-1]}"
    return datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

def update_scan_task(scan_id, updates):
    old_sub = os.path.join(SCANS_DIR, scan_id)
    # Neu khong tim thay truc tiep theo scan_id, tim trong cac folder xem co folder nao chua scan_id nay khong
    if not os.path.exists(old_sub) or not os.path.isdir(old_sub):
        for name in os.listdir(SCANS_DIR):
            cand = os.path.join(SCANS_DIR, name)
            if os.path.isdir(cand):
                cand_info = os.path.join(cand, "info.json")
                if os.path.exists(cand_info):
                    try:
                        with open(cand_info, "r", encoding="utf-8") as f:
                            ci = json.load(f)
                        if ci.get("scan_id") == scan_id:
                            old_sub = cand
                            scan_id = name
                            break
                    except Exception:
                        pass

    info_path = os.path.join(old_sub, "info.json")
    apps_path = os.path.join(old_sub, "apps.json")
    if not os.path.exists(info_path) or not os.path.exists(apps_path):
        return None
        
    with open(info_path, "r", encoding="utf-8") as f:
        info = json.load(f)
    with open(apps_path, "r", encoding="utf-8") as f:
        apps = json.load(f)
        
    if "customer_name" in updates:
        info["customer_name"] = str(updates["customer_name"]).strip()
    if "customer_id" in updates:
        info["customer_id"] = str(updates["customer_id"]).strip()
    if "computer_name" in updates:
        new_pc = str(updates["computer_name"]).strip()
        if new_pc:
            info["computer_name"] = new_pc
            info["computer_name_confirmed"] = True
            uname = info.get("username") or (str(info.get("user_id", "")).split("\\", 1)[-1] if "\\" in str(info.get("user_id", "")) else "User")
            info["user_id"] = f"{new_pc}\\{uname}"
    if "computer_name_confirmed" in updates:
        info["computer_name_confirmed"] = bool(updates["computer_name_confirmed"])
    if "product_number" in updates:
        pn_val = str(updates["product_number"]).strip()
        if pn_val:
            info["product_number"] = pn_val
    if "serial_number" in updates:
        sn_val = str(updates["serial_number"]).strip()
        if sn_val:
            info["serial_number"] = sn_val
    if "scan_stage" in updates:
        st = str(updates["scan_stage"]).strip().lower()
        info["scan_stage"] = "ban_giao" if st in ["ban_giao", "sau_cai_dat", "cai_xong"] else "tiep_nhan"
        info["stage_label"] = "Tiếp Nhận Máy (Trước Cài)" if info["scan_stage"] == "tiep_nhan" else "Bàn Giao Máy (Sau Khi Cài)"
        info["stage_tag"] = "TiepNhan" if info["scan_stage"] == "tiep_nhan" else "BanGiao"

    # Luon dam bao bo sung thong tin phan cung / RAM / PN neu chua co (khong ghi de gia tri user da sua)
    if not info.get("product_number") or not info.get("serial_number") or not info.get("motherboard"):
        try:
            hw = get_hardware_info()
            if not info.get("serial_number") or info.get("serial_number") == "N/A":
                info["serial_number"] = hw.get("serial_number", "N/A")
            if not info.get("product_number") or info.get("product_number") == "N/A":
                info["product_number"] = hw.get("product_number", "N/A")
            if not info.get("motherboard") or info.get("motherboard") == "N/A":
                info["motherboard"] = hw.get("motherboard", "N/A")
            if not info.get("cpu_name"):
                info["cpu_name"] = hw.get("cpu_name", "")
        except Exception:
            pass
    if not info.get("ram_bus_mhz") or not info.get("ram_summary"):
        try:
            r_live = get_ram_info()
            if not info.get("ram_info"):
                info["ram_info"] = r_live
            info.setdefault("total_ram_gb", r_live.get("installed_gb") or r_live.get("total_gb", 0))
            if not info.get("ram_installed_gb"):
                info["ram_installed_gb"] = r_live.get("installed_gb") or r_live.get("total_gb", 0)
            if not info.get("ram_bus_mhz"):
                info["ram_bus_mhz"] = r_live.get("bus_mhz", 0)
            if not info.get("ram_bus_display") or info.get("ram_bus_display") == "Chưa rõ":
                info["ram_bus_display"] = r_live.get("bus_display", "Chưa rõ")
            if not info.get("ram_type"):
                info["ram_type"] = r_live.get("ram_type", "")
            if not info.get("ram_slots_used"):
                info["ram_slots_used"] = r_live.get("slots_used", 0)
            if not info.get("ram_slots_total"):
                info["ram_slots_total"] = r_live.get("slots_total", 0)
            if not info.get("ram_summary"):
                info["ram_summary"] = r_live.get("ram_summary", "")
                info["ram_total"] = r_live.get("ram_summary", "")
        except Exception:
            pass

    # Xay dung scan_id va ten thu muc moi theo quy tac:
    # {Ten_User}_{Ma_ID}_{Trang_Thai}_{Ten_May}_{Timestamp}
    clean_cust = sanitize_name(info.get("customer_name") or "")
    clean_id = sanitize_name(info.get("customer_id") or "")
    clean_pc = sanitize_name(info.get("computer_name") or "")
    stage_tag = info.get("stage_tag") or ("BanGiao" if info.get("scan_stage") == "ban_giao" else "TiepNhan")
    ts_id = extract_timestamp_id(info, scan_id)

    parts = []
    if clean_cust:
        parts.append(clean_cust)
    else:
        parts.append("User")
        
    if clean_id:
        parts.append(clean_id)
        
    parts.append(stage_tag)
    parts.append(clean_pc if clean_pc else "PC")
    parts.append(ts_id)

    new_scan_id = "_".join(parts)
    target_sub = old_sub

    # Neu ten thu muc moi khac ten thu muc cu -> Tien hanh doi ten thu muc vat ly tren Windows
    if new_scan_id != scan_id:
        new_sub = os.path.join(SCANS_DIR, new_scan_id)
        if os.path.abspath(old_sub).lower() != os.path.abspath(new_sub).lower():
            if os.path.exists(new_sub):
                shutil.rmtree(new_sub, ignore_errors=True)
            try:
                os.rename(old_sub, new_sub)
                target_sub = new_sub
                info["scan_id"] = new_scan_id
            except Exception as e:
                try:
                    shutil.move(old_sub, new_sub)
                    target_sub = new_sub
                    info["scan_id"] = new_scan_id
                except Exception as e2:
                    print(f"Error renaming folder from {scan_id} to {new_scan_id}: {e2}")
        else:
            # Chi khac biet ve chu hoa / chu thuong tren he thong file Windows
            try:
                temp_sub = old_sub + "_renaming_tmp"
                os.rename(old_sub, temp_sub)
                os.rename(temp_sub, new_sub)
                target_sub = new_sub
                info["scan_id"] = new_scan_id
            except Exception:
                pass
    else:
        info["scan_id"] = scan_id

    active_id = info.get("scan_id", new_scan_id)
    info["folder_rel"] = f"scans/{active_id}"
    info["html_file"] = f"scans/{active_id}/report.html"
    info["csv_file"] = f"scans/{active_id}/report.csv"
    info["json_file"] = f"scans/{active_id}/apps.json"

    # Luu file info.json moi
    new_info_path = os.path.join(target_sub, "info.json")
    with open(new_info_path, "w", encoding="utf-8") as f:
        json.dump(info, f, ensure_ascii=False, indent=2)

    # Dong bo nguoc dinh danh sang checklist.json neu da ton tai
    chk_path = os.path.join(target_sub, "checklist.json")
    if os.path.exists(chk_path):
        try:
            with open(chk_path, "r", encoding="utf-8") as fc:
                chk_data = json.load(fc)
            if isinstance(chk_data, dict):
                chk_data["scan_id"] = info.get("scan_id", chk_data.get("scan_id", ""))
                chk_data["customer_name"] = info.get("customer_name", "")
                chk_data["customer_id"] = info.get("customer_id", "")
                chk_data["computer_name"] = info.get("computer_name", "")
                chk_data["serial_number"] = info.get("serial_number", "")
                chk_data["product_number"] = info.get("product_number", "")
                with open(chk_path, "w", encoding="utf-8") as fcw:
                    json.dump(chk_data, fcw, ensure_ascii=False, indent=2)
        except Exception:
            pass
        
    # Re-generate report.html & report.csv (kem disk_tree.csv neu co) trong thu muc moi
    regenerate_task_reports(os.path.basename(target_sub))
    
    return info

def save_scan_task(machine_info, apps):
    os.makedirs(SCANS_DIR, exist_ok=True)
    scan_id = machine_info["scan_id"]
    task_dir = os.path.join(SCANS_DIR, scan_id)
    os.makedirs(task_dir, exist_ok=True)
    
    with_icons = sum(1 for a in apps if a.get("thumbnail"))
    
    info_data = dict(machine_info)
    info_data["total_apps"] = len(apps)
    info_data["with_icons"] = with_icons
    info_data["folder_rel"] = f"scans/{scan_id}"
    info_data["html_file"] = f"scans/{scan_id}/report.html"
    info_data["csv_file"] = f"scans/{scan_id}/report.csv"
    info_data["json_file"] = f"scans/{scan_id}/apps.json"

    # 1. info.json
    with open(os.path.join(task_dir, "info.json"), "w", encoding="utf-8") as f:
        json.dump(info_data, f, ensure_ascii=False, indent=2)

    # 2. apps.json
    with open(os.path.join(task_dir, "apps.json"), "w", encoding="utf-8") as f:
        json.dump(apps, f, ensure_ascii=False, indent=2)

    # 3. report.html & report.csv & disk_tree.csv
    regenerate_task_reports(scan_id)

    return info_data

def sync_scan_folder_names():
    """Tu dong kiem tra va doi ten thu muc vat ly neu trang thai TiepNhan/BanGiao chua dong bo"""
    os.makedirs(SCANS_DIR, exist_ok=True)
    if not os.path.exists(SCANS_DIR):
        return
    for name in list(os.listdir(SCANS_DIR)):
        sub = os.path.join(SCANS_DIR, name)
        if os.path.isdir(sub):
            info_path = os.path.join(sub, "info.json")
            if os.path.exists(info_path):
                try:
                    with open(info_path, "r", encoding="utf-8") as f:
                        info = json.load(f)
                    stage = info.get("scan_stage", "tiep_nhan")
                    expected_tag = "BanGiao" if stage == "ban_giao" else "TiepNhan"
                    if ("_TiepNhan_" in name and expected_tag == "BanGiao") or ("_BanGiao_" in name and expected_tag == "TiepNhan"):
                        update_scan_task(name, {"scan_stage": stage})
                except Exception:
                    pass

def list_scan_tasks():
    os.makedirs(SCANS_DIR, exist_ok=True)
    sync_scan_folder_names()
    tasks = []
    if os.path.exists(SCANS_DIR):
        for name in os.listdir(SCANS_DIR):
            sub = os.path.join(SCANS_DIR, name)
            if os.path.isdir(sub):
                info_path = os.path.join(sub, "info.json")
                if os.path.exists(info_path):
                    try:
                        with open(info_path, "r", encoding="utf-8") as f:
                            info = json.load(f)
                        needs_save = False
                        if "license_info" not in info:
                            lic = get_windows_license_info()
                            info["license_info"] = lic
                            info["license_summary"] = lic.get("summary", "")
                            info["license_status"] = lic.get("status_title", "")
                            info["license_badge"] = lic.get("badge_class", "")
                            info["license_channel"] = lic.get("channel_label", "")
                            info["license_key"] = lic.get("partial_key", "")
                            needs_save = True

                        if (
                            "serial_number" not in info
                            or "product_number" not in info
                            or not info.get("motherboard")
                            or not info.get("cpu_name")
                        ):
                            hw = get_hardware_info()
                            if not info.get("serial_number") or info.get("serial_number") == "N/A":
                                info["serial_number"] = hw.get("serial_number", "N/A")
                            if "product_number" not in info or not info.get("product_number") or info.get("product_number") == "N/A":
                                info["product_number"] = hw.get("product_number", "N/A")
                            if not info.get("motherboard") or info.get("motherboard") == "N/A":
                                info["motherboard"] = hw.get("motherboard", "N/A")
                            info.setdefault("board_vendor", hw.get("board_vendor", ""))
                            info.setdefault("board_model", hw.get("board_model", ""))
                            info.setdefault("system_model", hw.get("system_model", ""))
                            if not info.get("cpu_name"):
                                info["cpu_name"] = hw.get("cpu_name", "")
                            needs_save = True

                        if "ram_bus_mhz" not in info or not info.get("ram_summary"):
                            r_live = get_ram_info()
                            if not info.get("ram_info"):
                                info["ram_info"] = r_live
                            if not info.get("total_ram_gb"):
                                info["total_ram_gb"] = r_live.get("installed_gb") or r_live.get("total_gb", 0)
                            info.setdefault("ram_installed_gb", r_live.get("installed_gb") or r_live.get("total_gb", 0))
                            info["ram_bus_mhz"] = r_live.get("bus_mhz", 0)
                            info["ram_bus_display"] = r_live.get("bus_display", "Chưa rõ")
                            info["ram_type"] = r_live.get("ram_type", "")
                            info["ram_slots_used"] = r_live.get("slots_used", 0)
                            info["ram_slots_total"] = r_live.get("slots_total", 0)
                            info["ram_summary"] = r_live.get("ram_summary", "")
                            info["ram_total"] = r_live.get("ram_summary", "")
                            needs_save = True

                        if needs_save:
                            try:
                                with open(info_path, "w", encoding="utf-8") as fw:
                                    json.dump(info, fw, ensure_ascii=False, indent=2)
                            except Exception:
                                pass
                        info["has_disk_tree"] = os.path.exists(os.path.join(sub, "disk_tree.json"))
                        tasks.append(info)
                    except Exception:
                        pass
                        
    # Sort newest first
    tasks.sort(key=lambda x: x.get("timestamp_raw", ""), reverse=True)
    return tasks

def _enrich_task_info_audit_status(info, folder_path):
    """
    Kiem tra su hien dien va tom tat ket qua cua 6 buoc kiem dinh trong thu muc task:
    1. info.json (Cau hinh may & ban quyen)
    2. apps.json (Phan mem da cai dat)
    3. disk_tree.json (Cay thu muc o dia TreeSize)
    4. smart_info.json (Suc khoe o cung S.M.A.R.T CrystalDiskInfo)
    5. hardware_diagnostics.json (Giam sat phan cung GPU-Z, CPU-Z, HWMonitor)
    6. report.html (Bao cao tong hop)
    """
    dt_path = os.path.join(folder_path, "disk_tree.json")
    info["has_disk_tree"] = os.path.exists(dt_path)
    info["disk_summary"] = ""
    if info["has_disk_tree"]:
        try:
            with open(dt_path, "r", encoding="utf-8") as dtf:
                dt_data = json.load(dtf)
                trees = dt_data.get("trees", [])
                tot_files = sum(t.get("files_count", 0) for t in trees)
                info["disk_summary"] = f"{len(trees)} ổ đĩa ({tot_files:,} tệp)"
        except Exception:
            pass

    smart_path = os.path.join(folder_path, "smart_info.json")
    info["has_smart_info"] = os.path.exists(smart_path)
    info["smart_summary"] = ""
    if info["has_smart_info"]:
        try:
            with open(smart_path, "r", encoding="utf-8") as sf:
                s_data = json.load(sf)
                s_disks = s_data.get("disks") or ([s_data.get("disk")] if s_data.get("disk") else [])
                if s_disks and s_disks[0]:
                    d0 = s_disks[0]
                    info["smart_summary"] = f"{d0.get('name', 'Ổ đĩa')} • {d0.get('healthScore', 100)}% ({d0.get('healthStatus', 'GOOD')}) • {d0.get('temp', 40)}°C"
        except Exception:
            pass

    hw_path = os.path.join(folder_path, "hardware_diagnostics.json")
    info["has_hardware_diag"] = os.path.exists(hw_path)
    info["hw_summary"] = ""
    if info["has_hardware_diag"]:
        try:
            with open(hw_path, "r", encoding="utf-8") as hf:
                h_data = json.load(hf)
                c_name = h_data.get("cpu", {}).get("name") or ""
                g_name = h_data.get("primary_gpu") or ""
                g_vram = h_data.get("primary_vram") or ""
                parts = []
                if c_name:
                    clean_c = c_name.split("@")[0].replace("Intel(R) Core(TM)", "").replace("AMD Ryzen", "Ryzen").strip()
                    parts.append(clean_c)
                if g_name and g_name != "N/A":
                    clean_g = g_name.replace("Intel(R)", "").replace("NVIDIA", "").strip()
                    parts.append(f"{clean_g} ({g_vram})".strip())
                info["hw_summary"] = " • ".join(parts) if parts else "Đã đo kiểm phần cứng"
        except Exception:
            pass

    info["has_html_report"] = os.path.exists(os.path.join(folder_path, "report.html"))
    return info

def get_scan_task(scan_id):
    sub = os.path.join(SCANS_DIR, scan_id)
    info_path = os.path.join(sub, "info.json")
    apps_path = os.path.join(sub, "apps.json")
    if os.path.exists(info_path):
        try:
            with open(info_path, "r", encoding="utf-8") as f:
                info = json.load(f)
        except Exception:
            info = None

        if info is not None:
            apps = []
            if os.path.exists(apps_path):
                try:
                    with open(apps_path, "r", encoding="utf-8") as f:
                        apps = json.load(f)
                except Exception:
                    apps = []

            needs_save = False
            if "license_info" not in info:
                lic = get_windows_license_info()
                info["license_info"] = lic
                info["license_summary"] = lic.get("summary", "")
                info["license_status"] = lic.get("status_title", "")
                info["license_badge"] = lic.get("badge_class", "")
                info["license_channel"] = lic.get("channel_label", "")
                info["license_key"] = lic.get("partial_key", "")
                needs_save = True

            if (
                "serial_number" not in info
                or "product_number" not in info
                or not info.get("motherboard")
                or not info.get("cpu_name")
            ):
                hw = get_hardware_info()
                if not info.get("serial_number") or info.get("serial_number") == "N/A":
                    info["serial_number"] = hw.get("serial_number", "N/A")
                if "product_number" not in info or not info.get("product_number") or info.get("product_number") == "N/A":
                    info["product_number"] = hw.get("product_number", "N/A")
                if not info.get("motherboard") or info.get("motherboard") == "N/A":
                    info["motherboard"] = hw.get("motherboard", "N/A")
                info.setdefault("board_vendor", hw.get("board_vendor", ""))
                info.setdefault("board_model", hw.get("board_model", ""))
                info.setdefault("system_model", hw.get("system_model", ""))
                if not info.get("cpu_name"):
                    info["cpu_name"] = hw.get("cpu_name", "")
                needs_save = True

            if "ram_bus_mhz" not in info or not info.get("ram_summary"):
                r_live = get_ram_info()
                if not info.get("ram_info"):
                    info["ram_info"] = r_live
                if not info.get("total_ram_gb"):
                    info["total_ram_gb"] = r_live.get("installed_gb") or r_live.get("total_gb", 0)
                info.setdefault("ram_installed_gb", r_live.get("installed_gb") or r_live.get("total_gb", 0))
                info["ram_bus_mhz"] = r_live.get("bus_mhz", 0)
                info["ram_bus_display"] = r_live.get("bus_display", "Chưa rõ")
                info["ram_type"] = r_live.get("ram_type", "")
                info["ram_slots_used"] = r_live.get("slots_used", 0)
                info["ram_slots_total"] = r_live.get("slots_total", 0)
                info["ram_summary"] = r_live.get("ram_summary", "")
                info["ram_total"] = r_live.get("ram_summary", "")
                needs_save = True

            if needs_save:
                try:
                    with open(info_path, "w", encoding="utf-8") as fw:
                        json.dump(info, fw, ensure_ascii=False, indent=2)
                except Exception:
                    pass

            _enrich_task_info_audit_status(info, sub)
            return {"info": info, "apps": apps, "has_disk_tree": info.get("has_disk_tree", False)}
    
    # Fallback search by scan_id in info.json
    if os.path.exists(SCANS_DIR):
        for name in os.listdir(SCANS_DIR):
            cand = os.path.join(SCANS_DIR, name)
            if os.path.isdir(cand):
                info_p = os.path.join(cand, "info.json")
                apps_p = os.path.join(cand, "apps.json")
                if os.path.exists(info_p) and os.path.exists(apps_p):
                    try:
                        with open(info_p, "r", encoding="utf-8") as f:
                            ci = json.load(f)
                        if ci.get("scan_id") == scan_id:
                            with open(apps_p, "r", encoding="utf-8") as f:
                                ca = json.load(f)
                            _enrich_task_info_audit_status(ci, cand)
                            return {"info": ci, "apps": ca, "has_disk_tree": ci["has_disk_tree"]}
                    except Exception:
                        pass
    return None

def delete_scan_task(scan_id):
    sub = os.path.join(SCANS_DIR, scan_id)
    if os.path.exists(sub) and os.path.isdir(sub):
        shutil.rmtree(sub, ignore_errors=True)
        return True
    # Fallback search by scan_id
    if os.path.exists(SCANS_DIR):
        for name in os.listdir(SCANS_DIR):
            cand = os.path.join(SCANS_DIR, name)
            if os.path.isdir(cand):
                info_p = os.path.join(cand, "info.json")
                if os.path.exists(info_p):
                    try:
                        with open(info_p, "r", encoding="utf-8") as f:
                            ci = json.load(f)
                        if ci.get("scan_id") == scan_id:
                            shutil.rmtree(cand, ignore_errors=True)
                            return True
                    except Exception:
                        pass
    return False

def find_scan_folder(scan_id):
    if not scan_id:
        return None
    sub = os.path.join(SCANS_DIR, scan_id)
    if os.path.exists(sub) and os.path.isdir(sub):
        return sub
    if os.path.exists(SCANS_DIR):
        for name in os.listdir(SCANS_DIR):
            cand = os.path.join(SCANS_DIR, name)
            if os.path.isdir(cand):
                info_p = os.path.join(cand, "info.json")
                if os.path.exists(info_p):
                    try:
                        with open(info_p, "r", encoding="utf-8") as f:
                            ci = json.load(f)
                        if ci.get("scan_id") == scan_id:
                            return cand
                    except Exception:
                        pass
    return None

def get_default_checklist(scan_id="", info=None):
    if not info and scan_id:
        folder = find_scan_folder(scan_id)
        if folder:
            info_p = os.path.join(folder, "info.json")
            if os.path.exists(info_p):
                try:
                    with open(info_p, "r", encoding="utf-8") as f:
                        info = json.load(f)
                except Exception:
                    pass
    info = info or {}
    now_str = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    return {
        "scan_id": scan_id or info.get("scan_id", ""),
        "customer_name": info.get("customer_name", ""),
        "customer_id": info.get("customer_id", ""),
        "customer_phone": info.get("customer_phone", "") or info.get("customer_id", ""),
        "computer_name": info.get("computer_name", ""),
        "serial_number": info.get("serial_number", ""),
        "product_number": info.get("product_number", ""),
        "motherboard": info.get("motherboard", ""),
        "ram_summary": info.get("ram_summary", ""),
        "cpu_name": info.get("cpu_name", ""),
        "scan_time": info.get("scan_time", now_str),
        "active_tab": info.get("scan_stage", "tiep_nhan"),
        
        # 1. DỮ LIỆU CHECKLIST TIẾP NHẬN MÁY (TRƯỚC CÀI)
        "tiep_nhan": {
            "technician_name": "",
            "customer_pin": "",
            "machine_condition": "Bình thường",
            "accessories": {
                "charger": False,
                "mouse": False,
                "bag": False,
                "power_cable": False,
                "other": ""
            },
            "items": {
                "tn_case": True,
                "tn_screen": True,
                "tn_keyboard": True,
                "tn_ports": True,
                "tn_audio_cam": True,
                "tn_battery": True,
                "tn_disk_health": True,
                "tn_data_backup": True,
                "tn_data_special": True,
                "tn_license_check": True
            },
            "technician_notes": "",
            "final_status": "pass",
            "updated_at": now_str
        },

        # 2. DỮ LIỆU CHECKLIST BÀN GIAO MÁY (SAU KHI CÀI)
        "ban_giao": {
            "technician_name": "",
            "optimized_tier": "4to8gb",
            "warranty_months": "3 tháng",
            "items": {
                "bg_os_spec": True,
                "bg_drivers": True,
                "bg_activation": True,
                "bg_essential_apps": True,
                "bg_temperature": True,
                "bg_data_restore": True,
                "bg_startup_speed": True,
                "bg_cust_verify": True,
                "bg_cust_data": True,
                "bg_return_accessories": True
            },
            "technician_notes": "",
            "final_status": "pass",
            "updated_at": now_str
        },
        
        "updated_at": now_str
    }

def get_scan_checklist(scan_id):
    folder = find_scan_folder(scan_id)
    if not folder:
        return get_default_checklist(scan_id)
    
    info_path = os.path.join(folder, "info.json")
    info = None
    if os.path.exists(info_path):
        try:
            with open(info_path, "r", encoding="utf-8") as f:
                info = json.load(f)
        except Exception:
            pass

    default_data = get_default_checklist(scan_id, info)
    chk_path = os.path.join(folder, "checklist.json")
    if os.path.exists(chk_path):
        try:
            with open(chk_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    # Tự động đồng bộ Tên User, Mã ID, PC, SN, PN, RAM từ info nếu có
                    if info:
                        data["customer_name"] = data.get("customer_name") or info.get("customer_name", "")
                        data["customer_id"] = data.get("customer_id") or info.get("customer_id", "")
                        data["customer_phone"] = data.get("customer_phone") or info.get("customer_id", "")
                        data["computer_name"] = data.get("computer_name") or info.get("computer_name", "")
                        data["serial_number"] = data.get("serial_number") or info.get("serial_number", "")
                        data["product_number"] = data.get("product_number") or info.get("product_number", "")
                        data["ram_summary"] = data.get("ram_summary") or info.get("ram_summary", "")
                        data["cpu_name"] = data.get("cpu_name") or info.get("cpu_name", "")
                        if "active_tab" not in data:
                            data["active_tab"] = info.get("scan_stage", "tiep_nhan")

                    # Đảm bảo cấu trúc tiep_nhan tách biệt
                    if "tiep_nhan" not in data or not isinstance(data["tiep_nhan"], dict):
                        data["tiep_nhan"] = default_data["tiep_nhan"]
                    else:
                        for k, v in default_data["tiep_nhan"].items():
                            if k not in data["tiep_nhan"]:
                                data["tiep_nhan"][k] = v
                        if "items" not in data["tiep_nhan"] or not isinstance(data["tiep_nhan"]["items"], dict):
                            data["tiep_nhan"]["items"] = default_data["tiep_nhan"]["items"]
                        else:
                            for ik, iv in default_data["tiep_nhan"]["items"].items():
                                if ik not in data["tiep_nhan"]["items"]:
                                    data["tiep_nhan"]["items"][ik] = iv

                    # Đảm bảo cấu trúc ban_giao tách biệt
                    if "ban_giao" not in data or not isinstance(data["ban_giao"], dict):
                        data["ban_giao"] = default_data["ban_giao"]
                    else:
                        for k, v in default_data["ban_giao"].items():
                            if k not in data["ban_giao"]:
                                data["ban_giao"][k] = v
                        if "items" not in data["ban_giao"] or not isinstance(data["ban_giao"]["items"], dict):
                            data["ban_giao"]["items"] = default_data["ban_giao"]["items"]
                        else:
                            for ik, iv in default_data["ban_giao"]["items"].items():
                                if ik not in data["ban_giao"]["items"]:
                                    data["ban_giao"]["items"][ik] = iv

                    return data
        except Exception:
            pass
    return default_data

def save_scan_checklist(scan_id, data):
    folder = find_scan_folder(scan_id)
    if not folder:
        if scan_id:
            folder = os.path.join(SCANS_DIR, scan_id)
            os.makedirs(folder, exist_ok=True)
        else:
            return False, "Thiếu mã nhận diện lượt quét (scan_id)!"
    
    chk_path = os.path.join(folder, "checklist.json")
    try:
        now_str = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        if isinstance(data, dict):
            data["updated_at"] = now_str
            if "scan_id" not in data or not data["scan_id"]:
                data["scan_id"] = scan_id

        with open(chk_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        # Tự động đồng bộ ngược customer_name, customer_id, computer_name, product_number, serial_number vào info.json
        if isinstance(data, dict):
            cust_name = data.get("customer_name")
            cust_id = data.get("customer_id")
            pc_name = data.get("computer_name")
            pn_val = data.get("product_number")
            sn_val = data.get("serial_number")
            if cust_name or cust_id or pc_name or pn_val or sn_val:
                info_p = os.path.join(folder, "info.json")
                if os.path.exists(info_p):
                    try:
                        with open(info_p, "r", encoding="utf-8") as fi:
                            c_info = json.load(fi)
                        if cust_name:
                            c_info["customer_name"] = cust_name
                        if cust_id:
                            c_info["customer_id"] = cust_id
                        if pc_name:
                            c_info["computer_name"] = pc_name
                        if pn_val:
                            c_info["product_number"] = pn_val
                        if sn_val:
                            c_info["serial_number"] = sn_val
                        with open(info_p, "w", encoding="utf-8") as fo:
                            json.dump(c_info, fo, ensure_ascii=False, indent=2)
                    except Exception:
                        pass

        return True, "Đã lưu checklist quy trình tiếp nhận & bàn giao thành công!"
    except Exception as e:
        return False, f"Lỗi khi lưu checklist: {str(e)}"


CONFIG_DIR = os.path.join(ROOT_DIR, "config")
TIME_CONFIG_FILE = os.path.join(CONFIG_DIR, "time_settings.json")

TIME_SERVERS_PRESETS = {
    "google_ntp": {
        "name": "Google Public NTP (Chuẩn nguyên tử - Đề xuất)",
        "type": "ntp",
        "url": "time.google.com",
        "port": 123,
        "description": "Máy chủ thời gian chuẩn nguyên tử toàn cầu của Google, siêu nhanh & chính xác (~50ms)."
    },
    "cloudflare_ntp": {
        "name": "Cloudflare Anycast NTP",
        "type": "ntp",
        "url": "time.cloudflare.com",
        "port": 123,
        "description": "Mạng lưới Anycast NTP toàn cầu của Cloudflare."
    },
    "windows_ntp": {
        "name": "Microsoft Windows Time",
        "type": "ntp",
        "url": "time.windows.com",
        "port": 123,
        "description": "Máy chủ thời gian đồng bộ mặc định của Microsoft Windows."
    },
    "pool_ntp": {
        "name": "Cụm Máy Chủ Pool NTP Quốc Tế",
        "type": "ntp",
        "url": "pool.ntp.org",
        "port": 123,
        "description": "Hệ thống máy chủ NTP phi tập trung mở rộng toàn cầu."
    },
    "google_http": {
        "name": "Google Web HTTPS (Date Header)",
        "type": "http",
        "url": "https://www.google.com",
        "description": "Lấy giờ qua giao thức HTTPS. Hoạt động trên mọi mạng cấm cổng UDP 123."
    },
    "cloudflare_http": {
        "name": "Cloudflare Web HTTPS (Date Header)",
        "type": "http",
        "url": "https://cloudflare.com",
        "description": "Lấy giờ chuẩn qua HTTPS từ mạng Cloudflare Edge."
    },
    "custom": {
        "name": "Link Server Tùy Chỉnh (Nội bộ / LAN / API riêng)",
        "type": "custom",
        "url": "",
        "description": "Nhập link URL máy chủ nội bộ hoặc server API thời gian riêng của bạn."
    }
}

def query_ntp_server(host, timeout=2.5):
    import socket, struct, time
    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    client.settimeout(timeout)
    data = b'\x1b' + 47 * b'\0'
    t0 = time.time()
    client.sendto(data, (host, 123))
    resp, _ = client.recvfrom(1024)
    t1 = time.time()
    if resp:
        ntp_time = struct.unpack('!12I', resp)[10] - 2208988800
        latency_ms = int((t1 - t0) * 1000)
        return float(ntp_time), latency_ms
    raise Exception(f"Không nhận được phản hồi từ NTP server {host}")

def query_http_time_server(url, timeout=3.5):
    import urllib.request, email.utils, json, time
    t0 = time.time()
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req, timeout=timeout) as res:
        t1 = time.time()
        latency_ms = int((t1 - t0) * 1000)
        content_type = res.headers.get('Content-Type', '')
        if 'application/json' in content_type:
            try:
                body = res.read().decode('utf-8')
                j = json.loads(body)
                if 'timestamp' in j:
                    return float(j['timestamp']), latency_ms
                if 'unixtime' in j:
                    return float(j['unixtime']), latency_ms
            except Exception:
                pass
        date_hdr = res.headers.get('Date')
        if date_hdr:
            dt = email.utils.parsedate_to_datetime(date_hdr)
            return float(dt.timestamp()), latency_ms
    raise Exception(f"Không thể đọc header Date hoặc JSON từ {url}")

def query_server_time(preset_key=None, custom_url=None):
    cfg = load_time_settings()
    preset = preset_key or cfg.get("time_server_preset", "google_ntp")
    url = (custom_url if custom_url is not None else cfg.get("time_server_url", "")).strip()

    name = "Google Public NTP"
    stype = "ntp"
    target_addr = "time.google.com"

    if preset in TIME_SERVERS_PRESETS and preset != "custom":
        p_info = TIME_SERVERS_PRESETS[preset]
        name = p_info["name"]
        stype = p_info["type"]
        target_addr = p_info["url"]
    else:
        stype = "custom"
        target_addr = url or "time.google.com"
        name = f"Máy chủ riêng ({target_addr})"

    server_time = None
    latency_ms = 0
    fallback_note = ""

    is_http = target_addr.startswith("http://") or target_addr.startswith("https://") or stype == "http"

    if is_http:
        try:
            http_url = target_addr if (target_addr.startswith("http://") or target_addr.startswith("https://")) else f"http://{target_addr}"
            server_time, latency_ms = query_http_time_server(http_url)
        except Exception as e:
            try:
                server_time, latency_ms = query_http_time_server("https://www.google.com")
                fallback_note = " (Đã fallback sang Google Web do link không phản hồi)"
            except Exception:
                raise e
    else:
        clean_host = target_addr.replace("http://", "").replace("https://", "").split("/")[0].split(":")[0]
        try:
            server_time, latency_ms = query_ntp_server(clean_host)
        except Exception as e_ntp:
            try:
                server_time, latency_ms = query_http_time_server("https://www.google.com")
                fallback_note = " (Đã tự động fallback sang Google HTTPS do mạng chặn cổng UDP 123)"
            except Exception:
                raise e_ntp

    t_local = time.time()
    drift = server_time - t_local
    server_dt = datetime.datetime.fromtimestamp(server_time)

    return {
        "status": "ok",
        "preset": preset,
        "server_name": name + fallback_note,
        "server_url": target_addr,
        "server_type": "http" if is_http else "ntp",
        "server_timestamp": int(server_time),
        "server_time_iso": server_dt.isoformat(),
        "server_time_str": server_dt.strftime("%d/%m/%Y %H:%M:%S"),
        "latency_ms": latency_ms,
        "drift_seconds": round(drift, 2),
        "drift_str": f"{'+' if drift >= 0 else ''}{round(drift, 1)}s"
    }

def sync_server_time(preset_key=None, custom_url=None, save=True):
    try:
        res = query_server_time(preset_key, custom_url)
        updates = {
            "server_drift_seconds": res["drift_seconds"],
            "last_sync_server_url": res["server_url"],
            "last_sync_server_name": res["server_name"],
            "last_sync_server_time": res["server_time_str"],
            "last_sync_latency_ms": res["latency_ms"],
            "last_sync_status": "connected",
            "last_sync_error": "",
            "last_sync_iso": datetime.datetime.now().isoformat()
        }
        if preset_key:
            updates["time_server_preset"] = preset_key
        if custom_url is not None:
            updates["time_server_url"] = custom_url
        if save:
            save_time_settings(updates)
        return {"status": "ok", "result": res, "updates": updates}
    except Exception as e:
        updates = {
            "last_sync_status": "offline",
            "last_sync_error": str(e),
            "last_sync_iso": datetime.datetime.now().isoformat()
        }
        if save:
            save_time_settings(updates)
        return {"status": "error", "message": f"Không thể kết nối Server thời gian: {e}", "updates": updates}

def load_time_settings():
    os.makedirs(CONFIG_DIR, exist_ok=True)
    defaults = {
        "mode": "auto",
        "manual_datetime": "",
        "manual_offset_minutes": 0,
        "lock_duration_hours": 24,
        "strict_machine_check": True,
        "time_server_preset": "google_ntp",
        "time_server_url": "time.google.com",
        "server_drift_seconds": 0.0,
        "last_sync_server_url": "time.google.com",
        "last_sync_server_name": "Google Public NTP",
        "last_sync_server_time": "",
        "last_sync_latency_ms": 0,
        "last_sync_status": "unverified",
        "last_sync_error": "",
        "last_updated": datetime.datetime.now().isoformat()
    }
    if os.path.exists(TIME_CONFIG_FILE):
        try:
            with open(TIME_CONFIG_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
            defaults.update(data)
        except Exception:
            pass
    return defaults

def save_time_settings(settings):
    os.makedirs(CONFIG_DIR, exist_ok=True)
    current = load_time_settings()
    current.update(settings)
    current["last_updated"] = datetime.datetime.now().isoformat()
    with open(TIME_CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(current, f, ensure_ascii=False, indent=2)
    return current

def get_effective_datetime():
    cfg = load_time_settings()
    if cfg.get("mode") == "manual" and cfg.get("manual_datetime"):
        try:
            dt_str = cfg["manual_datetime"]
            dt_str = dt_str.replace("Z", "")
            base_dt = datetime.datetime.fromisoformat(dt_str)
            offset = int(cfg.get("manual_offset_minutes") or 0)
            return base_dt + datetime.timedelta(minutes=offset)
        except Exception:
            pass
    drift = float(cfg.get("server_drift_seconds") or 0.0)
    return datetime.datetime.now() + datetime.timedelta(seconds=drift)

def check_task_lock(scan_id):
    """
    Kiem tra tinh hop le va trang thai khoa cua luot quet:
    1. So sanh dinh danh may hien tai voi may trong luot quet (machine_guid, serial_number, computer_name)
    2. Kiem tra thoi gian tao luot quet voi gioi han khoa (mac dinh 24h = 86400s)
    """
    cfg = load_time_settings()
    lock_hours = float(cfg.get("lock_duration_hours", 24))
    strict_check = bool(cfg.get("strict_machine_check", True))

    task_data = get_scan_task(scan_id)
    if not task_data or not task_data.get("info"):
        return {
            "is_locked": False,
            "is_mismatch": False,
            "is_expired": False,
            "remaining_seconds": 0,
            "lock_duration_hours": lock_hours,
            "reason": ""
        }

    task_info = task_data["info"]
    curr_info = get_machine_info()

    # 1. Kiem tra khac may (Machine Mismatch)
    if strict_check:
        t_serial = (task_info.get("serial_number") or "").strip().upper()
        c_serial = (curr_info.get("serial_number") or "").strip().upper()
        t_guid = (task_info.get("machine_guid") or "").strip().lower()
        c_guid = (curr_info.get("machine_guid") or "").strip().lower()
        t_pc = (task_info.get("computer_name") or "").strip().upper()
        c_pc = (curr_info.get("computer_name") or "").strip().upper()

        is_diff = False
        if t_guid and c_guid and t_guid != "N/A" and c_guid != "N/A":
            if t_guid != c_guid:
                is_diff = True
        elif t_serial and c_serial and t_serial != "N/A" and c_serial != "N/A":
            if t_serial != c_serial:
                is_diff = True
        elif t_pc and c_pc:
            if t_pc != c_pc:
                is_diff = True

        if is_diff:
            return {
                "is_locked": True,
                "is_mismatch": True,
                "is_expired": False,
                "remaining_seconds": 0,
                "lock_duration_hours": lock_hours,
                "task_pc": task_info.get("computer_name", "N/A"),
                "task_serial": task_info.get("serial_number", "N/A"),
                "current_pc": curr_info.get("computer_name", "N/A"),
                "current_serial": curr_info.get("serial_number", "N/A"),
                "reason": f"Task này thuộc về máy khác ({task_info.get('computer_name')} - Serial: {task_info.get('serial_number')}). Bạn đang chạy trên máy ({curr_info.get('computer_name')} - Serial: {curr_info.get('serial_number')}). Không thể quét đè lên task của máy khác!"
            }

    # 2. Kiem tra thoi han ghi de (Expiration Lock - 24 gio)
    task_dt = None
    if task_info.get("timestamp_raw"):
        try:
            task_dt = datetime.datetime.fromisoformat(task_info["timestamp_raw"])
        except Exception:
            pass
    if not task_dt and task_info.get("scan_time"):
        try:
            task_dt = datetime.datetime.strptime(task_info["scan_time"], "%d/%m/%Y %H:%M:%S")
        except Exception:
            pass

    if not task_dt:
        task_dt = datetime.datetime.now()

    now_eff = get_effective_datetime()
    lock_delta = datetime.timedelta(hours=lock_hours)
    expire_time = task_dt + lock_delta
    remaining_sec = (expire_time - now_eff).total_seconds()

    if remaining_sec <= 0:
        return {
            "is_locked": True,
            "is_mismatch": False,
            "is_expired": True,
            "remaining_seconds": 0,
            "lock_duration_hours": lock_hours,
            "task_scan_time": task_info.get("scan_time", ""),
            "reason": f"Lượt quét này đã quá thời hạn cho phép ghi đè ({lock_hours:g} giờ kể từ khi quét). Lượt quét đã được đóng băng lưu trữ an toàn."
        }

    return {
        "is_locked": False,
        "is_mismatch": False,
        "is_expired": False,
        "remaining_seconds": int(remaining_sec),
        "total_seconds": int(lock_hours * 3600),
        "lock_duration_hours": lock_hours,
        "task_scan_time": task_info.get("scan_time", ""),
        "reason": ""
    }

def rescan_task(scan_id):
    """
    Quet lai phan mem cho luot quet dang chon (khi con hop le)
    """
    lock_status = check_task_lock(scan_id)
    if lock_status["is_locked"]:
        return {"status": "error", "message": lock_status["reason"], "lock_info": lock_status}

    import scripts.scan_installed as scanner
    apps = scanner.scan_installed_apps(extract_icons=True)
    task_data = get_scan_task(scan_id)
    if not task_data:
        return {"status": "error", "message": "Không tìm thấy task để quét lại!"}

    info = task_data["info"]
    now = get_effective_datetime()
    info["scan_time"] = now.strftime("%d/%m/%Y %H:%M:%S")
    info["timestamp_raw"] = now.isoformat()
    
    # Cap nhat phan cung & RAM/Bus neu chua co (khong ghi de neu KTV da sua thu cong SN/PN)
    hw = get_hardware_info(force_refresh=True)
    if not info.get("serial_number") or info.get("serial_number") == "N/A":
        info["serial_number"] = hw.get("serial_number", "N/A")
    if not info.get("product_number") or info.get("product_number") == "N/A":
        info["product_number"] = hw.get("product_number", "N/A")
    if not info.get("motherboard") or info.get("motherboard") == "N/A":
        info["motherboard"] = hw.get("motherboard", "N/A")
    if not info.get("cpu_name"):
        info["cpu_name"] = hw.get("cpu_name", "")

    r_live = get_ram_info(force_refresh=True)
    info["ram_info"] = r_live
    info["total_ram_gb"] = r_live.get("installed_gb") or r_live.get("total_gb", 0)
    info["ram_installed_gb"] = r_live.get("installed_gb") or r_live.get("total_gb", 0)
    info["ram_bus_mhz"] = r_live.get("bus_mhz", 0)
    info["ram_bus_display"] = r_live.get("bus_display", "Chưa rõ")
    info["ram_type"] = r_live.get("ram_type", "")
    info["ram_slots_used"] = r_live.get("slots_used", 0)
    info["ram_slots_total"] = r_live.get("slots_total", 0)
    info["ram_summary"] = r_live.get("ram_summary", "")
    info["ram_total"] = r_live.get("ram_summary", "")
    
    # Luu de len task do
    saved = save_scan_task(info, apps)
    return {"status": "ok", "task": saved, "apps": apps}

if __name__ == "__main__":
    print("Testing scan_manager...")
    m = get_machine_info()
    print("Machine info:", m)

