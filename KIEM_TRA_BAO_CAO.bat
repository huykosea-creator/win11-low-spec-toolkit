@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul

title [BO LOC MA DOC ^& TIEP NHAN BAO CAO] - Tham dinh HTML / Goi ZIP
color 0A

:: Kiem tra neu co truyen file qua drag-and-drop hoac doi so dong lenh
if exist "%~dp0python\python.exe" (
    if "%~1"=="" (
        "%~dp0python\python.exe" "%~dp0scripts\verify_report.py"
    ) else (
        "%~dp0python\python.exe" "%~dp0scripts\verify_report.py" %*
    )
    goto DONE
)

python --version >nul 2>&1
if %errorlevel% equ 0 (
    if "%~1"=="" (
        python "%~dp0scripts\verify_report.py"
    ) else (
        python "%~dp0scripts\verify_report.py" %*
    )
    goto DONE
)

echo [!] Khong tim thay Python de chay bo tham dinh ma doc.
echo     Vui long kiem tra thu muc python\ noi bo.
pause
exit /b 1

:DONE
echo.
echo ==============================================================================
echo   DA HOAN TAT THAM TRA AN TOAN FILE BAO CAO!
echo ==============================================================================
echo.
pause
