#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
   MODULE PHÁT HIỆN TRẠNG THÁI CÀI ĐẶT PHẦN MỀM (APP DETECTOR)
   - Kiểm tra tệp thực thi (.exe) trong Program Files & AppData
   - Quét khóa gỡ cài đặt Windows Registry (HKLM, HKLM_Wow6432, HKCU)
   - Quét lối tắt Desktop (.lnk) bao gồm OneDrive Desktop & Start Menu
   - Tối ưu hiệu năng, trả về kết quả chính xác trong < 100ms
==============================================================================
"""

import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Khai báo đường dẫn mặc định và mẫu tên nhận diện đồng bộ với shortcut_manager.py
KNOWN_APP_SIGNATURES = {
    "7zip": {
        "exe_paths": [
            r"C:\Program Files\7-Zip\7zFM.exe",
            r"C:\Program Files (x86)\7-Zip\7zFM.exe",
            r"C:\Program Files\7-Zip\7z.exe",
            r"C:\Program Files (x86)\7-Zip\7z.exe"
        ],
        "reg_keywords": ["7-zip"],
        "shortcuts": ["7-Zip File Manager.lnk", "7-Zip.lnk"]
    },
    "winrar": {
        "exe_paths": [
            r"C:\Program Files\WinRAR\WinRAR.exe",
            r"C:\Program Files (x86)\WinRAR\WinRAR.exe"
        ],
        "reg_keywords": ["winrar"],
        "shortcuts": ["WinRAR.lnk"]
    },
    "unikey": {
        "exe_paths": [
            r"C:\Program Files\UniKey\UniKeyNT.exe",
            r"C:\Program Files (x86)\UniKey\UniKeyNT.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\UniKey\UniKeyNT.exe")
        ],
        "reg_keywords": ["unikey"],
        "shortcuts": ["UniKey.lnk"]
    },
    "chrome": {
        "exe_paths": [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe")
        ],
        "reg_keywords": ["google chrome"],
        "shortcuts": ["Google Chrome.lnk", "Chrome.lnk"]
    },
    "firefox": {
        "exe_paths": [
            r"C:\Program Files\Mozilla Firefox\firefox.exe",
            r"C:\Program Files (x86)\Mozilla Firefox\firefox.exe"
        ],
        "reg_keywords": ["mozilla firefox"],
        "shortcuts": ["Firefox.lnk", "Mozilla Firefox.lnk"]
    },
    "coccoc": {
        "exe_paths": [
            r"C:\Program Files\CocCoc\Browser\Application\browser.exe",
            r"C:\Program Files (x86)\CocCoc\Browser\Application\browser.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\CocCoc\Browser\Application\browser.exe")
        ],
        "reg_keywords": ["cốc cốc", "coccoc browser"],
        "shortcuts": ["Cốc Cốc.lnk", "CocCoc.lnk"]
    },
    "ultraviewer": {
        "exe_paths": [
            r"C:\Program Files (x86)\UltraViewer\UltraViewer_Desktop.exe",
            r"C:\Program Files\UltraViewer\UltraViewer_Desktop.exe"
        ],
        "reg_keywords": ["ultraviewer"],
        "shortcuts": ["UltraViewer.lnk"]
    },
    "anydesk": {
        "exe_paths": [
            r"C:\Program Files (x86)\AnyDesk\AnyDesk.exe",
            r"C:\Program Files\AnyDesk\AnyDesk.exe",
            r"C:\Program Files (x86)\AnyDeskMSI\AnyDeskMSI.exe",
            r"C:\Program Files\AnyDeskMSI\AnyDeskMSI.exe",
            os.path.expandvars(r"%APPDATA%\AnyDesk\AnyDesk.exe"),
            os.path.expandvars(r"%LOCALAPPDATA%\AnyDesk\AnyDesk.exe"),
            os.path.expandvars(r"%ProgramData%\AnyDesk\AnyDesk.exe")
        ],
        "reg_keywords": ["anydesk"],
        "shortcuts": ["AnyDesk.lnk"]
    },
    "teamviewer": {
        "exe_paths": [
            r"C:\Program Files\TeamViewer\TeamViewer.exe",
            r"C:\Program Files (x86)\TeamViewer\TeamViewer.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\TeamViewer\TeamViewer.exe")
        ],
        "reg_keywords": ["teamviewer"],
        "shortcuts": ["TeamViewer.lnk"]
    },
    "rustdesk": {
        "exe_paths": [
            r"C:\Program Files\RustDesk\rustdesk.exe",
            r"C:\Program Files (x86)\RustDesk\rustdesk.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\RustDesk\rustdesk.exe"),
            os.path.expandvars(r"%LOCALAPPDATA%\rustdesk\rustdesk.exe"),
            os.path.expandvars(r"%APPDATA%\RustDesk\rustdesk.exe")
        ],
        "reg_keywords": ["rustdesk"],
        "shortcuts": ["RustDesk.lnk"]
    },
    "vlc": {
        "exe_paths": [
            r"C:\Program Files\VideoLAN\VLC\vlc.exe",
            r"C:\Program Files (x86)\VideoLAN\VLC\vlc.exe"
        ],
        "reg_keywords": ["vlc media player"],
        "shortcuts": ["VLC media player.lnk", "VLC.lnk"]
    },
    "foxit-reader": {
        "exe_paths": [
            r"C:\Program Files\Foxit Software\Foxit PDF Reader\FoxitPDFReader.exe",
            r"C:\Program Files (x86)\Foxit Software\Foxit PDF Reader\FoxitPDFReader.exe",
            r"C:\Program Files\Foxit Software\Foxit Reader\FoxitReader.exe",
            r"C:\Program Files (x86)\Foxit Software\Foxit Reader\FoxitReader.exe"
        ],
        "reg_keywords": ["foxit pdf reader", "foxit reader"],
        "shortcuts": ["Foxit PDF Reader.lnk", "Foxit Reader.lnk"]
    },
    "mem-reduct": {
        "exe_paths": [
            r"C:\Program Files\Mem Reduct\memreduct.exe",
            r"C:\Program Files (x86)\Mem Reduct\memreduct.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Mem Reduct\memreduct.exe")
        ],
        "reg_keywords": ["mem reduct"],
        "shortcuts": ["Mem Reduct.lnk"]
    },
    "geek-uninstaller": {
        "exe_paths": [
            r"C:\Program Files\GeekUninstaller\geek.exe",
            r"C:\Program Files (x86)\GeekUninstaller\geek.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\GeekUninstaller\geek.exe")
        ],
        "reg_keywords": ["geek uninstaller", "geekuninstaller"],
        "shortcuts": ["Geek Uninstaller.lnk"]
    },
    "libreoffice": {
        "exe_paths": [
            r"C:\Program Files\LibreOffice\program\soffice.exe",
            r"C:\Program Files (x86)\LibreOffice\program\soffice.exe"
        ],
        "reg_keywords": ["libreoffice"],
        "shortcuts": ["LibreOffice.lnk", "LibreOffice Writer.lnk"]
    },
    "wps-office": {
        "exe_paths": [
            os.path.expandvars(r"%LOCALAPPDATA%\Kingsoft\WPS Office\ksolaunch.exe"),
            r"C:\Program Files\Kingsoft\WPS Office\ksolaunch.exe",
            r"C:\Program Files (x86)\Kingsoft\WPS Office\ksolaunch.exe"
        ],
        "reg_keywords": ["wps office", "kingsoft office"],
        "shortcuts": ["WPS Office.lnk"]
    },
    "office365": {
        "exe_paths": [
            r"C:\Program Files\Microsoft Office\root\Office16\WINWORD.EXE",
            r"C:\Program Files (x86)\Microsoft Office\root\Office16\WINWORD.EXE",
            r"C:\Program Files\Microsoft Office\Office16\WINWORD.EXE",
            r"C:\Program Files (x86)\Microsoft Office\Office16\WINWORD.EXE"
        ],
        "also_require_exes": [
            r"C:\Program Files\Microsoft Office\root\Office16\EXCEL.EXE",
            r"C:\Program Files (x86)\Microsoft Office\root\Office16\EXCEL.EXE",
            r"C:\Program Files\Microsoft Office\Office16\EXCEL.EXE",
            r"C:\Program Files (x86)\Microsoft Office\Office16\EXCEL.EXE"
        ],
        "reg_keywords": ["microsoft 365 apps", "microsoft office professional", "microsoft office standard", "microsoft office home", "microsoft 365 -"],
        "shortcuts": ["Word.lnk", "Excel.lnk", "Microsoft Word.lnk"],
        "require_exe": True
    },
    "vscode": {
        "exe_paths": [
            r"C:\Program Files\Microsoft VS Code\Code.exe",
            r"C:\Program Files (x86)\Microsoft VS Code\Code.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Microsoft VS Code\Code.exe")
        ],
        "reg_keywords": ["visual studio code", "microsoft visual studio code"],
        "shortcuts": ["Visual Studio Code.lnk"]
    },
    "antigravity": {
        "exe_paths": [
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\antigravity\antigravity.exe"),
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Antigravity IDE\Antigravity.exe"),
            r"C:\Program Files\Antigravity\antigravity.exe"
        ],
        "reg_keywords": ["antigravity"],
        "shortcuts": ["Antigravity.lnk", "Google Antigravity.lnk", "Antigravity IDE.lnk"]
    },
    "notepadplusplus": {
        "exe_paths": [
            r"C:\Program Files\Notepad++\notepad++.exe",
            r"C:\Program Files (x86)\Notepad++\notepad++.exe"
        ],
        "reg_keywords": ["notepad++"],
        "shortcuts": ["Notepad++.lnk"]
    },
    "docker-desktop": {
        "exe_paths": [
            r"C:\Program Files\Docker\Docker\Docker Desktop.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Docker\Docker Desktop.exe")
        ],
        "reg_keywords": ["docker desktop"],
        "shortcuts": ["Docker Desktop.lnk"]
    },
    "nodejs": {
        "exe_paths": [
            r"C:\Program Files\nodejs\node.exe",
            r"C:\Program Files (x86)\nodejs\node.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\nodejs\node.exe")
        ],
        "reg_keywords": ["node.js"],
        "shortcuts": ["Node.js.lnk", "Node.js command prompt.lnk"]
    },
    "git": {
        "exe_paths": [
            r"C:\Program Files\Git\git-bash.exe",
            r"C:\Program Files\Git\cmd\git.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Git\git-bash.exe")
        ],
        "reg_keywords": ["git version"],
        "shortcuts": ["Git Bash.lnk"]
    },
    "postman": {
        "exe_paths": [
            os.path.expandvars(r"%LOCALAPPDATA%\Postman\Postman.exe"),
            r"C:\Program Files\Postman\Postman.exe"
        ],
        "reg_keywords": ["postman"],
        "shortcuts": ["Postman.lnk"]
    },
    "mobaxterm": {
        "exe_paths": [
            r"C:\Program Files (x86)\Mobatek\MobaXterm\MobaXterm.exe",
            r"C:\Program Files\Mobatek\MobaXterm\MobaXterm.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Mobatek\MobaXterm\MobaXterm.exe")
        ],
        "reg_keywords": ["mobaxterm"],
        "shortcuts": ["MobaXterm.lnk"]
    },
    "putty": {
        "exe_paths": [
            r"C:\Program Files\PuTTY\putty.exe",
            r"C:\Program Files (x86)\PuTTY\putty.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\PuTTY\putty.exe")
        ],
        "reg_keywords": ["putty release", "putty"],
        "shortcuts": ["PuTTY.lnk"]
    },
    "winscp": {
        "exe_paths": [
            r"C:\Program Files (x86)\WinSCP\WinSCP.exe",
            r"C:\Program Files\WinSCP\WinSCP.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\WinSCP\WinSCP.exe")
        ],
        "reg_keywords": ["winscp"],
        "shortcuts": ["WinSCP.lnk"]
    },
    "claude": {
        "exe_paths": [
            os.path.expandvars(r"%LOCALAPPDATA%\AnthropicClaude\claude.exe"),
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Claude\Claude.exe"),
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\claude-desktop\Claude.exe"),
            r"C:\Program Files\Claude\Claude.exe"
        ],
        "reg_keywords": ["claude"],
        "shortcuts": ["Claude.lnk"]
    },
    "chatgpt": {
        "exe_paths": [
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\ChatGPT\ChatGPT.exe"),
            os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WindowsApps\ChatGPT.exe"),
            r"C:\Program Files\ChatGPT\ChatGPT.exe"
        ],
        "reg_keywords": ["chatgpt"],
        "shortcuts": ["ChatGPT.lnk"]
    },
    "advanced-ip-scanner": {
        "exe_paths": [
            r"C:\Program Files (x86)\Advanced IP Scanner\advanced_ip_scanner.exe",
            r"C:\Program Files\Advanced IP Scanner\advanced_ip_scanner.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\Advanced IP Scanner\advanced_ip_scanner.exe")
        ],
        "reg_keywords": ["advanced ip scanner"],
        "shortcuts": ["Advanced IP Scanner.lnk"]
    },
    "wireshark": {
        "exe_paths": [
            r"C:\Program Files\Wireshark\Wireshark.exe",
            r"C:\Program Files (x86)\Wireshark\Wireshark.exe"
        ],
        "reg_keywords": ["wireshark"],
        "shortcuts": ["Wireshark.lnk"]
    },
    "nmap": {
        "exe_paths": [
            r"C:\Program Files (x86)\Nmap\zenmap.exe",
            r"C:\Program Files (x86)\Nmap\nmap.exe",
            r"C:\Program Files\Nmap\zenmap.exe",
            r"C:\Program Files\Nmap\nmap.exe"
        ],
        "reg_keywords": ["nmap"],
        "shortcuts": ["Nmap - Zenmap GUI.lnk", "Zenmap.lnk"]
    },
    "openvpn-connect": {
        "exe_paths": [
            r"C:\Program Files\OpenVPN Connect\OpenVPNConnect.exe",
            r"C:\Program Files (x86)\OpenVPN Connect\OpenVPNConnect.exe",
            r"C:\Program Files\OpenVPN\bin\openvpn-gui.exe"
        ],
        "reg_keywords": ["openvpn connect", "openvpn"],
        "shortcuts": ["OpenVPN Connect.lnk", "OpenVPN GUI.lnk"]
    },
    "tailscale": {
        "exe_paths": [
            r"C:\Program Files\Tailscale\tailscale-ipn.exe",
            r"C:\Program Files (x86)\Tailscale\tailscale-ipn.exe"
        ],
        "reg_keywords": ["tailscale"],
        "shortcuts": ["Tailscale.lnk"]
    },
    "dbeaver": {
        "exe_paths": [
            r"C:\Program Files\DBeaver\dbeaver.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\DBeaver\dbeaver.exe"),
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\DBeaver\dbeaver.exe")
        ],
        "reg_keywords": ["dbeaver"],
        "shortcuts": ["DBeaver.lnk"]
    },
    "gpuz": {
        "exe_paths": [
            r"C:\Program Files\GPU-Z\GPU-Z.exe",
            r"C:\Program Files (x86)\GPU-Z\GPU-Z.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\GPU-Z\GPU-Z.exe")
        ],
        "reg_keywords": ["techpowerup gpu-z", "gpu-z"],
        "shortcuts": ["TechPowerUp GPU-Z.lnk", "GPU-Z.lnk"]
    },
    "cpuz": {
        "exe_paths": [
            r"C:\Program Files\CPUID\CPU-Z\cpuz.exe",
            r"C:\Program Files\CPUID\CPU-Z\cpuz_x64.exe",
            r"C:\Program Files (x86)\CPUID\CPU-Z\cpuz.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\CPUID\CPU-Z\cpuz.exe"),
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\CPUID\CPU-Z\cpuz_x64.exe")
        ],
        "reg_keywords": ["cpuid cpu-z", "cpu-z"],
        "shortcuts": ["CPUID CPU-Z.lnk", "CPU-Z.lnk"]
    },
    "hwmonitor": {
        "exe_paths": [
            r"C:\Program Files\CPUID\HWMonitor\HWMonitor.exe",
            r"C:\Program Files\CPUID\HWMonitor\HWMonitor_x64.exe",
            r"C:\Program Files (x86)\CPUID\HWMonitor\HWMonitor.exe",
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\CPUID\HWMonitor\HWMonitor.exe"),
            os.path.expandvars(r"%LOCALAPPDATA%\Programs\CPUID\HWMonitor\HWMonitor_x64.exe")
        ],
        "reg_keywords": ["cpuid hwmonitor", "hwmonitor"],
        "shortcuts": ["CPUID HWMonitor.lnk", "HWMonitor.lnk"]
    },
    "vcredist-x64": {
        "exe_paths": [
            r"C:\Windows\System32\vcruntime140_1.dll",
            r"C:\Windows\System32\msvcp140.dll"
        ],
        "reg_keywords": [
            "microsoft visual c++ 2015-2022 redistributable (x64)",
            "microsoft visual c++ 2015-2019 redistributable (x64)",
            "microsoft visual c++ 2022 x64"
        ],
        "shortcuts": []
    },
    "vcredist-x86": {
        "exe_paths": [
            r"C:\Windows\SysWOW64\msvcp140.dll",
            r"C:\Windows\SysWOW64\vcruntime140.dll"
        ],
        "reg_keywords": [
            "microsoft visual c++ 2015-2022 redistributable (x86)",
            "microsoft visual c++ 2015-2019 redistributable (x86)",
            "microsoft visual c++ 2022 x86"
        ],
        "shortcuts": []
    }
}


def get_installed_from_registry():
    """Đọc toàn bộ danh sách phần mềm từ Windows Uninstall Registry"""
    installed_reg = []
    try:
        import winreg
        roots = [
            (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"),
            (winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"),
            (winreg.HKEY_CURRENT_USER, r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall"),
        ]
        for root, subkey in roots:
            try:
                with winreg.OpenKey(root, subkey) as key:
                    num_subkeys, _, _ = winreg.QueryInfoKey(key)
                    for i in range(num_subkeys):
                        try:
                            name = winreg.EnumKey(key, i)
                            with winreg.OpenKey(key, name) as app_key:
                                dn = ""
                                dv = ""
                                il = ""
                                sys_comp = 0
                                try:
                                    sys_comp = int(winreg.QueryValueEx(app_key, "SystemComponent")[0])
                                except Exception:
                                    pass
                                if sys_comp == 1:
                                    continue
                                try:
                                    dn = str(winreg.QueryValueEx(app_key, "DisplayName")[0]).strip()
                                except OSError:
                                    pass
                                try:
                                    dv = str(winreg.QueryValueEx(app_key, "DisplayVersion")[0]).strip()
                                except OSError:
                                    pass
                                try:
                                    il = str(winreg.QueryValueEx(app_key, "InstallLocation")[0]).strip()
                                except OSError:
                                    pass
                                if dn:
                                    installed_reg.append({
                                        "name": dn,
                                        "name_lower": dn.lower(),
                                        "version": dv,
                                        "location": il
                                    })
                        except OSError:
                            pass
            except OSError:
                pass
    except Exception:
        pass
    return installed_reg


def get_desktop_shortcuts():
    """Lấy danh sách các tệp .lnk trên Desktop (kể cả OneDrive) và Start Menu (tối đa 2 cấp)"""
    shortcuts = set()
    candidate_dirs = [
        os.path.expandvars(r"%USERPROFILE%\Desktop"),
        os.path.expandvars(r"%OneDrive%\Desktop"),
        os.path.expandvars(r"%OneDriveConsumer%\Desktop"),
        os.path.expandvars(r"%OneDriveCommercial%\Desktop"),
        r"C:\Users\Public\Desktop",
    ]
    start_menu_dirs = [
        os.path.expandvars(r"%APPDATA%\Microsoft\Windows\Start Menu\Programs"),
        r"C:\ProgramData\Microsoft\Windows\Start Menu\Programs"
    ]

    for d in candidate_dirs:
        if d and "%" not in d and os.path.isdir(d):
            try:
                for f in os.listdir(d):
                    if f.lower().endswith(".lnk"):
                        shortcuts.add(f.lower())
            except Exception:
                pass

    for sm_dir in start_menu_dirs:
        if sm_dir and "%" not in sm_dir and os.path.isdir(sm_dir):
            try:
                for root, dirs, files in os.walk(sm_dir):
                    rel_depth = root[len(sm_dir):].count(os.sep)
                    if rel_depth > 2:
                        dirs[:] = []
                        continue
                    for f in files:
                        if f.lower().endswith(".lnk"):
                            shortcuts.add(f.lower())
            except Exception:
                pass

    return shortcuts


def detect_all_installed_apps(custom_signatures=None):
    """
    Phát hiện toàn bộ các phần mềm đã cài đặt trên máy.
    """
    registry_list = get_installed_from_registry()
    shortcuts = get_desktop_shortcuts()

    signatures = dict(KNOWN_APP_SIGNATURES)
    if custom_signatures and isinstance(custom_signatures, dict):
        signatures.update(custom_signatures)

    installed_map = {}
    installed_ids = []

    for app_id, sig in signatures.items():
        has_exe = False
        has_reg = False
        has_shortcut = False
        detected_version = ""
        found_exe = ""
        found_reason = []
        require_exe = bool(sig.get("require_exe", False))

        # 1. Kiểm tra tồn tại file .exe thực tế
        for path in sig.get("exe_paths", []):
            if path and os.path.isfile(path):
                has_exe = True
                found_exe = path
                found_reason.append("file_exists")
                break

        # Nếu có danh sách file bổ sung bắt buộc (vd: Office phải có cả WINWORD.EXE & EXCEL.EXE)
        if has_exe and sig.get("also_require_exes"):
            has_extra_exe = any(p and os.path.isfile(p) for p in sig.get("also_require_exes", []))
            if not has_extra_exe:
                has_exe = False
                found_exe = ""
                found_reason = [r for r in found_reason if r != "file_exists"]

        # 2. Kiểm tra Registry
        for reg_app in registry_list:
            r_name = reg_app["name_lower"]
            for kw in sig.get("reg_keywords", []):
                if kw and kw in r_name:
                    loc = reg_app.get("location", "")
                    # Bỏ qua khóa Registry rác nếu InstallLocation có ghi nhưng thư mục đã bị xóa hoàn toàn
                    if loc and not os.path.exists(loc) and not has_exe:
                        continue
                    has_reg = True
                    detected_version = reg_app["version"]
                    found_reason.append("registry_match")
                    if not found_exe and loc:
                        found_exe = loc
                    break
            if has_reg and detected_version:
                break

        # 3. Kiểm tra Shortcut (Chỉ dùng bổ trợ khi không bắt buộc require_exe)
        for sc in sig.get("shortcuts", []):
            if sc and sc.lower() in shortcuts:
                has_shortcut = True
                found_reason.append("shortcut_exists")
                break

        if require_exe:
            is_installed = has_exe
        else:
            is_installed = has_exe or has_reg or (has_shortcut and not sig.get("exe_paths"))
            # Với các app portable hoặc cài user-dir có thể không ghi HKLM/exe chuẩn nhưng có shortcut thực
            if not is_installed and has_shortcut and app_id in ("unikey", "geek-uninstaller", "gpuz", "cpuz", "hwmonitor", "anydesk", "rustdesk"):
                is_installed = True

        if is_installed:
            installed_ids.append(app_id)
            installed_map[app_id] = {
                "installed": True,
                "version": detected_version,
                "exe_path": found_exe,
                "methods": list(set(found_reason))
            }
        else:
            installed_map[app_id] = {
                "installed": False,
                "version": "",
                "exe_path": "",
                "methods": []
            }

    return {
        "status": "ok",
        "total_checked": len(signatures),
        "total_installed": len(installed_ids),
        "total_missing": len(signatures) - len(installed_ids),
        "installed_ids": installed_ids,
        "installed_map": installed_map
    }


if __name__ == "__main__":
    res = detect_all_installed_apps()
    print(f"Phát hiện {res['total_installed']}/{res['total_checked']} phần mềm đã cài đặt (Chưa cài: {res['total_missing']}):")
    for app_id, info in res["installed_map"].items():
        mark = "[+]" if info["installed"] else "[-]"
        print(f" {mark} {app_id:18s}: {'ĐÃ CÀI' if info['installed'] else 'CHƯA CÀI':8s} | ver={info.get('version', '')} | {info.get('exe_path', '')}")
