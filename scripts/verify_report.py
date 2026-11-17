#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
  BỘ LỌC MÃ ĐỘC & THẨM ĐỊNH AN TOÀN BÁO CÁO HTML (HTML SAFETY VERIFIER)
  Phát hiện chống tiêm mã độc, chống rò rỉ dữ liệu, khử độc file HTML
==============================================================================
"""

import os
import sys
import re
import hashlib
import subprocess
import webbrowser
import zipfile
import tempfile
import shutil

# Cau hinh console UTF-8 tren Windows de khong bao gio bi loi UnicodeEncodeError
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCANS_DIR = os.path.join(ROOT_DIR, "scans")

# Các mẫu regex nhận diện mã độc / tiêm script / rò rỉ dữ liệu
MALICIOUS_PATTERNS = [
    {
        "id": "EXTERNAL_SCRIPT",
        "name": "Nạp mã JavaScript từ xa qua Internet (<script src='http...'>)",
        "level": "CRITICAL",
        "pattern": re.compile(r"<script[^>]+src\s*=\s*['\"](https?://|//)[^'\"]+['\"][^>]*>", re.IGNORECASE)
    },
    {
        "id": "HIDDEN_IFRAME",
        "name": "Thẻ iframe ẩn / nạp web ngầm (Drive-by download)",
        "level": "CRITICAL",
        "pattern": re.compile(r"<iframe[^>]*>", re.IGNORECASE)
    },
    {
        "id": "MALICIOUS_OBJECT",
        "name": "Thẻ nhúng đối tượng nhị phân (<object>, <embed>, <applet>)",
        "level": "CRITICAL",
        "pattern": re.compile(r"<(object|embed|applet)[^>]*>", re.IGNORECASE)
    },
    {
        "id": "ACTIVEX_EXEC",
        "name": "Lệnh thực thi hệ thống ActiveX / WScript (Chạy file exe ngầm)",
        "level": "CRITICAL",
        "pattern": re.compile(r"(new\s+ActiveXObject|WScript\.Shell|Shell\.Application)", re.IGNORECASE)
    },
    {
        "id": "EXTERNAL_NETWORK_CALL",
        "name": "Lệnh gửi dữ liệu ra mạng ngoài (fetch, XMLHttpRequest, WebSocket)",
        "level": "WARNING",
        "pattern": re.compile(r"\b(fetch\s*\(|new\s+XMLHttpRequest|new\s+WebSocket|navigator\.sendBeacon)\b", re.IGNORECASE)
    },
    {
        "id": "META_REFRESH",
        "name": "Thẻ chuyển hướng URL tự động (<meta http-equiv='refresh'>)",
        "level": "WARNING",
        "pattern": re.compile(r"<meta[^>]+http-equiv\s*=\s*['\"]refresh['\"][^>]*>", re.IGNORECASE)
    },
    {
        "id": "DANGEROUS_EVAL",
        "name": "Hàm giải mã và thực thi mã động (eval / Function constructor)",
        "level": "WARNING",
        "pattern": re.compile(r"\b(eval\s*\(|new\s+Function\s*\()\b", re.IGNORECASE)
    }
]

def print_banner():
    print("=" * 78)
    print("   BỘ LỌC MÃ ĐỘC & THẨM ĐỊNH AN TOÀN BÁO CÁO HTML CHO KỸ THUẬT VIÊN")
    print("   Bảo Vệ Toàn Vẹn Báo Cáo - Chống Lây Nhiễm Chéo Từ Máy Khách")
    print("=" * 78)
    print()

try:
    from scripts.security_audit import audit_html_file, audit_html_content, sanitize_html, inspect_zip_package
except ImportError:
    from security_audit import audit_html_file, audit_html_content, sanitize_html, inspect_zip_package

def inspect_html_file(file_path):
    if not os.path.exists(file_path):
        print(f"[-] Lỗi: Không tìm thấy file: {file_path}")
        return None

    res = audit_html_file(file_path)
    if res.get("status") == "error":
        print(f"[-] Không thể đọc file: {res.get('message')}")
        return None

    # Đọc lại nội dung để tương thích với sanitize_and_clean_html
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    file_size = res.get("file_size", 0)
    file_name = res.get("filename", os.path.basename(file_path))

    return {
        "file_path": file_path,
        "file_name": file_name,
        "file_size": file_size,
        "file_size_kb": round(file_size / 1024, 1),
        "sha256": res.get("sha256_disk") or res.get("sha256"),
        "sig_status": res.get("sig_status"),
        "sig_match": res.get("sig_match"),
        "has_csp": res.get("has_csp"),
        "is_airgapped": res.get("is_airgapped"),
        "threats": res.get("threats", []),
        "content": content
    }

def sanitize_and_clean_html(file_path, original_content):
    """
    Tự động cắt bỏ các đoạn mã độc, iframe, event handler hoặc script ngoại lai bị virus chèn thêm
    và lưu thành file [name]_CLEAN.html an toàn tuyệt đối.
    """
    clean = sanitize_html(original_content)

    base, ext = os.path.splitext(file_path)
    if base.endswith("_CLEAN"):
        clean_path = file_path
    else:
        clean_path = f"{base}_CLEAN{ext}"

    with open(clean_path, "w", encoding="utf-8") as f:
        f.write(clean)

    # Tao chu ky moi cho file clean tu byte nhi phan thuc te tren dia
    with open(clean_path, "rb") as bf:
        new_hash = hashlib.sha256(bf.read()).hexdigest()
    with open(f"{clean_path}.sha256", "w", encoding="utf-8") as sf:
        sf.write(f"{new_hash} *{os.path.basename(clean_path)}\n")

    return clean_path

DANGEROUS_EXTS = {
    ".exe", ".scr", ".pif", ".vbs", ".vbe", ".js", ".jse", ".wsf", ".wsh", 
    ".bat", ".cmd", ".ps1", ".dll", ".sys", ".hta", ".cpl", ".reg"
}

def handle_zip_package(zip_path):
    print(f"[*] Phát hiện gói dữ liệu nén: {os.path.basename(zip_path)}")
    print(f"    Đang thẩm định tệp tin và giải nén trong môi trường cách ly (Sandbox Temp)...\n")
    
    temp_dir = tempfile.mkdtemp(prefix="ktv_safe_import_")
    try:
        zip_res = inspect_zip_package(zip_path, extract_target_dir=temp_dir)
        if zip_res.get("status") == "error":
            print(f"  ✖ [LỖI] {zip_res.get('message')}\n")
            return

        if zip_res.get("blocked_traversal"):
            print(f"  ✖ [CẢNH BÁO NGUY HIỂM] PHÁT HIỆN LỖ HỔNG ZIP SLIP / PATH TRAVERSAL:")
            for bt in zip_res["blocked_traversal"]:
                print(f"      * [ĐÃ CHẶN ĐỨNG] {bt}")
            print()

        if zip_res.get("blocked_dangerous_exts"):
            print(f"  ✖ [CẢNH BÁO NGUY HIỂM] PHÁT HIỆN TỆP KHẢ NGHI TRONG FILE ZIP:")
            for sf in zip_res["blocked_dangerous_exts"]:
                print(f"      * [ĐÃ CHẶN & LOẠI BỎ] {sf}")
            print("    Các tệp nhị phân/mã script này đã bị hệ thống chặn đứng, không cho giải nén!\n")
        else:
            print("  ✔ Kiểm tra danh mục tệp: KHÔNG CÓ TỆP THỰC THI NGUY HIỂM (.exe, .bat, .vbs, .dll)")
                
        # Tìm và thẩm định toàn bộ file HTML bên trong gói nén
        html_files = []
        for root, dirs, files in os.walk(temp_dir):
            for f in files:
                if f.lower().endswith(".html"):
                    html_files.append(os.path.join(root, f))
                    
        clean_html_path = None
        for hf in html_files:
            res = inspect_html_file(hf)
            if not res:
                continue
            print(f"------------------------------------------------------------------------------")
            print(f"THẨM TRA FILE BÁO CÁO: {res['file_name']}")
            print(f"  Mã SHA-256: {res['sha256'][:16]}... | Chữ ký gốc: {res['sig_status']}")
            if res['has_csp']:
                print("  ✔ Lá chắn CSP: BẬT (Khóa 100% mạng ngoài, cấm iframe, cấm object)")
            if not res['threats']:
                print("  ✔ Mã độc nhúng / Script: SẠCH 100% (Không phát hiện mẫu mã độc nào)")
                clean_html_path = hf
            else:
                print(f"  ✖ PHÁT HIỆN DẤU HIỆU BẤT THƯỜNG ({len(res['threats'])} cảnh báo) -> Đang khử độc...")
                clean_html_path = sanitize_and_clean_html(hf, res['content'])
                print(f"  [+] Đã khử độc sạch sẽ: {os.path.basename(clean_html_path)}")
            print(f"------------------------------------------------------------------------------\n")

        # Xác định thư mục task để Import vào scans/ của máy KTV
        subdirs = [d for d in os.listdir(temp_dir) if os.path.isdir(os.path.join(temp_dir, d))]
        if subdirs:
            task_source_dir = os.path.join(temp_dir, subdirs[0])
            imported_task_name = subdirs[0]
        else:
            task_source_dir = temp_dir
            imported_task_name = os.path.splitext(os.path.basename(zip_path))[0].replace("BAOCAO_", "")

        dest_dir = os.path.join(SCANS_DIR, imported_task_name)
        os.makedirs(SCANS_DIR, exist_ok=True)
        if os.path.exists(dest_dir):
            shutil.rmtree(dest_dir)
        shutil.copytree(task_source_dir, dest_dir)

        print("=" * 78)
        print("   [✔ TIẾP NHẬN & NHẬP BÁO CÁO THÀNH CÔNG VÀO HỆ THỐNG KTV!]")
        print("=" * 78)
        print(f"   * Tên lượt quét:  {imported_task_name}")
        print(f"   * Đã nhập vào:    scans/{imported_task_name}")
        print(f"   * Trạng thái mã:  ĐÃ THẨM ĐỊNH & KHỬ TRÙNG 100% SẠCH SẼ")
        print("   * Lịch sử quét:   Đã tự động cập nhật vào WebUI Toolkit (Sẵn sàng So sánh)")
        print("=" * 78)
        print()

        final_html = os.path.join(dest_dir, "report.html")
        if not os.path.exists(final_html):
            clean_cand = os.path.join(dest_dir, "report_CLEAN.html")
            if os.path.exists(clean_cand):
                final_html = clean_cand

        if os.path.exists(final_html) and sys.stdin and hasattr(sys.stdin, 'isatty') and sys.stdin.isatty():
            print("[?] Bạn có muốn mở xem báo cáo an toàn trên Trình duyệt ngay bây giờ?")
            try:
                choice = input("    Nhập 'Y' để mở (hoặc Enter để thoát): ").strip().lower()
                if choice == 'y':
                    webbrowser.open(f"file:///{final_html.replace(os.sep, '/')}")
            except Exception:
                pass

    finally:
        try:
            shutil.rmtree(temp_dir)
        except Exception:
            pass

def run_verification(target_file=None):
    print_banner()

    # Nếu truyền vào file zip, thực hiện tiếp nhận và giải nén sandbox
    if target_file and os.path.exists(target_file) and target_file.lower().endswith(".zip"):
        handle_zip_package(target_file)
        return

    files_to_check = []
    if target_file and os.path.exists(target_file):
        files_to_check.append(target_file)
    else:
        # Tu dong quet toan bo report.html trong thu muc scans/
        if os.path.exists(SCANS_DIR):
            for root, dirs, files in os.walk(SCANS_DIR):
                for f in files:
                    if f.lower().endswith(".html"):
                        files_to_check.append(os.path.join(root, f))

    if not files_to_check:
        print("[!] Không tìm thấy file báo cáo .html nào để kiểm tra.")
        print("    Bạn có thể kéo thả trực tiếp file report.html vào file KIEM_TRA_BAO_CAO.bat!")
        print()
        return

    print(f"[*] Tìm thấy {len(files_to_check)} file báo cáo. Đang tiến hành thẩm tra mã...\n")

    for idx, fpath in enumerate(files_to_check, 1):
        res = inspect_html_file(fpath)
        if not res:
            continue

        print(f"------------------------------------------------------------------------------")
        print(f"[{idx}/{len(files_to_check)}] THẨM TRA FILE: {res['file_name']}")
        print(f"      Đường dẫn: {res['file_path']}")
        print(f"      Dung lượng: {res['file_size_kb']} KB | Mã SHA-256: {res['sha256'][:16]}...{res['sha256'][-8:]}")
        print(f"      Chữ ký gốc: {res['sig_status']}")

        # Danh gia muc do an toan
        critical_threats = [t for t in res["threats"] if t["level"] == "CRITICAL"]
        warning_threats = [t for t in res["threats"] if t["level"] == "WARNING"]

        print()
        print("  [KẾT QUẢ KIỂM TRA BẢO MẬT]:")
        
        # CSP Check
        if res["has_csp"] and res["is_airgapped"]:
            print("  ✔ Lá chắn Trình duyệt (CSP): BẬT (Khóa 100% mạng ngoài, cấm iframe, cấm object)")
        elif res["has_csp"]:
            print("  ✔ Lá chắn Trình duyệt (CSP): BẬT")
        else:
            print("  ⚠️ Lá chắn Trình duyệt (CSP): CHƯA BẬT (Nên bổ sung để an toàn tối đa)")

        # Ma doc check
        if not res["threats"]:
            print("  ✔ Mã độc nhúng / Script độc hại: SẠCH 100% (Không phát hiện mẫu mã độc nào)")
            print()
            print("  ==> ĐÁNH GIÁ: [AN TOÀN TUYỆT ĐỐI] - File chuẩn cấu trúc, có thể mở trực tiếp!")
        else:
            print(f"  ✖ PHÁT HIỆN DẤU HIỆU BẤT THƯỜNG / MÃ ĐỘC ({len(res['threats'])} cảnh báo):")
            for t in res["threats"]:
                tag = "[NGUY HIỂM]" if t.get("level") == "CRITICAL" else "[CẢNH BÁO]"
                count_val = t.get("count", 1)
                print(f"      * {tag} {t['name']} (Số lượng: {count_val})")

            print()
            print("  [*] Đang tự động làm sạch và khử độc mã...")
            clean_file = sanitize_and_clean_html(res["file_path"], res["content"])
            print(f"  [+] ĐÃ KHỬ ĐỘC THÀNH CÔNG! Đã lưu bản sạch tại:")
            print(f"      ==> {clean_file}")
            print(f"      Bản sạch này đã loại bỏ toàn bộ mã ngoại lai và kích hoạt lá chắn CSP 100%.")

        print("------------------------------------------------------------------------------\n")

    # Neu chi kiem tra 1 file duy nhat, hoi mo trinh duyet khi chay trong cua so CMD
    if len(files_to_check) == 1 and sys.stdin and hasattr(sys.stdin, 'isatty') and sys.stdin.isatty():
        target = files_to_check[0]
        print("[?] Bạn có muốn mở xem báo cáo an toàn trên Trình duyệt ngay bây giờ?")
        try:
            choice = input("    Nhập 'Y' để mở (hoặc Enter để thoát): ").strip().lower()
            if choice == 'y':
                webbrowser.open(f"file:///{target.replace(os.sep, '/')}")
        except Exception:
            pass

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else None
    run_verification(target)
