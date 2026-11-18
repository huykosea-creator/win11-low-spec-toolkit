# -*- coding: utf-8 -*-
"""
Software Repository & Offline Updater Service
Quan ly kiem tra phien ban, phat hien phan mem offline cu / moi / chua co,
va lap phuong an dong bo tai bo cai moi nhat ve thu muc software/
"""

import ctypes
from ctypes import wintypes
import json
import os
import re
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SOFTWARE_DIR = os.path.join(ROOT_DIR, "software")

# Catalog thong tin kenh tai truc tiep chinh thuc va cach kiem tra version moi nhat
OFFICIAL_CATALOG = {
    "chrome": {
        "name": "Google Chrome",
        "category": "Trình Duyệt",
        "official_site": "https://www.google.com/chrome/",
        "installer_name": "ChromeStandaloneSetup64.exe",
        "silent_args": ["/silent", "/install"],
        "download_url": "https://dl.google.com/chrome/install/latest/chrome_installer.exe",
        "version_check_type": "github_winget_manifest",
        "manifest_path": "g/Google/Chrome",
        "fallback_version": "131.0.6778.86",
    },
    "firefox": {
        "name": "Mozilla Firefox",
        "category": "Trình Duyệt",
        "official_site": "https://www.mozilla.org/firefox/",
        "installer_name": "Firefox_Setup_x64.exe",
        "silent_args": ["-ms"],
        "download_url": "https://download.mozilla.org/?product=firefox-latest-ssl&os=win64&lang=en-US",
        "version_check_type": "mozilla_api",
        "api_url": "https://product-details.mozilla.org/1.0/firefox_versions.json",
        "fallback_version": "133.0",
    },
    "7zip": {
        "name": "7-Zip (.7z / .zip)",
        "category": "Nén & Giải Nén",
        "official_site": "https://www.7-zip.org/",
        "installer_name": "7z-x64.exe",
        "silent_args": ["/S"],
        "download_url": "https://www.7-zip.org/a/7z2408-x64.exe",
        "version_check_type": "github_winget_manifest",
        "manifest_path": "7/7zip/7zip",
        "fallback_version": "24.08",
    },
    "winrar": {
        "name": "WinRAR (x64)",
        "category": "Nén & Giải Nén",
        "official_site": "https://www.rarlab.com/",
        "installer_name": "winrar-x64.exe",
        "silent_args": ["/S"],
        "download_url": "https://www.win-rar.com/fileadmin/winrar-versions/winrar/winrar-x64-701.exe",
        "version_check_type": "github_winget_manifest",
        "manifest_path": "r/RARLab/WinRAR",
        "fallback_version": "7.01",
    },
    "notepadplusplus": {
        "name": "Notepad++ (Code / Text)",
        "category": "Tiện Ích Văn Phòng",
        "official_site": "https://notepad-plus-plus.org/",
        "installer_name": "npp_installer_x64.exe",
        "silent_args": ["/S"],
        "download_url": "https://github.com/notepad-plus-plus/notepad-plus-plus/releases/download/v8.7.5/npp.8.7.5.Installer.x64.exe",
        "version_check_type": "github_release",
        "repo": "notepad-plus-plus/notepad-plus-plus",
        "asset_pattern": r"npp\..*\.Installer\.x64\.exe$",
        "fallback_version": "8.7.5",
    },
    "vlc": {
        "name": "VLC Media Player",
        "category": "Media",
        "official_site": "https://www.videolan.org/vlc/",
        "installer_name": "vlc-win64.exe",
        "silent_args": ["/S"],
        "download_url": "https://get.videolan.org/vlc/3.0.21/win64/vlc-3.0.21-win64.exe",
        "version_check_type": "github_winget_manifest",
        "manifest_path": "v/VideoLAN/VLC",
        "fallback_version": "3.0.21",
    },
    "rustdesk": {
        "name": "RustDesk Remote Desktop",
        "category": "Điều Khiển Từ Xa",
        "official_site": "https://rustdesk.com/",
        "installer_name": "rustdesk.exe",
        "silent_args": ["--silent-install"],
        "download_url": "https://github.com/rustdesk/rustdesk/releases/download/1.3.7/rustdesk-1.3.7-x86_64.exe",
        "version_check_type": "github_release",
        "repo": "rustdesk/rustdesk",
        "asset_pattern": r"rustdesk-.*-x86_64\.exe$",
        "fallback_version": "1.3.7",
    },
    "anydesk": {
        "name": "AnyDesk (Remote Desktop)",
        "category": "Điều Khiển Từ Xa",
        "official_site": "https://anydesk.com/",
        "installer_name": "AnyDesk.exe",
        "silent_args": ["--install", "C:\\Program Files (x86)\\AnyDesk", "--start-with-win", "--silent"],
        "download_url": "https://download.anydesk.com/AnyDesk.exe",
        "version_check_type": "custom",
        "fallback_version": "9.8.0",
    },
    "foxit-reader": {
        "name": "Foxit PDF Reader",
        "category": "Văn Phòng & PDF",
        "official_site": "https://www.foxit.com/pdf-reader/",
        "installer_name": "FoxitPDFReader_Setup.exe",
        "silent_args": ["/S"],
        "download_url": "https://cdn01.foxitsoftware.com/product/reader/desktop/win/latest/FoxitPDFReader_Setup.exe",
        "version_check_type": "github_winget_manifest",
        "manifest_path": "f/Foxit/FoxitReader",
        "fallback_version": "2024.3.0.26795",
    },
    "git": {
        "name": "Git for Windows (x64)",
        "category": "Dev Tools",
        "official_site": "https://git-scm.com/",
        "installer_name": "Git-64-bit.exe",
        "silent_args": ["/VERYSILENT", "/NORESTART", "/NOCANCEL", "/SP-"],
        "download_url": "https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.1/Git-2.47.1-64-bit.exe",
        "version_check_type": "github_release",
        "repo": "git-for-windows/git",
        "asset_pattern": r"Git-.*-64-bit\.exe$",
        "fallback_version": "2.47.1",
    },
    "vscode": {
        "name": "Visual Studio Code (x64)",
        "category": "Dev Tools",
        "official_site": "https://code.visualstudio.com/",
        "installer_name": "VSCodeUserSetup-x64.exe",
        "silent_args": ["/VERYSILENT", "/NORESTART", "/NOCANCEL", "/SP-"],
        "download_url": "https://update.code.visualstudio.com/latest/win32-x64-user/stable",
        "version_check_type": "github_winget_manifest",
        "manifest_path": "m/Microsoft/VisualStudioCode",
        "fallback_version": "1.95.3",
    },
    "vcredist-x64": {
        "name": "VC++ 2015-2022 Redist (x64)",
        "category": "Thư Viện Nền Tảng",
        "official_site": "https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist",
        "installer_name": "VC_redist.x64.exe",
        "silent_args": ["/install", "/quiet", "/norestart"],
        "download_url": "https://aka.ms/vs/17/release/vc_redist.x64.exe",
        "version_check_type": "github_winget_manifest",
        "manifest_path": "m/Microsoft/VCRedist/2015+/x64",
        "fallback_version": "14.42.34433.0",
    },
    "vcredist-x86": {
        "name": "VC++ 2015-2022 Redist (x86)",
        "category": "Thư Viện Nền Tảng",
        "official_site": "https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist",
        "installer_name": "VC_redist.x86.exe",
        "silent_args": ["/install", "/quiet", "/norestart"],
        "download_url": "https://aka.ms/vs/17/release/vc_redist.x86.exe",
        "version_check_type": "github_winget_manifest",
        "manifest_path": "m/Microsoft/VCRedist/2015+/x86",
        "fallback_version": "14.42.34433.0",
    },
}

