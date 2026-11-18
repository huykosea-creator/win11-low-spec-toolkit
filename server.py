"""
Windows 11 Low-Spec Toolkit & Technician Hub - Local WebUI Server
Chạy nội bộ hoàn toàn trên localhost (127.0.0.1), minh bạch và an toàn chuẩn doanh nghiệp.
"""

import ctypes
import datetime
import glob
import importlib
import json
import os
import re
import shutil
import ssl
import subprocess
import sys
import tempfile
import threading
import time
import traceback
import urllib.parse
import urllib.request
import webbrowser
import winreg
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HOST = "127.0.0.1"
PORT = 5678
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
SCANS_DIR = os.path.join(ROOT_DIR, "scans")

if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Trạng thái tiến trình cài đặt tuần tự
install_lock = threading.RLock()
install_state = {
    "session_id": "",
    "status": "idle",
    "current_app": "",
    "current_package": "",
    "current_index": 0,
    "total_apps": 0,
    "step_status": "idle",
    "current_stage": "",
    "sub_progress": 0,
    "sub_detail": "",
    "delay_remaining": 0,
    "queue": [],
    "logs": [],
}

install_control = {
    "paused": False,
    "stopped": False,
    "skipped": False,
    "skip_index": 0,
    "fast_forward_delay": False,
    "current_proc": None,
    "lock": threading.Lock(),
}

_CACHED_WINGET_BIN = None
_CHECKED_WINGET = False


def add_log(msg: str) -> None:
    timestamp = time.strftime("[%H:%M:%S] ")
    full_msg = f"{timestamp}{msg}"
    try:
        print(full_msg)
    except Exception:
        print(full_msg.encode("ascii", errors="replace").decode("ascii", errors="replace"))
    with install_lock:
        install_state["logs"].append(full_msg)
        while len(install_state["logs"]) > 200:
            install_state["logs"].pop(0)


def get_active_install_mode_block():
    """
    Kiem tra xem he thong co dang trong che do cai dat phan mem hay khong.
    Neu co ('installing' hoac 'paused'), tra ve (True, payload) de chan cac buoc quet may tinh.
    """
    with install_lock:
        st = str(install_state.get("status") or "idle").strip().lower()
        if st in ("installing", "paused"):
            cur_app = install_state.get("current_app") or "phần mềm"
            cur_idx = install_state.get("current_index") or 0
            tot = install_state.get("total_apps") or 0
            state_label = "đang cài đặt" if st == "installing" else "đang tạm dừng cài đặt"
            progress_txt = f" ({cur_idx}/{tot}: {cur_app})" if tot else ""
            return True, {
                "status": "error",
                "code": "INSTALL_MODE_ACTIVE",
                "http_status": 409,
                "install_status": st,
                "current_app": cur_app,
                "current_index": cur_idx,
                "total_apps": tot,
                "message": f"À user ơi! Tool đang ở trong chế độ cài đặt phần mềm ({state_label}{progress_txt}), do đó không thể thực hiện bước quét máy tính nhé! Vui lòng đợi cài xong, bỏ qua gói đang treo hoặc bấm Dừng tiến trình trước khi quét.",
            }
    return False, None


def find_winget_exe():
    """Tìm đường dẫn thực thi winget.exe sẵn có trên Windows 10/11."""
    global _CHECKED_WINGET, _CACHED_WINGET_BIN
    if _CHECKED_WINGET and _CACHED_WINGET_BIN and os.path.isfile(_CACHED_WINGET_BIN):
        return _CACHED_WINGET_BIN

    candidates = []
    which_p = shutil.which("winget")
    if which_p:
        candidates.append(which_p)

    local_p = os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WindowsApps\winget.exe")
    if local_p and "%" not in local_p:
        candidates.append(local_p)

    for p in glob.glob(r"C:\Users\*\AppData\Local\Microsoft\WindowsApps\winget.exe"):
        if p not in candidates:
            candidates.append(p)

    for p in glob.glob(r"C:\Program Files\WindowsApps\Microsoft.DesktopAppInstaller_*_x64__*\winget.exe"):
        if p not in candidates:
            candidates.append(p)

    sys32 = os.path.expandvars(r"%SystemRoot%\System32\winget.exe")
    if sys32 and os.path.isfile(sys32):
        candidates.append(sys32)

    for cand in candidates:
        try:
            res = subprocess.run(
                [cand, "--version"],
                capture_output=True,
                text=True,
                timeout=4,
            )
            if res.returncode == 0:
                _CACHED_WINGET_BIN = cand
                _CHECKED_WINGET = True
                return cand
        except Exception:
            continue

    _CHECKED_WINGET = True
    _CACHED_WINGET_BIN = None
    return None


def terminate_active_install_process(kill_tree: bool = True) -> None:
    with install_control["lock"]:
        proc = install_control.get("current_proc")
    if proc is not None:
        if kill_tree and os.name == "nt" and getattr(proc, "pid", None):
            try:
                no_win = getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000)
                subprocess.run(
                    ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                    capture_output=True,
                    timeout=5,
                    creationflags=no_win,
                )
            except Exception:
                pass
        try:
            proc.terminate()
            try:
                proc.wait(timeout=2)
            except Exception:
                proc.kill()
        except Exception:
            pass


def handle_install_control(action: str, target_index: int = 0) -> dict:
    act = (action or "").strip().lower()
    if act == "pause":
        install_control["paused"] = True
        with install_lock:
            if install_state["status"] == "installing":
                install_state["status"] = "paused"
                install_state["step_status"] = "paused"
                install_state["current_stage"] = "Đang tạm dừng cài đặt (Bấm Tiếp Tục để chạy)..."
        add_log("[TẠM DỪNG] Kỹ thuật viên đã tạm dừng quy trình cài đặt.")
        return {"ok": True, "action": act, "status": "paused"}

    if act == "resume":
        install_control["paused"] = False
        with install_lock:
            if install_state["status"] == "paused":
                install_state["status"] = "installing"
                install_state["step_status"] = "installing"
        add_log("[TIẾP TỤC] Kỹ thuật viên tiếp tục quy trình cài đặt.")
        return {"ok": True, "action": act, "status": "installing"}

    if act == "skip":
        with install_lock:
            cur_status = install_state.get("status", "idle")
            cur_step = install_state.get("step_status", "idle")
            cur_idx = int(install_state.get("current_index", 0) or 0)
            cur_app = install_state.get("current_app", "") or "gói hiện tại"

        if cur_status not in ("installing", "paused"):
            return {"ok": False, "error": "Hiện không có tiến trình nào đang cài đặt để bỏ qua."}

        if target_index > 0 and cur_idx != target_index:
            return {
                "ok": False,
                "stale": True,
                "message": "Phần mềm trước đã xử lý xong và chuyển sang gói kế tiếp.",
            }

        if cur_step == "delay":
            install_control["fast_forward_delay"] = True
            return {
                "ok": True,
                "action": "skip",
                "fast_forwarded_delay": True,
                "message": "Gói hiện tại đã hoàn tất, đang chuyển nhanh sang gói kế tiếp...",
            }

        install_control["skipped"] = True
        install_control["skip_index"] = cur_idx
        install_control["paused"] = False
        with install_lock:
            install_state["status"] = "installing"
            install_state["step_status"] = "skipping"
            install_state["current_stage"] = f"Đang bỏ qua {cur_app} (do treo hoặc lỗi)..."
            queue = install_state.get("queue", [])
            if 1 <= cur_idx <= len(queue):
                queue[cur_idx - 1]["stage"] = "Đang dừng để bỏ qua..."
        add_log(f"[BỎ QUA] KTV yêu cầu bỏ qua gói [{cur_idx}] {cur_app} và chuyển sang phần mềm tiếp theo...")
        terminate_active_install_process(kill_tree=True)
        return {
            "ok": True,
            "action": "skip",
            "status": "skipping",
            "index": cur_idx,
            "app": cur_app,
            "message": f"Đang bỏ qua {cur_app} để cài phần mềm tiếp theo...",
        }

    if act == "stop":
        install_control["stopped"] = True
        install_control["paused"] = False
        install_control["skipped"] = False
        terminate_active_install_process(kill_tree=True)
        with install_lock:
            install_state["status"] = "stopped"
            install_state["step_status"] = "stopped"
            install_state["current_stage"] = "Đã dừng quy trình cài đặt theo yêu cầu của KTV."
            for q_item in install_state.get("queue", []):
                if q_item.get("status") in ("pending", "installing"):
                    q_item["status"] = "stopped"
                    q_item["stage"] = "Đã dừng bởi KTV"
        add_log("[DỪNG HẲN] Kỹ thuật viên đã dừng toàn bộ quy trình cài đặt!")
        return {"ok": True, "action": act, "status": "stopped"}

    return {"ok": False, "error": f"Lệnh không hợp lệ: {act}"}


def run_command_with_live_logs(cmd_args: list, timeout: int = 300, on_progress=None):
    """Thực thi gói cài đặt bằng danh sách tham số an toàn (shell=False) và đọc log trực tiếp."""
    if install_control["stopped"]:
        return -888, "Stopped by user"
    if install_control["skipped"]:
        return -777, "Skipped by user"

    try:
        proc = subprocess.Popen(
            cmd_args,
            stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
            shell=False,
        )
    except Exception as exc:
        return -1, str(exc)

    with install_control["lock"]:
        install_control["current_proc"] = proc

    def reader():
        buf = []
        last_progress_time = 0.0
        try:
            while True:
                if install_control["stopped"] or install_control["skipped"]:
                    break
                ch = proc.stdout.read(1)
                if not ch:
                    break
                if ch in ("\r", "\n"):
                    line = "".join(buf).strip()
                    buf.clear()
                    if not line:
                        continue
                    now = time.time()
                    pct_m = re.search(r"(\d{1,3})%", line)
                    if pct_m and on_progress:
                        try:
                            pct_val = int(pct_m.group(1))
                            on_progress(pct_val, f"{pct_val}%", "downloading")
                        except Exception:
                            pass
                    elif on_progress and any(
                        line.startswith(k) for k in ("Installing", "Starting package", "Extracting", "msiexec")
                    ):
                        on_progress(80, line[:60], "installing")

                    is_progress_bar = any(tok in line for tok in ("█", "▒", "MB /", "KB /"))
                    if is_progress_bar:
                        if now - last_progress_time >= 0.8:
                            last_progress_time = now
                            add_log("   -> " + line[:140])
                    else:
                        add_log("   -> " + line[:240])
                else:
                    buf.append(ch)
                    if len(buf) > 400:
                        buf = buf[-400:]
            if buf:
                tail = "".join(buf).strip()
                if tail:
                    add_log("   -> " + tail[:240])
        except Exception:
            pass
        finally:
            try:
                if proc.stdout:
                    proc.stdout.close()
            except Exception:
                pass

    t_reader = threading.Thread(target=reader, daemon=True)
    t_reader.start()

    start_wait = time.time()
    last_hb = start_wait
    hb_pct = 15
    while True:
        if install_control["stopped"]:
            terminate_active_install_process(kill_tree=True)
            t_reader.join(timeout=1.5)
            with install_control["lock"]:
                install_control["current_proc"] = None
            return -888, "Stopped by user"

        if install_control["skipped"]:
            terminate_active_install_process(kill_tree=True)
            t_reader.join(timeout=1.5)
            with install_control["lock"]:
                install_control["current_proc"] = None
            return -777, "Skipped by user"

        rc = proc.poll()
        if rc is not None:
            t_reader.join(timeout=1.5)
            with install_control["lock"]:
                install_control["current_proc"] = None
            return rc, ""

        now_wait = time.time()
        if now_wait - start_wait > timeout:
            add_log(f"[CẢNH BÁO] Quá thời gian cài đặt tối đa ({timeout}s), tự động giải phóng tiến trình...")
            terminate_active_install_process(kill_tree=True)
            t_reader.join(timeout=1.5)
            with install_control["lock"]:
                install_control["current_proc"] = None
            return -999, "Timeout"

        if on_progress and (now_wait - last_hb >= 3.0):
            last_hb = now_wait
            elapsed_s = int(now_wait - start_wait)
            hb_pct = min(82, hb_pct + 2)
            try:
                with install_lock:
                    cur_sub = int(install_state.get("sub_progress") or 0)
                    if cur_sub < hb_pct:
                        install_state["sub_progress"] = hb_pct
                        install_state["sub_detail"] = f"Đang xử lý ({elapsed_s}s)..."
                        idx_cur = int(install_state.get("current_index") or 0)
                        q_list = install_state.get("queue") or []
                        if 1 <= idx_cur <= len(q_list):
                            q_list[idx_cur - 1]["sub_progress"] = hb_pct
            except Exception:
                pass

        time.sleep(0.25)


def _build_office365_odt_xml(log_dir: str = "") -> str:
    """Tạo file XML cấu hình chuẩn Office Deployment Tool (Word, Excel, PowerPoint, Outlook, OneNote)."""
    is_64 = (
        os.environ.get("PROCESSOR_ARCHITECTURE") == "AMD64"
        or os.environ.get("PROCESSOR_ARCHITEW6432") == "AMD64"
    )
    arch = "64" if is_64 else "32"
    logging_line = f'  <Logging Level="Standard" Path="{log_dir}" />\n' if log_dir else ""
    return (
        "<Configuration>\n"
        f'  <Add OfficeClientEdition="{arch}" Channel="Current">\n'
        '    <Product ID="O365ProPlusRetail">\n'
        '      <Language ID="en-us" />\n'
        '      <ExcludeApp ID="Groove" />\n'
        '      <ExcludeApp ID="Lync" />\n'
        '      <ExcludeApp ID="Bing" />\n'
        '      <ExcludeApp ID="Teams" />\n'
        "    </Product>\n"
        "  </Add>\n"
        '  <Property Name="FORCEAPPSHUTDOWN" Value="TRUE" />\n'
        '  <Updates Enabled="TRUE" />\n'
        '  <Display Level="None" AcceptEULA="TRUE" />\n'
        f"{logging_line}"
        "</Configuration>\n"
    )


def _get_dir_size_mb(path: str, stop_event=None) -> float:
    total = 0
    if not path or not os.path.isdir(path):
        return 0.0
    try:
        for root, _, files in os.walk(path):
            if (stop_event and stop_event.is_set()) or install_control["stopped"] or install_control["skipped"]:
                break
            for fn in files:
                try:
                    total += os.path.getsize(os.path.join(root, fn))
                except OSError:
                    pass
    except Exception:
        pass
    return total / (1024.0 * 1024.0)


