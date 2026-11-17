#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tạo và quản lý bộ icon chính thức (SVG vector) cho 12 phần mềm.
Có thể dùng để tải icon từ URL bất kỳ vào thư mục assets/icons/.
"""

import os
import sys
import urllib.request

ICONS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "icons")
os.makedirs(ICONS_DIR, exist_ok=True)

# Bộ vector SVG chuẩn nét, màu sắc chính xác, chạy 100% offline
SVG_ICONS = {
    "chrome": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle cx="24" cy="24" r="12" fill="#fff"/>
  <path fill="#4caf50" d="M24 36c6.63 0 12-5.37 12-12 0-.3-.02-.6-.05-.89L24 24h-7.61c1.88 4.69 6.47 8 11.61 8l-4 4z"/>
  <path fill="#fbc02d" d="M35.95 23.11C35.48 16.92 30.29 12 24 12c-3.15 0-6.02 1.23-8.15 3.23l6.54 11.33L24 24h11.95z"/>
  <path fill="#e53935" d="M24 12c6.29 0 11.48 4.92 11.95 11.11H24l-8.15-8.77C17.98 13.23 20.85 12 24 12z"/>
  <path fill="#e53935" d="M15.85 15.23L9.31 26.56C8.48 24.23 8 21.68 8 19c0-3.87 1.09-7.48 2.98-10.56l4.87 6.79z"/>
  <path fill="#fbc02d" d="M24 36c-5.14 0-9.73-3.31-11.61-8l-3.08-1.44c-.83 2.33-.31 5.44 1.69 7.44L24 36z"/>
  <circle cx="24" cy="24" r="6" fill="#1976d2"/>
</svg>''',

    "firefox": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <radialGradient id="ff-a" cx="24" cy="24" r="20" gradientUnits="userSpaceOnUse">
    <stop offset="0%" stop-color="#ff9100"/>
    <stop offset="70%" stop-color="#ff3d00"/>
    <stop offset="100%" stop-color="#d50000"/>
  </radialGradient>
  <circle cx="24" cy="24" r="20" fill="url(#ff-a)"/>
  <circle cx="24" cy="24" r="14" fill="#2979ff"/>
  <path fill="#ffd600" d="M38 18c-2-6-8-10-14-10-3 0-5 1-7 2 4 1 7 4 8 7 1 2 0 5-2 6-3 2-6 1-8-1-1-2-1-4 0-6-4 3-7 8-7 14 0 9 7 16 16 16 7 0 13-4 15-11 1-3 1-6 0-8-.4-1.5-1.1-2.9-1.9-4 2.8 1.6 4.9 4.3 5.9 7.5.3-2.1.2-4.3-.4-6.5-.4-1.6-1.3-3.7-2.6-5z"/>
  <circle cx="20" cy="26" r="10" fill="#00e5ff" opacity=".6"/>
</svg>''',

    "vlc": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <path fill="#ff6d00" d="M21.5 5h5l2.5 9h-10z"/>
  <path fill="#ffffff" d="M19 14h10l2 7h-14z"/>
  <path fill="#ff6d00" d="M17 21h14l2.5 8h-19z"/>
  <path fill="#ffffff" d="M14.5 29h19l2 7h-23z"/>
  <path fill="#ff6d00" d="M12.5 36h23l2.5 5h-28z"/>
  <ellipse cx="24" cy="42" rx="19" ry="3" fill="#e65100"/>
</svg>''',

    "anydesk": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="10" fill="#ef4444"/>
  <path fill="#ffffff" d="M14 24l9-9 9 9-9 9z" opacity=".85"/>
  <path fill="#ffffff" d="M25 15l9 9-9 9-9-9z"/>
</svg>''',

    "rustdesk": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="10" fill="#0284c7"/>
  <circle cx="24" cy="24" r="14" fill="#ffffff" opacity=".2"/>
  <path fill="#ffffff" d="M24 10l12 7v14l-12 7-12-7V17l12-7z" fill-opacity=".9"/>
  <circle cx="24" cy="24" r="6" fill="#f97316"/>
</svg>''',

    "winrar": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect x="6" y="8" width="36" height="32" rx="3" fill="#3b82f6"/>
  <rect x="10" y="8" width="8" height="32" fill="#10b981"/>
  <rect x="20" y="8" width="8" height="32" fill="#ec4899"/>
  <rect x="30" y="8" width="8" height="32" fill="#8b5cf6"/>
  <rect x="6" y="20" width="36" height="8" fill="#1e293b"/>
  <rect x="20" y="18" width="8" height="12" rx="2" fill="#fbbf24"/>
  <circle cx="24" cy="24" r="2" fill="#1e293b"/>
</svg>''',

    "unikey": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="10" fill="#f3e8ff"/>
  <rect x="8" y="10" width="32" height="28" rx="4" fill="#7c3aed"/>
  <rect x="12" y="14" width="24" height="12" rx="2" fill="#ede9fe"/>
  <text x="24" y="24" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="#7c3aed" text-anchor="middle">UNI</text>
  <circle cx="16" cy="32" r="2" fill="#facc15"/>
  <circle cx="24" cy="32" r="2" fill="#facc15"/>
  <circle cx="32" cy="32" r="2" fill="#facc15"/>
  <text x="24" y="36" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">V</text>
</svg>''',

    "ultraviewer": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="10" fill="#0284c7"/>
  <rect x="8" y="10" width="32" height="22" rx="3" fill="#ffffff"/>
  <rect x="11" y="13" width="26" height="16" rx="1" fill="#38bdf8"/>
  <path d="M20 32h8l2 6h-12z" fill="#ffffff"/>
  <path d="M16 40h16v2H16z" fill="#ffffff"/>
  <circle cx="24" cy="21" r="4" fill="#0284c7"/>
</svg>''',

    "sumatra-pdf": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <path d="M10 6h20l10 10v26H10z" fill="#fef08a"/>
  <path d="M30 6v10h10z" fill="#facc15"/>
  <rect x="14" y="22" width="20" height="3" rx="1" fill="#ca8a04"/>
  <rect x="14" y="28" width="16" height="3" rx="1" fill="#ca8a04"/>
  <rect x="14" y="34" width="12" height="3" rx="1" fill="#ca8a04"/>
  <text x="28" y="38" font-family="Arial, sans-serif" font-size="9" font-weight="900" fill="#dc2626">PDF</text>
</svg>''',

    "mem-reduct": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="10" fill="#10b981"/>
  <rect x="10" y="16" width="28" height="16" rx="2" fill="#ffffff"/>
  <rect x="14" y="20" width="5" height="8" rx="1" fill="#059669"/>
  <rect x="22" y="20" width="5" height="8" rx="1" fill="#059669"/>
  <rect x="30" y="20" width="5" height="8" rx="1" fill="#059669"/>
  <path d="M14 12v4m4-4v4m4-4v4m4-4v4m4-4v4" stroke="#ffffff" stroke-width="2"/>
  <path d="M14 32v4m4-4v4m4-4v4m4-4v4m4-4v4" stroke="#ffffff" stroke-width="2"/>
  <path d="M28 26l8 8m0-8l-8 8" stroke="#facc15" stroke-width="3" stroke-linecap="round"/>
</svg>''',

    "geek-uninstaller": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="10" fill="#f97316"/>
  <polygon points="24,10 38,36 10,36" fill="#ffffff"/>
  <polygon points="24,15 34,33 14,33" fill="#ea580c"/>
  <circle cx="24" cy="28" r="2.5" fill="#ffffff"/>
  <rect x="22.5" y="20" width="3" height="5" rx="1" fill="#ffffff"/>
</svg>''',

    "libreoffice": '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="10" fill="#15803d"/>
  <path d="M12 8h16l8 8v24H12z" fill="#ffffff"/>
  <path d="M28 8v8h8z" fill="#86efac"/>
  <rect x="16" y="22" width="16" height="3" rx="1" fill="#16a34a"/>
  <rect x="16" y="28" width="16" height="3" rx="1" fill="#16a34a"/>
  <rect x="16" y="34" width="10" height="3" rx="1" fill="#16a34a"/>
</svg>'''
}

def write_default_icons():
    for name, svg_content in SVG_ICONS.items():
        file_path = os.path.join(ICONS_DIR, f"{name}.svg")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(svg_content.strip())
    print(f"[OK] Da tao thanh cong {len(SVG_ICONS)} icon SVG chuan net tai: {ICONS_DIR}")

def download_icon(app_id, url):
    """Tai icon tu URL va luu vao assets/icons/<app_id>.<ext>"""
    ext = ".png"
    if ".svg" in url.lower():
        ext = ".svg"
    elif ".ico" in url.lower():
        ext = ".ico"
    
    target_path = os.path.join(ICONS_DIR, f"{app_id}{ext}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as response, open(target_path, 'wb') as out_file:
        out_file.write(response.read())
    print(f"[OK] Da tai icon cho {app_id} tu: {url} -> {target_path}")
    return target_path

if __name__ == "__main__":
    if len(sys.argv) >= 3:
        download_icon(sys.argv[1], sys.argv[2])
    else:
        write_default_icons()
