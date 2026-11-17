import os
import sys
import json
import time
import shutil
import string
import ctypes
import datetime
import threading

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCANS_DIR = os.path.join(ROOT_DIR, "scans")

# Windows constants
FILE_ATTRIBUTE_REPARSE_POINT = 0x400

def enable_windows_backup_privileges():
    """
    Kích hoạt SeBackupPrivilege và SeRestorePrivilege cho tiến trình để bypass ACL NTFS,
    cho phép quét sâu mọi thư mục hệ thống (System Volume Information, System32, Config...)
    mà không bị lỗi Access is denied.
    """
    try:
        from ctypes import wintypes
        advapi32 = ctypes.windll.advapi32
        kernel32 = ctypes.windll.kernel32

        kernel32.GetCurrentProcess.restype = wintypes.HANDLE
        advapi32.OpenProcessToken.argtypes = [wintypes.HANDLE, wintypes.DWORD, ctypes.POINTER(wintypes.HANDLE)]
        advapi32.OpenProcessToken.restype = wintypes.BOOL

        class LUID(ctypes.Structure):
            _fields_ = [('LowPart', wintypes.DWORD), ('HighPart', wintypes.LONG)]

        class LUID_AND_ATTRIBUTES(ctypes.Structure):
            _fields_ = [('Luid', LUID), ('Attributes', wintypes.DWORD)]

        class TOKEN_PRIVILEGES(ctypes.Structure):
            _fields_ = [('PrivilegeCount', wintypes.DWORD), ('Privileges', LUID_AND_ATTRIBUTES * 1)]

        advapi32.LookupPrivilegeValueW.argtypes = [wintypes.LPCWSTR, wintypes.LPCWSTR, ctypes.POINTER(LUID)]
        advapi32.LookupPrivilegeValueW.restype = wintypes.BOOL
        advapi32.AdjustTokenPrivileges.argtypes = [wintypes.HANDLE, wintypes.BOOL, ctypes.POINTER(TOKEN_PRIVILEGES), wintypes.DWORD, ctypes.c_void_p, ctypes.c_void_p]
        advapi32.AdjustTokenPrivileges.restype = wintypes.BOOL

        hToken = wintypes.HANDLE()
        hProcess = kernel32.GetCurrentProcess()
        if advapi32.OpenProcessToken(hProcess, 0x0020 | 0x0008, ctypes.byref(hToken)):
            for priv in ['SeBackupPrivilege', 'SeRestorePrivilege']:
                luid = LUID()
                if advapi32.LookupPrivilegeValueW(None, priv, ctypes.byref(luid)):
                    tp = TOKEN_PRIVILEGES()
                    tp.PrivilegeCount = 1
                    tp.Privileges[0].Luid = luid
                    tp.Privileges[0].Attributes = 0x00000002 # SE_PRIVILEGE_ENABLED
                    advapi32.AdjustTokenPrivileges(hToken, False, ctypes.byref(tp), 0, None, None)
            kernel32.CloseHandle(hToken)
            return True
    except Exception:
        pass
    return False

ENABLE_BACKUP_PRIV_RESULT = enable_windows_backup_privileges()

def get_admin_status():
    is_admin = False
    try:
        is_admin = bool(ctypes.windll.shell32.IsUserAnAdmin() != 0)
    except Exception:
        pass
    return {
        "is_admin": is_admin,
        "backup_privilege": ENABLE_BACKUP_PRIV_RESULT,
        "mode_label": "Quản Trị Viên (Full Admin + SeBackupPrivilege Bypass ACL)" if is_admin else "Người Dùng Thường (Standard User)"
    }

# Thread-safe global scanning progress
_progress_lock = threading.Lock()
DISK_SCAN_PROGRESS = {
    "is_scanning": False,
    "scan_type": "idle",       # "full", "single", "expand"
    "target": "ALL",
    "phase": "idle",
    "current_path": "",
    "current_folder_name": "",
    "files_scanned": 0,
    "dirs_scanned": 0,
    "bytes_scanned": 0,
    "start_time": 0,
    "elapsed_sec": 0,
    "speed_files_sec": 0,
    "speed_mb_sec": 0,
    "percent": 0,
    "status_text": "Sẵn sàng",
    "done": False,
    "summary": "",
    "error": None,
    "result": None
}

