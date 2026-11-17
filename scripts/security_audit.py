#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
   SECURITY AUDIT & AST/REGEX HTML SANITIZER ENGINE
   Bảo vệ toàn vẹn báo cáo, phát hiện mã độc AST & Regex,
   chống Zip-Slip Path Traversal, đối chiếu chữ ký SHA-256 nhị phân chuẩn xác.
==============================================================================
"""

import os
import sys
import re
import json
import zipfile
import hashlib
import tempfile
import shutil
from html.parser import HTMLParser
from urllib.parse import urlparse

# Set Windows console to UTF-8
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Dangerous file extensions in ZIP packages
DANGEROUS_EXTS = {
    ".exe", ".scr", ".pif", ".vbs", ".vbe", ".js", ".jse", ".wsf", ".wsh",
    ".bat", ".cmd", ".ps1", ".dll", ".sys", ".hta", ".cpl", ".reg", ".msi",
    ".jar", ".com", ".gadget", ".msp", ".mst"
}

# Dangerous HTML event handlers
DANGEROUS_EVENT_HANDLERS = {
    "onerror", "onload", "onclick", "ondblclick", "onmouseover", "onmouseout",
    "onmouseenter", "onmouseleave", "onmousemove", "onmousedown", "onmouseup",
    "onfocus", "onblur", "onchange", "onsubmit", "onreset", "onselect",
    "onkeydown", "onkeypress", "onkeyup", "onanimationstart", "onanimationend",
    "onpointerdown", "onpointerup", "onpointermove", "oncontextmenu",
    "ontouchstart", "ontouchend", "onwheel", "onpageshow", "onpagehide",
    "onbeforeunload", "onunload", "onhashchange", "onpopstate", "onmessage",
    "onformdata", "ontoggle", "onscroll", "onresize", "oncopy", "oncut", "onpaste"
}

# Regex patterns for malicious activity
MALICIOUS_REGEX_PATTERNS = [
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
        "id": "DANGEROUS_EVAL",
        "name": "Hàm giải mã và thực thi mã động (eval / Function constructor)",
        "level": "WARNING",
        "pattern": re.compile(r"\b(eval\s*\(|new\s+Function\s*\()", re.IGNORECASE)
    },
    {
        "id": "COOKIE_THEFT",
        "name": "Truy cập / Đánh cắp thông tin cookie hoặc phiên (document.cookie / localStorage)",
        "level": "CRITICAL",
        "pattern": re.compile(r"\b(document\.cookie|sessionStorage|localStorage|document\.domain)\b", re.IGNORECASE)
    },
    {
        "id": "META_REFRESH",
        "name": "Thẻ chuyển hướng URL tự động (<meta http-equiv='refresh'>)",
        "level": "WARNING",
        "pattern": re.compile(r"<meta[^>]+http-equiv\s*=\s*['\"]refresh['\"][^>]*>", re.IGNORECASE)
    },
    {
        "id": "BINARY_PAYLOAD",
        "name": "Dữ liệu nhị phân thực thi / Base64 executable trong HTML",
        "level": "CRITICAL",
        "pattern": re.compile(r"(data:application/x-(msdownload|executable|dosexec)|TVqQAAMAAAAEAAAA//8AALgAAAAAAAAA)", re.IGNORECASE)
    }
]

class HTMLSecurityASTParser(HTMLParser):
    """
    AST Parser phân tích cây thẻ HTML, thuộc tính và nội dung script
    để phát hiện rò rỉ dữ liệu, XSS, mã độc nhúng và event handler nguy hiểm.
    """
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.threats = []
        self.in_script = False
        self.current_script_content = []
        self.tag_stack = []

    def handle_starttag(self, tag, attrs):
        tag_lower = tag.lower()
        self.tag_stack.append(tag_lower)
        attrs_dict = dict(attrs)

        # 1. Thẻ nguy hiểm
        if tag_lower in ["iframe", "frame", "frameset"]:
            self.threats.append({
                "id": "HIDDEN_IFRAME",
                "name": f"Thẻ nạp web ngầm <{tag_lower}>",
                "level": "CRITICAL",
                "tag": tag_lower,
                "details": f"Phát hiện thẻ <{tag_lower}>"
            })
        elif tag_lower in ["object", "embed", "applet"]:
            self.threats.append({
                "id": "MALICIOUS_OBJECT",
                "name": f"Thẻ nhúng đối tượng nhị phân <{tag_lower}>",
                "level": "CRITICAL",
                "tag": tag_lower,
                "details": f"Phát hiện thẻ <{tag_lower}>"
            })
        elif tag_lower == "script":
            self.in_script = True
            src = attrs_dict.get("src")
            if src:
                src_clean = src.strip().lower()
                if src_clean.startswith("http://") or src_clean.startswith("https://") or src_clean.startswith("//"):
                    self.threats.append({
                        "id": "EXTERNAL_SCRIPT",
                        "name": f"Nạp mã JavaScript từ xa qua Internet ({src})",
                        "level": "CRITICAL",
                        "tag": "script",
                        "details": f"script src={src}"
                    })
        elif tag_lower == "meta":
            http_equiv = (attrs_dict.get("http-equiv") or "").lower()
            if http_equiv == "refresh":
                self.threats.append({
                    "id": "META_REFRESH",
                    "name": "Thẻ chuyển hướng URL tự động (<meta http-equiv='refresh'>)",
                    "level": "WARNING",
                    "tag": "meta",
                    "details": attrs_dict.get("content", "")
                })

        # 2. Kiểm tra thuộc tính (Attributes): Event Handlers & Dangerous Protocols & Binary Data
        for attr_name, attr_val in attrs:
            if not attr_name:
                continue
            attr_name_lower = attr_name.lower().strip()
            attr_val_str = str(attr_val or "")

            # 2a. Event Handler (onerror, onload, onclick, onmouseover...)
            if attr_name_lower.startswith("on") and (attr_name_lower in DANGEROUS_EVENT_HANDLERS or len(attr_name_lower) > 2):
                # Kiểm tra nếu là action UI hợp lệ trong báo cáo chuẩn của toolkit
                is_safe_ui = False
                val_trimmed = attr_val_str.strip()
                safe_patterns = [
                    r"^switchReportTab\s*\(\s*['\"][a-zA-Z0-9_-]+['\"]\s*\)\s*;?$",
                    r"^filterAppsTable\s*\(\s*\)\s*;?$",
                    r"^filterTreeTable\s*\(\s*\)\s*;?$",
                    r"^toggleTreeExpandAll\s*\(\s*\)\s*;?$",
                    r"^exportTreeCSV\s*\(\s*\)\s*;?$",
                    r"^window\.print\s*\(\s*\)\s*;?$"
                ]
                if attr_name_lower in ["onclick", "oninput"]:
                    for sp in safe_patterns:
                        if re.match(sp, val_trimmed, re.IGNORECASE):
                            is_safe_ui = True
                            break

                if not is_safe_ui:
                    threat_detail = f"Phát hiện event handler nguy hiểm: {attr_name_lower}='{attr_val_str[:60]}'"
                    self.threats.append({
                        "id": "DANGEROUS_EVENT_HANDLER",
                        "name": f"Event Handler thực thi mã JavaScript nguy hiểm ({attr_name_lower})",
                        "level": "CRITICAL",
                        "tag": tag_lower,
                        "attribute": attr_name_lower,
                        "count": 1,
                        "details": threat_detail
                    })
                    # Kiểm tra nội dung mã trong event handler
                    self._inspect_script_code(attr_val_str, source_type=f"attribute {attr_name_lower}")

            # 2b. URL Protocols nguy hiểm (javascript:, vbscript:, data:text/html)
            val_clean = attr_val_str.replace(" ", "").replace("\t", "").replace("\n", "").replace("\r", "").lower()
            if val_clean.startswith("javascript:") or val_clean.startswith("vbscript:"):
                self.threats.append({
                    "id": "JAVASCRIPT_URI",
                    "name": f"Giao thức URL nhúng mã lệnh ({val_clean[:30]})",
                    "level": "CRITICAL",
                    "tag": tag_lower,
                    "attribute": attr_name_lower,
                    "details": f"{attr_name_lower}='{attr_val_str[:50]}'"
                })
                self._inspect_script_code(attr_val_str, source_type=f"uri {attr_name_lower}")

            # 2c. Dữ liệu nhị phân độc hại / executable base64 trong data URI
            if "data:application/x-msdownload" in val_clean or "data:application/x-executable" in val_clean or "tvqqaamaaaaeaaaa" in val_clean:
                self.threats.append({
                    "id": "BINARY_PAYLOAD",
                    "name": "Nhúng mã nhị phân Windows thực thi (.exe / PE) dạng Data URI",
                    "level": "CRITICAL",
                    "tag": tag_lower,
                    "attribute": attr_name_lower,
                    "details": f"{attr_name_lower} chứa binary payload"
                })

    def handle_endtag(self, tag):
        tag_lower = tag.lower()
        if tag_lower == "script":
            self.in_script = False
            full_code = "".join(self.current_script_content)
            self.current_script_content = []
            if full_code.strip():
                self._inspect_script_code(full_code, source_type="<script>")
        if self.tag_stack and self.tag_stack[-1] == tag_lower:
            self.tag_stack.pop()

    def handle_data(self, data):
        if self.in_script:
            self.current_script_content.append(data)

    def _inspect_script_code(self, code_str, source_type="code"):
        """Kiểm tra nội dung đoạn code tìm cookie theft, network calls, eval, ActiveX"""
        # Document cookie / session theft
        if re.search(r"\b(document\.cookie|sessionStorage|localStorage|document\.domain)\b", code_str, re.IGNORECASE):
            self.threats.append({
                "id": "COOKIE_THEFT",
                "name": f"Hành vi truy cập / đánh cắp cookie hoặc phiên ({source_type})",
                "level": "CRITICAL",
                "details": f"Tìm thấy truy cập cookie/storage trong {source_type}"
            })

        # Eval / dynamic execution
        if re.search(r"\b(eval\s*\(|new\s+Function\s*\()", code_str, re.IGNORECASE):
            self.threats.append({
                "id": "DANGEROUS_EVAL",
                "name": f"Mã thực thi động nguy hiểm eval/Function ({source_type})",
                "level": "WARNING",
                "details": f"Phát hiện eval trong {source_type}"
            })

        # ActiveX / Shell
        if re.search(r"(ActiveXObject|WScript\.Shell|Shell\.Application)", code_str, re.IGNORECASE):
            self.threats.append({
                "id": "ACTIVEX_EXEC",
                "name": f"Lệnh thực thi shell hệ điều hành ActiveX ({source_type})",
                "level": "CRITICAL",
                "details": f"Phát hiện ActiveX/WScript trong {source_type}"
            })

        # External network exfiltration (fetch / XMLHttpRequest / WebSocket to foreign IP / host)
        net_matches = re.findall(r"\b(fetch\s*\(\s*['\"`]|new\s+XMLHttpRequest|new\s+WebSocket|navigator\.sendBeacon\s*\(\s*['\"`])", code_str, re.IGNORECASE)
        if net_matches:
            self.threats.append({
                "id": "EXTERNAL_NETWORK_CALL",
                "name": f"Lệnh gửi dữ liệu ra mạng ngoài ({source_type})",
                "level": "WARNING",
                "details": f"Phát hiện gọi mạng trong {source_type}"
            })


def audit_html_content(content_str, filename="report.html", expected_sha256=None):
    """
    Thực hiện kiểm tra bảo mật 2 lớp AST & Regex đối với nội dung HTML.
    Trả về dict chi tiết kết quả thẩm tra.
    """
    # 1. Quét AST bằng HTMLParser
    ast_parser = HTMLSecurityASTParser()
    try:
        ast_parser.feed(content_str)
        ast_parser.close()
    except Exception as e:
        # Nếu HTML bị lỗi cú pháp quá nặng, ghi nhận cảnh báo
        ast_parser.threats.append({
            "id": "HTML_PARSE_ERROR",
            "name": f"Lỗi cú pháp phân tích HTML AST: {str(e)}",
            "level": "WARNING",
            "details": str(e)
        })

    # 2. Quét bổ trợ Regex
    regex_threats = []
    for item in MALICIOUS_REGEX_PATTERNS:
        matches = item["pattern"].findall(content_str)
        if matches:
            # Kiểm tra xem AST đã phát hiện cùng threat id chưa để tránh trùng lặp
            existing = any(t["id"] == item["id"] for t in ast_parser.threats)
            if not existing:
                regex_threats.append({
                    "id": item["id"],
                    "name": item["name"],
                    "level": item["level"],
                    "count": len(matches),
                    "details": f"Regex phát hiện {len(matches)} mẫu phù hợp"
                })

    all_threats = ast_parser.threats + regex_threats

    # 3. Kiểm tra CSP
    has_csp = bool(re.search(r"<meta[^>]+Content-Security-Policy", content_str, re.IGNORECASE))
    is_airgapped = "connect-src 'none'" in content_str and "frame-src 'none'" in content_str

    # 4. Tính toán băm SHA-256 từ chuỗi (utf-8)
    sha256_hash = hashlib.sha256(content_str.encode("utf-8", errors="replace")).hexdigest()
    sig_status = "Chưa có chữ ký gốc"
    sig_match = None
    if expected_sha256:
        clean_expected = expected_sha256.strip().split()[0].lower()
        if clean_expected == sha256_hash.lower():
            sig_status = "✔ HỢP LỆ (Khớp 100% chữ ký lúc tạo, không bị chỉnh sửa)"
            sig_match = True
        else:
            sig_status = "✖ BỊ SAI LỆCH! (File đã bị virus hoặc ai đó sửa đổi sau khi tạo!)"
            sig_match = False

    is_safe = (len([t for t in all_threats if t["level"] == "CRITICAL"]) == 0) and (sig_match is not False)

    return {
        "filename": filename,
        "is_safe": is_safe,
        "threat_count": len(all_threats),
        "threats": all_threats,
        "critical_threats": [t for t in all_threats if t["level"] == "CRITICAL"],
        "warning_threats": [t for t in all_threats if t["level"] == "WARNING"],
        "has_csp": has_csp,
        "is_airgapped": is_airgapped,
        "sha256": sha256_hash,
        "sig_status": sig_status,
        "sig_match": sig_match,
        "sig_valid": sig_match
    }


def audit_html_file(file_path):
    """
    Thẩm tra một file HTML trên đĩa.
    Tính toán SHA-256 từ file nhị phân (open 'rb') chuẩn xác,
    đối chiếu với file .sha256 đi kèm nếu có.
    """
    if not os.path.exists(file_path):
        return {
            "status": "error",
            "message": f"Không tìm thấy file: {file_path}",
            "is_safe": False
        }

    # Đọc binary để tính mã SHA-256 thực tế trên đĩa
    with open(file_path, "rb") as f:
        raw_bytes = f.read()
    disk_sha256 = hashlib.sha256(raw_bytes).hexdigest()

    # Đọc text UTF-8 để phân tích nội dung HTML
    try:
        content_str = raw_bytes.decode("utf-8")
    except UnicodeDecodeError:
        content_str = raw_bytes.decode("utf-8", errors="replace")

    # Kiểm tra file .sha256 đồng hành
    sha_file = f"{file_path}.sha256"
    expected_sha = None
    if os.path.exists(sha_file):
        try:
            with open(sha_file, "r", encoding="utf-8") as sf:
                expected_sha = sf.read().strip()
        except Exception:
            pass

    res = audit_html_content(content_str, os.path.basename(file_path), expected_sha)
    # Cập nhật mã SHA256 chuẩn từ đĩa
    res["sha256_disk"] = disk_sha256
    if expected_sha:
        exp_clean = expected_sha.strip().split()[0].lower()
        if exp_clean == disk_sha256.lower():
            res["sig_status"] = "✔ HỢP LỆ (Khớp 100% chữ ký lúc tạo, không bị chỉnh sửa)"
            res["sig_match"] = True
        else:
            res["sig_status"] = "✖ BỊ SAI LỆCH! (File đã bị virus hoặc ai đó sửa đổi sau khi tạo!)"
            res["sig_match"] = False
            res["is_safe"] = False

    res["file_path"] = file_path
    res["file_size"] = len(raw_bytes)
    return res


def sanitize_html(content_str):
    """
    Tự động làm sạch và khử trùng mã độc trong HTML:
    - Loại bỏ toàn bộ script nạp từ xa (<script src='http...'>)
    - Loại bỏ thẻ iframe, object, embed, applet
    - Loại bỏ các event handler nguy hiểm (onerror=, onload=, onclick=...)
    - Loại bỏ các URL nguy hiểm javascript:, vbscript:, payload nhị phân
    - Loại bỏ ActiveX / WScript
    - Kích hoạt lá chắn Content-Security-Policy nghiêm ngặt
    """
    clean = content_str

    # 1. Loại bỏ script nạp từ xa
    clean = re.sub(r"<script[^>]+src\s*=\s*['\"](https?://|//)[^'\"]+['\"][^>]*>.*?</script>", "", clean, flags=re.IGNORECASE | re.DOTALL)
    clean = re.sub(r"<script[^>]+src\s*=\s*['\"](https?://|//)[^'\"]+['\"][^>]*/>", "", clean, flags=re.IGNORECASE)

    # 2. Loại bỏ iframe, object, embed, applet
    clean = re.sub(r"<iframe[^>]*>.*?</iframe>", "", clean, flags=re.IGNORECASE | re.DOTALL)
    clean = re.sub(r"<iframe[^>]*/>", "", clean, flags=re.IGNORECASE)
    clean = re.sub(r"<(object|embed|applet)[^>]*>.*?</\1>", "", clean, flags=re.IGNORECASE | re.DOTALL)
    clean = re.sub(r"<(object|embed|applet)[^>]*/>", "", clean, flags=re.IGNORECASE)

    # 3. Loại bỏ ActiveX / WScript / Shell
    clean = re.sub(r"<script[^>]*>(?:(?!</script>).)*(?:ActiveXObject|WScript\.Shell|Shell\.Application)(?:(?!</script>).)*</script>", "", clean, flags=re.IGNORECASE | re.DOTALL)

    # 4. Loại bỏ meta refresh
    clean = re.sub(r"<meta[^>]+http-equiv\s*=\s*['\"]refresh['\"][^>]*>", "", clean, flags=re.IGNORECASE)

    # 5. Loại bỏ toàn bộ event handlers (onerror=, onload=, onclick=...)
    clean = re.sub(r"\s+on[a-zA-Z]+\s*=\s*(['\"][^'\"]*['\"]|[^\s>]+)", "", clean, flags=re.IGNORECASE)

    # 6. Loại bỏ javascript: / vbscript: trong href / src
    clean = re.sub(r"(href|src)\s*=\s*['\"](?:javascript|vbscript):[^'\"]*['\"]", r'\1="#"', clean, flags=re.IGNORECASE)

    # 7. Đảm bảo Content-Security-Policy nghiêm ngặt
    if "<meta http-equiv=\"Content-Security-Policy\"" not in clean and "<head" in clean.lower():
        csp_tag = '\n<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; script-src \'unsafe-inline\'; img-src data: blob:; connect-src \'none\'; frame-src \'none\'; object-src \'none\'; base-uri \'none\'; form-action \'none\';">\n'
        clean = re.sub(r"(<head[^>]*>)", r"\1" + csp_tag, clean, count=1, flags=re.IGNORECASE)

    return clean


def inspect_zip_package(zip_path_or_bytes, extract_target_dir=None):
    """
    Thẩm tra toàn diện file nén ZIP:
    - Chống lỗ hổng Zip Slip (Path Traversal ../, ..\\, đường dẫn tuyệt đối)
    - Chặn đứng các tệp thực thi / mã script nguy hiểm (.exe, .bat, .vbs, .dll, .ps1...)
    - Trả về danh sách an toàn và danh sách bị chặn
    - Giải nén an toàn vào thư mục cách ly (nếu có yêu cầu extract)
    """
    is_bytes = isinstance(zip_path_or_bytes, (bytes, bytearray))
    temp_zip_file = None
    if is_bytes:
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".zip")
        temp_file.write(zip_path_or_bytes)
        temp_file.close()
        zip_file_path = temp_file.name
        temp_zip_file = zip_file_path
    else:
        zip_file_path = zip_path_or_bytes

    if not os.path.exists(zip_file_path):
        return {
            "status": "error",
            "message": f"Không tìm thấy file zip: {zip_file_path}",
            "is_safe": False
        }

    blocked_traversal = []
    blocked_dangerous_exts = []
    safe_members = []

    try:
        with zipfile.ZipFile(zip_file_path, "r") as zf:
            for member in zf.infolist():
                fname = member.filename
                # Kiểm tra Zip Slip / Path Traversal
                if ".." in fname or fname.startswith("/") or fname.startswith("\\") or (len(fname) > 2 and fname[1] == ":"):
                    blocked_traversal.append(fname)
                    continue

                # Kiểm tra phần mở rộng nguy hiểm
                ext = os.path.splitext(fname)[1].lower()
                if ext in DANGEROUS_EXTS:
                    blocked_dangerous_exts.append(fname)
                    continue

                safe_members.append(member)

            # Giải nén an toàn nếu có chỉ định thư mục
            if extract_target_dir:
                os.makedirs(extract_target_dir, exist_ok=True)
                for member in safe_members:
                    zf.extract(member, extract_target_dir)

    except zipfile.BadZipFile:
        return {
            "status": "error",
            "message": "Tệp tin không phải là định dạng ZIP hợp lệ hoặc đã bị hỏng!",
            "is_safe": False
        }
    finally:
        if temp_zip_file and os.path.exists(temp_zip_file):
            try:
                os.remove(temp_zip_file)
            except Exception:
                pass

    total_threats = len(blocked_traversal) + len(blocked_dangerous_exts)
    is_safe = (total_threats == 0)

    return {
        "status": "ok",
        "is_safe": is_safe,
        "blocked_traversal": blocked_traversal,
        "blocked_dangerous_exts": blocked_dangerous_exts,
        "safe_member_count": len(safe_members),
        "total_threats": total_threats,
        "details": f"Phát hiện {len(blocked_traversal)} lỗ hổng Path Traversal, {len(blocked_dangerous_exts)} tệp nhị phân nguy hiểm bị chặn." if not is_safe else "Gói ZIP 100% an toàn."
    }

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = sys.argv[1]
        if target.lower().endswith(".zip"):
            print(json.dumps(inspect_zip_package(target), indent=2, ensure_ascii=False))
        else:
            print(json.dumps(audit_html_file(target), indent=2, ensure_ascii=False))
    else:
        print("Usage: python security_audit.py <path_to_html_or_zip>")