def install_microsoft_office_365(winget_bin, software_app_dir: str, sm, on_progress=None) -> tuple:
    """
    Quy trình cài đặt chuyên biệt cho Microsoft Office 365:
    - Tránh lỗi winget chạy OfficeSetup.exe / setup.exe không kèm XML dẫn tới báo OK giả nhưng thiếu Word/Excel.
    - Hỗ trợ bộ cài Offline trong software/office365/ (setup.exe + .xml) hoặc tự tải ODT chuẩn từ Microsoft CDN.
    - Theo dõi dung lượng thư mục Office thực tế & xác minh có đủ WINWORD.EXE + EXCEL.EXE trước khi báo thành công.
    """
    has_both, word_path = sm.has_office_desktop_apps()
    if has_both:
        add_log(f"[OK] Đã phát hiện Microsoft Office Desktop đầy đủ (Word & Excel) tại: {word_path}")
        return 0, True

    odt_work_dir = os.path.join(tempfile.gettempdir(), "win11_toolkit_office365")
    os.makedirs(odt_work_dir, exist_ok=True)
    default_xml_path = os.path.join(odt_work_dir, "office365_config.xml")
    with open(default_xml_path, "w", encoding="utf-8") as xf:
        xf.write(_build_office365_odt_xml(odt_work_dir))

    xml_to_use = default_xml_path
    setup_exe = None

    # 1. Kiểm tra bộ cài Offline trong software/office365/
    if os.path.isdir(software_app_dir):
        xml_files = [f for f in os.listdir(software_app_dir) if f.lower().endswith(".xml")]
        exe_files = [f for f in os.listdir(software_app_dir) if f.lower().endswith(".exe")]
        if xml_files:
            xml_to_use = os.path.join(software_app_dir, xml_files[0])
            add_log(f"   -> Phát hiện file cấu hình Office Offline: software/office365/{xml_files[0]}")
        if exe_files:
            preferred = next((f for f in exe_files if "setup" in f.lower()), exe_files[0])
            setup_exe = os.path.join(software_app_dir, preferred)
            add_log(f"   -> Phát hiện bộ cài Office Offline: software/office365/{preferred}")

    # 2. Nếu chưa có offline setup.exe, tải trực tiếp ODT setup.exe chính thức từ Microsoft CDN
    if not setup_exe:
        cached_setup = os.path.join(odt_work_dir, "setup.exe")
        if os.path.isfile(cached_setup) and os.path.getsize(cached_setup) > 500_000:
            setup_exe = cached_setup
            add_log("   -> Sử dụng Office Click-to-Run setup.exe đã tải sẵn từ bộ nhớ đệm.")
        else:
            cdn_url = "https://officecdn.microsoft.com/pr/wsus/setup.exe"
            add_log("   -> Đang tải Microsoft Office Deployment Tool (setup.exe) từ officecdn.microsoft.com...")
            if on_progress:
                on_progress(15, "Đang tải Office ODT từ Microsoft...", "downloading")
            try:
                req = urllib.request.Request(cdn_url, headers={"User-Agent": "Win11Toolkit/1.0"})
                ssl_ctx = ssl.create_default_context()
                aborted_dl = False
                with urllib.request.urlopen(req, timeout=20, context=ssl_ctx) as resp, open(cached_setup, "wb") as out_f:
                    while True:
                        if install_control["stopped"] or install_control["skipped"]:
                            aborted_dl = True
                            break
                        chunk = resp.read(65536)
                        if not chunk:
                            break
                        out_f.write(chunk)
                if aborted_dl:
                    try:
                        os.remove(cached_setup)
                    except OSError:
                        pass
                    return (-888 if install_control["stopped"] else -777), False
                if os.path.isfile(cached_setup) and os.path.getsize(cached_setup) > 500_000:
                    size_mb = round(os.path.getsize(cached_setup) / (1024 * 1024), 2)
                    add_log(f"   -> Đã tải xong setup.exe chính thức ({size_mb} MB).")
                    setup_exe = cached_setup
            except Exception as exc:
                add_log(f"   -> Không tải trực tiếp được setup.exe từ Microsoft CDN ({exc}), chuyển sang Winget ODT override...")

    stop_monitor = threading.Event()
    office_dirs = [
        r"C:\Program Files\Microsoft Office",
        r"C:\Program Files (x86)\Microsoft Office",
    ]

    def _office_monitor():
        last_mb = -1.0
        while not stop_monitor.is_set() and not install_control["stopped"] and not install_control["skipped"]:
            total_mb = sum(_get_dir_size_mb(d, stop_monitor) for d in office_dirs)
            if stop_monitor.is_set() or install_control["stopped"] or install_control["skipped"]:
                break
            if total_mb > 5.0 and abs(total_mb - last_mb) >= 40.0:
                last_mb = total_mb
                pct = min(92, 22 + int((total_mb / 2800.0) * 70))
                if on_progress:
                    on_progress(pct, f"Đang tải & cài Office ({int(total_mb)} MB)...", "installing")
                add_log(f"   -> Tiến độ Office 365 trên ổ đĩa: ~{int(total_mb)} MB (Word, Excel, PowerPoint...)")
            stop_monitor.wait(2.0)

    mon_thread = None
    if setup_exe or winget_bin:
        mon_thread = threading.Thread(target=_office_monitor, daemon=True)
        mon_thread.start()

    rc = -1
    try:
        if install_control["stopped"] or install_control["skipped"]:
            return (-888 if install_control["stopped"] else -777), False
        if setup_exe:
            add_log(f"   -> Đang thực thi cài đặt Office 365 với cấu hình XML: setup.exe /configure \"{xml_to_use}\"")
            add_log("   -> Quá trình tải Word, Excel, PowerPoint (~2-3 GB) có thể mất 5-15 phút tùy tốc độ mạng...")
            if on_progress:
                on_progress(25, "Đang cài Office (ODT /configure)...", "installing")
            rc, _ = run_command_with_live_logs(
                [setup_exe, "/configure", xml_to_use],
                timeout=1800,
                on_progress=on_progress,
            )
        elif winget_bin:
            add_log("   -> Đang cài đặt Microsoft.Office qua Winget kèm tham số ODT --override /configure...")
            if on_progress:
                on_progress(20, "Đang chạy Winget + ODT /configure...", "downloading")
            rc, _ = run_command_with_live_logs(
                [
                    winget_bin,
                    "install",
                    "--id",
                    "Microsoft.Office",
                    "--exact",
                    "--force",
                    "--accept-package-agreements",
                    "--accept-source-agreements",
                    "--override",
                    f'/configure "{xml_to_use}"',
                ],
                timeout=1800,
                on_progress=on_progress,
            )
        else:
            add_log("[LỖI] Không thể tải bộ cài Office ODT từ Microsoft CDN và máy chưa có Winget.")
    finally:
        stop_monitor.set()
        if mon_thread is not None:
            mon_thread.join(timeout=1.5)

    has_both_now, word_path_now = sm.has_office_desktop_apps()
    if not has_both_now and winget_bin and setup_exe and not install_control["stopped"] and not install_control["skipped"]:
        # Nếu setup.exe trực tiếp gặp sự cố, thử thêm fallback qua Winget + --override /configure
        add_log("   -> Chưa thấy Word/Excel sau bước ODT trực tiếp, thử phương án dự phòng qua Winget --override...")
        rc2, _ = run_command_with_live_logs(
            [
                winget_bin,
                "install",
                "--id",
                "Microsoft.Office",
                "--exact",
                "--force",
                "--accept-package-agreements",
                "--accept-source-agreements",
                "--override",
                f'/configure "{xml_to_use}"',
            ],
            timeout=1800,
            on_progress=on_progress,
        )
        if rc != 0:
            rc = rc2
        has_both_now, word_path_now = sm.has_office_desktop_apps()

    return rc, has_both_now


