@echo off
setlocal
cd /d "%~dp0"

:: 0. Kiem tra va tu dong yeu cau quyen Administrator (Ngan chan triet de loi UAC Prompt va Timeout cai dat)
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ==============================================================================
    echo   [*] Dang yeu cau quyen Administrator de he thong cai dat muot ma 100%%...
    echo ==============================================================================
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

title [WINDOWS 11 TOOLKIT ^& HUB] - WebUI Engine Port 5678
color 0A

echo ==============================================================================
echo           WINDOWS 11 LOW SPEC OPTIMIZATION ^& SUPPORT HUB
echo ==============================================================================
echo.
echo   [*] Thu muc goc:    %~dp0
echo   [*] Dia chi WebUI:  http://localhost:5678/
echo   [*] Engine chay:    Python 3.11 Portable noi bo (Khong rac, khong can cai dat)
echo.
echo ------------------------------------------------------------------------------
echo   [HUONG DAN KY THUAT VIEN]
echo   - Cua so CMD nay dang giu may chu WebUI hoat dong.
echo   - Trinh duyet se TU DONG MO trong 1 giay!
echo   - KHI MUON TAT WEBUI: Chi can DONG (bam nut X) cua so CMD nay hoac bam Ctrl+C.
echo ------------------------------------------------------------------------------
echo.

:: 1. Kiem tra va giai phong cong 5678 neu bi chiem dung boi tien trinh cu
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5678 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: 2. Khoi chay bang Python Portable noi bo
if exist "%~dp0python\python.exe" (
    echo [OK] Dang khoi chay may chu WebUI voi Python Portable...
    echo.
    "%~dp0python\python.exe" "%~dp0server.py"
    goto ON_EXIT
)

:: 3. Fallback sang Python he thong neu thieu
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Dang khoi chay voi Python he thong...
    python "%~dp0server.py"
    goto ON_EXIT
)

:: 4. Fallback sang PowerShell neu khong co Python
echo [i] Dang khoi chay voi PowerShell Engine du phong...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"

:ON_EXIT
echo.
echo ==============================================================================
echo   DA DUNG MAY CHU WEBUI. Cua so se dong sau 3 giay...
echo ==============================================================================
ping 127.0.0.1 -n 3 >nul