# Trang thai download dong bo toan cuc
sync_lock = threading.Lock()
sync_state = {
    "status": "idle",       # idle, checking, syncing, paused, stopped, completed, error
    "current_app_id": "",
    "current_app_name": "",
    "current_file": "",
    "downloaded_bytes": 0,
    "total_bytes": 0,
    "progress_percent": 0,
    "speed_kbps": 0,
    "eta_seconds": 0,
    "current_index": 0,
    "total_apps": 0,
    "synced_apps": [],
    "logs": [],
    "stop_requested": False,
    "pause_requested": False,
}


def add_sync_log(msg: str):
    timestamp = time.strftime("[%H:%M:%S]")
    line = f"{timestamp} {msg}"
    with sync_lock:
        sync_state["logs"].append(line)
        if len(sync_state["logs"]) > 200:
            sync_state["logs"] = sync_state["logs"][-200:]
    try:
        print(f"[SYNC] {line}")
    except Exception:
        pass


def get_pe_file_version(filepath: str) -> str:
    """Lay phien ban FileVersion / ProductVersion tu file PE (.exe / .dll) bang Win32 API."""
    if not os.path.isfile(filepath):
        return ""
    try:
        size = ctypes.windll.version.GetFileVersionInfoSizeW(filepath, None)
        if size == 0:
            return ""
        res = ctypes.create_string_buffer(size)
        if not ctypes.windll.version.GetFileVersionInfoW(filepath, None, size, res):
            return ""
        uLen = wintypes.UINT()
        lpBuffer = wintypes.LPVOID()
        if not ctypes.windll.version.VerQueryValueW(res, r"\\", ctypes.byref(lpBuffer), ctypes.byref(uLen)):
            return ""

        class VS_FIXEDFILEINFO(ctypes.Structure):
            _fields_ = [
                ("dwSignature", wintypes.DWORD), ("dwStrucVersion", wintypes.DWORD),
                ("dwFileVersionMS", wintypes.DWORD), ("dwFileVersionLS", wintypes.DWORD),
                ("dwProductVersionMS", wintypes.DWORD), ("dwProductVersionLS", wintypes.DWORD),
                ("dwFileFlagsMask", wintypes.DWORD), ("dwFileFlags", wintypes.DWORD),
                ("dwFileOS", wintypes.DWORD), ("dwFileType", wintypes.DWORD),
                ("dwFileSubtype", wintypes.DWORD), ("dwFileDateMS", wintypes.DWORD),
                ("dwFileDateLS", wintypes.DWORD),
            ]

        vs = ctypes.cast(lpBuffer, ctypes.POINTER(VS_FIXEDFILEINFO)).contents
        vms = vs.dwProductVersionMS or vs.dwFileVersionMS
        vls = vs.dwProductVersionLS or vs.dwFileVersionLS
        ver_str = f"{vms >> 16}.{vms & 0xFFFF}.{vls >> 16}.{vls & 0xFFFF}"
        # Cat bo cac duoi .0 khong can thiet o cuoi neu co
        parts = ver_str.split(".")
        while len(parts) > 2 and parts[-1] == "0":
            parts.pop()
        return ".".join(parts)
    except Exception:
        return ""