def format_size(bytes_val):
    if bytes_val is None or bytes_val < 0:
        return "0 B"
    if bytes_val < 1024:
        return f"{bytes_val} B"
    elif bytes_val < 1024**2:
        return f"{bytes_val / 1024:.1f} KB"
    elif bytes_val < 1024**3:
        return f"{bytes_val / (1024**2):.1f} MB"
    elif bytes_val < 1024**4:
        return f"{bytes_val / (1024**3):.1f} GB"
    else:
        return f"{bytes_val / (1024**4):.2f} TB"

def is_reparse_point(entry_or_path):
    """
    Kiem tra mot thu muc co phai la Reparse Point / Junction (lien ket he thong Windows)
    de tranh loi lap vo tan va access denied lam treo tien trinh quet.
    """
    try:
        if hasattr(entry_or_path, "is_symlink") and entry_or_path.is_symlink():
            return True
        if hasattr(entry_or_path, "stat"):
            st = entry_or_path.stat(follow_symlinks=False)
            attrs = getattr(st, "st_file_attributes", 0)
            return bool(attrs & FILE_ATTRIBUTE_REPARSE_POINT)
        elif isinstance(entry_or_path, str):
            st = os.stat(entry_or_path, follow_symlinks=False)
            attrs = getattr(st, "st_file_attributes", 0)
            return bool(attrs & FILE_ATTRIBUTE_REPARSE_POINT)
    except Exception:
        return True
    return False

def get_scan_progress():
    with _progress_lock:
        data = dict(DISK_SCAN_PROGRESS)
        if data["is_scanning"] and data["start_time"] > 0:
            elapsed = max(0.05, time.time() - data["start_time"])
            data["elapsed_sec"] = round(elapsed, 1)
            if elapsed > 0:
                data["speed_files_sec"] = round(data["files_scanned"] / elapsed)
                data["speed_mb_sec"] = round((data["bytes_scanned"] / (1024**2)) / elapsed, 1)
        return data

def get_logical_drives():
    drives = []
    try:
        bitmask = ctypes.windll.kernel32.GetLogicalDrives()
        for letter in string.ascii_uppercase:
            if bitmask & 1:
                root_path = f"{letter}:\\"
                try:
                    total, used, free = shutil.disk_usage(root_path)
                    pct = round((used / total) * 100, 1) if total > 0 else 0
                    drives.append({
                        "drive": f"{letter}:",
                        "root": root_path,
                        "total_bytes": total,
                        "used_bytes": used,
                        "free_bytes": free,
                        "total_human": format_size(total),
                        "used_human": format_size(used),
                        "free_human": format_size(free),
                        "percent": pct
                    })
                except Exception:
                    pass
            bitmask >>= 1
    except Exception:
        # Fallback
        for letter in ["C", "D", "E", "F"]:
            root = f"{letter}:\\"
            if os.path.exists(root):
                try:
                    total, used, free = shutil.disk_usage(root)
                    pct = round((used / total) * 100, 1) if total > 0 else 0
                    drives.append({
                        "drive": f"{letter}:",
                        "root": root,
                        "total_bytes": total,
                        "used_bytes": used,
                        "free_bytes": free,
                        "total_human": format_size(total),
                        "used_human": format_size(used),
                        "free_human": format_size(free),
                        "percent": pct
                    })
                except Exception:
                    pass
    return drives

def compute_folder_metrics(path, max_items=50000, timeout_sec=2.5, on_progress=None):
    """
    Tinh toan dung luong thuc te, so luong file, so luong thu muc con mot cach toi uu.
    Loai bo triet de Reparse Point / Junction point de khong bao gio bi treo hoac lap vo tan.
    Dung gioi han theo so luong file thuc te, khong de so luong thu muc con lam dung som.
    """
    t_start = time.time()
    total_size = 0
    file_cnt = 0
    dir_cnt = 0
    latest_mtime = 0
    stack = [path]
    items_since_last_prog = 0

    while stack and file_cnt < max_items:
        if time.time() - t_start > timeout_sec:
            break
        curr = stack.pop()
        try:
            with os.scandir(curr) as it:
                for entry in it:
                    try:
                        # Bo qua symlink va reparse point (Junction)
                        if is_reparse_point(entry):
                            continue
                        st = entry.stat(follow_symlinks=False)
                        if st.st_mtime > latest_mtime:
                            latest_mtime = st.st_mtime
                        if entry.is_file(follow_symlinks=False):
                            total_size += st.st_size
                            file_cnt += 1
                            items_since_last_prog += 1
                        elif entry.is_dir(follow_symlinks=False):
                            dir_cnt += 1
                            items_since_last_prog += 1
                            stack.append(entry.path)

                        if on_progress and items_since_last_prog >= 500:
                            on_progress(curr, items_since_last_prog, 0, 0)
                            items_since_last_prog = 0
                    except Exception:
                        pass
        except Exception:
            pass

    return total_size, file_cnt, dir_cnt, latest_mtime