def run_sequential_install(app_items: list, delay_seconds: int = 3) -> None:
    """Cài đặt tuần tự từng ứng dụng một (hỗ trợ Portable/Offline & Winget chính thức)."""
    from scripts import shortcut_manager as sm

    install_control["paused"] = False
    install_control["stopped"] = False
    install_control["skipped"] = False
    install_control["skip_index"] = 0
    install_control["fast_forward_delay"] = False
    with install_control["lock"]:
        install_control["current_proc"] = None

    queue = []
    for it in app_items:
        if isinstance(it, dict):
            queue.append({
                "id": str(it.get("id", "")),
                "name": str(it.get("name", "Ứng dụng")),
                "winget": str(it.get("winget", "")),
                "status": "pending",
                "stage": "Chờ đến lượt...",
                "sub_progress": 0,
                "sub_detail": "",
                "shortcut": "",
            })

    session_id = str(int(time.time()))
    with install_lock:
        install_state.update({
            "session_id": session_id,
            "status": "installing",
            "total_apps": len(queue),
            "current_index": 0,
            "current_app": "",
            "current_package": "",
            "step_status": "installing",
            "current_stage": "Khởi tạo tiến trình cài đặt...",
            "sub_progress": 0,
            "sub_detail": "",
            "delay_remaining": 0,
            "queue": queue,
            "logs": [],
        })

    add_log(f"Bắt đầu quy trình cài đặt tuần tự {len(queue)} phần mềm (Delay {delay_seconds}s)...")

    # Bước 0: Kiểm tra mạng & Tự động nhận diện / nạp thông tin Wi-Fi AP theo toolkit_config.json
    try:
        from scripts import config_manager as cm
        from scripts import wifi_manager as wm

        tk_cfg = cm.load_toolkit_config()
        if tk_cfg.get("general_workflow", {}).get("auto_provision_wifi_before_install", True) and tk_cfg.get("wifi_config", {}).get("enabled", True):
            with install_lock:
                install_state["current_stage"] = "Bước 0: Kiểm tra kết nối mạng & nhận diện Wi-Fi AP..."
                install_state["sub_detail"] = "Đang kiểm tra LAN / Wi-Fi AP..."
            add_log("==================================================")
            add_log("[BƯỚC 0] Kiểm tra kết nối mạng & tự động nhận diện Wi-Fi AP từ Config...")
            wm.run_smart_wifi_provisioning(force=False, log_callback=add_log)
            add_log("==================================================")
    except Exception as exc:
        add_log(f"[CHÚ Ý WIFI] Bỏ qua bước kiểm tra AP tự động: {exc}")

    system_winget = find_winget_exe()
    if system_winget:
        add_log(f"[HỆ THỐNG] Đã phát hiện công cụ Winget tại: {system_winget}")
    else:
        add_log("[CHÚ Ý HỆ THỐNG] Không tìm thấy công cụ Winget (Microsoft App Installer) trên máy.")
        add_log("   -> Các gói Offline/Portable có sẵn trong thư mục software/ vẫn được cài đặt bình thường.")

    try:
        for idx, item in enumerate(queue, start=1):
            while install_control["paused"] and not install_control["stopped"] and not install_control["skipped"]:
                time.sleep(0.4)

            if install_control["stopped"]:
                break

            if install_control["skipped"] and install_control.get("skip_index", 0) in (0, idx):
                with install_lock:
                    item["status"] = "skipped"
                    item["stage"] = "Đã bỏ qua bởi KTV"
                    item["sub_progress"] = 100
                add_log(f"[BỎ QUA] Đã bỏ qua {item['name']} trước khi cài đặt.")
                install_control["skipped"] = False
                install_control["skip_index"] = 0
                continue

            install_control["skipped"] = False
            install_control["skip_index"] = 0
            install_control["fast_forward_delay"] = False

            app_id = item["id"]
            app_name = item["name"]
            package_id = item["winget"]

            with install_lock:
                install_state["status"] = "installing"
                install_state["current_index"] = idx
                install_state["current_app"] = app_name
                install_state["current_package"] = package_id
                install_state["step_status"] = "installing"
                install_state["current_stage"] = f"Chuẩn bị cài đặt {app_name}..."
                install_state["sub_progress"] = 10
                install_state["sub_detail"] = "Đang kiểm tra gói cài..."
                item["status"] = "installing"
                item["stage"] = "Đang kiểm tra gói cài..."
                item["sub_progress"] = 10

            add_log("--------------------------------------------------")
            add_log(f"[{idx}/{len(queue)}] Đang tiến hành cài đặt: {app_name} ({package_id or app_id})...")

            def on_app_progress(pct, detail, stage_type):
                bounded = min(95, max(5, int(pct)))
                with install_lock:
                    install_state["sub_progress"] = bounded
                    install_state["sub_detail"] = detail
                    if stage_type == "downloading":
                        install_state["current_stage"] = f"Đang tải gói dữ liệu ({detail})..."
                        item["stage"] = f"Đang tải ({bounded}%)..."
                    else:
                        install_state["current_stage"] = "Đang bung file & cài đặt vào hệ thống..."
                        item["stage"] = "Đang cài đặt..."
                    item["sub_progress"] = bounded

            software_app_dir = os.path.join(ROOT_DIR, "software", app_id)
            is_direct_handled = False
            rc = -1

            # 0. Xử lý chuyên biệt cho Microsoft Office 365 (Word, Excel, PowerPoint)
            if app_id == "office365":
                rc, office_verified = install_microsoft_office_365(
                    system_winget or find_winget_exe(),
                    software_app_dir,
                    sm,
                    on_progress=on_app_progress,
                )
                is_direct_handled = True

            # 1. Các gói Portable có sẵn trong thư mục software/
            portable_handlers = {
                "unikey": ("UniKeyNT.exe", sm.install_portable_unikey),
                "geek-uninstaller": ("geek.exe", sm.install_portable_geek),
                "gpuz": (None, sm.install_portable_gpuz),
                "cpuz": (None, sm.install_portable_cpuz),
                "hwmonitor": (None, sm.install_portable_hwmonitor),
                "crystaldiskinfo": (None, sm.install_portable_crystaldiskinfo),
            }
            if app_id in portable_handlers and os.path.isdir(software_app_dir):
                req_file, fn_install = portable_handlers[app_id]
                has_files = (
                    os.path.isfile(os.path.join(software_app_dir, req_file))
                    if req_file
                    else any(f.lower().endswith(".exe") for f in os.listdir(software_app_dir))
                )
                if has_files:
                    add_log(f"   -> Phát hiện bản {app_name} Portable tại software/{app_id}...")
                    on_app_progress(50, "Cài đặt Portable...", "installing")
                    try:
                        ok, dest_exe = fn_install(software_app_dir)
                        if ok:
                            add_log(f"[OK] Đã cài đặt {app_name} vào {dest_exe} và tạo lối tắt Desktop!")
                            rc = 0
                        else:
                            add_log(f"[LỖI] Không thể cài đặt {app_name}: {dest_exe}")
                            rc = 1
                        is_direct_handled = True
                    except Exception as exc:
                        add_log(f"[LỖI] Xảy ra lỗi khi cài {app_name}: {exc}")

            # 2. Các bộ cài Offline (.exe / .msi) có sẵn trong thư mục software/<app_id>
            # Hỗ trợ cả file config app: config.json / installer.json / app.json nếu KTV muốn tùy chỉnh cờ lệnh
            if not is_direct_handled and os.path.isdir(software_app_dir):
                cfg_installer = None
                for cfg_name in ("config.json", "installer.json", "app.json", "setup.json"):
                    cfg_p = os.path.join(software_app_dir, cfg_name)
                    if os.path.isfile(cfg_p):
                        try:
                            with open(cfg_p, "r", encoding="utf-8") as cfp:
                                cfg_installer = json.load(cfp)
                            break
                        except Exception:
                            pass

                candidate_files = []
                specified_file = ""
                custom_args = None
                if isinstance(cfg_installer, dict):
                    specified_file = cfg_installer.get("file") or cfg_installer.get("installer") or ""
                    custom_args = cfg_installer.get("args") or cfg_installer.get("arguments")

                if specified_file and os.path.isfile(os.path.join(software_app_dir, specified_file)):
                    candidate_files = [specified_file]
                else:
                    candidate_files = [
                        f for f in os.listdir(software_app_dir)
                        if f.lower().endswith((".exe", ".msi"))
                    ]

                if candidate_files:
                    target_file = os.path.join(software_app_dir, candidate_files[0])
                    fname_lower = candidate_files[0].lower()
                    add_log(f"   -> Phát hiện bộ cài offline {app_name}: software/{app_id}/{candidate_files[0]}")
                    on_app_progress(40, "Cài offline...", "installing")

                    if custom_args is not None:
                        if isinstance(custom_args, list):
                            cmd = [target_file] + [str(a) for a in custom_args]
                        else:
                            import shlex
                            cmd = [target_file] + shlex.split(str(custom_args))
                    elif fname_lower.endswith(".msi"):
                        cmd = ["msiexec.exe", "/i", target_file, "/qn", "/norestart"]
                    elif app_id == "rustdesk":
                        cmd = [target_file, "--silent-install"]
                    elif app_id == "anydesk":
                        dest_ad = os.path.join(os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)"), "AnyDesk")
                        cmd = [target_file, "--install", dest_ad, "--start-with-win", "--silent"]
                    elif app_id == "teamviewer":
                        cmd = [target_file, "/S"]
                    elif app_id == "docker-desktop":
                        cmd = [target_file, "install", "--quiet", "--accept-license"]
                    elif app_id in ("git", "winscp", "vscode"):
                        cmd = [target_file, "/VERYSILENT", "/NORESTART", "/NOCANCEL", "/SP-"]
                    elif app_id == "advanced-ip-scanner":
                        cmd = [target_file, "/VERYSILENT", "/NORESTART"]
                    elif app_id in ("wireshark", "nmap", "dbeaver"):
                        cmd = [target_file, "/S"]
                    elif app_id == "tailscale":
                        cmd = [target_file, "/quiet", "/norestart"]
                    elif app_id in ("postman", "claude"):
                        cmd = [target_file, "-s"]
                    elif app_id in ("vcredist-x64", "vcredist-x86", "vcredist"):
                        cmd = [target_file, "/install", "/quiet", "/norestart"]
                    elif app_id == "ultraviewer" or "inno" in fname_lower:
                        cmd = [target_file, "/SP-", "/VERYSILENT", "/SUPPRESSMSGBOXES", "/NORESTART", "/NOCANCEL"]
                    elif app_id in ("chrome", "coccoc") or "google" in fname_lower:
                        cmd = [target_file, "/silent", "/install"]
                    elif app_id in ("winrar", "7zip", "foxit-reader", "notepadplusplus", "vlc", "libreoffice"):
                        cmd = [target_file, "/S"]
                    elif "inno" in fname_lower:
                        cmd = [target_file, "/VERYSILENT", "/NORESTART", "/SP-"]
                    else:
                        cmd = [target_file, "/S"]

                    rc, _ = run_command_with_live_logs(cmd, timeout=300, on_progress=on_app_progress)
                    is_direct_handled = True

            # 3. Cài đặt trực tuyến qua Microsoft Winget chính thức
            if not is_direct_handled:
                winget_bin = system_winget or find_winget_exe()
                if not winget_bin or not package_id:
                    add_log(f"[BỎ QUA] {app_name} ({package_id}) cần công cụ Winget nhưng máy chưa có App Installer.")
                    item["status"] = "missing_winget"
                    item["stage"] = "Thiếu Winget (Cần App Installer)"
                    item["sub_progress"] = 0
                    continue

                on_app_progress(15, "Đang tải qua mạng...", "downloading")
                cmd = [
                    winget_bin,
                    "install",
                    "--id",
                    package_id,
                    "--exact",
                    "--disable-interactivity",
                    "--accept-package-agreements",
                    "--accept-source-agreements",
                ]
                if "." in package_id:
                    cmd.extend(["--source", "winget"])
                if package_id == "UniKey.UniKey":
                    cmd.extend(["-v", "4.6.230919"])

                rc, _ = run_command_with_live_logs(cmd, timeout=300, on_progress=on_app_progress)

            if install_control["stopped"] or rc == -888:
                item["status"] = "stopped"
                item["stage"] = "Đã dừng bởi KTV"
                break

            if install_control["skipped"] or rc == -777:
                add_log(f"[BỎ QUA] Đã bỏ qua {app_name} theo yêu cầu KTV — tiếp tục phần mềm tiếp theo...")
                with install_lock:
                    item["status"] = "skipped"
                    item["stage"] = "Đã bỏ qua (treo/lỗi)"
                    item["sub_progress"] = 100
                install_control["skipped"] = False
                install_control["skip_index"] = 0
                continue

            already_codes = {
                -1978335189, 2316632107, 2316632332, 2316632076,
                2316632070, 2147943623, 2147747609, 1602, 2,
            }
            if app_id == "office365":
                has_office_now, word_exe = sm.has_office_desktop_apps()
                if has_office_now:
                    add_log(f"[OK] Đã xác nhận Microsoft Office 365 có đầy đủ Word & Excel tại: {word_exe}")
                    is_ok = True
                elif rc == -999:
                    add_log("[CẢNH BÁO] Quá trình tải/cài Office 365 vượt quá thời gian chờ (Timeout 30 phút).")
                    is_ok = False
                else:
                    add_log(f"[LỖI] Trình cài đặt Office 365 kết thúc (mã {rc}) nhưng CHƯA thấy Word (WINWORD.EXE) hoặc Excel (EXCEL.EXE) trên máy!")
                    add_log("   -> Nguyên nhân thường gặp: Kết nối tới officecdn.microsoft.com bị gián đoạn, hết dung lượng ổ C, hoặc xung đột bản Office UWP/OEM cũ.")
                    add_log("   -> Gợi ý KTV: Kiểm tra mạng hoặc chép bộ cài ODT/Office Offline (setup.exe + XML) vào thư mục software/office365/.")
                    is_ok = False
            elif rc in (0, 3010):
                add_log(f"[OK] {app_name} đã cài đặt thành công!")
                is_ok = True
            elif rc == -999:
                add_log(f"[CẢNH BÁO] {app_name} bị dừng do quá thời gian chờ (Timeout 300s).")
                is_ok = False
            elif rc in already_codes:
                exists_now = sm.is_app_installed(app_id)
                if isinstance(exists_now, tuple):
                    exists_now = exists_now[0]
                if exists_now:
                    add_log(f"[OK] {app_name} đã tồn tại hoặc được cài đặt sẵn trên máy!")
                    is_ok = True
                else:
                    add_log(f"[CHÚ Ý] {app_name} kết thúc với mã trả về: {rc} (có thể đã cài hoặc cần xác nhận UAC)")
                    is_ok = False
            else:
                exists_now = sm.is_app_installed(app_id)
                if isinstance(exists_now, tuple):
                    exists_now = exists_now[0]
                if exists_now:
                    add_log(f"[OK] Đã xác nhận phần mềm {app_name} hoạt động tốt trên máy!")
                    is_ok = True
                else:
                    add_log(f"[CHÚ Ý] {app_name} kết thúc với mã trả về: {rc}")
                    is_ok = False

            # Kiểm tra/tạo lối tắt Desktop (bỏ qua đối với các gói thư viện hệ thống VC++ Redistributables)
            if app_id in ("vcredist-x64", "vcredist-x86", "vcredist"):
                add_log("   -> [THƯ VIỆN HỆ THỐNG] Đã nạp thư viện C++ Runtime vào Windows System32/SysWOW64 (Không cần lối tắt Desktop)")
            else:
                try:
                    s_ok, s_path, s_msg = sm.ensure_desktop_shortcut(app_id, app_name)
                    if s_msg:
                        add_log(f"   -> [LỐI TẮT DESKTOP] {s_msg}")
                    if s_ok and s_path:
                        item["shortcut"] = os.path.basename(s_path)
                except Exception:
                    pass

            with install_lock:
                item["status"] = "completed" if is_ok else "error"
                item["stage"] = "Đã hoàn tất" if is_ok else f"Mã kết thúc: {rc}"
                item["sub_progress"] = 100

            # Nghỉ đệm giữa các gói cài đặt
            if idx < len(queue) and delay_seconds > 0 and not install_control["stopped"]:
                add_log(f"Hệ thống tạm dừng {delay_seconds} giây để giải phóng tiến trình và khóa tập tin (File Lock)...")
                for rem in range(delay_seconds, 0, -1):
                    if install_control["stopped"] or install_control["fast_forward_delay"]:
                        break
                    while install_control["paused"] and not install_control["stopped"] and not install_control["fast_forward_delay"]:
                        time.sleep(0.4)
                    with install_lock:
                        install_state["step_status"] = "delay"
                        install_state["delay_remaining"] = rem
                        install_state["current_stage"] = f"Hệ thống tạm dừng ({rem}s) để giải phóng khóa tập tin..."
                    time.sleep(1.0)
                install_control["fast_forward_delay"] = False

        was_stopped = False
        with install_lock:
            if install_control["stopped"]:
                was_stopped = True
                install_state["status"] = "stopped"
                install_state["step_status"] = "stopped"
                install_state["current_stage"] = "Đã dừng quy trình cài đặt theo yêu cầu của KTV."
                for q_item in install_state["queue"]:
                    if q_item["status"] in ("pending", "installing"):
                        q_item["status"] = "stopped"
                        q_item["stage"] = "Đã dừng bởi KTV"
            else:
                install_state["status"] = "completed"
                install_state["step_status"] = "finished"
                install_state["sub_progress"] = 100
                install_state["current_stage"] = "Đã hoàn tất cài đặt toàn bộ ứng dụng!"
        if was_stopped:
            add_log("[DỪNG HẲN] Quy trình cài đặt đã được dừng an toàn.")
        else:
            add_log("==================================================")
            add_log("[THÀNH CÔNG] Đã hoàn tất toàn bộ tiến trình cài đặt tuần tự!")
    except Exception as exc:
        with install_lock:
            install_state["status"] = "stopped"
            install_state["current_stage"] = f"Gián đoạn: {exc}"
        add_log(f"[LỖI HỆ THỐNG] Quy trình cài đặt bị gián đoạn: {exc}")


# ==============================================================================
# CÁC HÀM TIỆN ÍCH HỆ THỐNG NATIVE PYTHON (KHÔNG GỌI CHUỖI LỆNH ẨN GÂY NGHI NGỜ)
# ==============================================================================
def _broadcast_setting_change() -> None:
    """Thông báo cho Windows cập nhật giao diện mà không cần tắt explorer.exe."""
    try:
        HWND_BROADCAST = 0xFFFF
        WM_SETTINGCHANGE = 0x001A
        SMTO_ABORTIFHUNG = 0x0002
        result = ctypes.c_ulong()
        ctypes.windll.user32.SendMessageTimeoutW(
            HWND_BROADCAST,
            WM_SETTINGCHANGE,
            0,
            "ImmersiveColorSet",
            SMTO_ABORTIFHUNG,
            1000,
            ctypes.byref(result),
        )
    except Exception:
        pass


def _set_hkcu_value(subkey: str, name: str, value, reg_type: int) -> None:
    with winreg.CreateKeyEx(winreg.HKEY_CURRENT_USER, subkey, 0, winreg.KEY_SET_VALUE) as k:
        winreg.SetValueEx(k, name, 0, reg_type, value)


def _clean_user_temp_safely() -> int:
    """Dọn các tệp tạm trong thư mục %TEMP% của người dùng bằng thư viện chuẩn Python."""
    removed = 0
    temp_dir = tempfile.gettempdir()
    if not temp_dir or not os.path.isdir(temp_dir):
        return 0
    for entry in os.scandir(temp_dir):
        try:
            if entry.is_dir(follow_symlinks=False):
                shutil.rmtree(entry.path, ignore_errors=True)
                removed += 1
            else:
                os.unlink(entry.path)
                removed += 1
        except OSError:
            continue
    return removed


def _enable_ultimate_power_plan() -> str:
    """Kích hoạt gói nguồn Ultimate Performance qua công cụ chuẩn powercfg.exe."""
    res = subprocess.run(
        ["powercfg.exe", "-duplicatescheme", "e9a42b02-d5df-448d-aa00-03f14749eb61"],
        capture_output=True,
        text=True,
        timeout=8,
    )
    m = re.search(r"([a-fA-F0-9\-]{36})", (res.stdout or "") + " " + (res.stderr or ""))
    if m:
        guid = m.group(1)
        subprocess.run(["powercfg.exe", "-setactive", guid], capture_output=True, timeout=6)
        return f"Đã mở khóa và kích hoạt gói nguồn Ultimate Performance ({guid})!"
    return "Đã gửi yêu cầu kích hoạt gói nguồn Ultimate Performance!"


def _run_ps1_script_visibly(script_name: str, extra_args=None) -> bool:
    script_path = os.path.join(ROOT_DIR, "scripts", script_name)
    if not os.path.isfile(script_path):
        return False
    args = ["powershell.exe", "-NoProfile", "-File", script_path]
    if extra_args:
        args.extend(extra_args)
    creation_flags = getattr(subprocess, "CREATE_NEW_CONSOLE", 0)
    subprocess.Popen(args, cwd=ROOT_DIR, creationflags=creation_flags)
    return True


