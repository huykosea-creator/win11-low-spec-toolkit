# Windows 11 Low-Spec & Optimization Toolkit

Bộ công cụ, tài liệu và script hỗ trợ cài đặt, tối ưu hóa Windows 11 cho máy cấu hình yếu/ít RAM, xử lý thông báo kích hoạt và hướng dẫn an toàn pháp lý.

---

## 📁 Cấu trúc thư mục

```text
win11-low-spec-toolkit/
├── MO_GIAO_DIEN.bat                    # 🌟 NHẤP ĐÚP ĐỂ KHỞI CHẠY WEBUI & ENGINE PYTHON PORTABLE (BẤM LÀ CHẠY)
├── server.py                           # Runner Engine (Python Native) quản lý cài đặt tuần tự & delay 3s
├── server.ps1                          # Engine Fallback PowerShell Native
├── assets/
│   └── icons/                          # Bộ icon logo vector SVG chính thức của các phần mềm
├── python/                             # Bộ Python 3.11 Embeddable Portable tích hợp sẵn (Không lo lỗi PowerShell)
├── index.html                          # Trang WebUI Dashboard trực quan (Chế độ Lưới / Danh sách, Đổi Icon)
├── README.md                           # Hướng dẫn tổng quan và hướng dẫn sử dụng
├── docs/
│   ├── bios.md                         # Cẩm nang BIOS: IDE vs AHCI, Legacy vs UEFI, MBR vs GPT
│   ├── rufus-bypass-guide.md           # Hướng dẫn tạo USB cài đặt bypass TPM, RAM, CPU
│   └── legal-and-security.md           # Đánh giá chi tiết rủi ro pháp lý & bảo mật
├── scripts/
│   ├── bypass-setup-requirements.reg   # File Registry bypass phần cứng trực tiếp khi cài Win
│   ├── export-installed-software.bat   # Script xuất danh sách phần mềm đang có trên máy cũ
│   ├── export-installed-software.ps1   # Script PowerShell quét Registry lấy danh sách app
│   ├── hide-activation-watermark.bat   # Script ẩn watermark "Activate Windows"
│   ├── optimize-low-spec.ps1           # Script PowerShell tối ưu hóa RAM & dịch vụ ngầm
│   └── restore-defaults.ps1            # Script khôi phục thiết lập mặc định
└── software/
    ├── README.md                       # Bảng tổng hợp phần mềm & lệnh winget
    ├── apps.json                       # Dữ liệu JSON quản lý danh mục ứng dụng
    ├── winrar/                         # Lưu trữ / Link tải WinRAR (.rar)
    ├── unikey/                         # Lưu trữ / Link tải UniKey
    ├── chrome/                         # Lưu trữ / Link tải Google Chrome
    ├── firefox/                        # Lưu trữ / Link tải Mozilla Firefox
    ├── ultraviewer/                    # Lưu trữ / Link tải UltraViewer
    ├── rustdesk/                       # Lưu trữ / Link tải RustDesk
    ├── anydesk/                        # Lưu trữ / Link tải AnyDesk
    ├── vlc-player/                     # Lưu trữ / Link tải VLC Media Player
    ├── sumatra-pdf/                    # Lưu trữ / Link tải Sumatra PDF
    ├── mem-reduct/                     # Lưu trữ / Link tải Mem Reduct
    ├── geek-uninstaller/               # Lưu trữ / Link tải Geek Uninstaller
    └── libreoffice/                    # Lưu trữ / Link tải LibreOffice
```

---

## 🚀 Hướng dẫn nhanh

### 0. Mở giao diện điều khiển trực quan (Khuyên dùng)
- Nhấp đúp vào [MO_GIAO_DIEN.bat](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/MO_GIAO_DIEN.bat) (hoặc mở trực tiếp file [index.html](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/index.html)).
- Giao diện WebUI sẽ tự động mở trên trình duyệt với đầy đủ tính năng: chọn app tạo lệnh cài đặt tự động, kéo thả xem file máy cũ, cẩm nang BIOS và tối ưu máy.

### 1. Chuẩn bị BIOS & Ổ cứng chuẩn kỹ thuật
- Nắm vững quy tắc ghép cặp: **UEFI + GPT + AHCI** để tránh màn hình xanh hoặc lỗi không boot được (xem [bios.md](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/docs/bios.md)).

### 2. Cài đặt trên máy không hỗ trợ (TPM / CPU / RAM < 4GB)
- **Cách khuyến nghị:** Sử dụng Rufus tạo bộ cài ISO (xem [rufus-bypass-guide.md](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/docs/rufus-bypass-guide.md)).
- **Cách dùng trực tiếp trong bộ cài:** Nhấn `Shift + F10` ở màn hình cài đặt Windows, mở CMD và import file [bypass-setup-requirements.reg](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/scripts/bypass-setup-requirements.reg).

### 3. Tối ưu hóa hiệu năng sau khi cài
- Nhấp chuột phải vào [optimize-low-spec.ps1](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/scripts/optimize-low-spec.ps1) -> **Run with PowerShell** (với quyền Admin).
- Script sẽ:
  - Tắt các hiệu ứng đồ họa không cần thiết (chỉ giữ font chữ mượt mà).
  - Tắt Widgets, Copilot và Web Search trên Taskbar.
  - Tắt telemetry và các dịch vụ thu thập dữ liệu ngầm.
  - Thiết lập chế độ tiết kiệm tài nguyên.

### 4. Tắt watermark "Activate Windows"
- Nhấp chuột phải vào [hide-activation-watermark.bat](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/scripts/hide-activation-watermark.bat) -> **Run as administrator**.
- Cung cấp tùy chọn:
  1. Gia hạn 30 ngày chính thống từ Microsoft (`slmgr /rearm`).
  2. Ẩn thông báo Desktop version qua Registry.

### 5. Xuất danh sách phần mềm từ máy cũ
- Chạy file [export-installed-software.bat](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/scripts/export-installed-software.bat) hoặc bấm card **📋 Xuất Thông Tin Phần Mềm Đã Cài** trên WebUI.
- Script sẽ tự động quét Registry (32-bit & 64-bit) và xuất ra 2 file trong thư mục `scans/`:
  - `Danh_Sach_Phan_Mem_<TênMáy>.txt`: Dễ đọc, mở trực tiếp bằng Notepad.
  - `Danh_Sach_Phan_Mem_<TênMáy>.csv`: Dễ lọc và quản lý trong Microsoft Excel.

### 6. Tìm hiểu về rủi ro pháp lý
- Xem chi tiết tại [legal-and-security.md](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/docs/legal-and-security.md).
