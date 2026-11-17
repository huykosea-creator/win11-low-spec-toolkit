@echo off
chcp 65001 >nul
title Windows 11 Watermark Manager

:: Check administrator privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Vui lòng bấm chuột phải vào file này và chọn "Run as administrator"!
    echo.
    pause
    exit /b
)

:MENU
cls
echo ========================================================
echo        CÔNG CỤ ẨN WATERMARK "ACTIVATE WINDOWS"
echo ========================================================
echo.
echo [1] Dùng lệnh chính thức của Microsoft (slmgr /rearm) - Khuyên dùng
echo     - Reset thời gian dùng thử (Grace Period 30 ngày)
echo     - Ẩn hoàn toàn watermark, an toàn tuyệt đối
echo.
echo [2] Chỉnh Registry (PaintDesktopVersion = 0) + Khởi động lại Explorer
echo     - Ẩn watermark thông tin phiên bản Windows trên Desktop
echo.
echo [3] Khởi động lại Windows Explorer (Tạm thời xóa watermark trong phiên)
echo.
echo [0] Thoát
echo ========================================================
set /p choice="Nhập lựa chọn của bạn [0-3]: "

if "%choice%"=="1" goto REARM
if "%choice%"=="2" goto REGISTRY
if "%choice%"=="3" goto RESTART_EXPLORER
if "%choice%"=="0" exit /b
goto MENU

:REARM
echo.
echo Đang thực thi lệnh slmgr /rearm...
cscript //nologo %windir%\system32\slmgr.vbs /rearm
echo.
echo [OK] Đã gửi lệnh reset thời gian dùng thử!
echo Bạn cần khởi động lại máy tính để thay đổi có hiệu lực.
echo.
pause
goto MENU

:REGISTRY
echo.
echo Đang chỉnh sửa Registry...
reg add "HKEY_CURRENT_USER\Control Panel\Desktop" /v PaintDesktopVersion /t REG_DWORD /d 0 /f >nul
echo [OK] Đã cập nhật Registry! Đang khởi động lại Explorer...
taskkill /f /im explorer.exe >nul
start explorer.exe
echo.
echo [OK] Hoàn tất!
echo.
pause
goto MENU

:RESTART_EXPLORER
echo.
echo Đang khởi động lại Windows Explorer...
taskkill /f /im explorer.exe >nul
start explorer.exe
echo.
echo [OK] Đã khởi động lại Explorer!
echo.
pause
goto MENU