def execute_clean_ktv_action(action: str, params: dict) -> dict:
    """Thực thi các tác vụ KTV bằng API Python chuẩn và trình điều khiển chính thống của Windows."""
    from scripts import hardware_monitor_service as hms
    from scripts import network_service as ns
    from scripts import time_sync as ts

    if action in ("debloat-under4gb", "optimize-under4gb", "optimize-level3"):
        _run_ps1_script_visibly("optimize-low-spec.ps1", ["-Tier", "under4gb"])
        return {"status": "ok", "message": "Đã mở cửa sổ tối ưu Gói Siêu Nhẹ (Dưới 4GB RAM)!"}

    if action in ("debloat-4to8gb", "optimize-4to8gb", "optimize-level2"):
        _run_ps1_script_visibly("optimize-low-spec.ps1", ["-Tier", "4to8gb"])
        return {"status": "ok", "message": "Đã mở cửa sổ tối ưu Gói Cân Bằng (RAM 4GB - 8GB)!"}

    if action in ("debloat-above8gb", "optimize-above8gb", "optimize-level1"):
        _run_ps1_script_visibly("optimize-low-spec.ps1", ["-Tier", "above8gb"])
        return {"status": "ok", "message": "Đã mở cửa sổ tối ưu Gói Giữ Tính Năng (Trên 8GB RAM)!"}

    if action == "optimize":
        _run_ps1_script_visibly("optimize-low-spec.ps1")
        return {"status": "ok", "message": "Đã khởi chạy script tối ưu hóa hệ thống!"}

    if action in ("install-winget", "setup-winget"):
        _run_ps1_script_visibly("install-winget.ps1")
        return {"status": "ok", "message": "Đang mở tiến trình cài đặt Microsoft App Installer (Winget)..."}

    if action == "create-restore-point":
        _run_ps1_script_visibly("create-restore-point.ps1")
        return {"status": "ok", "message": "Đang khởi tạo điểm khôi phục hệ thống (System Restore Point)..."}

    if action == "restore":
        _run_ps1_script_visibly("restore-defaults.ps1")
        return {"status": "ok", "message": "Đã mở tiến trình khôi phục cài đặt mặc định!"}

    if action in ("sync-time-utc7", "sync-time"):
        sync_res = ts.sync_all()
        disp = (sync_res.get("info") or {}).get("formatted_display", "")
        return {"status": "ok", "message": f"Đã đồng bộ giờ chuẩn UTC+07:00! Thời gian hiện tại: {disp}"}

    if action == "enable-ultimate-power":
        msg = _enable_ultimate_power_plan()
        return {"status": "ok", "message": msg}

    if action == "clean-temp":
        count = _clean_user_temp_safely()
        return {"status": "ok", "message": f"Đã dọn dẹp an toàn {count} mục tệp tạm trong %TEMP%!"}

    if action == "flush-dns-network":
        ns.flush_dns()
        return {"status": "ok", "message": "Đã xóa Cache DNS (ipconfig /flushdns) thành công!"}

    if action == "set-best-performance":
        _set_hkcu_value(
            r"Control Panel\Desktop",
            "UserPreferencesMask",
            bytes([0x90, 0x12, 0x03, 0x80, 0x10, 0x00, 0x00, 0x00]),
            winreg.REG_BINARY,
        )
        _set_hkcu_value(r"Control Panel\Desktop\WindowMetrics", "MinAnimate", "0", winreg.REG_SZ)
        _set_hkcu_value(
            r"Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects",
            "VisualFXSetting",
            2,
            winreg.REG_DWORD,
        )
        _broadcast_setting_change()
        return {"status": "ok", "message": "Đã chuyển hiệu ứng hình ảnh sang chế độ Best Performance!"}

    if action == "disable-transparency":
        _set_hkcu_value(
            r"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize",
            "EnableTransparency",
            0,
            winreg.REG_DWORD,
        )
        _broadcast_setting_change()
        return {"status": "ok", "message": "Đã tắt hiệu ứng trong suốt (Transparency Effects)!"}

    if action == "disable-widgets-copilot":
        _set_hkcu_value(
            r"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced",
            "TaskbarDa",
            0,
            winreg.REG_DWORD,
        )
        _set_hkcu_value(
            r"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced",
            "ShowCopilotButton",
            0,
            winreg.REG_DWORD,
        )
        _broadcast_setting_change()
        return {"status": "ok", "message": "Đã ẩn Widgets và nút Copilot trên thanh Taskbar!"}

    if action == "set-menushowdelay-20":
        _set_hkcu_value(r"Control Panel\Desktop", "MenuShowDelay", "20", winreg.REG_SZ)
        _broadcast_setting_change()
        return {"status": "ok", "message": "Đã giảm độ trễ hiển thị Menu chuột phải xuống 20ms!"}

    if action == "enable-gamemode":
        _set_hkcu_value(r"Software\Microsoft\GameBar", "AutoGameModeEnabled", 1, winreg.REG_DWORD)
        return {"status": "ok", "message": "Đã bật chế độ ưu tiên hiệu năng Windows Game Mode!"}

    # Các công cụ cấu hình chính thống của Windows (mở trực tiếp qua Shell API sạch)
    os_shell_targets = {
        "open-sysdm": ("SystemPropertiesAdvanced.exe", "Đã mở hộp thoại System Properties (Advanced)!"),
        "set-paging-4g": ("SystemPropertiesPerformance.exe", "Đã mở Performance Options để thiết lập Virtual Memory (RAM ảo) an toàn!"),
        "open-performance-options": ("SystemPropertiesPerformance.exe", "Đã mở hộp thoại Performance Options!"),
        "open-system-protection": ("SystemPropertiesProtection.exe", "Đã mở hộp thoại System Protection!"),
        "open-taskmgr-startup": ("taskmgr.exe", "Đã mở Windows Task Manager!"),
        "open-services": ("services.msc", "Đã mở bảng quản lý Windows Services!"),
        "disable-sysmain": ("services.msc", "Đã mở Windows Services để kiểm tra dịch vụ SysMain / Windows Search!"),
        "disable-telemetry": ("ms-settings:privacy-feedback", "Đã mở cài đặt Quyền riêng tư & Chẩn đoán (Diagnostics & Feedback) của Windows!"),
        "open-power-cpl": ("powercfg.cpl", "Đã mở bảng điều khiển Power Options!"),
        "open-graphics-settings": ("ms-settings:display-advancedgraphics", "Đã mở cài đặt Graphics Settings!"),
        "open-apps-features": ("ms-settings:appsfeatures", "Đã mở trang Quản lý ứng dụng đã cài đặt (Installed Apps)!"),
        "toggle-defender": ("windowsdefender:", "Đã mở trung tâm bảo mật Windows Security!"),
        "clean-event-logs": ("eventvwr.msc", "Đã mở trình quản lý Event Viewer chính thống của Windows!"),
        "rearm": ("ms-settings:activation", "Đã mở trang Trạng thái Bản quyền (Windows Activation)!"),
    }
    if action in os_shell_targets:
        uri_or_exe, msg = os_shell_targets[action]
        os.startfile(uri_or_exe)
        return {"status": "ok", "message": msg}

    hw_tool_map = {
        "open-hwmonitor": "hwmonitor",
        "open-cpuz": "cpuz",
        "open-crystaldiskinfo": "crystaldiskinfo",
        "open-gpuz": "gpuz",
    }
    if action in hw_tool_map:
        ok, msg = hms.launch_hardware_tool(hw_tool_map[action])
        return {"status": "ok" if ok else "error", "message": msg}

    if action == "scan-old":
        blocked, block_payload = get_active_install_mode_block()
        if blocked:
            return block_payload
        bat_p = os.path.join(ROOT_DIR, "scripts", "export-installed-software.bat")
        if os.path.isfile(bat_p):
            os.startfile(bat_p)
            comp = os.environ.get("COMPUTERNAME", "PC")
            return {"status": "ok", "message": f"Đã xuất danh sách phần mềm hiện có tại scans\\Danh_Sach_Phan_Mem_{comp}.txt (.csv)!"}
        return {"status": "error", "message": "Không tìm thấy script scripts/export-installed-software.bat!"}

    if action == "watermark-menu":
        bat_p = os.path.join(ROOT_DIR, "scripts", "hide-activation-watermark.bat")
        if os.path.isfile(bat_p):
            os.startfile(bat_p)
        return {"status": "ok", "message": "Đã mở tiện ích kiểm tra hiển thị màn hình!"}

    if action == "open-folder":
        folder_rel = params.get("folder", [""])[0]
        target_path = folder_rel if os.path.isabs(folder_rel) else os.path.join(ROOT_DIR, folder_rel)
        if os.path.isdir(target_path):
            os.startfile(target_path)
            return {"status": "ok", "message": f"Đã mở thư mục: {target_path}"}
        return {"status": "error", "message": f"Không tìm thấy thư mục: {target_path}"}

    if action == "open-file":
        file_rel = params.get("file", [""])[0]
        target_file = file_rel if os.path.isabs(file_rel) else os.path.join(ROOT_DIR, file_rel)
        if os.path.exists(target_file):
            subprocess.Popen(["explorer.exe", f"/select,{os.path.normpath(target_file)}"])
            return {"status": "ok", "message": f"Đã mở vị trí tệp: {target_file}"}
        return {"status": "error", "message": f"Không tìm thấy tệp: {target_file}"}

    return {"status": "ok", "message": f"Đã ghi nhận thao tác: {action}"}


DEFAULT_KTV_TASKS = [
    {
        "id": "enable-ultimate-power",
        "icon": "🚀",
        "title": "Gói Nguồn Ultimate Performance",
        "desc": "Mở khóa và kích hoạt gói nguồn tối đa, loại bỏ độ trễ tiết kiệm điện của CPU.",
        "cmd_type": "powershell",
        "command": "powercfg.exe -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61; powercfg.exe /setactive e9a42b02-d5df-448d-aa00-03f14749eb61",
    },
    {
        "id": "clean-temp",
        "icon": "🧹",
        "title": "Dọn Rác Thư Mục %TEMP%",
        "desc": "Dọn dẹp an toàn các tệp tạm không còn sử dụng trong thư mục %TEMP% người dùng.",
        "cmd_type": "powershell",
        "command": "Remove-Item -Path \"$env:TEMP\\*\" -Recurse -Force -ErrorAction SilentlyContinue; Write-Host \"Đã dọn sạch tệp rác trong %TEMP%!\"",
    },
    {
        "id": "set-paging-4g",
        "icon": "🧠",
        "title": "Cấu Hình RAM Ảo (Virtual Memory)",
        "desc": "Mở hộp thoại Performance Options chính thống để thiết lập Paging File an toàn.",
        "cmd_type": "shell",
        "command": "SystemPropertiesPerformance.exe",
    },
    {
        "id": "toggle-defender",
        "icon": "🛡️",
        "title": "Bảo Mật Windows Security",
        "desc": "Mở nhanh bảng điều khiển Windows Defender để kiểm tra bảo vệ thời gian thực.",
        "cmd_type": "shell",
        "command": "windowsdefender:",
    },
    {
        "id": "disable-telemetry",
        "icon": "🛑",
        "title": "Chẩn Đoán & Quyền Riêng Tư",
        "desc": "Mở cài đặt Diagnostics & Feedback của Windows để tùy chỉnh thu thập dữ liệu.",
        "cmd_type": "shell",
        "command": "ms-settings:privacy-feedback",
    },
    {
        "id": "clean-event-logs",
        "icon": "📝",
        "title": "Nhật Ký Sự Kiện (Event Viewer)",
        "desc": "Mở trình quản lý Event Viewer (eventvwr.msc) để tra cứu lỗi phần cứng & hệ thống.",
        "cmd_type": "shell",
        "command": "eventvwr.msc",
    },
    {
        "id": "flush-dns-network",
        "icon": "🌐",
        "title": "Xóa Cache DNS & Làm Mới Mạng",
        "desc": "Khắc phục lỗi mạng không vào được trang web bằng lệnh ipconfig /flushdns.",
        "cmd_type": "cmd",
        "command": "ipconfig /flushdns",
    },
    {
        "id": "set-best-performance",
        "icon": "🪟",
        "title": "Giao Diện Best Performance",
        "desc": "Tắt toàn bộ hiệu ứng hoạt ảnh mờ cửa sổ để máy phản hồi nhanh như chớp.",
        "cmd_type": "powershell",
        "command": "Set-ItemProperty -Path 'HKCU:\\Control Panel\\Desktop' -Name UserPreferencesMask -Value ([byte[]](0x90,0x12,0x03,0x80,0x10,0x00,0x00,0x00)); Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects' -Name VisualFXSetting -Value 2; RUNDLL32.EXE user32.dll,UpdatePerUserSystemParameters",
    },
    {
        "id": "install-winget",
        "icon": "📦",
        "title": "Kích Hoạt Microsoft Winget",
        "desc": "Tự động cài đặt Microsoft App Installer cho Windows Sandbox, Win 10 LTSC hoặc bản Ghost rút gọn.",
        "cmd_type": "powershell",
        "command": "powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts\\install-winget.ps1",
    },
    {
        "id": "scan-old",
        "icon": "📋",
        "title": "Xuất Thông Tin Phần Mềm Đã Cài",
        "desc": "Quét toàn bộ phần mềm hiện đang cài trong máy ra file TXT & CSV (tại scans/) và mở xem ngay.",
        "cmd_type": "powershell",
        "command": "powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts\\export-installed-software.ps1",
    },
]


def get_ktv_tasks() -> list:
    """Đọc danh sách tác vụ KTV (hợp nhất mặc định với file cấu hình custom_ktv_tasks.json nếu có)."""
    custom_file = os.path.join(ROOT_DIR, "config", "custom_ktv_tasks.json")
    custom_map = {}
    if os.path.isfile(custom_file):
        try:
            with open(custom_file, "r", encoding="utf-8") as f:
                saved = json.load(f)
                if isinstance(saved, list):
                    custom_map = {item.get("id"): item for item in saved if isinstance(item, dict) and item.get("id")}
                elif isinstance(saved, dict) and "tasks" in saved:
                    custom_map = {item.get("id"): item for item in saved["tasks"] if isinstance(item, dict) and item.get("id")}
        except Exception:
            pass

    merged = []
    seen_ids = set()
    for def_task in DEFAULT_KTV_TASKS:
        t_id = def_task["id"]
        seen_ids.add(t_id)
        if t_id in custom_map:
            c = dict(def_task)
            c.update(custom_map[t_id])
            c["is_custom"] = True
            c["default_command"] = def_task["command"]
            merged.append(c)
        else:
            item = dict(def_task)
            item["is_custom"] = False
            item["default_command"] = def_task["command"]
            merged.append(item)

    # Thêm các task do người dùng tự tạo mới
    for t_id, c in custom_map.items():
        if t_id not in seen_ids:
            item = dict(c)
            item["is_custom"] = True
            item["is_user_created"] = True
            merged.append(item)

    return merged