def get_local_software_status(app_id: str) -> dict:
    """Kiem tra xem trong thu muc software/<app_id> da co bo cai offline chua, phien ban la gi."""
    app_dir = os.path.join(SOFTWARE_DIR, app_id)
    if not os.path.isdir(app_dir):
        return {
            "has_offline": False,
            "filename": "",
            "filepath": "",
            "filesize_mb": 0.0,
            "version": "",
            "mtime": "",
        }

    # Tim file exe/msi trong thu muc
    candidate_files = []
    for f in os.listdir(app_dir):
        fp = os.path.join(app_dir, f)
        if os.path.isfile(fp) and f.lower().endswith((".exe", ".msi")):
            candidate_files.append((f, fp, os.path.getsize(fp), os.path.getmtime(fp)))

    if not candidate_files:
        return {
            "has_offline": False,
            "filename": "",
            "filepath": "",
            "filesize_mb": 0.0,
            "version": "",
            "mtime": "",
        }

    # Uu tien file exe lon nhat hoac msi
    candidate_files.sort(key=lambda x: x[2], reverse=True)
    best = candidate_files[0]
    fname, fpath, fsize, fmtime = best

    # Doc version tu header PE hoac config.json neu co
    detected_ver = get_pe_file_version(fpath)
    cfg_path = os.path.join(app_dir, "config.json")
    if not detected_ver and os.path.isfile(cfg_path):
        try:
            with open(cfg_path, "r", encoding="utf-8") as cfp:
                cdata = json.load(cfp)
                detected_ver = cdata.get("version", "")
        except Exception:
            pass

    return {
        "has_offline": True,
        "filename": fname,
        "filepath": fpath,
        "filesize_mb": round(fsize / (1024 * 1024), 2),
        "version": detected_ver or "Sẵn sàng",
        "mtime": time.strftime("%d/%m/%Y %H:%M", time.localtime(fmtime)),
    }


