@echo off
setlocal
cd /d "%~dp0"
chcp 65001 >nul

title [XUAT GOI BAO CAO AN TOAN] - Dong goi tiep nhan / ban giao
color 0B

if exist "%~dp0python\python.exe" (
    if "%~1"=="" (
        "%~dp0python\python.exe" "%~dp0scripts\export_task.py"
    ) else (
        "%~dp0python\python.exe" "%~dp0scripts\export_task.py" %*
    )
    goto DONE
)

python --version >nul 2>&1
if %errorlevel% equ 0 (
    if "%~1"=="" (
        python "%~dp0scripts\export_task.py"
    ) else (
        python "%~dp0scripts\export_task.py" %*
    )
    goto DONE
)

echo [!] Khong tim thay Python de chay cong cu dong goi bao cao.
pause
exit /b 1

:DONE
echo.
pause
