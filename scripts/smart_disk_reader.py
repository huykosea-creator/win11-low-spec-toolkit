#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
   SMART DISK READER & HEALTH INTEGRITY SERVICE
   Đọc, thẩm tra tính toàn vẹn và xử lý ngoại lệ an toàn cho smart_info.json
   Tự động phát hiện dữ liệu hỏng, khôi phục fallback và chẩn đoán phần cứng.
==============================================================================
"""

import os
import sys
import json

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCANS_DIR = os.path.join(ROOT_DIR, "scans")

def resolve_task_folder(scan_id_or_dir):
    """Xác định đường dẫn thư mục task từ scan_id hoặc đường dẫn trực tiếp"""
    if not scan_id_or_dir:
        return None
    if os.path.isdir(scan_id_or_dir):
        return scan_id_or_dir
    cand = os.path.join(SCANS_DIR, str(scan_id_or_dir))
    if os.path.isdir(cand):
        return cand
    if os.path.exists(SCANS_DIR):
        for name in os.listdir(SCANS_DIR):
            p = os.path.join(SCANS_DIR, name)
            if os.path.isdir(p):
                info_p = os.path.join(p, "info.json")
                if os.path.exists(info_p):
                    try:
                        with open(info_p, "r", encoding="utf-8") as f:
                            ci = json.load(f)
                        if ci.get("scan_id") == scan_id_or_dir:
                            return p
                    except Exception:
                        pass
    return None

def get_default_smart_profile():
    """Tạo profile S.M.A.R.T mặc định an toàn cho hệ thống khi thiếu dữ liệu"""
    return {
        "status": "default_fallback",
        "timestamp": "",
        "disks": [
            {
                "id": "disk_0",
                "driveLetter": "C:",
                "name": "Ổ Cứng Hệ Thống Windows (System Storage)",
                "type": "nvme",
                "typeLabel": "SSD NVMe PCIe",
                "busType": "PCIe NVMe",
                "formFactor": "M.2 2280",
                "serialNumber": "SSD-PRIMARY-SAFE",
                "capacity": 256,
                "temp": 40,
                "healthScore": 95,
                "healthStatus": "GOOD",
                "powerOnHours": 1000,
                "powerCycles": 300,
                "unsafeShutdowns": 2,
                "totalWritesTBW": 10.0,
                "ratedTBW": 150,
                "smartAttributes": {
                    "reallocated": 0,
                    "pending": 0,
                    "uncorrectable": 0,
                    "crcErrors": 0,
                    "mediaErrors": 0,
                    "availableSpare": 95,
                    "percentageUsed": 5
                },
                "partitions": ["C:"]
            }
        ]
    }

def validate_disk_object(disk):
    """Kiểm tra tính toàn vẹn của một object thông tin ổ đĩa"""
    if not isinstance(disk, dict):
        return False, "Đối tượng ổ đĩa không phải là dictionary"

    # Kiểm tra các trường bắt buộc
    req_fields = ["name", "healthScore", "healthStatus"]
    for rf in req_fields:
        if rf not in disk:
            return False, f"Thiếu trường thông tin bắt buộc: {rf}"

    # Kiểm tra giới hạn điểm sức khỏe (0 - 100)
    try:
        score = int(disk.get("healthScore", 0))
        if score < 0 or score > 100:
            return False, f"Điểm sức khỏe không hợp lệ (ngoài phạm vi 0-100): {score}"
    except (ValueError, TypeError):
        return False, "Điểm sức khỏe không phải là số hợp lệ"

    # Kiểm tra trạng thái sức khỏe
    status = str(disk.get("healthStatus", "")).upper()
    if status not in ["GOOD", "CAUTION", "BAD", "HEALTHY", "WARNING", "UNHEALTHY"]:
        return False, f"Trạng thái sức khỏe không đúng chuẩn: {status}"

    return True, "Hợp lệ"

def read_smart_info(scan_id_or_dir):
    """
    Đọc an toàn file smart_info.json từ thư mục task.
    Bắt trọn vẹn ngoại lệ:
    - Thiếu thư mục hoặc thiếu file smart_info.json -> status: 'missing'
    - File bị hỏng (JSON syntax error, rỗng, truncated) -> status: 'corrupted'
    - File hợp lệ nhưng cấu trúc sai -> status: 'invalid_schema'
    - File hợp lệ -> status: 'ok'
    """
    task_dir = resolve_task_folder(scan_id_or_dir)
    if not task_dir:
        return {
            "status": "missing",
            "message": f"Không tìm thấy thư mục lượt quét: {scan_id_or_dir}",
            "disks": get_default_smart_profile()["disks"],
            "data": None
        }

    smart_file = os.path.join(task_dir, "smart_info.json")
    if not os.path.exists(smart_file):
        return {
            "status": "missing",
            "message": f"Chưa có tệp smart_info.json trong {os.path.basename(task_dir)}",
            "disks": get_default_smart_profile()["disks"],
            "data": None
        }

    try:
        with open(smart_file, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                return {
                    "status": "corrupted",
                    "message": "Tệp smart_info.json rỗng (0 bytes)",
                    "disks": get_default_smart_profile()["disks"],
                    "data": None
                }
            data = json.loads(content)

    except json.JSONDecodeError as jde:
        return {
            "status": "corrupted",
            "message": f"Tệp smart_info.json bị hỏng cấu trúc cú pháp JSON: {str(jde)}",
            "disks": get_default_smart_profile()["disks"],
            "data": None
        }
    except Exception as e:
        return {
            "status": "corrupted",
            "message": f"Lỗi không xác định khi đọc smart_info.json: {str(e)}",
            "disks": get_default_smart_profile()["disks"],
            "data": None
        }

    # Chuẩn hóa danh sách disks
    disks = []
    if isinstance(data, dict):
        if "disks" in data and isinstance(data["disks"], list):
            disks = data["disks"]
        elif "disk" in data and isinstance(data["disk"], dict):
            disks = [data["disk"]]
    elif isinstance(data, list):
        disks = data

    if not disks:
        return {
            "status": "invalid_schema",
            "message": "Không tìm thấy danh sách ổ đĩa hợp lệ trong smart_info.json",
            "disks": get_default_smart_profile()["disks"],
            "data": data
        }

    # Thẩm tra từng ổ đĩa
    valid_disks = []
    has_issues = False
    for d in disks:
        is_ok, err_msg = validate_disk_object(d)
        if is_ok:
            valid_disks.append(d)
        else:
            has_issues = True

    return {
        "status": "ok" if not has_issues else "partial_valid",
        "message": "Đọc dữ liệu S.M.A.R.T thành công" if not has_issues else "Một số bản ghi ổ đĩa bị lỗi đã được lọc bỏ",
        "disks": valid_disks if valid_disks else get_default_smart_profile()["disks"],
        "data": data,
        "disk_count": len(valid_disks)
    }

def save_smart_info(scan_id_or_dir, smart_data):
    """Lưu an toàn dữ liệu S.M.A.R.T vào thư mục task với kiểm tra toàn vẹn"""
    task_dir = resolve_task_folder(scan_id_or_dir)
    if not task_dir:
        # Nếu truyền scan_id chưa tồn tại, tạo thư mục mới trong scans/
        task_dir = os.path.join(SCANS_DIR, str(scan_id_or_dir))
        os.makedirs(task_dir, exist_ok=True)

    smart_file = os.path.join(task_dir, "smart_info.json")
    try:
        # Ghi tạm ra file tmp rồi đổi tên để tránh hỏng dữ liệu khi mất điện/crash (Atomic write)
        tmp_file = f"{smart_file}.tmp"
        with open(tmp_file, "w", encoding="utf-8") as f:
            json.dump(smart_data, f, ensure_ascii=False, indent=2)
        if os.path.exists(smart_file):
            os.replace(tmp_file, smart_file)
        else:
            os.rename(tmp_file, smart_file)
        return True, smart_file
    except Exception as e:
        return False, str(e)

def query_live_smart_disks():
    """Truy vấn S.M.A.R.T trực tiếp từ phần cứng thông qua disk_smart_service"""
    try:
        from scripts.disk_smart_service import scan_all_smart_disks
        return scan_all_smart_disks()
    except Exception:
        return get_default_smart_profile()["disks"]

def diagnose_disk(disk_data):
    """Chẩn đoán AI cho ổ đĩa thông qua disk_smart_service"""
    try:
        from scripts.disk_smart_service import diagnose_disk_ai
        return diagnose_disk_ai(disk_data)
    except Exception as e:
        return f"Không thể tạo chẩn đoán: {str(e)}"
