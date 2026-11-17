# -*- coding: utf-8 -*-
"""
Hardware Monitor & Diagnostic Tools Service
Manages portable and system hardware diagnostic tools:
- CPUID HWMonitor (Real-time CPU, GPU, SSD/HDD Temperature, Fan, Voltage)
- CPUID CPU-Z (Processor, Mainboard, Memory, SPD)
- CrystalDiskInfo (Drive Health, S.M.A.R.T attributes, Power-on hours)
- Task Manager Performance tab
- Windows Resource Monitor (resmon)
- System Information (msinfo32)
"""

import os
import subprocess
import json
import datetime

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def find_crystaldiskinfo_exe():
    candidates = [
        os.path.join(ROOT_DIR, "software", "crystaldiskinfo", "DiskInfo64.exe"),
        os.path.join(ROOT_DIR, "software", "crystaldiskinfo", "DiskInfo32.exe"),
        os.path.join(ROOT_DIR, "tools", "crystaldiskinfo", "DiskInfo64.exe"),
        os.path.join(ROOT_DIR, "tools", "crystaldiskinfo", "DiskInfo32.exe"),
        os.path.join(ROOT_DIR, "software", "DiskInfo64.exe"),
        os.path.join(ROOT_DIR, "tools", "DiskInfo64.exe"),
        os.path.join(ROOT_DIR, "DiskInfo64.exe"),
        r"C:\Users\Administrator\Downloads\CrystalDiskInfo9_9_2\DiskInfo64.exe",
        r"C:\Program Files\CrystalDiskInfo\DiskInfo64.exe",
        r"C:\Program Files (x86)\CrystalDiskInfo\DiskInfo32.exe",
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    return None

def find_hwmonitor_exe():
    candidates = [
        os.path.join(ROOT_DIR, "software", "hwmonitor", "HWMonitor_x64.exe"),
        os.path.join(ROOT_DIR, "software", "hwmonitor", "HWMonitor_x32.exe"),
        os.path.join(ROOT_DIR, "tools", "hwmonitor", "HWMonitor_x64.exe"),
        os.path.join(ROOT_DIR, "tools", "hwmonitor", "HWMonitor_x32.exe"),
        os.path.join(ROOT_DIR, "software", "HWMonitor_x64.exe"),
        r"C:\Program Files\CPUID\HWMonitor\HWMonitor.exe",
        r"C:\Program Files (x86)\CPUID\HWMonitor\HWMonitor.exe",
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    return None

def find_cpuz_exe():
    candidates = [
        os.path.join(ROOT_DIR, "software", "cpuz", "cpuz_x64.exe"),
        os.path.join(ROOT_DIR, "software", "cpuz", "cpuz_x32.exe"),
        os.path.join(ROOT_DIR, "tools", "cpuz", "cpuz_x64.exe"),
        os.path.join(ROOT_DIR, "tools", "cpuz", "cpuz_x32.exe"),
        os.path.join(ROOT_DIR, "software", "cpuz_x64.exe"),
        r"C:\Program Files\CPUID\CPU-Z\cpuz.exe",
        r"C:\Program Files (x86)\CPUID\CPU-Z\cpuz.exe",
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    return None

def find_gpuz_exe():
    candidates = [
        os.path.join(ROOT_DIR, "software", "gpuz", "GPU-Z.exe"),
        os.path.join(ROOT_DIR, "tools", "gpuz", "GPU-Z.exe"),
        os.path.join(ROOT_DIR, "software", "GPU-Z.exe"),
        os.path.join(ROOT_DIR, "tools", "GPU-Z.exe"),
        os.path.join(ROOT_DIR, "GPU-Z.exe"),
        r"C:\Program Files\GPU-Z\GPU-Z.exe",
        r"C:\Program Files (x86)\GPU-Z\GPU-Z.exe",
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    return None

def start_app(exe):
    if hasattr(os, "startfile"):
        try:
            os.startfile(exe)
            return True
        except Exception:
            pass
    cmd = f'start "" "{exe}"'
    subprocess.Popen(cmd, cwd=os.path.dirname(exe), shell=True)
    return True

def launch_hardware_tool(tool_id):
    """
    Kích hoạt khởi chạy công cụ theo mã tool_id:
    - 'hwmonitor': CPUID HWMonitor
    - 'cpuz': CPUID CPU-Z
    - 'gpuz': TechPowerUp GPU-Z
    - 'crystaldiskinfo': CrystalDiskInfo
    - 'taskmgr': Windows Task Manager Performance
    - 'resmon': Windows Resource Monitor
    - 'msinfo32': System Information
    """
    tool_id = (tool_id or "").strip().lower()

    if tool_id in ["hwmonitor", "temp", "nhietdo"]:
        exe = find_hwmonitor_exe()
        if exe:
            try:
                start_app(exe)
                return True, f"Đã mở CPUID HWMonitor ({os.path.basename(exe)}) - Giám sát nhiệt độ & phần cứng!"
            except Exception as e:
                return False, f"Lỗi khởi chạy HWMonitor: {e}"
        else:
            subprocess.Popen("taskmgr.exe /1", shell=True)
            return True, "Chưa tìm thấy HWMonitor. Đã mở Task Manager (Performance) thay thế!"

    elif tool_id in ["cpuz", "cpu-z", "thongso"]:
        exe = find_cpuz_exe()
        if exe:
            try:
                start_app(exe)
                return True, f"Đã mở CPUID CPU-Z ({os.path.basename(exe)}) - Kiểm tra vi xử lý & Mainboard!"
            except Exception as e:
                return False, f"Lỗi khởi chạy CPU-Z: {e}"
        else:
            subprocess.Popen("msinfo32.exe", shell=True)
            return True, "Chưa tìm thấy CPU-Z. Đã mở System Information (msinfo32) thay thế!"

    elif tool_id in ["crystaldiskinfo", "diskinfo", "smart"]:
        exe = find_crystaldiskinfo_exe()
        if exe:
            try:
                start_app(exe)
                return True, f"Đã mở CrystalDiskInfo ({os.path.basename(exe)}) - Kiểm tra sức khỏe ổ cứng!"
            except Exception as e:
                return False, f"Lỗi khởi chạy CrystalDiskInfo: {e}"
        else:
            subprocess.Popen("diskmgmt.msc", shell=True)
            return True, "Chưa tìm thấy DiskInfo64.exe. Đã mở Disk Management thay thế!"

    elif tool_id in ["gpuz", "gpu-z", "gpu", "cardmanhinh"]:
        exe = find_gpuz_exe()
        if exe:
            try:
                start_app(exe)
                return True, f"Đã mở TechPowerUp GPU-Z ({os.path.basename(exe)}) - Kiểm tra Card đồ họa & VRAM!"
            except Exception as e:
                return False, f"Lỗi khởi chạy GPU-Z: {e}"
        else:
            subprocess.Popen("dxdiag.exe", shell=True)
            return True, "Chưa tìm thấy GPU-Z. Đã mở DirectX Diagnostic Tool (dxdiag) thay thế!"

    elif tool_id == "taskmgr":
        try:
            subprocess.Popen("taskmgr.exe /1", shell=True)
            return True, "Đã mở Windows Task Manager (Tab Hiệu năng / Performance)!"
        except Exception as e:
            return False, f"Lỗi mở Task Manager: {e}"

    elif tool_id == "resmon":
        try:
            subprocess.Popen("resmon.exe", shell=True)
            return True, "Đã mở Resource Monitor (resmon) - Giám sát tài nguyên chuyên sâu!"
        except Exception as e:
            return False, f"Lỗi mở Resource Monitor: {e}"

    elif tool_id == "msinfo32":
        try:
            subprocess.Popen("msinfo32.exe", shell=True)
            return True, "Đã mở System Information (msinfo32) - Tổng quan cấu hình phần cứng!"
        except Exception as e:
            return False, f"Lỗi mở System Information: {e}"

    return False, f"Không nhận diện được công cụ: {tool_id}"

def get_tools_summary():
    """Tra ve danh sach cac cong cu giam sat san co va duong dan"""
    return [
        {
            "id": "hwmonitor",
            "name": "CPUID HWMonitor",
            "icon": "🌡️",
            "type": "portable",
            "category": "Nhiệt độ & Điện áp",
            "description": "Giám sát nhiệt độ CPU, GPU, ổ cứng SSD/HDD, tốc độ quạt RPM & công suất điện áp",
            "available": find_hwmonitor_exe() is not None,
            "path": find_hwmonitor_exe() or ""
        },
        {
            "id": "cpuz",
            "name": "CPUID CPU-Z",
            "icon": "⚡",
            "type": "portable",
            "category": "Thông số CPU & RAM",
            "description": "Chi tiết socket, số nhân/luồng, xung nhịp, Mainboard chipset, Bus RAM và thông số SPD",
            "available": find_cpuz_exe() is not None,
            "path": find_cpuz_exe() or ""
        },
        {
            "id": "gpuz",
            "name": "TechPowerUp GPU-Z",
            "icon": "🎮",
            "type": "portable",
            "category": "Card đồ họa & VRAM",
            "description": "Chi tiết chip GPU, VRAM GDDR, xung nhịp Core/Memory, cảm biến nhiệt độ & Stress Render Test",
            "available": find_gpuz_exe() is not None,
            "path": find_gpuz_exe() or ""
        },
        {
            "id": "crystaldiskinfo",
            "name": "CrystalDiskInfo Gốc",
            "icon": "💾",
            "type": "portable",
            "category": "Sức khỏe Ổ cứng S.M.A.R.T",
            "description": "Đọc trực quan bảng mã RAW S.M.A.R.T, % sức khỏe, nhiệt độ ổ đĩa và giờ chạy thực tế",
            "available": find_crystaldiskinfo_exe() is not None,
            "path": find_crystaldiskinfo_exe() or ""
        },
        {
            "id": "taskmgr",
            "name": "Task Manager (Performance)",
            "icon": "📈",
            "type": "system",
            "category": "Hiệu năng Windows",
            "description": "Biểu đồ thời gian thực sử dụng CPU, RAM, Ổ đĩa C/D, Card mạng và GPU đồ họa",
            "available": True,
            "path": "taskmgr.exe /1"
        },
        {
            "id": "resmon",
            "name": "Resource Monitor (resmon)",
            "icon": "🔍",
            "type": "system",
            "category": "Tài nguyên Chuyên sâu",
            "description": "Phân tích tiến trình nào đang chiếm dụng Disk I/O đọc ghi ổ cứng hoặc băng thông mạng",
            "available": True,
            "path": "resmon.exe"
        },
        {
            "id": "msinfo32",
            "name": "System Information (msinfo32)",
            "icon": "💻",
            "type": "system",
            "category": "Tổng quan Cấu hình",
            "description": "Báo cáo đầy đủ về phiên bản BIOS, Model bo mạch chủ, dung lượng RAM và thông tin phần cứng",
            "available": True,
            "path": "msinfo32.exe"
        }
    ]

_cached_hw_diagnostics = None

def get_detailed_hardware_diagnostics(force_refresh=False):
    """
    Thu thap day du thong so phan cung cho bao cao HTML va bien ban:
    - GPU (TechPowerUp GPU-Z format): Ten GPU, VRAM, Driver, VideoProcessor
    - CPU (CPUID CPU-Z format): Ten chip, So nhan/luong, Max Clock, Socket
    - Nhiet do do duoc (HWMonitor format)
    - Bo cong cu do kiem audit da tich hop
    """
    global _cached_hw_diagnostics
    if _cached_hw_diagnostics is not None and not force_refresh:
        return dict(_cached_hw_diagnostics)

    import datetime
    import winreg

    diagnostics = {
        "timestamp": datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        "cpu": {
            "name": "N/A",
            "cores": 0,
            "threads": os.cpu_count() or 0,
            "clock_mhz": 0,
            "clock_ghz": "N/A",
            "socket": "N/A"
        },
        "gpus": [],
        "primary_gpu": "N/A",
        "primary_vram": "N/A",
        "ram": {
            "installed_gb": 0,
            "usable_gb": 0,
            "avail_gb": 0,
            "bus_mhz": 0,
            "bus_display": "Chưa rõ",
            "ram_type": "",
            "slots_used": 0,
            "slots_total": 0,
            "slots_display": "Chưa rõ",
            "modules": [],
            "summary": "Chưa rõ"
        },
        "identity": {
            "computer_name": os.environ.get("COMPUTERNAME", ""),
            "product_number": "N/A",
            "serial_number": "N/A",
            "motherboard": "N/A"
        },
        "thermals": [],
        "audit_tools": {
            "crystaldiskinfo": {"name": "CrystalDiskInfo", "installed": find_crystaldiskinfo_exe() is not None, "path": find_crystaldiskinfo_exe() or ""},
            "hwmonitor": {"name": "CPUID HWMonitor", "installed": find_hwmonitor_exe() is not None, "path": find_hwmonitor_exe() or ""},
            "cpuz": {"name": "CPUID CPU-Z", "installed": find_cpuz_exe() is not None, "path": find_cpuz_exe() or ""},
            "gpuz": {"name": "TechPowerUp GPU-Z", "installed": find_gpuz_exe() is not None, "path": find_gpuz_exe() or ""}
        },
        "audit_stamp": "Đã đo kiểm & đối chiếu bằng bộ tứ chẩn đoán: CrystalDiskInfo 9.9.2, TechPowerUp GPU-Z 2.71, CPUID HWMonitor 1.56, CPU-Z 2.12."
    }

    # 0. Lay thong tin RAM (Dung luong, Bus MHz, DDR, Khe cam) & PN/SN tu scan_manager (SMBIOS RSMB + CIM)
    try:
        import scripts.scan_manager as sm
        ram_inf = sm.get_ram_info(force_refresh=force_refresh)
        hw_inf = sm.get_hardware_info(force_refresh=force_refresh)
        diagnostics["ram"] = {
            "installed_gb": ram_inf.get("installed_gb") or ram_inf.get("total_gb", 0),
            "usable_gb": ram_inf.get("total_gb", 0),
            "avail_gb": ram_inf.get("avail_gb", 0),
            "bus_mhz": ram_inf.get("bus_mhz", 0),
            "bus_display": ram_inf.get("bus_display", "Chưa rõ"),
            "ram_type": ram_inf.get("ram_type", ""),
            "slots_used": ram_inf.get("slots_used", 0),
            "slots_total": ram_inf.get("slots_total", 0),
            "slots_display": ram_inf.get("slots_display", "Chưa rõ"),
            "modules": ram_inf.get("modules", []),
            "summary": ram_inf.get("ram_summary", ""),
        }
        diagnostics["identity"] = {
            "computer_name": os.environ.get("COMPUTERNAME", ""),
            "product_number": hw_inf.get("product_number", "N/A"),
            "serial_number": hw_inf.get("serial_number", "N/A"),
            "motherboard": hw_inf.get("motherboard", "N/A"),
        }
        if hw_inf.get("cpu_name") and diagnostics["cpu"]["name"] == "N/A":
            diagnostics["cpu"]["name"] = hw_inf.get("cpu_name")
    except Exception:
        pass

    # 1. Fast path doc CPU tu Registry (0ms)
    try:
        k = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"HARDWARE\DESCRIPTION\System\CentralProcessor\0")
        c_name = winreg.QueryValueEx(k, "ProcessorNameString")[0].strip()
        diagnostics["cpu"]["name"] = c_name
        try:
            mhz = winreg.QueryValueEx(k, "~MHz")[0]
            diagnostics["cpu"]["clock_mhz"] = mhz
            diagnostics["cpu"]["clock_ghz"] = f"{mhz / 1000.0:.2f} GHz"
        except Exception:
            pass
    except Exception:
        pass

    # 2. Goi PowerShell lay thong so chi tiet GPU & CPU Cores
    try:
        ps = '[PSCustomObject]@{ cpu = (Get-CimInstance Win32_Processor -ErrorAction SilentlyContinue | Select-Object -First 1 Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed, SocketDesignation); gpus = @(Get-CimInstance Win32_VideoController -ErrorAction SilentlyContinue | Select-Object Name, AdapterRAM, DriverVersion, VideoProcessor) } | ConvertTo-Json -Depth 3'
        raw = subprocess.check_output(
            ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", ps],
            text=True,
            encoding="utf-8",
            errors="replace",
            stderr=subprocess.DEVNULL,
            timeout=12
        )
        data = json.loads(raw.strip()) if raw.strip() else {}

        # Parse CPU Cores & Socket
        cpu_raw = data.get("cpu") or {}
        if isinstance(cpu_raw, dict):
            if cpu_raw.get("Name"):
                diagnostics["cpu"]["name"] = str(cpu_raw["Name"]).strip()
            if cpu_raw.get("NumberOfCores"):
                diagnostics["cpu"]["cores"] = cpu_raw["NumberOfCores"]
            if cpu_raw.get("NumberOfLogicalProcessors"):
                diagnostics["cpu"]["threads"] = cpu_raw["NumberOfLogicalProcessors"]
            if cpu_raw.get("MaxClockSpeed"):
                mhz = cpu_raw["MaxClockSpeed"]
                diagnostics["cpu"]["clock_mhz"] = mhz
                diagnostics["cpu"]["clock_ghz"] = f"{mhz / 1000.0:.2f} GHz"
            if cpu_raw.get("SocketDesignation"):
                diagnostics["cpu"]["socket"] = str(cpu_raw["SocketDesignation"]).strip()

        # Parse GPUs
        gpus_raw = data.get("gpus") or []
        if isinstance(gpus_raw, dict):
            gpus_raw = [gpus_raw]
        valid_gpus = []
        for g in gpus_raw:
            if not isinstance(g, dict):
                continue
            name = str(g.get("Name") or "").strip()
            if not name or "virtual" in name.lower() or "remote" in name.lower():
                continue
            raw_ram = g.get("AdapterRAM")
            vram_str = "Shared VRAM"
            if raw_ram is not None:
                try:
                    bytes_val = int(raw_ram)
                    if bytes_val < 0:
                        bytes_val += 4294967296
                    if bytes_val >= 1073741824:
                        vram_str = f"{bytes_val / 1073741824:.1f} GB".replace(".0 GB", " GB")
                    elif bytes_val > 0:
                        vram_str = f"{bytes_val / 1048576:.0f} MB"
                except Exception:
                    pass

            is_discrete = any(k in name.lower() for k in ["geforce", "rtx", "gtx", "radeon", "arc", "quadro", "firepro"])
            valid_gpus.append({
                "name": name,
                "vram": vram_str,
                "driver": str(g.get("DriverVersion") or "N/A").strip(),
                "processor": str(g.get("VideoProcessor") or "N/A").strip(),
                "is_discrete": is_discrete
            })

        if valid_gpus:
            valid_gpus.sort(key=lambda x: (not x["is_discrete"], x["name"]))
            diagnostics["gpus"] = valid_gpus
            diagnostics["primary_gpu"] = valid_gpus[0]["name"]
            diagnostics["primary_vram"] = valid_gpus[0]["vram"]
        else:
            diagnostics["primary_gpu"] = "DirectX Graphics Adapter"
            diagnostics["primary_vram"] = "Shared Memory"

    except Exception:
        pass

    # 3. Thu thap thong tin nhiet do tu o dia neu co
    try:
        import scripts.disk_smart_service as dss
        disks = dss.scan_all_smart_disks()
        for d in disks:
            diagnostics["thermals"].append({
                "component": f"Ổ đĩa {d.get('name', 'Disk')} ({d.get('driveLetter', '')})",
                "temp": d.get("temp", 0),
                "health": d.get("healthScore", 100),
                "status": d.get("healthStatus", "GOOD")
            })
    except Exception:
        pass

    _cached_hw_diagnostics = dict(diagnostics)
    return diagnostics

def save_hardware_diagnostics_to_scan_folder(scan_id, payload=None):
    """Luu ket qua chan doan phan cung & nhiet do vao scans/<scan_id>/hardware_diagnostics.json"""
    if not scan_id:
        scan_id = "current_scan"
    scans_dir = os.path.join(ROOT_DIR, "scans")
    folder = os.path.join(scans_dir, scan_id)
    os.makedirs(folder, exist_ok=True)
    out_file = os.path.join(folder, "hardware_diagnostics.json")

    if payload is None:
        payload = get_detailed_hardware_diagnostics()

    try:
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        return True, out_file
    except Exception as e:
        return False, str(e)