def scan_sub_tree(parent_path, current_depth, max_depth, drive_used, on_progress=None, cur_pct=0, min_size_for_deep=1*1024*1024):
    """
    Quét đệ quy các thư mục con từ cấp 2 trở đi xuống đến cấp max_depth (mặc định cấp 5).
    Chỉ quét sâu vào các nhánh có dung lượng đáng kể (>= min_size_for_deep hoặc thuộc Users/Program Files/Windows)
    để bảo đảm tốc độ quét nhanh mà cây thư mục vẫn mở sâu được 4-5 tầng!
    Bao gồm cả danh sách các tệp tin thực tế bên trong từng thư mục để người dùng xem rõ tên và dung lượng.
    """
    children = []
    files_size = 0
    files_cnt = 0
    latest_m = 0

    try:
        with os.scandir(parent_path) as it:
            for entry in it:
                try:
                    if is_reparse_point(entry):
                        continue
                    st = entry.stat(follow_symlinks=False)
                    if st.st_mtime > latest_m:
                        latest_m = st.st_mtime
                    if entry.is_file(follow_symlinks=False):
                        files_size += st.st_size
                        files_cnt += 1
                    elif entry.is_dir(follow_symlinks=False):
                        s, f, d, m = compute_folder_metrics(entry.path, max_items=25000, timeout_sec=1.5)
                        pct = round((s / drive_used) * 100, 1) if drive_used > 0 else 0
                        m_str = datetime.datetime.fromtimestamp(m).strftime("%d/%m/%Y %H:%M") if m > 0 else "--"
                        clean_id = entry.path.replace("\\", "_").replace(":", "_")
                        child_node = {
                            "id": clean_id,
                            "name": entry.name,
                            "path": entry.path,
                            "type": "folder",
                            "size_bytes": s,
                            "size_human": format_size(s),
                            "alloc_human": format_size(s),
                            "files_count": f,
                            "dirs_count": d,
                            "percent_root": pct,
                            "mtime_str": m_str,
                            "has_children": bool(d > 0 or f > 0),
                            "expanded": False,
                            "depth": current_depth,
                            "children": []
                        }

                        # Đệ quy tiếp nếu chưa chạm max_depth và có thư mục con
                        is_user_or_app = any(k in entry.path.lower() for k in ["users", "program", "windows", "appdata"])
                        should_recurse = (current_depth < max_depth) and (d > 0) and (s >= min_size_for_deep or is_user_or_app)
                        if should_recurse:
                            deeper = scan_sub_tree(entry.path, current_depth + 1, max_depth, drive_used, on_progress, cur_pct, min_size_for_deep)
                            if deeper:
                                child_node["children"] = deeper

                        children.append(child_node)
                        if on_progress:
                            on_progress(entry.path, f, d, s)
                except Exception:
                    pass
    except Exception:
        pass

    # Tự động nạp tệp tin bên trong thư mục này để người dùng thấy rõ từng tệp
    if files_cnt > 0:
        all_files = get_folder_files(parent_path)
        if len(all_files) <= 25:
            # Nếu ít hơn hoặc bằng 25 file, đưa thẳng vào danh sách con để hiển thị trực tiếp
            for fi in all_files:
                fi["depth"] = current_depth
                children.append(fi)
        else:
            # Nếu nhiều file, đưa top 15 file lớn nhất ra ngoài và nhóm phần còn lại
            for fi in all_files[:15]:
                fi["depth"] = current_depth
                children.append(fi)
            remaining_files = all_files[15:]
            rem_size = sum(rf["size_bytes"] for rf in remaining_files)
            pct_rem = round((rem_size / drive_used) * 100, 1) if drive_used > 0 else 0
            clean_target = parent_path.replace(":", "_").replace("\\", "_")
            children.append({
                "id": f"{clean_target}_files_more",
                "name": f"[{len(remaining_files)} Tệp tin khác ({format_size(rem_size)})]",
                "path": parent_path,
                "type": "files_group",
                "size_bytes": rem_size,
                "size_human": format_size(rem_size),
                "alloc_human": format_size(rem_size),
                "files_count": len(remaining_files),
                "dirs_count": 0,
                "percent_root": pct_rem,
                "mtime_str": datetime.datetime.fromtimestamp(latest_m).strftime("%d/%m/%Y %H:%M") if latest_m > 0 else "--",
                "has_children": True,
                "expanded": False,
                "depth": current_depth,
                "children": remaining_files
            })

    children.sort(key=lambda x: x["size_bytes"], reverse=True)
    return children

