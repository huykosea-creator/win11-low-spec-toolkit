@echo off
setlocal
cd /d "%~dp0"
title Tat Windows 11 Toolkit Engine
color 0C

echo ==============================================================================
echo                 TAT TIEN TRINH WINDOWS 11 TOOLKIT ^& HUB
echo ==============================================================================
echo.

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5678 ^| findstr LISTENING 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [THANH CONG] Da kiem tra va tat sach may chu WebUI tren cong 5678!
echo.
ping 127.0.0.1 -n 3 >nul