def save_ktv_tasks(tasks_data) -> tuple:
    """Lưu danh sách tác vụ KTV tùy biến vào config/custom_ktv_tasks.json."""
    try:
        config_dir = os.path.join(ROOT_DIR, "config")
        os.makedirs(config_dir, exist_ok=True)
        custom_file = os.path.join(config_dir, "custom_ktv_tasks.json")
        with open(custom_file, "w", encoding="utf-8") as f:
            json.dump(tasks_data, f, ensure_ascii=False, indent=2)
        return True, "Đã lưu cấu hình lệnh KTV thành công!"
    except Exception as e:
        return False, f"Lỗi khi lưu cấu hình KTV: {e}"


def run_custom_ktv_command(cmd_type: str, command: str, title: str = "", test_mode: bool = False) -> dict:
    """Thực thi câu lệnh KTV nâng cao tùy biến (PowerShell, CMD, Windows Shell)."""
    command = (command or "").strip()
    if not command:
        return {"status": "error", "message": "Câu lệnh không được để trống!"}

    cmd_type = (cmd_type or "powershell").lower()

    if test_mode:
        try:
            if cmd_type == "powershell":
                res = subprocess.run(
                    ["powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command],
                    cwd=ROOT_DIR,
                    capture_output=True,
                    text=True,
                    timeout=15,
                )
                output = (res.stdout or "") + ("\n[LỖI]: " + res.stderr if res.stderr else "")
                return {
                    "status": "ok" if res.returncode == 0 else "warning",
                    "output": output.strip() or "(Lệnh đã chạy xong, không có đầu ra console)",
                    "code": res.returncode,
                }
            elif cmd_type == "cmd":
                res = subprocess.run(
                    ["cmd.exe", "/c", command],
                    cwd=ROOT_DIR,
                    capture_output=True,
                    text=True,
                    timeout=15,
                )
                output = (res.stdout or "") + ("\n[LỖI]: " + res.stderr if res.stderr else "")
                return {
                    "status": "ok" if res.returncode == 0 else "warning",
                    "output": output.strip() or "(Lệnh đã chạy xong, không có đầu ra console)",
                    "code": res.returncode,
                }
            else:  # shell / exe / uri
                clean_target = command[6:].strip() if command.lower().startswith("start ") else command
                os.startfile(clean_target)
                return {"status": "ok", "output": f"Đã mở tiến trình hệ thống: {clean_target}"}
        except subprocess.TimeoutExpired:
            return {"status": "warning", "output": "Lệnh đang chạy ngầm hoặc cần tương tác cửa sổ (vượt quá 15s chờ thử nghiệm)."}
        except Exception as e:
            return {"status": "error", "output": f"Lỗi khi thực thi: {e}"}

    # Chế độ chạy thực tế (1-click run)
    try:
        creation_flags = getattr(subprocess, "CREATE_NEW_CONSOLE", 0)
        if cmd_type == "powershell":
            if command.lower().startswith("start ") or command.endswith(".msc") or command.endswith(".cpl"):
                clean_target = command[6:].strip() if command.lower().startswith("start ") else command
                try:
                    os.startfile(clean_target)
                    return {"status": "ok", "message": f"Đã mở: {title or clean_target}"}
                except Exception:
                    pass
            subprocess.Popen(
                ["powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command],
                cwd=ROOT_DIR,
                creationflags=creation_flags,
            )
            return {"status": "ok", "message": f"Đã khởi chạy lệnh PowerShell: {title or command[:40]}"}
        elif cmd_type == "cmd":
            subprocess.Popen(
                ["cmd.exe", "/c", command],
                cwd=ROOT_DIR,
                creationflags=creation_flags,
            )
            return {"status": "ok", "message": f"Đã khởi chạy lệnh CMD: {title or command[:40]}"}
        else:
            clean_cmd = command[6:].strip() if command.lower().startswith("start ") else command
            os.startfile(clean_cmd)
            return {"status": "ok", "message": f"Đã mở: {title or clean_cmd}"}
    except Exception as e:
        return {"status": "error", "message": f"Lỗi khởi chạy: {e}"}


# ==============================================================================
# LOCAL HTTP REQUEST HANDLER (CHỈ PHỤC VỤ LOCALHOST 127.0.0.1)
# ==============================================================================
class ToolkitRequestHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
        ".ico": "image/x-icon",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".bmp": "image/bmp",
        ".js": "application/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".html": "text/html; charset=utf-8",
        ".json": "application/json; charset=utf-8",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def _is_loopback_client(self) -> bool:
        client_ip = (self.client_address[0] if self.client_address else "")
        return client_ip in ("127.0.0.1", "::1", "localhost")

    def _send_json(self, payload: dict, status_code: int = 200) -> None:
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", f"http://localhost:{PORT}")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        try:
            super().end_headers()
        except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError):
            pass

    def finish(self):
        try:
            super().finish()
        except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError):
            pass

    def do_OPTIONS(self):
        if not self._is_loopback_client():
            self.send_error(403, "Localhost only")
            return
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", f"http://localhost:{PORT}")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Filename")
        self.end_headers()

    def do_GET(self):
        if not self._is_loopback_client():
            self.send_error(403, "Localhost only")
            return

        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        if path == "/":
            self.path = "/index.html"
            return super().do_GET()

        if not path.startswith("/api/"):
            return super().do_GET()

        # Chỉ hot-reload khi bật TOOLKIT_DEV_RELOAD=1 để tránh xung đột đa luồng khi tải trang lần đầu
        if os.environ.get("TOOLKIT_DEV_RELOAD") == "1":
            for mod_name in (
                "scripts.scan_manager",
                "scripts.hardware_monitor_service",
                "scripts.disk_scanner",
                "scripts.scan_installed",
                "scripts.app_detector",
                "scripts.shortcut_manager",
                "scripts.config_manager",
                "scripts.wifi_manager",
                "scripts.network_service",
            ):
                if mod_name in sys.modules:
                    try:
                        importlib.reload(sys.modules[mod_name])
                    except Exception:
                        pass

        try:
            # 1. Trạng thái Runner
            if path == "/api/status":
                return self._send_json({
                    "status": "ok",
                    "engine": "python-portable",
                    "python_version": sys.version.split()[0],
                    "direct_execution": True,
                    "sequential_installer": True,
                })

            # 2. Thời gian hệ thống & đồng bộ giờ (Chỉ đọc ở time_status, chỉ đồng bộ khi bấm nút)
            if path == "/api/system/time_status":
                from scripts import time_sync as ts
                return self._send_json({"status": "ok", "time_info": ts.get_time_info()})

            if path == "/api/system/time_sync":
                from scripts import time_sync as ts
                sync_res = ts.sync_all()
                info_obj = sync_res.get("info")
                return self._send_json({
                    "status": "ok",
                    "success": sync_res.get("status") != "error",
                    "result": sync_res,
                    "info": info_obj,
                    "time_info": info_obj,
                })

            if path == "/api/system/time_config":
                from scripts import time_sync as ts
                cfg_file = os.path.join(ROOT_DIR, "config", "time_config.json")
                cfg = {
                    "timezone": "SE Asia Standard Time",
                    "ntp_servers": "time.windows.com, time.google.com, pool.ntp.org",
                    "auto_sync": True,
                }
                if os.path.isfile(cfg_file):
                    try:
                        with open(cfg_file, "r", encoding="utf-8") as f:
                            cfg.update(json.load(f))
                    except Exception:
                        pass
                common_tzs = getattr(ts, "COMMON_TIMEZONES", [])
                return self._send_json({
                    "status": "ok",
                    "config": cfg,
                    "common_timezones": common_tzs,
                    "time_info": ts.get_time_info(),
                })

            # 3. Nhận diện phần mềm đã cài & dữ liệu tùy biến
            if path == "/api/apps/detect_installed":
                from scripts import app_detector as ad
                custom_sig = {}
                config_file = os.path.join(ROOT_DIR, "config", "custom_apps.json")
                if os.path.isfile(config_file):
                    try:
                        with open(config_file, "r", encoding="utf-8") as f:
                            c_data = json.load(f)
                        for ca in c_data.get("custom_apps", []):
                            c_id = ca.get("id")
                            if c_id:
                                c_name = ca.get("name", "")
                                custom_sig[c_id] = {
                                    "exe_paths": [ca["exe_path"]] if ca.get("exe_path") else [],
                                    "reg_keywords": [ca.get("reg_keyword") or c_name.lower()] if c_name else [],
                                    "shortcuts": [f"{c_name}.lnk"] if c_name else [],
                                }
                    except Exception:
                        pass
                return self._send_json(ad.detect_all_installed_apps(custom_sig))

            if path == "/api/apps/custom_data":
                config_file = os.path.join(ROOT_DIR, "config", "custom_apps.json")
                data = {"custom_apps": [], "custom_groups": {}}
                if os.path.isfile(config_file):
                    try:
                        with open(config_file, "r", encoding="utf-8") as f:
                            data.update(json.load(f))
                    except Exception:
                        pass
                return self._send_json({"status": "ok", "data": data})

            # 4. Tiến trình cài đặt tuần tự
            if path in ("/api/install_progress", "/api/install_state"):
                with install_lock:
                    snapshot = dict(install_state)
                    snapshot["queue"] = [dict(q) for q in install_state.get("queue", [])]
                    snapshot["logs"] = list(install_state.get("logs", []))
                return self._send_json(snapshot)

            if path == "/api/install_control":
                action = params.get("action", [""])[0]
                idx_raw = params.get("index", ["0"])[0]
                try:
                    target_idx = int(idx_raw or 0)
                except ValueError:
                    target_idx = 0
                return self._send_json(handle_install_control(action, target_idx))

            if path == "/api/install_batch":
                raw_items = params.get("items", ["[]"])[0]
                app_items = json.loads(raw_items)
                if not isinstance(app_items, list) or not app_items:
                    return self._send_json(
                        {"status": "error", "message": "Khong co ung dung nao duoc chon!"},
                        status_code=400,
                    )
                delay_val = max(0, min(30, int(params.get("delay", ["3"])[0] or 3)))
                with install_lock:
                    if install_state["status"] in ("installing", "paused"):
                        return self._send_json(
                            {"status": "error", "message": "Dang co tien trinh cai dat dang chay!"},
                            status_code=400,
                        )
                    install_state.update({
                        "status": "installing",
                        "step_status": "installing",
                        "total_apps": len(app_items),
                        "current_index": 0,
                        "current_app": str((app_items[0] or {}).get("name", "Đang khởi tạo...")) if isinstance(app_items[0], dict) else "Đang khởi tạo...",
                        "current_stage": "Đang khởi tạo tiến trình cài đặt...",
                        "sub_progress": 5,
                    })
                t = threading.Thread(target=run_sequential_install, args=(app_items, delay_val), daemon=True)
                t.start()
                return self._send_json({"status": "started", "total": len(app_items)})

            # 5. Thực thi các tác vụ KTV minh bạch
            if path == "/api/run":
                action = params.get("action", [""])[0]
                res_data = execute_clean_ktv_action(action, params)
                http_code = res_data.get("http_status") or (200 if res_data.get("status") == "ok" else 400)
                return self._send_json(res_data, status_code=http_code)

            if path == "/api/ktv/tasks":
                return self._send_json({"status": "ok", "tasks": get_ktv_tasks()})

            # 6. Quản lý Icon (Offline + Tải có kiểm chứng SSL chuẩn)
            if path == "/api/get_icons_map":
                icons_dir = os.path.join(ROOT_DIR, "assets", "icons")
                os.makedirs(icons_dir, exist_ok=True)
                icons_map = {}
                valid_exts = {".png", ".webp", ".ico", ".jpg", ".jpeg", ".gif", ".bmp", ".svg"}

                def _icon_priority(fname: str):
                    fpath = os.path.join(icons_dir, fname)
                    _, ext = os.path.splitext(fname)
                    fsize = os.path.getsize(fpath) if os.path.isfile(fpath) else 0
                    mtime = os.path.getmtime(fpath) if os.path.isfile(fpath) else 0
                    tier = 0 if (ext.lower() == ".svg" and fsize < 1000) else 1
                    return (tier, mtime)

                for fname in sorted(os.listdir(icons_dir), key=_icon_priority):
                    stem, ext = os.path.splitext(fname)
                    if ext.lower() in valid_exts:
                        icons_map[stem.lower()] = f"assets/icons/{fname}"
                return self._send_json({"status": "ok", "icons": icons_map})

            if path == "/api/download_icon":
                app_id = re.sub(r"[^a-zA-Z0-9_\-]", "", params.get("id", [""])[0]).lower()
                icon_url = params.get("url", [""])[0].strip()
                if not app_id or not icon_url:
                    return self._send_json({"status": "error", "message": "Thiếu id hoặc URL icon!"}, 400)
                try:
                    icons_dir = os.path.join(ROOT_DIR, "assets", "icons")
                    os.makedirs(icons_dir, exist_ok=True)
                    clean_url = icon_url.replace(" ", "%20")
                    req = urllib.request.Request(clean_url, headers={"User-Agent": "Win11Toolkit/1.0"})
                    ssl_ctx = ssl.create_default_context()
                    with urllib.request.urlopen(req, timeout=10, context=ssl_ctx) as resp:
                        raw_icon = resp.read()
                        ctype = (resp.headers.get("Content-Type") or "").lower()

                    ext, fmt_name = ".png", "PNG"
                    if raw_icon.startswith(b"\x89PNG\r\n\x1a\n"):
                        ext, fmt_name = ".png", "PNG"
                    elif raw_icon.startswith(b"\xff\xd8\xff"):
                        ext, fmt_name = ".jpg", "JPEG"
                    elif len(raw_icon) > 12 and raw_icon[:4] == b"RIFF" and raw_icon[8:12] == b"WEBP":
                        ext, fmt_name = ".webp", "WebP"
                    elif raw_icon.startswith(b"\x00\x00\x01\x00"):
                        ext, fmt_name = ".ico", "ICO"
                    elif b"<svg" in raw_icon[:600].lower() or "svg" in ctype:
                        ext, fmt_name = ".svg", "SVG"

                    for old_ext in (".png", ".webp", ".ico", ".jpg", ".jpeg", ".gif", ".bmp"):
                        old_p = os.path.join(icons_dir, f"{app_id}{old_ext}")
                        if os.path.isfile(old_p) and old_ext != ext:
                            try:
                                os.remove(old_p)
                            except OSError:
                                pass

                    dest_p = os.path.join(icons_dir, f"{app_id}{ext}")
                    with open(dest_p, "wb") as f:
                        f.write(raw_icon)
                    size_kb = round(len(raw_icon) / 1024, 1)
                    return self._send_json({
                        "status": "ok",
                        "format": fmt_name,
                        "extension": ext,
                        "size_kb": size_kb,
                        "message": f"Đã tải và lưu icon cho {app_id} ({fmt_name}, {size_kb} KB)!",
                        "icon_url": f"assets/icons/{app_id}{ext}?t={int(time.time())}",
                    })
                except Exception as exc:
                    return self._send_json({
                        "status": "error",
                        "message": f"Lỗi khi tải icon: {exc}",
                        "fallback_url": icon_url,
                    })

            if path == "/api/reset_icon":
                app_id = re.sub(r"[^a-zA-Z0-9_\-]", "", params.get("id", [""])[0]).lower()
                icons_dir = os.path.join(ROOT_DIR, "assets", "icons")
                for old_ext in (".png", ".webp", ".ico", ".jpg", ".jpeg", ".gif", ".bmp"):
                    old_p = os.path.join(icons_dir, f"{app_id}{old_ext}")
                    if os.path.isfile(old_p):
                        try:
                            os.remove(old_p)
                        except OSError:
                            pass
                return self._send_json({
                    "status": "ok",
                    "message": f"Đã khôi phục icon mặc định cho {app_id}!",
                    "icon_url": f"assets/icons/{app_id}.svg?t={int(time.time())}",
                })

            # 7. Quét Máy Cũ, Lịch Sử Quét & Checklist
            if path == "/api/scan_installed":
                blocked, block_payload = get_active_install_mode_block()
                if blocked:
                    return self._send_json(block_payload, 409)
                from scripts import scan_installed as si
                apps = si.scan_installed_apps(extract_icons=True)
                return self._send_json({"status": "ok", "total": len(apps), "apps": apps})

            if path == "/api/machine_info":
                from scripts import scan_manager as scan_mgr
                return self._send_json({"status": "ok", "info": scan_mgr.get_machine_info()})

            if path == "/api/scans/list":
                from scripts import scan_manager as scan_mgr
                return self._send_json({"status": "ok", "tasks": scan_mgr.list_scan_tasks()})

            if path == "/api/scans/get":
                from scripts import scan_manager as scan_mgr
                scan_id = params.get("id", [""])[0] or params.get("scan_id", [""])[0]
                if not scan_id:
                    return self._send_json({"status": "error", "message": "Thiếu id lượt quét!"}, 400)
                task_data = scan_mgr.get_scan_task(scan_id)
                if not task_data:
                    return self._send_json({"status": "error", "message": "Không tìm thấy lượt quét này!"}, 404)
                return self._send_json({"status": "ok", **task_data} if isinstance(task_data, dict) else {"status": "ok", "task": task_data})

            if path == "/api/checklist/get":
                from scripts import scan_manager as scan_mgr
                scan_id = params.get("scan_id", [""])[0] or params.get("id", [""])[0]
                return self._send_json({"status": "ok", "checklist": scan_mgr.get_scan_checklist(scan_id)})

            if path == "/api/checklist/save":
                from scripts import scan_manager as scan_mgr
                scan_id = params.get("scan_id", [""])[0] or params.get("id", [""])[0]
                raw_data = params.get("data", ["{}"])[0]
                ok, msg = scan_mgr.save_scan_checklist(scan_id, json.loads(raw_data))
                return self._send_json({"status": "ok" if ok else "error", "message": msg}, 200 if ok else 400)

            if path == "/api/scans/create":
                blocked, block_payload = get_active_install_mode_block()
                if blocked:
                    return self._send_json(block_payload, 409)
                from scripts import scan_installed as si
                from scripts import scan_manager as scan_mgr
                cust_name = params.get("customer_name", [""])[0] or params.get("name", [""])[0]
                cust_id = params.get("user_code", [""])[0] or params.get("customer_id", [""])[0]
                stage = params.get("stage", ["tiep_nhan"])[0]
                pc_override = params.get("computer_name", [""])[0]
                pn_override = params.get("product_number", [""])[0] or params.get("pn", [""])[0]
                sn_override = params.get("serial_number", [""])[0] or params.get("sn", [""])[0]
                pc_confirmed = params.get("computer_name_confirmed", ["0"])[0].lower() in ("1", "true", "yes")
                machine_info = scan_mgr.get_machine_info(
                    customer_name=cust_name,
                    customer_id=cust_id,
                    scan_stage=stage,
                    computer_name_override=pc_override,
                    serial_override=sn_override,
                    pn_override=pn_override,
                    computer_name_confirmed=pc_confirmed,
                )
                apps = si.scan_installed_apps(extract_icons=True)
                task_info = scan_mgr.save_scan_task(machine_info, apps)
                return self._send_json({"status": "ok", "task": task_info, "apps": apps})

            if path == "/api/scans/update":
                from scripts import scan_manager as scan_mgr
                scan_id = params.get("id", [""])[0] or params.get("scan_id", [""])[0]
                lock_check = scan_mgr.check_task_lock(scan_id)
                if lock_check.get("is_locked"):
                    return self._send_json(
                        {"status": "error", "message": lock_check.get("reason", "Lượt quét đã khóa"), "lock_info": lock_check},
                        403,
                    )
                updates = {}
                for k_in, k_out in (
                    ("customer_name", "customer_name"),
                    ("name", "customer_name"),
                    ("user_code", "customer_id"),
                    ("customer_id", "customer_id"),
                    ("stage", "scan_stage"),
                    ("scan_stage", "scan_stage"),
                    ("computer_name", "computer_name"),
                    ("product_number", "product_number"),
                    ("pn", "product_number"),
                    ("serial_number", "serial_number"),
                    ("sn", "serial_number"),
                ):
                    if k_in in params and params[k_in]:
                        updates[k_out] = params[k_in][0]
                if "computer_name_confirmed" in params:
                    updates["computer_name_confirmed"] = params["computer_name_confirmed"][0].lower() in ("1", "true", "yes")
                updated = scan_mgr.update_scan_task(scan_id, updates)
                if not updated:
                    return self._send_json({"status": "error", "message": "Không tìm thấy lượt quét!"}, 404)
                return self._send_json({"status": "ok", "task": updated})

            if path == "/api/scans/delete":
                from scripts import scan_manager as scan_mgr
                scan_id = params.get("id", [""])[0] or params.get("scan_id", [""])[0]
                ok = scan_mgr.delete_scan_task(scan_id)
                return self._send_json(
                    {"status": "ok" if ok else "error", "message": "Đã xóa lượt quét!" if ok else "Không tìm thấy"},
                    200 if ok else 404,
                )

            if path == "/api/scans/lock_status":
                from scripts import scan_manager as scan_mgr
                scan_id = params.get("id", [""])[0] or params.get("scan_id", [""])[0]
                return self._send_json({"status": "ok", "lock_info": scan_mgr.check_task_lock(scan_id)})

            if path == "/api/scans/rescan":
                blocked, block_payload = get_active_install_mode_block()
                if blocked:
                    return self._send_json(block_payload, 409)
                from scripts import scan_manager as scan_mgr
                scan_id = params.get("id", [""])[0] or params.get("scan_id", [""])[0]
                res = scan_mgr.rescan_task(scan_id)
                return self._send_json(res, 200 if res.get("status") == "ok" else 403)

            if path == "/api/scans/regenerate_report":
                from scripts import scan_manager as scan_mgr
                scan_id = params.get("id", [""])[0] or params.get("scan_id", [""])[0]
                ok = scan_mgr.regenerate_task_reports(scan_id)
                return self._send_json(
                    {
                        "status": "ok" if ok else "error",
                        "success": bool(ok),
                        "report_url": f"/scans/{scan_id}/report.html" if ok else None,
                    },
                    200 if ok else 404,
                )

            if path == "/api/scans/run_step":
                blocked, block_payload = get_active_install_mode_block()
                if blocked:
                    return self._send_json(block_payload, 409)
                from scripts import disk_scanner as ds
                from scripts import disk_smart_service as dss
                from scripts import hardware_monitor_service as hms
                from scripts import scan_manager as scan_mgr

                raw_step = params.get("step", [""])[0]
                scan_id = params.get("id", [""])[0] or params.get("scan_id", [""])[0]
                if not raw_step:
                    return self._send_json({"status": "error", "message": "Thiếu tham số step (1-6)!"}, 400)
                try:
                    step = int(raw_step)
                    if step < 1 or step > 6:
                        raise ValueError("Out of range")
                except Exception:
                    return self._send_json({"status": "error", "message": f"Bước kiểm định không hợp lệ: '{raw_step}'."}, 400)

                if not scan_id:
                    return self._send_json({"status": "error", "message": "Thiếu id lượt quét!"}, 400)

                task_data = scan_mgr.get_scan_task(scan_id)
                if not task_data:
                    return self._send_json({"status": "error", "message": "Không tìm thấy lượt quét này!"}, 404)

                lock_check = scan_mgr.check_task_lock(scan_id)
                if lock_check.get("is_locked"):
                    return self._send_json(
                        {"status": "error", "message": lock_check.get("reason", "Lượt quét đã bị khóa"), "lock_info": lock_check},
                        403,
                    )

                if step == 1:
                    info_cur = task_data.get("info") or {}
                    pc_cur = info_cur.get("computer_name", "")
                    sn_cur = info_cur.get("serial_number", "")
                    pn_cur = info_cur.get("product_number", "")
                    pc_conf = bool(info_cur.get("computer_name_confirmed"))
                    machine_info = scan_mgr.get_machine_info(
                        info_cur.get("customer_name", ""),
                        info_cur.get("customer_id", ""),
                        info_cur.get("scan_stage", "tiep_nhan"),
                        computer_name_override=pc_cur if pc_conf else "",
                        serial_override=sn_cur if (sn_cur and sn_cur != "N/A") else "",
                        pn_override=pn_cur if (pn_cur and pn_cur != "N/A") else "",
                        computer_name_confirmed=pc_conf,
                    )
                    task_dir = scan_mgr.find_scan_folder(scan_id) or os.path.join(SCANS_DIR, scan_id)
                    info_path = os.path.join(task_dir, "info.json")
                    saved = dict(machine_info)
                    if os.path.isfile(info_path):
                        with open(info_path, "r", encoding="utf-8") as f:
                            saved = json.load(f)
                        preserved_scan_id = saved.get("scan_id") or scan_id
                        saved.update(machine_info)
                        saved["scan_id"] = preserved_scan_id
                        saved["folder_rel"] = f"scans/{preserved_scan_id}"
                        saved["html_file"] = f"scans/{preserved_scan_id}/report.html"
                        saved["csv_file"] = f"scans/{preserved_scan_id}/report.csv"
                        saved["json_file"] = f"scans/{preserved_scan_id}/apps.json"
                        with open(info_path, "w", encoding="utf-8") as f:
                            json.dump(saved, f, indent=2, ensure_ascii=False)
                    return self._send_json({
                        "status": "ok",
                        "step": 1,
                        "step_title": "Cấu Hình Máy, Định Danh (PN/SN) & RAM/Bus",
                        "machine_info": saved,
                    })

                if step == 2:
                    res = scan_mgr.rescan_task(scan_id)
                    return self._send_json({
                        "status": "ok" if res.get("status") == "ok" else "error",
                        "step": 2,
                        "step_title": "Danh Mục Phần Mềm & Logo Ứng Dụng",
                        "result": res,
                    }, 200 if res.get("status") == "ok" else 400)

                if step == 3:
                    ds.start_scan_async("ALL", scan_id)
                    return self._send_json({
                        "status": "ok",
                        "step": 3,
                        "step_title": "Dung Lượng Ổ Đĩa & Cây Thư Mục (TreeSize)",
                        "message": "Đã khởi chạy quét dung lượng ổ đĩa!",
                        "scan_id": scan_id,
                    })

                if step == 4:
                    disks = dss.scan_all_smart_disks()
                    dss.save_smart_to_scan_folder(scan_id, {"disks": disks})
                    return self._send_json({
                        "status": "ok",
                        "step": 4,
                        "step_title": "Sức Khỏe Ổ Cứng S.M.A.R.T (CrystalDiskInfo)",
                        "disks": disks,
                    })

                if step == 5:
                    diag = hms.get_detailed_hardware_diagnostics(force_refresh=True)
                    hms.save_hardware_diagnostics_to_scan_folder(scan_id, diag)
                    return self._send_json({
                        "status": "ok",
                        "step": 5,
                        "step_title": "Giám Sát Phần Cứng & Đồ Họa (GPU-Z, CPU-Z, HWMonitor)",
                        "diagnostics": diag,
                    })

                ok = scan_mgr.regenerate_task_reports(scan_id)
                return self._send_json({
                    "status": "ok" if ok else "error",
                    "step": 6,
                    "step_title": "Kết Xuất Báo Cáo Tổng Hợp HTML & CSV",
                    "success": bool(ok),
                    "report_url": f"/scans/{scan_id}/report.html" if ok else None,
                })

            # 8. Xuất / Nhập gói báo cáo máy khách (.zip)
            if path == "/api/scans/import_preview":
                from scripts import import_service as import_svc
                token = params.get("token", [""])[0]
                preview_html = import_svc.get_staged_report_html(token)
                if preview_html:
                    raw = preview_html.encode("utf-8")
                    self.send_response(200)
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(raw)
                else:
                    self.send_response(404)
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.end_headers()
                    self.wfile.write("<h3>Không tìm thấy bản xem trước hoặc phiên làm việc đã hết hạn.</h3>".encode("utf-8"))
                return

            if path == "/api/scans/export_zip":
                from scripts import export_task as exp_task
                from scripts import scan_manager as scan_mgr
                scan_id = params.get("id", [""])[0] or params.get("scan_id", [""])[0]
                task_dir = scan_mgr.find_scan_folder(scan_id) or os.path.join(SCANS_DIR, scan_id)
                if not os.path.isdir(task_dir):
                    return self._send_json({"status": "error", "message": f"Không tìm thấy thư mục lượt quét {scan_id}"}, 404)
                res = exp_task.package_task(task_dir)
                if not res or res.get("status") == "error":
                    return self._send_json({"status": "error", "message": "Lỗi khi đóng gói file zip"}, 500)
                zip_name = res.get("zip_name") or os.path.basename(res.get("zip_path", ""))
                res["download_url"] = f"/api/scans/download_zip?file={urllib.parse.quote(zip_name)}"
                res["status"] = "ok"
                return self._send_json(res)

            if path == "/api/scans/download_zip":
                file_name = os.path.basename(params.get("file", [""])[0])
                zip_path = os.path.join(SCANS_DIR, file_name)
                if file_name.lower().endswith(".zip") and os.path.isfile(zip_path):
                    fsize = os.path.getsize(zip_path)
                    self.send_response(200)
                    self.send_header("Content-Type", "application/zip")
                    self.send_header("Content-Disposition", f'attachment; filename="{file_name}"')
                    self.send_header("Content-Length", str(fsize))
                    self.end_headers()
                    with open(zip_path, "rb") as f:
                        shutil.copyfileobj(f, self.wfile)
                    return
                self.send_response(404)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.end_headers()
                self.wfile.write("Không tìm thấy file zip được yêu cầu.".encode("utf-8"))
                return

            # 9. Quét ổ cứng TreeSize & S.M.A.R.T & Giám sát phần cứng & Mạng
            if path == "/api/disk_scan/drives":
                from scripts import disk_scanner as ds
                return self._send_json({"status": "ok", "drives": ds.get_logical_drives()})

            if path == "/api/disk_scan/progress":
                from scripts import disk_scanner as ds
                return self._send_json({"status": "ok", "progress": ds.get_scan_progress()})

            if path == "/api/disk_scan/admin_status":
                from scripts import disk_scanner as ds
                return self._send_json({"status": "ok", **ds.get_admin_status()})

            if path == "/api/disk_scan/start":
                blocked, block_payload = get_active_install_mode_block()
                if blocked:
                    return self._send_json(block_payload, 409)
                from scripts import disk_scanner as ds
                from scripts import scan_manager as scan_mgr
                drive_arg = params.get("drive", ["ALL"])[0].strip()
                scan_id = params.get("scan_id", [""])[0].strip()
                if scan_id:
                    lock_check = scan_mgr.check_task_lock(scan_id)
                    if lock_check.get("is_locked"):
                        return self._send_json(
                            {"status": "error", "message": lock_check.get("reason", "Đã khóa"), "lock_info": lock_check},
                            403,
                        )
                started = ds.start_scan_async(drive_arg, scan_id)
                if not started:
                    return self._send_json(
                        {"status": "busy", "message": "Đang có tiến trình quét ổ cứng chạy!", "target": drive_arg, "scan_id": scan_id},
                        409,
                    )
                return self._send_json(
                    {"status": "ok", "message": "Đã bắt đầu quét dung lượng ổ đĩa!", "target": drive_arg, "scan_id": scan_id}
                )

            if path == "/api/disk_scan/run":
                blocked, block_payload = get_active_install_mode_block()
                if blocked:
                    return self._send_json(block_payload, 409)
                from scripts import disk_scanner as ds
                from scripts import scan_manager as scan_mgr
                drive_arg = params.get("drive", ["ALL"])[0].strip()
                scan_id = params.get("scan_id", [""])[0].strip()
                if scan_id:
                    lock_check = scan_mgr.check_task_lock(scan_id)
                    if lock_check.get("is_locked"):
                        return self._send_json(
                            {"status": "error", "message": lock_check.get("reason", "Đã khóa"), "lock_info": lock_check},
                            403,
                        )
                drives = ds.get_logical_drives()
                trees = []
                if drive_arg.upper() == "ALL":
                    for d in drives:
                        letter = d.get("letter", "").rstrip(":\\/")
                        if letter:
                            trees.append(ds.scan_drive_root(letter, max_children_depth=2))
                else:
                    letter = drive_arg.rstrip(":\\/")
                    trees.append(ds.scan_drive_root(letter, max_children_depth=2))
                payload = {
                    "status": "ok",
                    "drives": drives,
                    "trees": trees,
                    "scanned_at": datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                }
                if scan_id:
                    ds.save_disk_tree_to_task(scan_id, payload)
                return self._send_json(payload)

            if path == "/api/disk_scan/expand":
                from scripts import disk_scanner as ds
                target_path = params.get("path", [""])[0].strip()
                expand_type = params.get("type", ["folder"])[0].strip()
                if not target_path:
                    return self._send_json({"status": "error", "message": "Thiếu path!"}, 400)
                children = ds.get_folder_files(target_path) if expand_type == "files" else ds.expand_folder_children(target_path)
                return self._send_json({"status": "ok", "path": target_path, "type": expand_type, "children": children})

            if path == "/api/disk_scan/files":
                from scripts import disk_scanner as ds
                target_path = params.get("path", [""])[0].strip()
                if not target_path:
                    return self._send_json({"status": "error", "message": "Thiếu path!"}, 400)
                return self._send_json({"status": "ok", "path": target_path, "files": ds.get_folder_files(target_path)})

            if path == "/api/disk_scan/get":
                from scripts import disk_scanner as ds
                scan_id = params.get("scan_id", [""])[0].strip()
                if not scan_id:
                    return self._send_json({"status": "error", "message": "Thiếu scan_id!"}, 400)
                data = ds.load_disk_tree_from_task(scan_id)
                if data:
                    return self._send_json({"status": "ok", "has_data": True, **data})
                return self._send_json({"status": "ok", "has_data": False})

            # 10. Đồng hồ báo cáo & cấu hình NTP trong Quét Máy Cũ
            if path == "/api/time":
                from scripts import scan_manager as scan_mgr
                cfg = scan_mgr.load_time_settings()
                eff_dt = scan_mgr.get_effective_datetime()
                presets = getattr(scan_mgr, "TIME_SERVERS_PRESETS", {})
                return self._send_json({
                    "status": "ok",
                    "server_time_iso": datetime.datetime.now().isoformat(),
                    "effective_time_iso": eff_dt.isoformat(),
                    "timestamp": eff_dt.timestamp(),
                    "date_str": eff_dt.strftime("%d/%m/%Y"),
                    "time_str": eff_dt.strftime("%H:%M:%S"),
                    "full_str": eff_dt.strftime("%d/%m/%Y %H:%M:%S"),
                    "config": cfg,
                    "presets": presets,
                    "server_source": {
                        "preset": cfg.get("time_server_preset", "google_ntp"),
                        "url": cfg.get("last_sync_server_url", "time.google.com"),
                        "name": cfg.get("last_sync_server_name", "Google Public NTP"),
                        "status": cfg.get("last_sync_status", "unverified"),
                        "latency_ms": cfg.get("last_sync_latency_ms", 0),
                        "drift_seconds": cfg.get("server_drift_seconds", 0.0),
                        "last_sync_time": cfg.get("last_sync_server_time", ""),
                        "last_sync_error": cfg.get("last_sync_error", ""),
                    },
                })

            if path == "/api/time/config":
                from scripts import scan_manager as scan_mgr
                return self._send_json({
                    "status": "ok",
                    "config": scan_mgr.load_time_settings(),
                    "presets": getattr(scan_mgr, "TIME_SERVERS_PRESETS", {}),
                })

            if path == "/api/time/sync":
                from scripts import scan_manager as scan_mgr
                preset = params.get("preset", [""])[0] or None
                server_url = params.get("url", [""])[0] or None
                sync_res = scan_mgr.sync_server_time(preset_key=preset, custom_url=server_url, save=True)
                eff_dt = scan_mgr.get_effective_datetime()
                return self._send_json({
                    "status": "ok",
                    "sync_result": sync_res,
                    "config": scan_mgr.load_time_settings(),
                    "effective_time_iso": eff_dt.isoformat(),
                    "full_str": eff_dt.strftime("%d/%m/%Y %H:%M:%S"),
                })

            if path == "/api/time/test_server":
                from scripts import scan_manager as scan_mgr
                preset = params.get("preset", [""])[0] or None
                server_url = params.get("url", [""])[0] or None
                return self._send_json({
                    "status": "ok",
                    "test_result": scan_mgr.query_server_time(preset_key=preset, custom_url=server_url),
                })

            if path == "/api/time/save":
                from scripts import scan_manager as scan_mgr
                to_update = {
                    "mode": params.get("mode", ["auto"])[0],
                    "manual_datetime": params.get("datetime", [""])[0],
                    "lock_duration_hours": int(params.get("lock_hours", [24])[0]),
                    "strict_machine_check": params.get("strict", ["1"])[0] in ("1", "true", "True"),
                    "manual_offset_minutes": float(params.get("offset", [0])[0]),
                    "time_server_preset": params.get("preset", ["google_ntp"])[0],
                    "time_server_url": params.get("url", [""])[0],
                }
                updated = scan_mgr.save_time_settings(to_update)
                return self._send_json({"status": "ok", "config": updated})

            if path == "/api/disk_smart/open_gui":
                from scripts import disk_smart_service as dss
                ok, msg = dss.open_crystaldiskinfo_gui()
                return self._send_json({"status": "ok" if ok else "error", "message": msg})

            if path in ("/api/disk_smart/scan", "/api/smart/health"):
                blocked, block_payload = get_active_install_mode_block()
                if blocked:
                    return self._send_json(block_payload, 409)
                from scripts import disk_smart_service as dss
                return self._send_json({"status": "ok", "disks": dss.scan_all_smart_disks()})

            if path == "/api/hardware_monitor/tools":
                from scripts import hardware_monitor_service as hms
                return self._send_json({"status": "ok", "tools": hms.get_tools_summary()})

            if path == "/api/hardware_monitor/open":
                from scripts import hardware_monitor_service as hms
                tool_id = params.get("tool", [""])[0]
                ok, msg = hms.launch_hardware_tool(tool_id)
                return self._send_json({"status": "ok" if ok else "error", "message": msg})

            if path in ("/api/hardware_monitor/diagnostics", "/api/hardware_diagnostics"):
                from scripts import hardware_monitor_service as hms
                force = params.get("force", ["0"])[0].lower() in ("1", "true", "yes")
                return self._send_json({"status": "ok", "diagnostics": hms.get_detailed_hardware_diagnostics(force_refresh=force)})

            if path == "/api/network/adapters":
                from scripts import network_service as ns
                force = params.get("force", ["0"])[0].lower() in ("1", "true", "yes")
                res = ns.scan_network_adapters(force_refresh=force)
                if isinstance(res, dict) and "adapters" in res:
                    return self._send_json(res)
                return self._send_json({"status": "ok", "adapters": res if isinstance(res, list) else []})

            if path == "/api/network/ping":
                from scripts import network_service as ns
                return self._send_json(ns.ping_all_targets())

            if path == "/api/network/open_ncpa":
                from scripts import network_service as ns
                ok, msg = ns.open_ncpa()
                return self._send_json({"status": "ok" if ok else "error", "message": msg})

            if path == "/api/network/flush_dns":
                from scripts import network_service as ns
                ok, msg = ns.flush_dns()
                return self._send_json({"status": "ok" if ok else "error", "message": msg})

            # 11. Cấu hình trung tâm (toolkit_config.json) & Quản lý Wi-Fi AP thông minh
            if path == "/api/config/toolkit":
                from scripts import config_manager as cm
                cfg = cm.load_toolkit_config()
                return self._send_json({
                    "ok": True,
                    "status": "ok",
                    "config": cfg,
                    "config_paths": cm.CONFIG_PATHS,
                    "primary_path": cm.get_primary_config_path(),
                })

            if path == "/api/wifi/status":
                from scripts import wifi_manager as wm
                force = params.get("force", ["0"])[0].lower() in ("1", "true", "yes")
                st = wm.get_wifi_full_status(force_scan=force)
                return self._send_json({
                    "ok": True,
                    "status": st,
                    **{k: v for k, v in st.items() if k != "status"},
                })

            if path == "/api/wifi/provision":
                from scripts import wifi_manager as wm
                force = params.get("force", ["0"])[0].lower() in ("1", "true", "yes")
                target_ssid = params.get("ssid", [""])[0].strip() or None
                res = wm.run_smart_wifi_provisioning(force=force, target_ssid=target_ssid)
                res["action_taken"] = res.get("status", "ok")
                return self._send_json({
                    "ok": True,
                    "result": res,
                    **res,
                })

            return self._send_json({"status": "error", "message": f"API không tồn tại: {path}"}, 404)

        except Exception as exc:
            traceback.print_exc()
            return self._send_json({"status": "error", "message": str(exc)}, 500)

    def do_POST(self):
        if not self._is_loopback_client():
            self.send_error(403, "Localhost only")
            return

        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)
        content_len = int(self.headers.get("Content-Length", 0) or 0)

        try:
            if path == "/api/scans/import_verify":
                from scripts import import_service as import_svc
                filename = (
                    params.get("filename", [""])[0]
                    or self.headers.get("X-Filename", "")
                    or "report.html"
                )
                raw_bytes = self.rfile.read(content_len) if content_len > 0 else b""
                res = import_svc.verify_and_stage_upload(raw_bytes, os.path.basename(filename))
                return self._send_json(res, 200 if res.get("status") != "error" else 400)

            raw_body = self.rfile.read(content_len).decode("utf-8", errors="replace") if content_len > 0 else "{}"
            post_data = json.loads(raw_body or "{}")

            if path == "/api/install_control":
                action = post_data.get("action") or params.get("action", [""])[0]
                return self._send_json(handle_install_control(action))

            if path == "/api/checklist/save":
                from scripts import scan_manager as scan_mgr
                scan_id = post_data.get("scan_id") or post_data.get("id") or params.get("scan_id", [""])[0]
                if not scan_id:
                    return self._send_json({"status": "error", "message": "Thiếu scan_id!"}, 400)
                ok, msg = scan_mgr.save_scan_checklist(scan_id, post_data)
                return self._send_json({"status": "ok" if ok else "error", "message": msg}, 200 if ok else 400)

            if path == "/api/disk_smart/scan":
                blocked, block_payload = get_active_install_mode_block()
                if blocked:
                    return self._send_json(block_payload, 409)
                from scripts import disk_smart_service as dss
                return self._send_json({"status": "ok", "disks": dss.scan_all_smart_disks()})

            if path == "/api/disk_smart/ai_doctor":
                from scripts import disk_smart_service as dss
                disk = post_data.get("disk") or post_data
                diagnosis = dss.diagnose_disk_ai(disk)
                return self._send_json({
                    "status": "ok",
                    "diagnosis": diagnosis,
                    "aiModel": "Hardware SMART Specialist",
                })

            if path == "/api/disk_smart/save":
                from scripts import disk_smart_service as dss
                from scripts import scan_manager as scan_mgr
                scan_id = post_data.get("scanId") or post_data.get("scan_id") or "current_scan"
                res_path = dss.save_smart_to_scan_folder(scan_id, post_data)
                scan_mgr.regenerate_task_reports(scan_id)
                return self._send_json({"status": "ok", "success": bool(res_path), "path": res_path})

            if path == "/api/hardware_monitor/save":
                from scripts import hardware_monitor_service as hms
                from scripts import scan_manager as scan_mgr
                scan_id = post_data.get("scanId") or post_data.get("scan_id") or "current_scan"
                res_path = hms.save_hardware_diagnostics_to_scan_folder(scan_id, post_data)
                scan_mgr.regenerate_task_reports(scan_id)
                return self._send_json({"status": "ok", "success": bool(res_path), "path": res_path})

            if path == "/api/scans/import_confirm":
                from scripts import import_service as import_svc
                token = post_data.get("token", "")
                overwrite = bool(post_data.get("overwrite", True))
                ok, res_id = import_svc.confirm_and_import_task(token, overwrite=overwrite)
                if ok:
                    return self._send_json({
                        "status": "ok",
                        "scan_id": res_id,
                        "message": "Đã thêm lượt quét thành công vào Lịch Sử Quét Máy!",
                    })
                return self._send_json({"status": "error", "message": str(res_id)}, 400)

            if path == "/api/apps/custom_data":
                config_dir = os.path.join(ROOT_DIR, "config")
                os.makedirs(config_dir, exist_ok=True)
                config_file = os.path.join(config_dir, "custom_apps.json")
                with open(config_file, "w", encoding="utf-8") as f:
                    json.dump(post_data, f, ensure_ascii=False, indent=2)
                return self._send_json({
                    "status": "ok",
                    "message": "Đã lưu cấu hình phần mềm và phân nhóm thành công!",
                })

            if path == "/api/system/time_config":
                from scripts import time_sync as ts
                config_dir = os.path.join(ROOT_DIR, "config")
                os.makedirs(config_dir, exist_ok=True)
                config_file = os.path.join(config_dir, "time_config.json")
                with open(config_file, "w", encoding="utf-8") as f:
                    json.dump(post_data, f, ensure_ascii=False, indent=2)
                apply_res = ts.apply_custom_config(post_data)
                return self._send_json({
                    "status": "ok",
                    "message": "Đã lưu và áp dụng cấu hình thời gian thành công!",
                    "result": apply_res,
                })

            if path == "/api/config/toolkit":
                from scripts import config_manager as cm
                saved = cm.save_toolkit_config(post_data)
                return self._send_json({
                    "ok": True,
                    "status": "ok",
                    "message": "Đã lưu và đồng bộ file cấu hình toolkit_config.json thành công!",
                    "config": saved,
                    "config_paths": cm.CONFIG_PATHS,
                })

            if path == "/api/wifi/provision":
                from scripts import wifi_manager as wm
                force = bool(post_data.get("force", False))
                target_ssid = (post_data.get("ssid") or "").strip() or None
                res = wm.run_smart_wifi_provisioning(force=force, target_ssid=target_ssid)
                res["action_taken"] = res.get("status", "ok")
                return self._send_json({
                    "ok": True,
                    "result": res,
                    **res,
                })

            if path == "/api/wifi/ap_save":
                from scripts import config_manager as cm
                cfg = cm.load_toolkit_config()
                ap_list = cfg.setdefault("wifi_config", {}).setdefault("access_points", [])
                new_ap = post_data.get("ap") or post_data
                ssid = (new_ap.get("ssid") or "").strip()
                if not ssid:
                    return self._send_json({"ok": False, "status": "error", "message": "Vui lòng nhập tên Wi-Fi (SSID)!"}, 400)

                ap_id = (new_ap.get("id") or "").strip() or f"ap_{int(time.time())}"
                entry = {
                    "id": ap_id,
                    "ssid": ssid,
                    "password": new_ap.get("password") or "",
                    "auth": new_ap.get("auth") or "WPA2PSK",
                    "cipher": new_ap.get("cipher") or new_ap.get("encryption") or "AES",
                    "priority": int(new_ap.get("priority") or (len(ap_list) + 1)),
                    "auto_connect": bool(new_ap.get("auto_connect", True)),
                    "hidden": bool(new_ap.get("hidden", False)),
                    "scope": new_ap.get("scope") or "all",
                    "note": (new_ap.get("note") or "").strip(),
                }

                replaced = False
                for i, existing in enumerate(ap_list):
                    if existing.get("id") == ap_id or (existing.get("ssid") or "").strip().lower() == ssid.lower():
                        ap_list[i] = entry
                        replaced = True
                        break
                if not replaced:
                    ap_list.append(entry)

                ap_list.sort(key=lambda x: int(x.get("priority", 99)))
                cfg["wifi_access_points"] = ap_list
                saved_cfg = cm.save_toolkit_config(cfg)
                return self._send_json({
                    "ok": True,
                    "status": "ok",
                    "message": f"Đã lưu cấu hình Wi-Fi AP '{ssid}' vào toolkit_config.json!",
                    "config": saved_cfg,
                })

            if path == "/api/wifi/ap_delete":
                from scripts import config_manager as cm
                cfg = cm.load_toolkit_config()
                ap_list = cfg.setdefault("wifi_config", {}).setdefault("access_points", [])
                target_id = (post_data.get("id") or "").strip()
                target_ssid = (post_data.get("ssid") or "").strip().lower()
                new_list = [
                    a for a in ap_list
                    if not (
                        (target_id and a.get("id") == target_id)
                        or (target_ssid and (a.get("ssid") or "").strip().lower() == target_ssid)
                    )
                ]
                cfg["wifi_config"]["access_points"] = new_list
                cfg["wifi_access_points"] = new_list
                saved_cfg = cm.save_toolkit_config(cfg)
                return self._send_json({
                    "ok": True,
                    "status": "ok",
                    "message": "Đã xóa AP khỏi toolkit_config.json!",
                    "config": saved_cfg,
                })

            if path == "/api/scans/update":
                from scripts import scan_manager as scan_mgr
                scan_id = post_data.get("id") or post_data.get("scan_id") or params.get("id", [""])[0] or params.get("scan_id", [""])[0]
                if not scan_id:
                    return self._send_json({"status": "error", "message": "Thiếu id lượt quét!"}, 400)
                lock_check = scan_mgr.check_task_lock(scan_id)
                if lock_check.get("is_locked"):
                    return self._send_json(
                        {"status": "error", "message": lock_check.get("reason", "Lượt quét đã khóa"), "lock_info": lock_check},
                        403,
                    )
                updates = {}
                for k_in, k_out in (
                    ("customer_name", "customer_name"),
                    ("name", "customer_name"),
                    ("user_code", "customer_id"),
                    ("customer_id", "customer_id"),
                    ("stage", "scan_stage"),
                    ("scan_stage", "scan_stage"),
                    ("computer_name", "computer_name"),
                    ("product_number", "product_number"),
                    ("pn", "product_number"),
                    ("serial_number", "serial_number"),
                    ("sn", "serial_number"),
                ):
                    if k_in in post_data and post_data[k_in] is not None:
                        updates[k_out] = post_data[k_in]
                if "computer_name_confirmed" in post_data:
                    updates["computer_name_confirmed"] = bool(post_data["computer_name_confirmed"])
                updated = scan_mgr.update_scan_task(scan_id, updates)
                if not updated:
                    return self._send_json({"status": "error", "message": "Không tìm thấy lượt quét!"}, 404)
                return self._send_json({"status": "ok", "task": updated})

            if path == "/api/system/rename_computer":
                new_name = str(post_data.get("new_name") or post_data.get("computer_name") or "").strip()
                if not new_name:
                    return self._send_json({"status": "error", "message": "Vui lòng nhập tên máy tính mới!"}, 400)
                if len(new_name) > 15 or not re.match(r"^[A-Za-z0-9][A-Za-z0-9-]{0,14}$", new_name) or new_name.isdigit():
                    return self._send_json({
                        "status": "error",
                        "message": "Tên máy tính Windows (NetBIOS) tối đa 15 ký tự, chỉ gồm chữ cái A-Z, số 0-9 và dấu gạch ngang (-), không chỉ toàn số và không bắt đầu bằng '-'.",
                    }, 400)
                cur_pc = os.environ.get("COMPUTERNAME", "")
                if cur_pc.upper() == new_name.upper():
                    return self._send_json({
                        "status": "ok",
                        "already_same": True,
                        "restart_required": False,
                        "computer_name": cur_pc,
                        "message": f"Tên máy tính hiện tại đã là '{cur_pc}'.",
                    })
                ps_cmd = f"Rename-Computer -NewName '{new_name}' -Force -ErrorAction Stop"
                no_win = getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000)
                proc = subprocess.run(
                    ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command", ps_cmd],
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                    errors="replace",
                    timeout=15,
                    creationflags=no_win,
                )
                if proc.returncode == 0:
                    return self._send_json({
                        "status": "ok",
                        "restart_required": True,
                        "computer_name": new_name,
                        "message": f"Đã đổi tên máy Windows sang '{new_name}' thành công! Hệ thống sẽ áp dụng tên mới hoàn toàn sau khi khởi động lại (Restart).",
                    })
                err_txt = (proc.stderr or proc.stdout or "").strip()
                is_perm = "access" in err_txt.lower() or "privilege" in err_txt.lower() or "denied" in err_txt.lower()
                msg = (
                    "Không đủ quyền Administrator để đổi tên máy trong Windows (hãy chạy Tool bằng Run as Administrator nếu muốn đổi tên cấp OS). Tên máy trong báo cáo vẫn được lưu bình thường."
                    if is_perm else f"Không thể đổi tên máy Windows: {err_txt or 'Lỗi không xác định'}"
                )
                return self._send_json({"status": "error", "permission_denied": is_perm, "message": msg}, 403 if is_perm else 400)

            if path == "/api/ktv/tasks/save":
                tasks_data = post_data.get("tasks") if isinstance(post_data, dict) and "tasks" in post_data else post_data
                ok, msg = save_ktv_tasks(tasks_data)
                return self._send_json({"status": "ok" if ok else "error", "message": msg, "tasks": get_ktv_tasks()}, 200 if ok else 400)

            if path == "/api/ktv/run_command":
                cmd_str = str(post_data.get("command", "") or "")
                task_id = str(post_data.get("task_id", "") or post_data.get("id", "") or "").strip().lower()
                if task_id == "scan-old" or "export-installed-software" in cmd_str.lower():
                    blocked, block_payload = get_active_install_mode_block()
                    if blocked:
                        return self._send_json(block_payload, 409)
                res = run_custom_ktv_command(
                    cmd_type=post_data.get("cmd_type", "powershell"),
                    command=cmd_str,
                    title=post_data.get("title", ""),
                    test_mode=bool(post_data.get("test_mode", False)),
                )
                return self._send_json(res)

            return self._send_json({"status": "error", "message": f"API không tồn tại: {path}"}, 404)

        except Exception as exc:
            traceback.print_exc()
            return self._send_json({"status": "error", "message": str(exc)}, 500)


