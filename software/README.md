# Danh Mục Phần Mềm Quản Lý & Cài Đặt (Windows 11)

Thư mục này quản lý toàn bộ danh sách các phần mềm đã được cập nhật theo đúng yêu cầu:
- **Nén & Giải nén:** WinRAR (.rar)
- **Gõ tiếng Việt:** UniKey
- **Trình duyệt Web:** Google Chrome, Mozilla Firefox
- **Điều khiển từ xa:** UltraViewer, RustDesk, AnyDesk
- **Đa phương tiện:** VLC Media Player
- **Văn phòng & Tiện ích:** Sumatra PDF, Mem Reduct, Geek Uninstaller, LibreOffice

Dữ liệu JSON chi tiết: [`apps.json`](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/apps.json)

---

## 📋 Bảng tổng hợp ứng dụng

| STT | Tên ứng dụng | Phân loại | Thư mục & Link tải | Lệnh cài nhanh (Winget) |
| :---: | :--- | :--- | :--- | :--- |
| **01** | **WinRAR (.rar)** | Nén & Giải nén | [winrar/](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/winrar/info.md) | `winget install RARLab.WinRAR` |
| **02** | **UniKey** | Gõ tiếng Việt | [unikey/](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/unikey/info.md) | `winget install UniKey.UniKey` |
| **03** | **Google Chrome** | Trình duyệt Web | [chrome/](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/chrome/info.md) | `winget install Google.Chrome` |
| **04** | **Mozilla Firefox** | Trình duyệt Web | [firefox/](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/firefox/info.md) | `winget install Mozilla.Firefox` |
| **05** | **UltraViewer** | Điều khiển từ xa | [ultraviewer/](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/ultraviewer/info.md) | `winget install UltraViewer.UltraViewer` |
| **06** | **RustDesk** | Điều khiển từ xa (Mã nguồn mở) | [rustdesk/](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/rustdesk/info.md) | `winget install RustDesk.RustDesk` |
| **07** | **AnyDesk** | Điều khiển từ xa (Siêu nhẹ) | [anydesk/](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/anydesk/info.md) | `winget install AnyDeskSoftwareGmbH.AnyDesk` |
| **08** | **VLC Media Player** | Phát video & âm thanh | [vlc-player/](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/vlc-player/info.md) | `winget install VideoLAN.VLC` |
| **09** | **Sumatra PDF** | Đọc PDF siêu tốc | [sumatra-pdf/](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/sumatra-pdf/info.md) | `winget install SumatraPDF.SumatraPDF` |
| **10** | **Mem Reduct** | Quản lý & dọn RAM | [mem-reduct/](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/mem-reduct/info.md) | `winget install "Henry++ .MemReduct"` |
| **11** | **Geek Uninstaller** | Gỡ app triệt để | [geek-uninstaller/](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/geek-uninstaller/info.md) | `winget install GeekUninstaller.GeekUninstaller` |
| **12** | **LibreOffice** | Ứng dụng văn phòng | [libreoffice/](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/libreoffice/info.md) | `winget install TheDocumentFoundation.LibreOffice` |

---

## ⚡ Cài đặt nhanh toàn bộ chỉ bằng 1 dòng lệnh (One-liner Winget)

Mở **PowerShell** hoặc **Terminal** và dán lệnh sau để tự động tải & cài đặt:

```powershell
winget install RARLab.WinRAR UniKey.UniKey Google.Chrome Mozilla.Firefox UltraViewer.UltraViewer RustDesk.RustDesk AnyDeskSoftwareGmbH.AnyDesk VideoLAN.VLC SumatraPDF.SumatraPDF GeekUninstaller.GeekUninstaller --accept-package-agreements --accept-source-agreements
```

*(Hoặc chạy trực tiếp file [install-essential-apps.bat](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/software/install-essential-apps.bat))*

---

## 📂 Quản lý file cài đặt Offline
Bạn có thể tải sẵn các file `.exe` hoặc `.zip` của từng phần mềm bỏ vào các thư mục con tương ứng (`software/winrar/`, `software/unikey/`, v.v.) để lưu trữ trên USB, phục vụ việc cài đặt máy offline mà không phụ thuộc vào internet.

---

## 🔍 Quét phần mềm đã có trên máy cũ
Trước khi cài máy mới hoặc chuyển dữ liệu, bạn có thể chạy công cụ [`scripts/export-installed-software.bat`](file:///c:/Users/Administrator/Desktop/antigravity/Agent/win11-low-spec-toolkit/scripts/export-installed-software.bat) trên máy cũ để tự động liệt kê toàn bộ ứng dụng đang có thành file `.txt` và `.csv`.
