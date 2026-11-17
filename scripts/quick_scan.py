#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
   CÔNG CỤ QUÉT MÁY NHANH CHO KỸ THUẬT VIÊN (1-CLICK QUICK SCAN ENGINE)
   Chạy trực tiếp từ USB, tự động thu thập thông tin phần cứng, phần mềm,
   S.M.A.R.T ổ đĩa, tạo báo cáo an toàn và đóng gói file zip bàn giao.
==============================================================================
"""

import os
import sys
import json
import argparse
import datetime
import subprocess

# Đảm bảo UTF-8 cho console Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT_DIR)

import scripts.scan_manager as scan_mgr
import scripts.scan_installed as scanner
import scripts.disk_smart_service as smart_svc
import scripts.hardware_monitor_service as hwmon_svc
import scripts.export_task as exporter

def main():
    parser = argparse.ArgumentParser(description="Windows 11 KTV Toolkit - 1-Click Scan Engine")
    parser.add_argument("--stage", choices=["tiep_nhan", "ban_giao"], default="tiep_nhan",
                        help="Giai đoạn quét: tiep_nhan (Trước cài) hoặc ban_giao (Sau cài)")
    parser.add_argument("--name", default="", help="Tên khách hàng / người dùng")
    parser.add_argument("--id", default="", help="Mã ID khách hàng / phiếu nhận")
    parser.add_argument("--auto-export", action="store_true", default=True, help="Tự động đóng gói ZIP sau khi quét")
    parser.add_argument("--open-report", action="store_true", default=False, help="Tự động mở báo cáo trên trình duyệt")
    args = parser.parse_args()

    stage_name = "TIẾP NHẬN MÁY (TRƯỚC SỬA / CÀI ĐẶT)" if args.stage == "tiep_nhan" else "BÀN GIAO MÁY (SAU SỬA / CÀI XONG)"
    
    print("=" * 78)
    print("       WINDOWS 11 TOOLKIT & HUB - CÔNG CỤ QUÉT MÁY TỰ ĐỘNG CHO KTV")
    print(f"       GIAI ĐOẠN: {stage_name}")
    print("=" * 78)
    print()

    # Hỏi thông tin khách hàng nếu chạy tương tác và chưa truyền qua đối số
    cust_name = args.name.strip()
    cust_id = args.id.strip()

    if not cust_name and sys.stdin and hasattr(sys.stdin, 'isatty') and sys.stdin.isatty():
        try:
            print("[?] Nhập thông tin phiếu máy (Nhấn Enter để dùng mặc định):")
            val_name = input("    * Tên Khách Hàng / User [Mặc định: User]: ").strip()
            if val_name:
                cust_name = val_name
            val_id = input("    * Mã Phiếu / Số ĐT [Mặc định: None]: ").strip()
            if val_id:
                cust_id = val_id
            print()
        except Exception:
            pass

    if not cust_name:
        cust_name = "User"

    print(f"[*] Bắt đầu tiến trình kiểm định 6 bước cho máy tính...")
    print(f"    - Khách hàng: {cust_name}")
    if cust_id:
        print(f"    - Mã ID:     {cust_id}")
    print()

    # Bước 1: Quét cấu hình phần cứng & Bản quyền Windows
    print("  [1/5] Đang thu thập thông tin phần cứng, BIOS & Bản quyền Windows...")
    machine_info = scan_mgr.get_machine_info(customer_name=cust_name, customer_id=cust_id, scan_stage=args.stage)
    print(f"        ✔ Máy tính:    {machine_info.get('computer_name')}")
    print(f"        ✔ Vi xử lý:    {machine_info.get('cpu_name', 'N/A')}")
    print(f"        ✔ Bo mạch chủ: {machine_info.get('motherboard', 'N/A')} (Serial: {machine_info.get('serial_number', 'N/A')})")
    print(f"        ✔ Hệ điều hành:{machine_info.get('os_info')}")
    lic_info = machine_info.get("license_info") or {}
    print(f"        ✔ Bản quyền:   {lic_info.get('summary', 'N/A')}")

    # Bước 2: Quét phần mềm đã cài đặt
    print("\n  [2/5] Đang quét danh sách phần mềm và trích xuất logo ứng dụng...")
    try:
        apps = scanner.scan_installed_apps(extract_icons=True)
    except Exception as e:
        print(f"        [!] Lỗi trích xuất icon, fallback quét không icon: {e}")
        apps = scanner.scan_installed_apps(extract_icons=False)
    with_icons = sum(1 for a in apps if a.get("thumbnail"))
    print(f"        ✔ Đã tìm thấy {len(apps)} phần mềm ({with_icons} phần mềm có logo nhận diện).")

    # Lưu task vào thư mục scans/
    task_info = scan_mgr.save_scan_task(machine_info, apps)
    scan_id = task_info.get("scan_id")
    task_dir = os.path.join(ROOT_DIR, "scans", scan_id)

    # Bước 3: Quét Sức Khỏe Ổ Cứng S.M.A.R.T
    print("\n  [3/5] Đang phân tích sức khỏe ổ đĩa & chỉ số S.M.A.R.T...")
    try:
        smart_disks = smart_svc.scan_all_smart_disks()
        smart_svc.save_smart_to_scan_folder(scan_id, smart_disks)
        print(f"        ✔ Đã phân tích {len(smart_disks)} ổ đĩa vật lý:")
        for d in smart_disks:
            model = d.get("model") or d.get("device_id") or "Ổ đĩa"
            health = d.get("health_status") or "Chưa rõ"
            temp = d.get("temperature_c")
            temp_str = f" - {temp}°C" if temp else ""
            print(f"          + {model:<30} [{health}]{temp_str}")
    except Exception as e:
        print(f"        [!] Bỏ qua quét SMART do lỗi: {e}")

    # Bước 4: Thu thập chẩn đoán phần cứng (GPU, Sensors)
    print("\n  [4/5] Đang thu thập thông số cảm biến nhiệt độ & đồ họa...")
    try:
        diag = hwmon_svc.get_detailed_hardware_diagnostics()
        hwmon_svc.save_hardware_diagnostics_to_scan_folder(scan_id, diag)
        print("        ✔ Đã ghi nhận thông số cảm biến phần cứng an toàn.")
    except Exception as e:
        print(f"        [!] Bỏ qua cảm biến do lỗi: {e}")

    # Tái tạo lại báo cáo HTML với đầy đủ S.M.A.R.T và cảm biến
    scan_mgr.regenerate_task_reports(scan_id)
    report_html_path = os.path.join(task_dir, "report.html")

    # Bước 5: Tự động đóng gói ZIP an toàn
    print("\n  [5/5] Đang tự động đóng gói file ZIP an toàn cho KTV...")
    zip_result = exporter.package_task(task_dir)

    print()
    print("=" * 78)
    print("   [HOÀN TẤT THÀNH CÔNG] ĐÃ HOÀN THÀNH QUÉT MÁY!")
    print("=" * 78)
    print(f"   * Mã lượt quét:    {scan_id}")
    print(f"   * Báo cáo HTML:    {report_html_path}")
    if zip_result and zip_result.get("zip_path"):
        print(f"   * Gói ZIP an toàn: {zip_result['zip_path']}")
        print(f"   * Dung lượng nén:  {zip_result.get('zip_size_human')}")
    print("=" * 78)
    print()

    # Mở trình duyệt nếu được yêu cầu
    if args.open_report or (sys.stdin and hasattr(sys.stdin, 'isatty') and sys.stdin.isatty()):
        try:
            ans = input("[?] Bạn có muốn mở xem Báo Cáo trên Trình Duyệt ngay bây giờ? (Y/n): ").strip().lower()
            if ans != 'n':
                import webbrowser
                webbrowser.open(f"file:///{report_html_path.replace(os.sep, '/')}")
        except Exception:
            pass

if __name__ == "__main__":
    main()
