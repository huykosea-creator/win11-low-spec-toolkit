@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul

title [TIEP NHAN ^& THAM DINH BAO CAO] - Kiem tra chong ma doc HTML / Goi ZIP
color 0A

:: Kiem tra neu co truyen file qua drag-and-drop
set "TARGET_FILE=%~1"

if exist "%~dp0python\python.exe" (
    if "%TARGET_FILE%"=="" (
        "%~dp0python\python.exe" "%~dp0scripts\verify_report.py"
    ) else (
        "%~dp0python\python.exe" "%~dp0scripts\verify_report.py" "%TARGET_FILE%"
    )
    goto DONE
)

python --version >nul 2>&1
if %errorlevel% equ 0 (
    if "%TARGET_FILE%"=="" (
        python "%~dp0scripts\verify_report.py"
    ) else (
        python "%~dp0scripts\verify_report.py" "%TARGET_FILE%"
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
echo   DA HOAN TAT THAM TRA VA TIEP NHAN FILE BAO CAO!
echo ==============================================================================
echo.
pause
