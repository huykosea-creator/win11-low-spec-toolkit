<#
.SYNOPSIS
    Khôi phục cài đặt mặc định của Windows 11.
#>

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[!] Vui lòng mở PowerShell bằng quyền Administrator!" -ForegroundColor Red
    Pause
    Exit
}

Write-Host "Đang khôi phục cài đặt mặc định của Windows 11..." -ForegroundColor Yellow

# Bật lại Transparency
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" -Name "EnableTransparency" -Value 1 -Type DWord -ErrorAction SilentlyContinue

# Bật lại Animations
Set-ItemProperty -Path "HKCU:\Control Panel\Desktop\WindowMetrics" -Name "MinAnimate" -Value "1" -ErrorAction SilentlyContinue

# Bật lại Widgets & Copilot
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "TaskbarDa" -Value 1 -Type DWord -ErrorAction SilentlyContinue
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "ShowCopilotButton" -Value 1 -Type DWord -ErrorAction SilentlyContinue

# Khôi phục thanh tìm kiếm
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search" -Name "SearchboxTaskbarMode" -Value 2 -Type DWord -ErrorAction SilentlyContinue

# Khởi động lại Explorer
Stop-Process -Name explorer -Force
Start-Process explorer.exe

Write-Host "[✔] Đã khôi phục cài đặt cơ bản thành công!" -ForegroundColor Green
