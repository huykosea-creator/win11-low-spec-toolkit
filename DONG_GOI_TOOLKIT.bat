@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

title [DONG GOI TOOLKIT] - Tao ban zip sach de chep sang USB / May khach
color 0B

echo ==============================================================================
echo       CONG CU DONG GOI TOOLKIT KTV WINDOWS 11 CHUYEN NGHIEP
echo ==============================================================================
echo.
echo   [*] Thu muc nguon: %~dp0
echo   [*] Muc dich:      Don sach cache, tao file zip Portable de chep USB an toan
echo.
echo ------------------------------------------------------------------------------
echo   Dang don dep file cache, file rac, log tam truoc khi dong goi...
echo ------------------------------------------------------------------------------

:: 1. Don dep __pycache__, file .pyc va staging tam thoi
for /d /r "%~dp0" %%d in (__pycache__) do (
    if exist "%%d" rd /s /q "%%d" >nul 2>&1
)
del /s /q "%~dp0*.pyc" >nul 2>&1
del /s /q "%~dp0*.bak*" >nul 2>&1
del /s /q "%~dp0snap*.png" >nul 2>&1
del /f /q "%~dp0test_infected_*" >nul 2>&1
del /f /q "%~dp0BAOCAO_*.zip" >nul 2>&1
del /f /q "%~dp0BAOCAO_*.sha256" >nul 2>&1
if exist "%~dp0scans\.import_staging" rd /s /q "%~dp0scans\.import_staging" >nul 2>&1
if exist "%~dp0scratch" rd /s /q "%~dp0scratch" >nul 2>&1

echo   [+] Da don sach cache __pycache__, file tam va test artifacts.
echo   [!] LUU Y: python\python311.zip la Standard Library bat buoc cua Python Embedded.
echo.

:: Kiem tra Python Portable noi bo truoc khi dong goi
if exist "%~dp0python\python.exe" (
    "%~dp0python\python.exe" --version >nul 2>&1
    if !errorlevel! equ 0 (
        echo   [OK] Kiem tra Python Portable noi bo: SAN SANG ^(Khong can cai Python tren may khach^)
    ) else (
        echo   [!] CANH BAO: python\python.exe co dau hieu loi!
    )
) else (
    echo   [!] CANH BAO: Khong tim thay thu muc python\ Portable!
)
echo.

echo ------------------------------------------------------------------------------
echo   CHON CHE DO DONG GOI DE CHUYEN SANG MAY KHAC:
echo   [1] BAN SACH PORTABLE (Khuyen dung): Bo qua lich su quet cu (scans/User_*),
echo       giu nguyen 100%% Python, Tools, Bo cai App, Config Wi-Fi AP ^& Lenh KTV.
echo   [2] BAN FULL SAO LUU: Giu lai ca du lieu lich su quet cua may tinh nay.
echo ------------------------------------------------------------------------------
choice /C 12 /N /T 8 /D 1 /M "  -> Nhap lua chon [1 hoac 2] (Tu dong chon [1] sau 8 giay): "
set "PACK_MODE=!errorlevel!"
echo.

:: 2. Xac dinh ten thu muc hien tai & ten file zip xuat ra
for %%I in ("%~dp0.") do set "CUR_FOLDER=%%~nxI"
if "%PACK_MODE%"=="1" (
    set "ZIP_NAME=Windows11_KTV_Toolkit_Portable_Clean.zip"
) else (
    set "ZIP_NAME=Windows11_KTV_Toolkit_Portable_Full.zip"
)
set "TARGET_ZIP=%~dp0..\%ZIP_NAME%"

if exist "%TARGET_ZIP%" (
    echo   [*] Dang xoa ban zip cu: %TARGET_ZIP%
    del /f /q "%TARGET_ZIP%" >nul 2>&1
)

echo ------------------------------------------------------------------------------
echo   Dang dong goi thu muc [%CUR_FOLDER%] sang file: %ZIP_NAME%
echo ------------------------------------------------------------------------------

cd ..
if "%PACK_MODE%"=="1" (
    tar.exe -a -c -f "%ZIP_NAME%" --exclude="*.git" --exclude="*.pyc" --exclude="*__pycache__*" --exclude="%CUR_FOLDER%/scans/.import_staging" --exclude="%CUR_FOLDER%/scans/User_*" --exclude="%CUR_FOLDER%/scans/SCAN_*" --exclude="%CUR_FOLDER%/scans/Danh_Sach_Phan_Mem_*" --exclude="%CUR_FOLDER%/scripts/Danh_Sach_Phan_Mem_*" --exclude="%CUR_FOLDER%/software/crystaldiskinfo/Smart/*" --exclude="%CUR_FOLDER%/scratch" --exclude="%CUR_FOLDER%/test_infected_*" "%CUR_FOLDER%"
) else (
    tar.exe -a -c -f "%ZIP_NAME%" --exclude="*.git" --exclude="*.pyc" --exclude="*__pycache__*" --exclude="%CUR_FOLDER%/scans/.import_staging" --exclude="%CUR_FOLDER%/scratch" --exclude="%CUR_FOLDER%/test_infected_*" "%CUR_FOLDER%"
)

if %errorlevel% equ 0 (
    echo.
    echo ==============================================================================
    echo   [THANH CONG] DA TAO GOI PORTABLE SAN SANG CHUYEN SANG MAY KHAC!
    echo ==============================================================================
    echo.
    echo   [*] File zip hoan tat: %CD%\%ZIP_NAME%
    echo.
    echo   [HUONG DAN CHUYEN & CHAY TREN MAY TINH KHAC]:
    echo   1. Copy file %ZIP_NAME% vao USB / O cung di dong / Gui qua mang LAN, Zalo, Drive.
    echo   2. Tren may tinh khach hang: Giai nen vao C:\Tools\ hoac thu muc bat ky ^(tranh duong dan qua dai^).
    echo      (Meo: Neu may khach nghi nhiem virus, copy vao C:\Temp roi rut USB truoc khi giai nen!).
    echo   3. Mo thu muc da giai nen, nhap dup vao file:  CHAY_TOOLKIT.bat
    echo      (Tu dong nang quyen Administrator, nap Python Portable noi bo ^& mo WebUI ngay!).
    echo   4. Khong can cai dat Python hay bat ky thu vien nao tren may tinh moi!
    echo.
    explorer.exe /select,"%CD%\%ZIP_NAME%"
) else (
    echo.
    echo   [!] Co loi trong qua trinh dong goi bang tar.exe. Thu fallback sang PowerShell...
    powershell -NoProfile -Command "Compress-Archive -Path '%CUR_FOLDER%' -DestinationPath '%ZIP_NAME%' -Force"
    if exist "%ZIP_NAME%" (
        echo   [+] Da dong goi thanh cong bang PowerShell!
        explorer.exe /select,"%CD%\%ZIP_NAME%"
    ) else (
        echo   [-] Dong goi that bai. Vui long kiem tra lai dung luong o dia.
    )
)

echo.
pause
