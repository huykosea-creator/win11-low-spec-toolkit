#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
   QUẢN LÝ LỐI TẮT DESKTOP & CÀI ĐẶT ỨNG DỤNG PORTABLE (SHORTCUT & PORTABLE MANAGER)
   Tự động sao chép ứng dụng vào Program Files, tạo shortcut Desktop (.lnk)
   cho toàn bộ phần mềm sau khi cài đặt tuần tự.
==============================================================================
"""

import os
import sys
import shutil
import subprocess

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Danh mục đường dẫn thực thi chuẩn của các phần mềm thông dụng trên Windows
KNOWN_APP_PATHS = {
    "7zip": [
        r"C:\Program Files\7-Zip\7zFM.exe",
        r"C:\Program Files (x86)\7-Zip\7zFM.exe",
    ],
    "winrar": [
        r"C:\Program Files\WinRAR\WinRAR.exe",
        r"C:\Program Files (x86)\WinRAR\WinRAR.exe",
    ],
    "unikey": [
        r"C:\Program Files\UniKey\UniKeyNT.exe",
        r"C:\Program Files (x86)\UniKey\UniKeyNT.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\UniKey\UniKeyNT.exe"),
    ],
    "chrome": [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Google\Chrome\Application\chrome.exe"),
    ],
    "firefox": [
        r"C:\Program Files\Mozilla Firefox\firefox.exe",
        r"C:\Program Files (x86)\Mozilla Firefox\firefox.exe",
    ],
    "ultraviewer": [
        r"C:\Program Files (x86)\UltraViewer\UltraViewer_Desktop.exe",
        r"C:\Program Files\UltraViewer\UltraViewer_Desktop.exe",
    ],
    "rustdesk": [
        r"C:\Program Files\RustDesk\rustdesk.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\RustDesk\rustdesk.exe"),
    ],
    "anydesk": [
        r"C:\Program Files (x86)\AnyDesk\AnyDesk.exe",
        r"C:\Program Files\AnyDesk\AnyDesk.exe",
    ],
    "teamviewer": [
        r"C:\Program Files\TeamViewer\TeamViewer.exe",
        r"C:\Program Files (x86)\TeamViewer\TeamViewer.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"TeamViewer\TeamViewer.exe"),
    ],
    "vcredist-x64": [
        r"C:\Windows\System32\vcruntime140_1.dll",
        r"C:\Windows\System32\msvcp140.dll",
    ],
    "vcredist-x86": [
        r"C:\Windows\SysWOW64\msvcp140.dll",
        r"C:\Windows\SysWOW64\vcruntime140.dll",
    ],
    "vlc": [
        r"C:\Program Files\VideoLAN\VLC\vlc.exe",
        r"C:\Program Files (x86)\VideoLAN\VLC\vlc.exe",
    ],
    "vlc-player": [
        r"C:\Program Files\VideoLAN\VLC\vlc.exe",
        r"C:\Program Files (x86)\VideoLAN\VLC\vlc.exe",
    ],
    "foxit-reader": [
        r"C:\Program Files (x86)\Foxit Software\Foxit PDF Reader\FoxitPDFReader.exe",
        r"C:\Program Files\Foxit Software\Foxit PDF Reader\FoxitPDFReader.exe",
        r"C:\Program Files (x86)\Foxit Software\Foxit Reader\FoxitReader.exe",
    ],
    "foxit": [
        r"C:\Program Files (x86)\Foxit Software\Foxit PDF Reader\FoxitPDFReader.exe",
        r"C:\Program Files\Foxit Software\Foxit PDF Reader\FoxitPDFReader.exe",
        r"C:\Program Files (x86)\Foxit Software\Foxit Reader\FoxitReader.exe",
    ],
    "mem-reduct": [
        r"C:\Program Files\Mem Reduct\memreduct.exe",
        r"C:\Program Files (x86)\Mem Reduct\memreduct.exe",
    ],
    "memreduct": [
        r"C:\Program Files\Mem Reduct\memreduct.exe",
        r"C:\Program Files (x86)\Mem Reduct\memreduct.exe",
    ],
    "geek-uninstaller": [
        r"C:\Program Files\GeekUninstaller\geek.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\GeekUninstaller\geek.exe"),
    ],
    "geek": [
        r"C:\Program Files\GeekUninstaller\geek.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\GeekUninstaller\geek.exe"),
    ],
    "libreoffice": [
        r"C:\Program Files\LibreOffice\program\soffice.exe",
        r"C:\Program Files (x86)\LibreOffice\program\soffice.exe",
    ],
    "wps-office": [
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Kingsoft\WPS Office\ksolaunch.exe"),
        r"C:\Program Files\Kingsoft\WPS Office\ksolaunch.exe",
        r"C:\Program Files (x86)\Kingsoft\WPS Office\ksolaunch.exe",
    ],
    "coccoc": [
        r"C:\Program Files\CocCoc\Browser\Application\browser.exe",
        r"C:\Program Files (x86)\CocCoc\Browser\Application\browser.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"CocCoc\Browser\Application\browser.exe"),
    ],
    "office365": [
        r"C:\Program Files\Microsoft Office\root\Office16\WINWORD.EXE",
        r"C:\Program Files (x86)\Microsoft Office\root\Office16\WINWORD.EXE",
        r"C:\Program Files\Microsoft Office\Office16\WINWORD.EXE",
        r"C:\Program Files\Microsoft Office\root\Office16\EXCEL.EXE",
        r"C:\Program Files (x86)\Microsoft Office\root\Office16\EXCEL.EXE",
        r"C:\Program Files\Microsoft Office\root\Office16\POWERPNT.EXE",
        r"C:\Program Files (x86)\Microsoft Office\root\Office16\POWERPNT.EXE",
    ],
    "vscode": [
        r"C:\Program Files\Microsoft VS Code\Code.exe",
        r"C:\Program Files (x86)\Microsoft VS Code\Code.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\Microsoft VS Code\Code.exe"),
    ],
    "antigravity": [
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\antigravity\antigravity.exe"),
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\Antigravity IDE\Antigravity.exe"),
    ],
    "notepadplusplus": [
        r"C:\Program Files\Notepad++\notepad++.exe",
        r"C:\Program Files (x86)\Notepad++\notepad++.exe",
    ],
    "docker-desktop": [
        r"C:\Program Files\Docker\Docker\Docker Desktop.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Docker\Docker Desktop.exe"),
    ],
    "nodejs": [
        r"C:\Program Files\nodejs\node.exe",
        r"C:\Program Files (x86)\nodejs\node.exe",
    ],
    "git": [
        r"C:\Program Files\Git\git-bash.exe",
        r"C:\Program Files\Git\cmd\git.exe",
    ],
    "postman": [
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Postman\Postman.exe"),
        r"C:\Program Files\Postman\Postman.exe",
    ],
    "mobaxterm": [
        r"C:\Program Files (x86)\Mobatek\MobaXterm\MobaXterm.exe",
        r"C:\Program Files\Mobatek\MobaXterm\MobaXterm.exe",
    ],
    "putty": [
        r"C:\Program Files\PuTTY\putty.exe",
        r"C:\Program Files (x86)\PuTTY\putty.exe",
    ],
    "winscp": [
        r"C:\Program Files (x86)\WinSCP\WinSCP.exe",
        r"C:\Program Files\WinSCP\WinSCP.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\WinSCP\WinSCP.exe"),
    ],
    "claude": [
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"AnthropicClaude\claude.exe"),
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\Claude\Claude.exe"),
    ],
    "chatgpt": [
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\ChatGPT\ChatGPT.exe"),
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Microsoft\WindowsApps\ChatGPT.exe"),
    ],
    "advanced-ip-scanner": [
        r"C:\Program Files (x86)\Advanced IP Scanner\advanced_ip_scanner.exe",
        r"C:\Program Files\Advanced IP Scanner\advanced_ip_scanner.exe",
    ],
    "wireshark": [
        r"C:\Program Files\Wireshark\Wireshark.exe",
        r"C:\Program Files (x86)\Wireshark\Wireshark.exe",
    ],
    "nmap": [
        r"C:\Program Files (x86)\Nmap\zenmap.exe",
        r"C:\Program Files (x86)\Nmap\nmap.exe",
        r"C:\Program Files\Nmap\zenmap.exe",
    ],
    "openvpn-connect": [
        r"C:\Program Files\OpenVPN Connect\OpenVPNConnect.exe",
        r"C:\Program Files (x86)\OpenVPN Connect\OpenVPNConnect.exe",
        r"C:\Program Files\OpenVPN\bin\openvpn-gui.exe",
    ],
    "tailscale": [
        r"C:\Program Files\Tailscale\tailscale-ipn.exe",
        r"C:\Program Files (x86)\Tailscale\tailscale-ipn.exe",
    ],
    "dbeaver": [
        r"C:\Program Files\DBeaver\dbeaver.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"DBeaver\dbeaver.exe"),
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\DBeaver\dbeaver.exe"),
    ],
    "gpuz": [
        r"C:\Program Files\GPU-Z\GPU-Z.exe",
        r"C:\Program Files (x86)\GPU-Z\GPU-Z.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\GPU-Z\GPU-Z.exe"),
    ],
    "cpuz": [
        r"C:\Program Files\CPUID\CPU-Z\cpuz.exe",
        r"C:\Program Files\CPUID\CPU-Z\cpuz_x64.exe",
        r"C:\Program Files (x86)\CPUID\CPU-Z\cpuz.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\CPUID\CPU-Z\cpuz.exe"),
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\CPUID\CPU-Z\cpuz_x64.exe"),
    ],
    "hwmonitor": [
        r"C:\Program Files\CPUID\HWMonitor\HWMonitor.exe",
        r"C:\Program Files\CPUID\HWMonitor\HWMonitor_x64.exe",
        r"C:\Program Files (x86)\CPUID\HWMonitor\HWMonitor.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\CPUID\HWMonitor\HWMonitor.exe"),
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\CPUID\HWMonitor\HWMonitor_x64.exe"),
    ],
    "crystaldiskinfo": [
        r"C:\Program Files\CrystalDiskInfo\DiskInfo64.exe",
        r"C:\Program Files\CrystalDiskInfo\DiskInfo32.exe",
        r"C:\Program Files (x86)\CrystalDiskInfo\DiskInfo64.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Programs\CrystalDiskInfo\DiskInfo64.exe"),
    ],
}

# Từ khóa tìm kiếm file shortcut trong Start Menu nếu installer đã tạo
APP_SEARCH_KEYWORDS = {
    "7zip": ["7-zip", "7zip", "7zfm"],
    "winrar": ["winrar"],
    "unikey": ["unikey"],
    "chrome": ["chrome", "google chrome"],
    "firefox": ["firefox", "mozilla firefox"],
    "coccoc": ["cốc cốc", "coccoc"],
    "ultraviewer": ["ultraviewer"],
    "rustdesk": ["rustdesk"],
    "anydesk": ["anydesk"],
    "teamviewer": ["teamviewer"],
    "vlc": ["vlc", "vlc media player"],
    "vlc-player": ["vlc", "vlc media player"],
    "foxit-reader": ["foxit", "foxit reader", "foxit pdf reader"],
    "foxit": ["foxit", "foxit reader", "foxit pdf reader"],
    "mem-reduct": ["mem reduct", "memreduct"],
    "memreduct": ["mem reduct", "memreduct"],
    "geek-uninstaller": ["geek uninstaller", "geek"],
    "geek": ["geek uninstaller", "geek"],
    "libreoffice": ["libreoffice", "writer", "calc"],
    "wps-office": ["wps office", "wps"],
    "office365": ["word", "excel", "powerpoint", "microsoft 365"],
    "vscode": ["visual studio code", "code"],
    "antigravity": ["antigravity"],
    "notepadplusplus": ["notepad++"],
    "docker-desktop": ["docker desktop", "docker"],
    "nodejs": ["node.js", "nodejs"],
    "git": ["git bash", "git gui"],
    "postman": ["postman"],
    "mobaxterm": ["mobaxterm"],
    "putty": ["putty"],
    "winscp": ["winscp"],
    "claude": ["claude"],
    "chatgpt": ["chatgpt"],
    "advanced-ip-scanner": ["advanced ip scanner"],
    "wireshark": ["wireshark"],
    "nmap": ["zenmap", "nmap"],
    "openvpn-connect": ["openvpn connect", "openvpn"],
    "tailscale": ["tailscale"],
    "dbeaver": ["dbeaver"],
    "gpuz": ["gpu-z", "techpowerup"],
    "cpuz": ["cpu-z", "cpuid"],
    "hwmonitor": ["hwmonitor", "cpuid hwmonitor"],
    "crystaldiskinfo": ["crystaldiskinfo", "diskinfo"],
}

def get_user_desktop_dir():
    """Lấy thư mục Desktop của tài khoản hiện tại"""
    d = os.path.join(os.environ.get("USERPROFILE", "C:\\Users\\Default"), "Desktop")
    if os.path.exists(d):
        return d
    pub = os.path.join(os.environ.get("PUBLIC", "C:\\Users\\Public"), "Desktop")
    return pub if os.path.exists(pub) else d

def get_public_desktop_dir():
    """Lấy thư mục Public Desktop"""
    pub = os.path.join(os.environ.get("PUBLIC", "C:\\Users\\Public"), "Desktop")
    return pub if os.path.exists(pub) else get_user_desktop_dir()

def create_shortcut(target_exe, shortcut_path, working_dir=None, icon_path=None, description=""):
    """
    Tạo tệp shortcut Windows (.lnk) bằng PowerShell WScript.Shell
    """
    if not os.path.exists(target_exe):
        return False, f"Target exe không tồn tại: {target_exe}"

    if not working_dir:
        working_dir = os.path.dirname(target_exe)

    os.makedirs(os.path.dirname(shortcut_path), exist_ok=True)

    # Chuẩn hóa đường dẫn tránh lỗi dấu gạch chéo
    target_clean = target_exe.replace("/", "\\")
    shortcut_clean = shortcut_path.replace("/", "\\")
    working_clean = working_dir.replace("/", "\\")

    ps_code = [
        f'$ws = New-Object -ComObject WScript.Shell',
        f'$s = $ws.CreateShortcut("{shortcut_clean}")',
        f'$s.TargetPath = "{target_clean}"',
        f'$s.WorkingDirectory = "{working_clean}"'
    ]
    if icon_path and os.path.exists(icon_path):
        icon_clean = icon_path.replace("/", "\\")
        ps_code.append(f'$s.IconLocation = "{icon_clean}"')
    if description:
        ps_code.append(f'$s.Description = "{description}"')
    ps_code.append('$s.Save()')

    cmd_string = "; ".join(ps_code)

    try:
        creation_flags = 0x08000000 if sys.platform == "win32" else 0
        res = subprocess.run(
            ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", cmd_string],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=10,
            creationflags=creation_flags
        )
        if os.path.exists(shortcut_path):
            return True, shortcut_path
        else:
            return False, res.stderr.strip() or "Lỗi khi lưu shortcut"
    except Exception as e:
        return False, str(e)

def search_start_menu_shortcuts(keywords):
    """
    Tìm kiếm file .lnk trong Start Menu tương ứng với từ khóa,
    loại bỏ các file phụ trợ như help, readme, uninstall.
    """
    start_dirs = [
        os.path.join(os.environ.get("ALLUSERSPROFILE", "C:\\ProgramData"), r"Microsoft\Windows\Start Menu\Programs"),
        os.path.join(os.environ.get("APPDATA", ""), r"Microsoft\Windows\Start Menu\Programs")
    ]
    ignored_words = ["help", "manual", "readme", "uninstall", "gỡ cài đặt", "tro giup", "trợ giúp", "doc", "license"]
    found = []
    for sdir in start_dirs:
        if not os.path.exists(sdir):
            continue
        for root, dirs, files in os.walk(sdir):
            for f in files:
                if f.lower().endswith(".lnk"):
                    f_lower = f.lower()
                    if any(ign in f_lower for ign in ignored_words):
                        continue
                    for kw in keywords:
                        if kw.lower() in f_lower:
                            found.append(os.path.join(root, f))
                            break
    return found

def find_office365_executables():
    """Tìm đường dẫn thực tế của Word, Excel, PowerPoint trên máy."""
    candidates_map = {
        "Word": [
            r"C:\Program Files\Microsoft Office\root\Office16\WINWORD.EXE",
            r"C:\Program Files (x86)\Microsoft Office\root\Office16\WINWORD.EXE",
            r"C:\Program Files\Microsoft Office\Office16\WINWORD.EXE",
            r"C:\Program Files (x86)\Microsoft Office\Office16\WINWORD.EXE",
        ],
        "Excel": [
            r"C:\Program Files\Microsoft Office\root\Office16\EXCEL.EXE",
            r"C:\Program Files (x86)\Microsoft Office\root\Office16\EXCEL.EXE",
            r"C:\Program Files\Microsoft Office\Office16\EXCEL.EXE",
            r"C:\Program Files (x86)\Microsoft Office\Office16\EXCEL.EXE",
        ],
        "PowerPoint": [
            r"C:\Program Files\Microsoft Office\root\Office16\POWERPNT.EXE",
            r"C:\Program Files (x86)\Microsoft Office\root\Office16\POWERPNT.EXE",
            r"C:\Program Files\Microsoft Office\Office16\POWERPNT.EXE",
            r"C:\Program Files (x86)\Microsoft Office\Office16\POWERPNT.EXE",
        ],
    }
    found = {}
    for label, paths in candidates_map.items():
        exe_p = next((p for p in paths if os.path.isfile(p)), None)
        if exe_p:
            found[label] = exe_p
    return found


def has_office_desktop_apps():
    """Xác nhận Office 365 Desktop thực sự đã có cả Word (WINWORD.EXE) và Excel (EXCEL.EXE)."""
    found = find_office365_executables()
    if "Word" in found and "Excel" in found:
        return True, found["Word"]
    return False, ""


def ensure_office365_desktop_shortcuts():
    """
    Tạo riêng các lối tắt Word.lnk, Excel.lnk, PowerPoint.lnk trên Desktop nếu tồn tại file thực thi.
    """
    user_desktop = get_user_desktop_dir()
    pub_desktop = get_public_desktop_dir()
    found_exes = find_office365_executables()

    created = []
    first_path = ""
    for label, exe_found in found_exes.items():
        user_lnk = os.path.join(user_desktop, f"{label}.lnk")
        pub_lnk = os.path.join(pub_desktop, f"{label}.lnk")
        if os.path.exists(user_lnk) or os.path.exists(pub_lnk):
            if not first_path:
                first_path = user_lnk if os.path.exists(user_lnk) else pub_lnk
            created.append(label)
            continue
        ok, _ = create_shortcut(exe_found, user_lnk, description=f"Microsoft {label}")
        if ok:
            if not first_path:
                first_path = user_lnk
            created.append(label)

    if created:
        return True, first_path, f"Đã đảm bảo lối tắt Desktop cho: {', '.join(created)}"
    return False, "", "Chưa tìm thấy WINWORD.EXE / EXCEL.EXE để tạo shortcut Office"


def ensure_desktop_shortcut(app_id, app_name):
    """
    Đảm bảo sau khi cài đặt, ứng dụng luôn có biểu tượng lối tắt trên Desktop:
    1. Kiểm tra trên Desktop xem đã có .lnk chuẩn chưa.
    2. Ưu tiên tìm file .exe thực tế theo KNOWN_APP_PATHS và tạo mới shortcut chuẩn.
    3. Nếu không có đường dẫn chuẩn, tìm trong Start Menu (đã lọc help/uninstall) và sao chép sang Desktop.
    """
    if app_id == "office365":
        return ensure_office365_desktop_shortcuts()

    user_desktop = get_user_desktop_dir()
    pub_desktop = get_public_desktop_dir()
    clean_app_name = app_name.split("(")[0].strip()
    keywords = APP_SEARCH_KEYWORDS.get(app_id, [clean_app_name.lower(), app_id.lower()])

    # 1. Kiểm tra xem trên User Desktop hoặc Public Desktop đã có file .lnk phù hợp chưa
    for d_dir in [user_desktop, pub_desktop]:
        if os.path.exists(d_dir):
            for f in os.listdir(d_dir):
                if f.lower().endswith(".lnk"):
                    f_lower = f.lower()
                    # Không nhận các link help
                    if any(ign in f_lower for ign in ["help", "manual", "readme", "uninstall", "gỡ cài đặt"]):
                        continue
                    for kw in keywords:
                        if kw in f_lower:
                            return True, os.path.join(d_dir, f), "Đã tồn tại trên Desktop"

    # 2. Ưu tiên tìm file .exe thực tế và tự tạo shortcut chuẩn sạch sẽ
    target_exe = None
    known_paths = KNOWN_APP_PATHS.get(app_id, [])
    for p in known_paths:
        if os.path.exists(p):
            target_exe = p
            break

    if target_exe:
        shortcut_file = os.path.join(user_desktop, f"{clean_app_name}.lnk")
        ok, res = create_shortcut(target_exe, shortcut_file, description=f"Khởi chạy {clean_app_name}")
        if ok:
            return True, shortcut_file, f"Đã tạo lối tắt {clean_app_name}.lnk trên Desktop"

    # 3. Nếu chưa tìm thấy .exe theo danh mục chuẩn, tìm trong Start Menu
    sm_links = search_start_menu_shortcuts(keywords)
    if sm_links:
        chosen_lnk = sm_links[0]
        target_lnk = os.path.join(user_desktop, os.path.basename(chosen_lnk))
        try:
            shutil.copy2(chosen_lnk, target_lnk)
            return True, target_lnk, f"Đã sao chép {os.path.basename(chosen_lnk)} sang Desktop"
        except Exception:
            pass

    return False, "", "Chưa tìm thấy file thực thi để tạo shortcut"

def install_portable_unikey(source_dir):
    """
    Cài đặt UniKey Portable vào thư mục hệ thống cố định và tạo lối tắt Desktop:
    1. Sao chép UniKeyNT.exe vào C:\\Program Files\\UniKey (hoặc AppData\\Programs)
    2. Tạo shortcut Desktop
    3. Tạo shortcut Startup (Khởi động cùng Windows)
    4. Chạy UniKey ngầm (detached) không bao giờ bị nghẽn hay chờ đợi
    """
    src_exe = os.path.join(source_dir, "UniKeyNT.exe")
    if not os.path.exists(src_exe):
        return False, "Không tìm thấy file nguồn UniKeyNT.exe"

    # Thư mục đích cố định
    target_dir = os.path.join(os.environ.get("ProgramFiles", "C:\\Program Files"), "UniKey")
    try:
        os.makedirs(target_dir, exist_ok=True)
    except PermissionError:
        target_dir = os.path.join(os.environ.get("LOCALAPPDATA", "C:\\"), "Programs", "UniKey")
        os.makedirs(target_dir, exist_ok=True)

    dest_exe = os.path.join(target_dir, "UniKeyNT.exe")
    try:
        shutil.copy2(src_exe, dest_exe)
        src_map = os.path.join(source_dir, "keymap.txt")
        if os.path.exists(src_map):
            shutil.copy2(src_map, os.path.join(target_dir, "keymap.txt"))
    except Exception as e:
        # Nếu đang chạy và bị khóa file, vẫn dùng dest_exe
        pass

    user_desktop = get_user_desktop_dir()
    shortcut_file = os.path.join(user_desktop, "UniKey.lnk")
    create_shortcut(dest_exe, shortcut_file, working_dir=target_dir, description="Bộ gõ tiếng Việt UniKey")

    # Tạo shortcut khởi động cùng Windows
    startup_dir = os.path.join(os.environ.get("APPDATA", ""), r"Microsoft\Windows\Start Menu\Programs\Startup")
    if os.path.exists(startup_dir):
        create_shortcut(dest_exe, os.path.join(startup_dir, "UniKey.lnk"), working_dir=target_dir)

    # Khởi chạy UniKey ngầm bằng os.startfile (ShellExecute) hoàn toàn tách biệt, không giữ pipe
    try:
        os.startfile(dest_exe)
    except Exception:
        pass

    return True, dest_exe

def install_portable_geek(source_dir):
    """
    Cài đặt Geek Uninstaller Portable vào thư mục hệ thống và tạo lối tắt Desktop
    """
    src_exe = os.path.join(source_dir, "geek.exe")
    if not os.path.exists(src_exe):
        return False, "Không tìm thấy file nguồn geek.exe"

    target_dir = os.path.join(os.environ.get("ProgramFiles", "C:\\Program Files"), "GeekUninstaller")
    try:
        os.makedirs(target_dir, exist_ok=True)
    except Exception:
        target_dir = os.path.join(os.environ.get("LOCALAPPDATA", "C:\\"), "Programs", "GeekUninstaller")
        os.makedirs(target_dir, exist_ok=True)

    dest_exe = os.path.join(target_dir, "geek.exe")
    try:
        shutil.copy2(src_exe, dest_exe)
    except Exception:
        pass

    user_desktop = get_user_desktop_dir()
    shortcut_file = os.path.join(user_desktop, "Geek Uninstaller.lnk")
    create_shortcut(dest_exe, shortcut_file, working_dir=target_dir, description="Gỡ bỏ phần mềm sạch sẽ Geek Uninstaller")

    return True, dest_exe

def install_portable_gpuz(source_dir):
    """
    Cài đặt TechPowerUp GPU-Z Portable vào thư mục hệ thống và tạo lối tắt Desktop
    """
    candidates = [f for f in os.listdir(source_dir) if f.lower().endswith(".exe") and "gpu-z" in f.lower()] if os.path.exists(source_dir) else []
    if not candidates:
        return False, "Không tìm thấy file nguồn GPU-Z.exe"
    src_exe = os.path.join(source_dir, candidates[0])

    target_dir = os.path.join(os.environ.get("ProgramFiles", "C:\\Program Files"), "GPU-Z")
    try:
        os.makedirs(target_dir, exist_ok=True)
    except Exception:
        target_dir = os.path.join(os.environ.get("LOCALAPPDATA", "C:\\"), "Programs", "GPU-Z")
        os.makedirs(target_dir, exist_ok=True)

    dest_exe = os.path.join(target_dir, "GPU-Z.exe")
    try:
        shutil.copy2(src_exe, dest_exe)
    except Exception:
        pass

    user_desktop = get_user_desktop_dir()
    shortcut_file = os.path.join(user_desktop, "TechPowerUp GPU-Z.lnk")
    create_shortcut(dest_exe, shortcut_file, working_dir=target_dir, description="Chẩn đoán Card đồ họa GPU-Z")
    return True, dest_exe

def install_portable_cpuz(source_dir):
    """
    Cài đặt CPUID CPU-Z Portable vào thư mục hệ thống và tạo lối tắt Desktop
    """
    if not os.path.exists(source_dir):
        return False, "Không tìm thấy thư mục nguồn CPU-Z"

    # Ưu tiên bản x64 nếu hệ điều hành 64-bit
    is_64 = os.environ.get("PROCESSOR_ARCHITECTURE") == "AMD64" or os.environ.get("PROCESSOR_ARCHITEW6432") == "AMD64"
    src_exe = os.path.join(source_dir, "cpuz_x64.exe" if is_64 and os.path.exists(os.path.join(source_dir, "cpuz_x64.exe")) else "cpuz_x32.exe")
    if not os.path.exists(src_exe):
        exes = [f for f in os.listdir(source_dir) if f.lower().endswith(".exe")]
        if exes:
            src_exe = os.path.join(source_dir, exes[0])
        else:
            return False, "Không tìm thấy file exe CPU-Z"

    target_dir = os.path.join(os.environ.get("ProgramFiles", "C:\\Program Files"), "CPUID", "CPU-Z")
    try:
        os.makedirs(target_dir, exist_ok=True)
    except Exception:
        target_dir = os.path.join(os.environ.get("LOCALAPPDATA", "C:\\"), "Programs", "CPUID", "CPU-Z")
        os.makedirs(target_dir, exist_ok=True)

    dest_exe = os.path.join(target_dir, "cpuz.exe")
    try:
        shutil.copy2(src_exe, dest_exe)
        src_ini = os.path.join(source_dir, "cpuz.ini")
        if os.path.exists(src_ini):
            shutil.copy2(src_ini, os.path.join(target_dir, "cpuz.ini"))
    except Exception:
        pass

    user_desktop = get_user_desktop_dir()
    shortcut_file = os.path.join(user_desktop, "CPUID CPU-Z.lnk")
    create_shortcut(dest_exe, shortcut_file, working_dir=target_dir, description="Thông tin chi tiết CPU và Mainboard CPU-Z")
    return True, dest_exe

def install_portable_hwmonitor(source_dir):
    """
    Cài đặt CPUID HWMonitor Portable vào thư mục hệ thống và tạo lối tắt Desktop
    """
    if not os.path.exists(source_dir):
        return False, "Không tìm thấy thư mục nguồn HWMonitor"

    is_64 = os.environ.get("PROCESSOR_ARCHITECTURE") == "AMD64" or os.environ.get("PROCESSOR_ARCHITEW6432") == "AMD64"
    src_exe = os.path.join(source_dir, "HWMonitor_x64.exe" if is_64 and os.path.exists(os.path.join(source_dir, "HWMonitor_x64.exe")) else "HWMonitor_x32.exe")
    if not os.path.exists(src_exe):
        exes = [f for f in os.listdir(source_dir) if f.lower().endswith(".exe")]
        if exes:
            src_exe = os.path.join(source_dir, exes[0])
        else:
            return False, "Không tìm thấy file exe HWMonitor"

    target_dir = os.path.join(os.environ.get("ProgramFiles", "C:\\Program Files"), "CPUID", "HWMonitor")
    try:
        os.makedirs(target_dir, exist_ok=True)
    except Exception:
        target_dir = os.path.join(os.environ.get("LOCALAPPDATA", "C:\\"), "Programs", "CPUID", "HWMonitor")
        os.makedirs(target_dir, exist_ok=True)

    dest_exe = os.path.join(target_dir, "HWMonitor.exe")
    try:
        shutil.copy2(src_exe, dest_exe)
        src_ini = os.path.join(source_dir, "hwmonitorw.ini")
        if os.path.exists(src_ini):
            shutil.copy2(src_ini, os.path.join(target_dir, "hwmonitorw.ini"))
    except Exception:
        pass

    user_desktop = get_user_desktop_dir()
    shortcut_file = os.path.join(user_desktop, "CPUID HWMonitor.lnk")
    create_shortcut(dest_exe, shortcut_file, working_dir=target_dir, description="Giám sát nhiệt độ và điện áp HWMonitor")
    return True, dest_exe

def install_portable_crystaldiskinfo(source_dir):
    """
    Cài đặt CrystalDiskInfo Portable vào thư mục hệ thống và tạo lối tắt Desktop
    """
    if not os.path.exists(source_dir):
        return False, "Không tìm thấy thư mục nguồn CrystalDiskInfo"

    target_dir = os.path.join(os.environ.get("ProgramFiles", "C:\\Program Files"), "CrystalDiskInfo")
    try:
        os.makedirs(target_dir, exist_ok=True)
    except Exception:
        target_dir = os.path.join(os.environ.get("LOCALAPPDATA", "C:\\"), "Programs", "CrystalDiskInfo")
        os.makedirs(target_dir, exist_ok=True)

    try:
        for item in os.listdir(source_dir):
            s = os.path.join(source_dir, item)
            d = os.path.join(target_dir, item)
            if os.path.isdir(s):
                if not os.path.exists(d):
                    shutil.copytree(s, d)
            else:
                shutil.copy2(s, d)
    except Exception:
        pass

    dest_exe = os.path.join(target_dir, "DiskInfo64.exe" if os.path.exists(os.path.join(target_dir, "DiskInfo64.exe")) else "DiskInfo32.exe")
    user_desktop = get_user_desktop_dir()
    shortcut_file = os.path.join(user_desktop, "CrystalDiskInfo.lnk")
    create_shortcut(dest_exe, shortcut_file, working_dir=target_dir, description="Kiểm tra sức khỏe ổ đĩa CrystalDiskInfo")
    return True, dest_exe

def is_app_installed(app_id):
    """
    Kiểm tra nhanh xem ứng dụng đã tồn tại sẵn trên hệ thống hay chưa:
    1. Với Office 365, bắt buộc phải có cả WINWORD.EXE và EXCEL.EXE thực tế.
    2. Kiểm tra qua các đường dẫn thực thi chuẩn KNOWN_APP_PATHS.
    3. Kiểm tra xem trên Desktop đã có shortcut (.lnk) tương ứng chưa.
    """
    if app_id == "office365":
        return has_office_desktop_apps()

    # 1. Kiểm tra known paths
    paths = KNOWN_APP_PATHS.get(app_id, [])
    for p in paths:
        if os.path.exists(p):
            return True, p

    # 2. Kiểm tra Start Menu & Desktop
    user_d = get_user_desktop_dir()
    pub_d = get_public_desktop_dir()
    keywords = APP_SEARCH_KEYWORDS.get(app_id, [app_id])
    for d in [user_d, pub_d]:
        if os.path.exists(d):
            for f in os.listdir(d):
                if f.lower().endswith(".lnk"):
                    f_lower = f.lower()
                    if any(ign in f_lower for ign in ["help", "manual", "readme", "uninstall", "gỡ cài đặt"]):
                        continue
                    if any(kw in f_lower for kw in keywords):
                        return True, os.path.join(d, f)
    return False, ""