def fetch_latest_version_online(app_id: str, meta: dict) -> tuple:
    """Tra cuu phien ban moi nhat tu cac API chinh hang."""
    check_type = meta.get("version_check_type")
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

    try:
        if check_type == "github_release":
            repo = meta.get("repo", "")
            url = f"https://api.github.com/repos/{repo}/releases/latest"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                tag = data.get("tag_name", "").lstrip("vV")
                # Tim download url truc tiep tu assets neu co asset_pattern
                pattern = meta.get("asset_pattern")
                best_asset_url = ""
                if pattern and isinstance(data.get("assets"), list):
                    for a in data["assets"]:
                        aname = a.get("name", "")
                        if re.search(pattern, aname, re.IGNORECASE):
                            best_asset_url = a.get("browser_download_url", "")
                            break
                return tag or meta.get("fallback_version", ""), best_asset_url or meta.get("download_url", "")

        elif check_type == "mozilla_api":
            url = meta.get("api_url", "https://product-details.mozilla.org/1.0/firefox_versions.json")
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                latest_ver = data.get("LATEST_FIREFOX_VERSION", "")
                return latest_ver or meta.get("fallback_version", ""), meta.get("download_url", "")

        elif check_type == "github_winget_manifest":
            mpath = meta.get("manifest_path", "")
            url = f"https://api.github.com/repos/microsoft/winget-pkgs/contents/manifests/{mpath}"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=8) as resp:
                items = json.loads(resp.read().decode("utf-8"))
                valid_vers = []
                for it in items:
                    vname = it.get("name", "")
                    if re.match(r"^\d+(\.\d+)*", vname):
                        valid_vers.append(vname)
                if valid_vers:
                    return valid_vers[-1], meta.get("download_url", "")
    except Exception as e:
        pass

    return meta.get("fallback_version", "Mới nhất"), meta.get("download_url", "")


def compare_versions(local_v: str, latest_v: str) -> str:
    """So sanh 2 chuoi phien ban. Tra ve: 'latest', 'outdated', 'missing', 'unknown'."""
    if not local_v or local_v == "Chưa có":
        return "missing"
    if not latest_v or latest_v in ("Mới nhất", "Sẵn sàng"):
        return "ready"

    # Chuan hoa chuoi so
    p_local = [int(x) for x in re.findall(r"\d+", local_v)]
    p_latest = [int(x) for x in re.findall(r"\d+", latest_v)]

    if not p_local or not p_latest:
        return "ready"

    # Can bang do dai
    max_len = max(len(p_local), len(p_latest))
    p_local.extend([0] * (max_len - len(p_local)))
    p_latest.extend([0] * (max_len - len(p_latest)))

    if p_local >= p_latest:
        return "latest"
    else:
        return "outdated"