class LocalThreadingServer(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True

    def handle_error(self, request, client_address):
        exc_type = sys.exc_info()[0]
        if exc_type in (ConnectionResetError, BrokenPipeError, ConnectionAbortedError):
            return
        super().handle_error(request, client_address)


def _open_toolkit_browser_when_ready(url: str) -> None:
    """Đợi server sẵn sàng rồi mở trình duyệt, bỏ qua màn hình First-Run / Đồng bộ trên Windows mới."""
    import socket as _sock
    deadline = time.time() + 5.0
    while time.time() < deadline:
        s = _sock.socket(_sock.AF_INET, _sock.SOCK_STREAM)
        s.settimeout(0.3)
        try:
            s.connect((HOST, PORT))
            s.close()
            break
        except Exception:
            try:
                s.close()
            except Exception:
                pass
            time.sleep(0.1)

    if os.name == "nt":
        prog_id = ""
        try:
            import winreg
            with winreg.OpenKey(
                winreg.HKEY_CURRENT_USER,
                r"Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice",
            ) as k:
                prog_id = str(winreg.QueryValueEx(k, "ProgId")[0] or "")
        except Exception:
            prog_id = ""

        edge_paths = [
            os.path.expandvars(r"%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"),
            os.path.expandvars(r"%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"),
            os.path.expandvars(r"%LocalAppData%\Microsoft\Edge\Application\msedge.exe"),
        ]
        chrome_paths = [
            os.path.expandvars(r"%ProgramFiles%\Google\Chrome\Application\chrome.exe"),
            os.path.expandvars(r"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"),
            os.path.expandvars(r"%LocalAppData%\Google\Chrome\Application\chrome.exe"),
        ]

        browser_exe = None
        extra_flags = ["--no-first-run", "--no-default-browser-check"]
        if "chrome" in prog_id.lower():
            browser_exe = next((p for p in chrome_paths if os.path.isfile(p)), None)
        elif "edge" in prog_id.lower() or not prog_id:
            browser_exe = next((p for p in edge_paths if os.path.isfile(p)), None)
            extra_flags.append("--disable-features=msEdgeFRE,msEdgeFreWelcomePage")

        if browser_exe:
            try:
                subprocess.Popen([browser_exe, *extra_flags, url], close_fds=True)
                return
            except Exception:
                pass

    try:
        webbrowser.open(url)
    except Exception:
        pass


def main() -> None:
    print("==================================================================")
    print("   WINDOWS 11 TOOLKIT & HUB - LOCAL WEBUI SERVER (127.0.0.1)")
    print(f"   Phiên bản Python:  {sys.version.split()[0]} (Portable Localhost)")
    print(f"   Địa chỉ nội bộ:    http://{HOST}:{PORT}/")
    print("   Bảo mật:           Chỉ lắng nghe Localhost (Không mở cổng LAN)")
    print("==================================================================")

    httpd = LocalThreadingServer((HOST, PORT), ToolkitRequestHandler)
    threading.Thread(target=_open_toolkit_browser_when_ready, args=(f"http://localhost:{PORT}/",), daemon=True).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nĐang dừng máy chủ WebUI...")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