def scan_drive_root(drive_letter, max_children_depth=4, on_progress=None):
    root = f"{drive_letter.rstrip(':').upper()}:\\"
    if not os.path.exists(root):
        return None

    try:
        drive_total, drive_used, drive_free = shutil.disk_usage(root)
    except Exception:
        drive_total, drive_used, drive_free = 0, 0, 0

    root_files_size = 0
    root_files_cnt = 0
    root_latest_mtime = 0
    subdirs = []

    # Dem so luong folder o goc de uoc tinh tien do %
    root_entries = []
    try:
        with os.scandir(root) as it:
            for entry in it:
                try:
                    if is_reparse_point(entry):
                        continue
                    root_entries.append(entry)
                except Exception:
                    pass
    except Exception:
        pass

    total_root_dirs = max(1, sum(1 for e in root_entries if e.is_dir(follow_symlinks=False)))
    scanned_root_dirs = 0

    for entry in root_entries:
        try:
            st = entry.stat(follow_symlinks=False)
            if st.st_mtime > root_latest_mtime:
                root_latest_mtime = st.st_mtime

            if entry.is_file(follow_symlinks=False):
                root_files_size += st.st_size
                root_files_cnt += 1
                if on_progress:
                    on_progress(entry.path, 1, 0, st.st_size, (scanned_root_dirs / total_root_dirs) * 100)
            elif entry.is_dir(follow_symlinks=False):
                scanned_root_dirs += 1
                cur_pct = (scanned_root_dirs / total_root_dirs) * 100
                if on_progress:
                    on_progress(entry.path, 0, 1, 0, cur_pct)

                # Tinh metric cho thu muc con cap 1
                f_size, f_files, f_dirs, f_mtime = compute_folder_metrics(
                    entry.path,
                    max_items=40000,
                    timeout_sec=2.5,
                    on_progress=lambda p, f, d, b: on_progress(p, f, d, b, cur_pct) if on_progress else None
                )

                if on_progress:
                    on_progress(entry.path, f_files, f_dirs, f_size, cur_pct)

                mtime_str = datetime.datetime.fromtimestamp(f_mtime).strftime("%d/%m/%Y %H:%M") if f_mtime > 0 else "--"
                pct = round((f_size / drive_used) * 100, 1) if drive_used > 0 else 0

                child_data = {
                    "id": entry.path.replace("\\", "_").replace(":", "_"),
                    "name": entry.name,
                    "path": entry.path,
                    "type": "folder",
                    "size_bytes": f_size,
                    "size_human": format_size(f_size),
                    "alloc_human": format_size(f_size),
                    "files_count": f_files,
                    "dirs_count": f_dirs,
                    "percent_root": pct,
                    "mtime_str": mtime_str,
                    "has_children": bool(f_dirs > 0 or f_files > 0),
                    "expanded": False,
                    "depth": 1,
                    "children": []
                }

                # Neu yeu cau max_children_depth >= 2, quet nhanh cap 2 tro xuong
                if max_children_depth >= 2 and f_dirs > 0:
                    sub_children = scan_sub_tree(
                        entry.path,
                        current_depth=2,
                        max_depth=max_children_depth,
                        drive_used=drive_used,
                        on_progress=lambda p, f, d, s: on_progress(p, f, d, s, cur_pct) if on_progress else None,
                        cur_pct=cur_pct
                    )
                    child_data["children"] = sub_children

                    # Tự động tổng hợp dung lượng thực từ các nhánh con cấp 2 lên thư mục cha cấp 1 (như Windows, Program Files...)
                    if sub_children:
                        sum_s2 = sum(sc["size_bytes"] for sc in sub_children)
                        sum_f2 = sum(sc["files_count"] for sc in sub_children)
                        sum_d2 = len(sub_children) + sum(sc["dirs_count"] for sc in sub_children)
                        if sum_s2 > child_data["size_bytes"]:
                            child_data["size_bytes"] = sum_s2
                            child_data["size_human"] = format_size(sum_s2)
                            child_data["alloc_human"] = format_size(sum_s2)
                            child_data["files_count"] = max(child_data["files_count"], sum_f2)
                            child_data["dirs_count"] = max(child_data["dirs_count"], sum_d2)
                            child_data["percent_root"] = round((sum_s2 / drive_used) * 100, 1) if drive_used > 0 else 0

                subdirs.append(child_data)
        except Exception:
            pass

    # Them mot muc [Tep tin tai goc o dia] neu co
    if root_files_cnt > 0:
        pct_files = round((root_files_size / drive_used) * 100, 1) if drive_used > 0 else 0
        root_files_list = get_folder_files(root)
        subdirs.append({
            "id": f"{drive_letter}_root_files",
            "name": f"[{root_files_cnt} Tệp tin gốc ({format_size(root_files_size)})]",
            "path": root,
            "type": "files_group",
            "size_bytes": root_files_size,
            "size_human": format_size(root_files_size),
            "alloc_human": format_size(root_files_size),
            "files_count": root_files_cnt,
            "dirs_count": 0,
            "percent_root": pct_files,
            "mtime_str": datetime.datetime.fromtimestamp(root_latest_mtime).strftime("%d/%m/%Y %H:%M") if root_latest_mtime > 0 else "--",
            "has_children": len(root_files_list) > 0,
            "expanded": False,
            "depth": 1,
            "children": root_files_list
        })

    # Sap xep tu lon den nho theo dung luong
    subdirs.sort(key=lambda x: x["size_bytes"], reverse=True)

    drive_pct = round((drive_used / drive_total) * 100, 1) if drive_total > 0 else 0
    total_files_sum = sum(s["files_count"] for s in subdirs)
    total_dirs_sum = len(subdirs) + sum(s["dirs_count"] for s in subdirs)

    drive_node = {
        "id": f"drive_{drive_letter.upper()}",
        "name": f"Ổ đĩa {root} ({format_size(drive_total)})",
        "drive": f"{drive_letter.upper()}:",
        "path": root,
        "type": "drive",
        "size_bytes": drive_used,
        "size_human": format_size(drive_used),
        "total_bytes": drive_total,
        "total_human": format_size(drive_total),
        "free_bytes": drive_free,
        "free_human": format_size(drive_free),
        "files_count": total_files_sum,
        "dirs_count": total_dirs_sum,
        "percent_root": drive_pct,
        "mtime_str": datetime.datetime.now().strftime("%d/%m/%Y %H:%M"),
        "has_children": len(subdirs) > 0,
        "expanded": True,
        "depth": 0,
        "children": subdirs
    }
    return drive_node