def check_all_software_updates() -> dict:
    """Kiem tra toan bo tinh trang phan mem trong software/: co san, cu hay moi nhat."""
    results = []
    missing_count = 0
    outdated_count = 0
    latest_count = 0

    for app_id, meta in OFFICIAL_CATALOG.items():
        local_st = get_local_software_status(app_id)
        latest_ver, dl_url = fetch_latest_version_online(app_id, meta)
        cmp_status = compare_versions(local_st.get("version"), latest_ver)

        if not local_st["has_offline"]:
            status_badge = "missing"
            status_text = "Chưa Tải Bộ Cài"
            missing_count += 1
        elif cmp_status == "outdated":
            status_badge = "outdated"
            status_text = "Có Bản Cũ (Cần Update)"
            outdated_count += 1
        else:
            status_badge = "latest"
            status_text = "Bản Mới Nhất"
            latest_count += 1

        results.append({
            "id": app_id,
            "name": meta["name"],
            "category": meta["category"],
            "has_offline": local_st["has_offline"],
            "filename": local_st["filename"],
            "filesize_mb": local_st["filesize_mb"],
            "local_version": local_st["version"] or "Chưa có",
            "latest_version": latest_ver,
            "download_url": dl_url,
            "status_badge": status_badge,
            "status_text": status_text,
            "mtime": local_st["mtime"],
        })

    return {
        "status": "ok",
        "total": len(results),
        "missing_count": missing_count,
        "outdated_count": outdated_count,
        "latest_count": latest_count,
        "items": results,
    }


