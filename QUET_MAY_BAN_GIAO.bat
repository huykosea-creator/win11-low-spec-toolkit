@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul

title [QUET MAY BAN GIAO] - Windows 11 KTV Toolkit (Sau Cai Dat / Toi Uu Xong)
color 0A

echo ==============================================================================
echo       QUET MAY BAN GIAO - WINDOWS 11 LOW SPEC TOOLKIT ^& HUB
echo ==============================================================================
echo.
echo   [*] Thu muc:       %~dp0
echo   [*] Che do:        Quet tu dong ^& Xuat file zip an toan cho KTV
echo   [*] Giai doan:     Ban Giao May (Sau Khi Cai Dat / Toi Uu Xong)
echo.

if exist "%~dp0python\python.exe" (
    if "%~1"=="" (
        "%~dp0python\python.exe" "%~dp0scripts\quick_scan.py" --stage ban_giao
    ) else (
        "%~dp0python\python.exe" "%~dp0scripts\quick_scan.py" --stage ban_giao %*
    )
    goto DONE
)

python --version >nul 2>&1
if %errorlevel% equ 0 (
    if "%~1"=="" (
        python "%~dp0scripts\quick_scan.py" --stage ban_giao
    ) else (
        python "%~dp0scripts\quick_scan.py" --stage ban_giao %*
    )
    goto DONE
)

echo [!] Khong tim thay Python Portable noi bo.
pause
exit /b 1

:DONE
echo.
echo ==============================================================================
echo   DA HOAN TAT TIEN TRINH QUET MAY BAN GIAO!
echo ==============================================================================
echo.
pause