def expand_folder_children(target_path):
    """
    Quet dong cac thu muc con truc tiep khi nguoi dung click mo rong ▶.
    Loc bo triet de cac junction point / lien ket he thong de tranh bi treo.
    """
    if not os.path.exists(target_path) or not os.path.isdir(target_path):
        return []

    drive_prefix = os.path.splitdrive(target_path)[0] + "\\"
    try:
        _, drive_used, _ = shutil.disk_usage(drive_prefix)
    except Exception:
        drive_used = 1

    t0 = time.time()
    folder_name = os.path.basename(target_path) or target_path
    with _progress_lock:
        DISK_SCAN_PROGRESS["is_scanning"] = True
        DISK_SCAN_PROGRESS["scan_type"] = "expand"
        DISK_SCAN_PROGRESS["target"] = target_path
        DISK_SCAN_PROGRESS["current_path"] = target_path
        DISK_SCAN_PROGRESS["current_folder_name"] = folder_name
        DISK_SCAN_PROGRESS["start_time"] = t0
        DISK_SCAN_PROGRESS["percent"] = 40
        DISK_SCAN_PROGRESS["status_text"] = f"Đang nạp cấu trúc thư mục {folder_name}..."

    children = []
    files_size = 0
    files_cnt = 0
    latest_m = 0

    try:
        with os.scandir(target_path) as it:
            for entry in it:
                try:
                    # Loai bo Reparse Point / Junction point
                    if is_reparse_point(entry):
                        continue
                    st = entry.stat(follow_symlinks=False)
                    if st.st_mtime > latest_m:
                        latest_m = st.st_mtime
                    if entry.is_file(follow_symlinks=False):
                        files_size += st.st_size
                        files_cnt += 1
                    elif entry.is_dir(follow_symlinks=False):
                        s, f, d, m = compute_folder_metrics(entry.path, max_items=25000, timeout_sec=1.5)
                        pct = round((s / drive_used) * 100, 1) if drive_used > 0 else 0
                        m_str = datetime.datetime.fromtimestamp(m).strftime("%d/%m/%Y %H:%M") if m > 0 else "--"
                        children.append({
                            "id": entry.path.replace("\\", "_").replace(":", "_"),
                            "name": entry.name,
                            "path": entry.path,
                            "type": "folder",
                            "size_bytes": s,
                            "size_human": format_size(s),
                            "alloc_human": format_size(s),
                            "files_count": f,
                            "dirs_count": d,
                            "percent_root": pct,
                            "mtime_str": m_str,
                            "has_children": bool(d > 0 or f > 0),
                            "expanded": False,
                            "children": []
                        })
                except Exception:
                    pass
    except Exception:
        pass

    if files_cnt > 0:
        all_files = get_folder_files(target_path)
        if len(all_files) <= 40:
            for fi in all_files:
                children.append(fi)
        else:
            for fi in all_files[:25]:
                children.append(fi)
            remaining_files = all_files[25:]
            rem_size = sum(rf["size_bytes"] for rf in remaining_files)
            pct_rem = round((rem_size / drive_used) * 100, 1) if drive_used > 0 else 0
            clean_target = target_path.replace(":", "_").replace("\\", "_")
            children.append({
                "id": f"{clean_target}_files_more",
                "name": f"[{len(remaining_files)} Tệp tin khác ({format_size(rem_size)})]",
                "path": target_path,
                "type": "files_group",
                "size_bytes": rem_size,
                "size_human": format_size(rem_size),
                "alloc_human": format_size(rem_size),
                "files_count": len(remaining_files),
                "dirs_count": 0,
                "percent_root": pct_rem,
                "mtime_str": datetime.datetime.fromtimestamp(latest_m).strftime("%d/%m/%Y %H:%M") if latest_m > 0 else "--",
                "has_children": True,
                "expanded": False,
                "children": remaining_files
            })

    children.sort(key=lambda x: x["size_bytes"], reverse=True)
    t_expand = round(time.time() - t0, 2)
    tot_files = sum(c.get("files_count", 0) for c in children)
    speed = round(tot_files / t_expand) if t_expand > 0 else 0

    with _progress_lock:
        DISK_SCAN_PROGRESS["is_scanning"] = False
        DISK_SCAN_PROGRESS["percent"] = 100
        DISK_SCAN_PROGRESS["done"] = True
        DISK_SCAN_PROGRESS["elapsed_sec"] = t_expand
        DISK_SCAN_PROGRESS["files_scanned"] = tot_files
        DISK_SCAN_PROGRESS["speed_files_sec"] = speed
        DISK_SCAN_PROGRESS["status_text"] = f"Đã nạp {len(children)} mục của {folder_name} ({t_expand}s)"
        DISK_SCAN_PROGRESS["summary"] = f"✔ Đã nạp {len(children)} thư mục con ({tot_files:,} tệp tin) trong {t_expand}s • Tốc độ: ~{speed:,} tệp/s"

    return children

