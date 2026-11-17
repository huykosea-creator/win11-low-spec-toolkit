@echo off
chcp 65001 >nul
title Cai dat 12 phan mem thiet yeu tuan tu (Delay 3s)

echo ======================================================================
echo    CÀI ĐẶT TUẦN TỰ 12 PHẦN MỀM THIẾT YẾU (TỰ ĐỘNG + DELAY 3 GIÂY)
echo ======================================================================
echo.

cd /d "%~dp0"

:: 1. WinRAR
echo [1/12] Đang cài đặt: WinRAR (.rar, .zip)...
winget install --id RARLab.WinRAR --exact --accept-package-agreements --accept-source-agreements
echo [OK] Hoàn tất WinRAR. Nghỉ 3 giây...
timeout /t 3 /nobreak >nul
echo.

:: 2. UniKey (Bộ gõ tiếng Việt)
echo [2/12] Đang cài đặt: UniKey...
if exist "unikey\UniKeyNT.exe" (
    echo [OK] Đã có sẵn bản UniKey Portable chuẩn x64 trong thư mục unikey!
) else (
    winget install --id UniKey.UniKey -v 4.6.230919 --exact --accept-package-agreements --accept-source-agreements
)
echo [OK] Hoàn tất UniKey. Nghỉ 3 giây...
timeout /t 3 /nobreak >nul
echo.

:: 3. Google Chrome
echo [3/12] Đang cài đặt: Google Chrome...
winget install --id Google.Chrome --exact --accept-package-agreements --accept-source-agreements
echo [OK] Hoàn tất Google Chrome. Nghỉ 3 giây...
timeout /t 3 /nobreak >nul
echo.

:: 4. Mozilla Firefox
echo [4/12] Đang cài đặt: Mozilla Firefox...
winget install --id Mozilla.Firefox --exact --accept-package-agreements --accept-source-agreements
echo [OK] Hoàn tất Mozilla Firefox. Nghỉ 3 giây...
timeout /t 3 /nobreak >nul
echo.

:: 5. UltraViewer
echo [5/12] Đang cài đặt: UltraViewer...
if exist "ultraviewer\UltraViewer*.exe" (
    for %%f in (ultraviewer\UltraViewer*.exe) do "%%f" /VERYSILENT
) else (
    winget install --id DucFabulous.UltraViewer --exact --accept-package-agreements --accept-source-agreements
)
echo [OK] Hoàn tất UltraViewer. Nghỉ 3 giây...
timeout /t 3 /nobreak >nul
echo.

:: 6. RustDesk (Remote Desktop)
echo [6/12] Đang cài đặt: RustDesk...
if exist "rustdesk\rustdesk.exe" (
    "rustdesk\rustdesk.exe" --silent-install
) else (
    echo [i] Đang tải RustDesk từ GitHub...
    curl -L "https://github.com/rustdesk/rustdesk/releases/download/1.4.9/rustdesk-1.4.9-x86_64.exe" -o "rustdesk\rustdesk.exe"
    "rustdesk\rustdesk.exe" --silent-install
)
echo [OK] Hoàn tất RustDesk. Nghỉ 3 giây...
timeout /t 3 /nobreak >nul
echo.

:: 7. AnyDesk
echo [7/12] Đang cài đặt: AnyDesk...
if exist "anydesk\AnyDesk.exe" (
    "anydesk\AnyDesk.exe" --install "C:\Program Files (x86)\AnyDesk" --silent
) else (
    winget install --id AnyDesk.AnyDesk --exact --accept-package-agreements --accept-source-agreements
)
echo [OK] Hoàn tất AnyDesk. Nghỉ 3 giây...
timeout /t 3 /nobreak >nul
echo.

:: 8. VLC Media Player
echo [8/12] Đang cài đặt: VLC Media Player...
winget install --id VideoLAN.VLC --exact --accept-package-agreements --accept-source-agreements
echo [OK] Hoàn tất VLC. Nghỉ 3 giây...
timeout /t 3 /nobreak >nul
echo.

:: 9. Foxit PDF Reader
echo [9/12] Đang cài đặt: Foxit PDF Reader...
winget install --id Foxit.FoxitReader --exact --accept-package-agreements --accept-source-agreements
echo [OK] Hoàn tất Foxit PDF Reader. Nghỉ 3 giây...
timeout /t 3 /nobreak >nul
echo.

:: 10. Mem Reduct
echo [10/12] Đang cài đặt: Mem Reduct...
if exist "mem-reduct\memreduct-setup.exe" (
    "mem-reduct\memreduct-setup.exe" /S
) else (
    winget install --id Henry++.MemReduct --exact --accept-package-agreements --accept-source-agreements
)
echo [OK] Hoàn tất Mem Reduct. Nghỉ 3 giây...
timeout /t 3 /nobreak >nul
echo.

:: 11. Geek Uninstaller
echo [11/12] Đang cài đặt: Geek Uninstaller...
if exist "geek-uninstaller\geek.exe" (
    echo [OK] Geek Uninstaller Portable đã sẵn sàng trong thư mục geek-uninstaller!
) else (
    winget install --id GeekUninstaller.GeekUninstaller --exact --accept-package-agreements --accept-source-agreements
)
echo [OK] Hoàn tất Geek Uninstaller. Nghỉ 3 giây...
timeout /t 3 /nobreak >nul
echo.

:: 12. LibreOffice
echo [12/12] Đang cài đặt: LibreOffice...
winget install --id TheDocumentFoundation.LibreOffice --exact --accept-package-agreements --accept-source-agreements
echo [OK] Hoàn tất LibreOffice.
echo.

echo ======================================================================
echo [✔ THÀNH CÔNG] Đã hoàn tất cài đặt toàn bộ 12 phần mềm thiết yếu!
echo ======================================================================
pause
