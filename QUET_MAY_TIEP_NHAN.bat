@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul

title [QUET MAY TIEP NHAN] - Windows 11 KTV Toolkit (Truoc Cai Dat / Sua Chua)
color 0B

echo ==============================================================================
echo       QUET MAY TIEP NHAN - WINDOWS 11 LOW SPEC TOOLKIT ^& HUB
echo ==============================================================================
echo.
echo   [*] Thu muc:       %~dp0
echo   [*] Che do:        Quet tu dong ^& Xuat file zip an toan cho KTV
echo   [*] Giai doan:     Tiep Nhan May (Truoc Khi Cai Dat / Sua Chua)
echo.

if exist "%~dp0python\python.exe" (
    if "%~1"=="" (
        "%~dp0python\python.exe" "%~dp0scripts\quick_scan.py" --stage tiep_nhan
    ) else (
        "%~dp0python\python.exe" "%~dp0scripts\quick_scan.py" --stage tiep_nhan %*
    )
    goto DONE
)

python --version >nul 2>&1
if %errorlevel% equ 0 (
    if "%~1"=="" (
        python "%~dp0scripts\quick_scan.py" --stage tiep_nhan
    ) else (
        python "%~dp0scripts\quick_scan.py" --stage tiep_nhan %*
    )
    goto DONE
)

echo [!] Khong tim thay Python Portable noi bo.
pause
exit /b 1

:DONE
echo.
echo ==============================================================================
echo   DA HOAN TAT TIEN TRINH QUET MAY TIEP NHAN!
echo ==============================================================================
echo.
pause