def download_file_with_progress(url: str, dest_path: str, chunk_size: int = 65536) -> bool:
    """Tai file truc tiep co do tien do %, toc do KB/s va cap nhat vao sync_state."""
    tmp_path = dest_path + ".downloading"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    req = urllib.request.Request(url, headers=headers)

    t0 = time.time()
    last_speed_time = t0
    last_speed_bytes = 0

    try:
        with urllib.request.urlopen(req, timeout=30) as resp, open(tmp_path, "wb") as out_fp:
            total_len = int(resp.headers.get("Content-Length") or 0)
            downloaded = 0
            with sync_lock:
                sync_state["total_bytes"] = total_len
                sync_state["downloaded_bytes"] = 0
                sync_state["progress_percent"] = 0

            while True:
                with sync_lock:
                    if sync_state["stop_requested"]:
                        add_sync_log("Đã dừng tiến trình tải theo yêu cầu.")
                        break

                while True:
                    with sync_lock:
                        if not sync_state["pause_requested"] or sync_state["stop_requested"]:
                            break
                    time.sleep(0.3)

                with sync_lock:
                    if sync_state["stop_requested"]:
                        break

                chunk = resp.read(chunk_size)
                if not chunk:
                    break
                out_fp.write(chunk)
                downloaded += len(chunk)

                now = time.time()
                pct = int((downloaded / total_len * 100)) if total_len > 0 else 50
                if now - last_speed_time >= 0.5:
                    delta_t = now - last_speed_time
                    delta_b = downloaded - last_speed_bytes
                    speed_kbps = round((delta_b / 1024.0) / delta_t, 1)
                    rem_bytes = max(0, total_len - downloaded)
                    eta_sec = int(rem_bytes / (speed_kbps * 1024)) if speed_kbps > 0 else 0

                    last_speed_time = now
                    last_speed_bytes = downloaded
                    with sync_lock:
                        sync_state["downloaded_bytes"] = downloaded
                        sync_state["progress_percent"] = pct
                        sync_state["speed_kbps"] = speed_kbps
                        sync_state["eta_seconds"] = eta_sec

        with sync_lock:
            if sync_state["stop_requested"]:
                if os.path.isfile(tmp_path):
                    try:
                        os.remove(tmp_path)
                    except Exception:
                        pass
                return False

        if os.path.isfile(dest_path):
            try:
                os.remove(dest_path)
            except Exception:
                pass
        os.rename(tmp_path, dest_path)
        return True

    except Exception as exc:
        add_sync_log(f"Lỗi khi tải từ {url}: {exc}")
        if os.path.isfile(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass
        return False


def run_sync_plan_worker(selected_app_ids: list):
    """Worker chay nen dong bo tai cac file offline ve thu muc software/."""
    global sync_state
    with sync_lock:
        sync_state["status"] = "syncing"
        sync_state["current_index"] = 0
        sync_state["total_apps"] = len(selected_app_ids)
        sync_state["stop_requested"] = False
        sync_state["pause_requested"] = False
        sync_state["synced_apps"] = []
        sync_state["logs"] = []

    add_sync_log(f"Khởi động tiến trình đồng bộ {len(selected_app_ids)} phần mềm về thư mục software/...")

    for idx, app_id in enumerate(selected_app_ids, start=1):
        with sync_lock:
            if sync_state["stop_requested"]:
                break

        meta = OFFICIAL_CATALOG.get(app_id)
        if not meta:
            continue

        app_name = meta["name"]
        app_dir = os.path.join(SOFTWARE_DIR, app_id)
        os.makedirs(app_dir, exist_ok=True)

        target_file = meta.get("installer_name", f"{app_id}_setup.exe")
        target_path = os.path.join(app_dir, target_file)
        dl_url = meta.get("download_url", "")

        with sync_lock:
            sync_state["current_index"] = idx
            sync_state["current_app_id"] = app_id
            sync_state["current_app_name"] = app_name
            sync_state["current_file"] = target_file
            sync_state["progress_percent"] = 5
            sync_state["speed_kbps"] = 0

        add_sync_log(f"[{idx}/{len(selected_app_ids)}] Bắt đầu tải {app_name} -> software/{app_id}/{target_file}...")

        ok = download_file_with_progress(dl_url, target_path)

        if ok and os.path.isfile(target_path):
            fsize_mb = round(os.path.getsize(target_path) / (1024 * 1024), 2)
            detected_ver = get_pe_file_version(target_path) or meta.get("fallback_version", "")
            add_sync_log(f"   -> [XONG] Đã lưu {target_file} ({fsize_mb} MB, Ver: {detected_ver})!")

            # Tao hoac cap nhat file config.json cho app nay
            cfg_path = os.path.join(app_dir, "config.json")
            cfg_data = {
                "name": app_name,
                "file": target_file,
                "version": detected_ver,
                "args": meta.get("silent_args", ["/S"]),
                "last_updated": time.strftime("%Y-%m-%d %H:%M:%S"),
            }
            try:
                with open(cfg_path, "w", encoding="utf-8") as cfp:
                    json.dump(cfg_data, cfp, indent=2, ensure_ascii=False)
            except Exception:
                pass

            with sync_lock:
                sync_state["synced_apps"].append({"id": app_id, "name": app_name, "size_mb": fsize_mb})
        else:
            with sync_lock:
                if sync_state["stop_requested"]:
                    add_sync_log(f"   -> Đã dừng tải {app_name}.")
                    break
                else:
                    add_sync_log(f"   -> [LỖI] Không thể tải gói {app_name} từ {dl_url}")

    with sync_lock:
        if sync_state["stop_requested"]:
            sync_state["status"] = "stopped"
            add_sync_log("Đã dừng tiến trình đồng bộ theo yêu cầu.")
        else:
            sync_state["status"] = "completed"
            add_sync_log(f"🎉 Hoàn tất quá trình đồng bộ! Đã tải thành công {len(sync_state['synced_apps'])}/{len(selected_app_ids)} phần mềm vào thư mục software/.")


def start_sync_plan_async(app_ids: list = None) -> dict:
    """Khoi dong tien trinh tai dong bo bat dong bo."""
    with sync_lock:
        if sync_state["status"] == "syncing":
            return {"status": "error", "message": "Đang có tiến trình đồng bộ phần mềm khác đang chạy!"}

    if not app_ids:
        # Neu khong truyen, mac dinh kiem tra va tai tat ca app con thieu hoac cu
        chk = check_all_software_updates()
        app_ids = [it["id"] for it in chk.get("items", []) if it["status_badge"] in ("missing", "outdated")]

    if not app_ids:
        return {"status": "ok", "message": "Tất cả phần mềm offline đều đã đầy đủ và là phiên bản mới nhất!"}

    t = threading.Thread(target=run_sync_plan_worker, args=(app_ids,), daemon=True)
    t.start()
    return {"status": "started", "total": len(app_ids), "app_ids": app_ids}


def get_sync_progress_snapshot() -> dict:
    """Lay snapshot tien do tai hien tai."""
    with sync_lock:
        return dict(sync_state)