def get_folder_files(target_path):
    """
    Lay danh sach toan bo cac tep tin don le ben trong mot thu muc, sap xep tu lon den nho
    """
    if not os.path.exists(target_path) or not os.path.isdir(target_path):
        return []

    drive_prefix = os.path.splitdrive(target_path)[0] + "\\"
    try:
        _, drive_used, _ = shutil.disk_usage(drive_prefix)
    except Exception:
        drive_used = 1

    files_list = []
    try:
        with os.scandir(target_path) as it:
            for entry in it:
                try:
                    if entry.is_file(follow_symlinks=False):
                        st = entry.stat(follow_symlinks=False)
                        s = st.st_size
                        pct = round((s / drive_used) * 100, 2) if drive_used > 0 else 0
                        m_str = datetime.datetime.fromtimestamp(st.st_mtime).strftime("%d/%m/%Y %H:%M") if st.st_mtime > 0 else "--"
                        name = entry.name
                        _, ext = os.path.splitext(name)
                        clean_path = entry.path.replace("\\", "_").replace(":", "_")
                        files_list.append({
                            "id": f"file_{clean_path}",
                            "name": name,
                            "path": entry.path,
                            "parent_path": target_path,
                            "type": "file",
                            "ext": ext.lower(),
                            "size_bytes": s,
                            "size_human": format_size(s),
                            "files_count": 1,
                            "dirs_count": 0,
                            "percent_root": pct,
                            "mtime_str": m_str,
                            "has_children": False,
                            "expanded": False,
                            "children": []
                        })
                except Exception:
                    pass
    except Exception:
        pass

    files_list.sort(key=lambda x: x["size_bytes"], reverse=True)
    return files_list

