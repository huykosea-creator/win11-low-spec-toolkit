@echo off
setlocal
cd /d "%~dp0"
title Quet danh sach phan mem da cai dat tren may cu

echo Dang khoi chay tien trinh quet phan mem...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0export-installed-software.ps1"

echo.
pause
