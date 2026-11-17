#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
   CÔNG CỤ XUẤT GÓI BÁO CÁO AN TOÀN (SAFE TASK EXPORTER)
   Đóng gói toàn bộ báo cáo, phần mềm, phần cứng & S.M.A.R.T thành 1 file zip
   sạch sẽ, gọn nhẹ để chép sang USB hoặc gửi qua Zalo / Cloud / Telegram.
==============================================================================
"""

import os
import sys
import json
import zipfile
import hashlib
import datetime

# Console UTF-8
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCANS_DIR = os.path.join(ROOT_DIR, "scans")

def print_banner():
    print("=" * 78)
    print("   CÔNG CỤ XUẤT GÓI BÁO CÁO TIẾP NHẬN / BÀN GIAO AN TOÀN CHO KTV")
    print("   Đóng Gói Tự Động - Nén Gọn Nhẹ - Sẵn Sàng Gửi Cloud Hoặc Chép USB")
    print("=" * 78)
    print()

def get_available_tasks():
    if not os.path.exists(SCANS_DIR):
        return []
    tasks = []
    for item in os.listdir(SCANS_DIR):
        item_path = os.path.join(SCANS_DIR, item)
        if os.path.isdir(item_path):
            info_file = os.path.join(item_path, "info.json")
            if os.path.exists(info_file):
                try:
                    with open(info_file, "r", encoding="utf-8") as f:
                        info = json.load(f)
                    mtime = os.path.getmtime(item_path)
                    tasks.append({
                        "dir_name": item,
                        "dir_path": item_path,
                        "mtime": mtime,
                        "customer": info.get("customer_name", "Chưa rõ"),
                        "stage": info.get("stage_label", "Tiếp Nhận"),
                        "computer": info.get("computer_name", "PC"),
                        "scan_time": info.get("scan_time", "")
                    })
                except Exception:
                    pass
    tasks.sort(key=lambda x: x["mtime"], reverse=True)
    return tasks

def package_task(task_dir, output_zip_path=None):
    if not os.path.exists(task_dir):
        cand = os.path.join(SCANS_DIR, task_dir)
        if os.path.exists(cand):
            task_dir = cand
        else:
            print(f"[-] Lỗi: Không tìm thấy thư mục task: {task_dir}")
            return None

    task_name = os.path.basename(os.path.normpath(task_dir))
    info_path = os.path.join(task_dir, "info.json")
    report_html = os.path.join(task_dir, "report.html")

    # Kiểm tra đảm bảo có ít nhất report.html hoặc info.json
    if not os.path.exists(report_html) and not os.path.exists(info_path):
        print(f"[-] Thư mục không có dữ liệu báo cáo hợp lệ: {task_dir}")
        return None

    # Tự động tính hash SHA-256 chính xác cho report.html trước khi đóng gói
    if os.path.exists(report_html):
        sha_file = f"{report_html}.sha256"
        try:
            with open(report_html, "rb") as f:
                h = hashlib.sha256(f.read()).hexdigest()
            with open(sha_file, "w", encoding="utf-8") as sf:
                sf.write(f"{h} *report.html\n")
        except Exception:
            pass

    if not output_zip_path:
        # Lưu ra thư mục gốc toolkit hoặc Desktop
        zip_filename = f"BAOCAO_{task_name}.zip"
        output_zip_path = os.path.join(ROOT_DIR, zip_filename)

    print(f"[*] Đang đóng gói dữ liệu của lượt quét: {task_name}")
    
    # Danh sách các file quan trọng cần đóng gói
    allowed_files = [
        "report.html",
        "report.html.sha256",
        "report_CLEAN.html",
        "info.json",
        "apps.json",
        "hardware_diagnostics.json",
        "smart_info.json",
        "report.csv",
        "disk_tree.csv"
    ]

    total_uncompressed = 0
    packed_files = []

    with zipfile.ZipFile(output_zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        # Ghi các file được phép
        for fname in os.listdir(task_dir):
            fpath = os.path.join(task_dir, fname)
            if os.path.isfile(fpath):
                # Nếu là file trong danh sách cho phép hoặc file disk_tree
                # (Chúng ta đóng gói cả disk_tree.json nếu có vì zip nén lại rất nhỏ)
                if fname in allowed_files or fname == "disk_tree.json":
                    fsize = os.path.getsize(fpath)
                    total_uncompressed += fsize
                    zf.write(fpath, arcname=os.path.join(task_name, fname))
                    packed_files.append((fname, fsize))

    zip_size = os.path.getsize(output_zip_path)
    ratio = (1 - (zip_size / total_uncompressed)) * 100 if total_uncompressed > 0 else 0

    # Tinh toan SHA-256 cho report.html va goi zip
    sha256_html = ""
    if os.path.exists(report_html):
        try:
            with open(report_html, "rb") as f:
                sha256_html = hashlib.sha256(f.read()).hexdigest()
        except Exception:
            pass

    sha256_zip = ""
    if os.path.exists(output_zip_path):
        try:
            with open(output_zip_path, "rb") as f:
                sha256_zip = hashlib.sha256(f.read()).hexdigest()
            # Ghi file .sha256 cho file zip
            with open(f"{output_zip_path}.sha256", "w", encoding="utf-8") as zsf:
                zsf.write(f"{sha256_zip} *{os.path.basename(output_zip_path)}\n")
        except Exception:
            pass

    print()
    print("=" * 78)
    print("   [XUẤT GÓI BÁO CÁO THÀNH CÔNG!]")
    print("=" * 78)
    print(f"   * Tên gói:        {os.path.basename(output_zip_path)}")
    print(f"   * Vị trí lưu:     {output_zip_path}")
    print(f"   * Dung lượng nén: {zip_size / (1024*1024):.2f} MB (Giảm {ratio:.1f}% từ {total_uncompressed / (1024*1024):.2f} MB)")
    print(f"   * Mã SHA-256 Zip: {sha256_zip}")
    print(f"   * SHA-256 Báo Cáo:{sha256_html}")
    print(f"   * Số tệp đã gói:  {len(packed_files)} tệp tin")
    for fn, sz in packed_files:
        print(f"     - {fn:<26} ({sz / 1024:.1f} KB)")
    print("=" * 78)
    print()
    print("[HƯỚNG DẪN KỸ THUẬT VIÊN]:")
    print("1. Chép duy nhất file .zip này vào USB phụ hoặc gửi thẳng qua Zalo/Cloud.")
    print("2. Khi mang về máy tiệm: Kéo thả file .zip này vào file 'KIEM_TRA_BAO_CAO.bat'.")
    print("   Hệ thống sẽ tự động quét khử độc và nhập (Import) thẳng vào Lịch Sử Quét!")
    print()

    # Mở Explorer chọn file nếu chạy trên Windows giao diện
    if sys.platform == "win32" and sys.stdin and hasattr(sys.stdin, 'isatty') and sys.stdin.isatty():
        try:
            os.system(f'explorer.exe /select,"{output_zip_path}"')
        except Exception:
            pass

    return {
        "status": "ok",
        "zip_path": output_zip_path,
        "zip_name": os.path.basename(output_zip_path),
        "zip_size": zip_size,
        "zip_size_human": f"{zip_size / (1024*1024):.2f} MB" if zip_size >= 1024*1024 else f"{zip_size / 1024:.1f} KB",
        "sha256_html": sha256_html,
        "sha256_zip": sha256_zip,
        "file_count": len(packed_files),
        "packed_files": [fn for fn, sz in packed_files],
        "ratio_percent": round(ratio, 1)
    }

def main():
    print_banner()
    tasks = get_available_tasks()

    if not tasks:
        print("[-] Chưa có lượt quét tiếp nhận hoặc bàn giao nào trong thư mục scans/!")
        print("    Vui lòng thực hiện quét máy trước khi xuất báo cáo.")
        return

    # Nếu truyền tham số đường dẫn hoặc tên task
    if len(sys.argv) > 1:
        target = sys.argv[1]
        if os.path.isdir(target):
            package_task(target)
            return
        elif os.path.isdir(os.path.join(SCANS_DIR, target)):
            package_task(os.path.join(SCANS_DIR, target))
            return

    # Nếu chỉ có 1 task duy nhất hoặc chạy tự động: lấy task mới nhất
    if len(tasks) == 1 or not (sys.stdin and hasattr(sys.stdin, 'isatty') and sys.stdin.isatty()):
        selected = tasks[0]
        print(f"[*] Tự động chọn lượt quét gần nhất: {selected['dir_name']}")
        print(f"    Khách: {selected['customer']} | Máy: {selected['computer']} | Giai đoạn: {selected['stage']}")
        print()
        package_task(selected["dir_path"])
        return

    # Nếu chạy tương tác và có nhiều task: hiển thị menu chọn
    print("Danh sách các lượt quét hiện có trên máy:")
    for idx, t in enumerate(tasks, start=1):
        print(f"  [{idx}] {t['stage'].upper()}: {t['customer']} ({t['computer']}) - Ngày: {t['scan_time']}")
        print(f"      Thư mục: {t['dir_name']}")
    print()

    try:
        choice = input(f"Chọn số thứ tự lượt quét muốn đóng gói (1-{len(tasks)}, mặc định: 1): ").strip()
        if not choice:
            choice_idx = 0
        else:
            choice_idx = int(choice) - 1
            if choice_idx < 0 or choice_idx >= len(tasks):
                print("[!] Lựa chọn không hợp lệ. Mặc định chọn số 1.")
                choice_idx = 0
    except Exception:
        choice_idx = 0

    selected = tasks[choice_idx]
    print()
    package_task(selected["dir_path"])

if __name__ == "__main__":
    main()