def run_scan_worker(drive_arg="ALL", scan_id=""):
    """
    Tien trinh worker quet toan bo o dia trong thread ngam, lien tuc cap nhat DISK_SCAN_PROGRESS.
    """
    t0 = time.time()
    with _progress_lock:
        DISK_SCAN_PROGRESS["is_scanning"] = True
        DISK_SCAN_PROGRESS["scan_type"] = "single" if drive_arg != "ALL" else "full"
        DISK_SCAN_PROGRESS["target"] = drive_arg
        DISK_SCAN_PROGRESS["phase"] = "scanning"
        DISK_SCAN_PROGRESS["current_path"] = f"Khởi tạo quét {drive_arg}..."
        DISK_SCAN_PROGRESS["current_folder_name"] = drive_arg
        DISK_SCAN_PROGRESS["files_scanned"] = 0
        DISK_SCAN_PROGRESS["dirs_scanned"] = 0
        DISK_SCAN_PROGRESS["bytes_scanned"] = 0
        DISK_SCAN_PROGRESS["start_time"] = t0
        DISK_SCAN_PROGRESS["elapsed_sec"] = 0
        DISK_SCAN_PROGRESS["speed_files_sec"] = 0
        DISK_SCAN_PROGRESS["speed_mb_sec"] = 0
        DISK_SCAN_PROGRESS["percent"] = 5
        DISK_SCAN_PROGRESS["status_text"] = f"Đang kiểm tra ổ đĩa hệ thống..."
        DISK_SCAN_PROGRESS["done"] = False
        DISK_SCAN_PROGRESS["summary"] = ""
        DISK_SCAN_PROGRESS["error"] = None
        DISK_SCAN_PROGRESS["result"] = None

    try:
        drives = get_logical_drives()
        trees = []
        drives_to_scan = []
        if drive_arg and drive_arg.upper() != "ALL":
            letter = drive_arg.rstrip(":\\/").upper()
            drives_to_scan = [d for d in drives if d["drive"].rstrip(":").upper() == letter]
            if not drives_to_scan:
                drives_to_scan = [{"drive": f"{letter}:"}]
        else:
            drives_to_scan = drives

        total_drives = max(1, len(drives_to_scan))

        for d_idx, d in enumerate(drives_to_scan):
            letter = d["drive"].rstrip(":")

            def on_prog(path, files_delta, dirs_delta, bytes_delta, sub_pct=0):
                with _progress_lock:
                    DISK_SCAN_PROGRESS["current_path"] = path
                    DISK_SCAN_PROGRESS["current_folder_name"] = os.path.basename(path) or path
                    DISK_SCAN_PROGRESS["files_scanned"] += files_delta
                    DISK_SCAN_PROGRESS["dirs_scanned"] += dirs_delta
                    DISK_SCAN_PROGRESS["bytes_scanned"] += bytes_delta
                    base_pct = (d_idx / total_drives) * 90
                    curr_pct = base_pct + (sub_pct / 100.0) * (90 / total_drives)
                    DISK_SCAN_PROGRESS["percent"] = min(96, round(max(5, curr_pct)))
                    elapsed = max(0.05, time.time() - t0)
                    speed = round(DISK_SCAN_PROGRESS["files_scanned"] / elapsed) if elapsed > 0 else 0
                    DISK_SCAN_PROGRESS["speed_files_sec"] = speed
                    DISK_SCAN_PROGRESS["status_text"] = f"Đang quét ổ {letter}: (~{speed:,} tệp/giây)..."

            t = scan_drive_root(letter, max_children_depth=4, on_progress=on_prog)
            if t:
                trees.append(t)

        t_end = time.time()
        elapsed_total = round(t_end - t0, 1)
        tot_files = sum(t["files_count"] for t in trees)
        tot_dirs = sum(t["dirs_count"] for t in trees)
        tot_bytes = sum(t["size_bytes"] for t in trees)
        avg_speed = round(tot_files / elapsed_total) if elapsed_total > 0 else 0

        result = {
            "status": "ok",
            "drives": drives,
            "trees": trees,
            "scanned_at": datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            "stats": {
                "elapsed_sec": elapsed_total,
                "total_files": tot_files,
                "total_dirs": tot_dirs,
                "total_size_human": format_size(tot_bytes),
                "avg_speed_files_sec": avg_speed
            }
        }

        if scan_id:
            save_disk_tree_to_task(scan_id, result)

        with _progress_lock:
            DISK_SCAN_PROGRESS["is_scanning"] = False
            DISK_SCAN_PROGRESS["percent"] = 100
            DISK_SCAN_PROGRESS["done"] = True
            DISK_SCAN_PROGRESS["elapsed_sec"] = elapsed_total
            DISK_SCAN_PROGRESS["files_scanned"] = tot_files
            DISK_SCAN_PROGRESS["dirs_scanned"] = tot_dirs
            DISK_SCAN_PROGRESS["bytes_scanned"] = tot_bytes
            DISK_SCAN_PROGRESS["speed_files_sec"] = avg_speed
            DISK_SCAN_PROGRESS["status_text"] = f"Quét hoàn tất trong {elapsed_total}s"
            DISK_SCAN_PROGRESS["summary"] = f"✔ Đã phân tích {tot_files:,} tệp • {tot_dirs:,} thư mục ({format_size(tot_bytes)}) trong {elapsed_total}s • Tốc độ trung bình: {avg_speed:,} tệp/s"
            DISK_SCAN_PROGRESS["result"] = result

    except Exception as e:
        with _progress_lock:
            DISK_SCAN_PROGRESS["is_scanning"] = False
            DISK_SCAN_PROGRESS["done"] = True
            DISK_SCAN_PROGRESS["error"] = str(e)
            DISK_SCAN_PROGRESS["status_text"] = f"Lỗi: {e}"

def start_scan_async(drive_arg="ALL", scan_id=""):
    """
    Khoi chay tien trinh quet ngam va tra ve ngay tuc thi.
    """
    with _progress_lock:
        if DISK_SCAN_PROGRESS["is_scanning"]:
            return False, "Một tiến trình quét khác đang chạy!"
    
    t = threading.Thread(target=run_scan_worker, args=(drive_arg, scan_id), daemon=True)
    t.start()
    return True, "Đã khởi động tiến trình quét ngầm thành công."

def scan_all_system_drives():
    drives = get_logical_drives()
    trees = []
    for d in drives:
        letter = d["drive"].rstrip(":")
        tree = scan_drive_root(letter, max_children_depth=4)
        if tree:
            trees.append(tree)

    return {
        "drives": drives,
        "trees": trees,
        "scanned_at": datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    }

def save_disk_tree_to_task(task_id, data):
    task_dir = os.path.join(SCANS_DIR, task_id)
    if not (os.path.exists(task_dir) and os.path.isdir(task_dir)):
        # Fallback tim theo scan_id trong info.json
        if os.path.exists(SCANS_DIR):
            for name in os.listdir(SCANS_DIR):
                cand = os.path.join(SCANS_DIR, name)
                if os.path.isdir(cand):
                    cand_info = os.path.join(cand, "info.json")
                    if os.path.exists(cand_info):
                        try:
                            with open(cand_info, "r", encoding="utf-8") as f:
                                ci = json.load(f)
                            if ci.get("scan_id") == task_id:
                                task_dir = cand
                                break
                        except Exception:
                            pass

    if os.path.exists(task_dir) and os.path.isdir(task_dir):
        out_path = os.path.join(task_dir, "disk_tree.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        # Tu dong cap nhat lai report.html va disk_tree.csv cho task
        try:
            import scripts.scan_manager as scan_mgr
            scan_mgr.regenerate_task_reports(os.path.basename(task_dir))
        except Exception as e:
            print(f"Error regenerating reports for {task_id}: {e}")

        return True
    return False

def load_disk_tree_from_task(task_id):
    task_dir = os.path.join(SCANS_DIR, task_id)
    out_path = os.path.join(task_dir, "disk_tree.json")
    if os.path.exists(out_path):
        try:
            with open(out_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return None

if __name__ == "__main__":
    print("Testing updated disk_scanner...")
    drives = get_logical_drives()
    print("Drives:", drives)
    c_tree = scan_drive_root("C", max_children_depth=1)
    print("C tree root children:", len(c_tree["children"]))
