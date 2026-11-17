<#
.SYNOPSIS
    Cài đặt và kích hoạt Microsoft App Installer (Winget) tự động cho Windows 10/11/Sandbox/LTSC.
#>
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = 'SilentlyContinue'

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " [KTV] DANG KICH HOAT MICROSOFT APP INSTALLER (WINGET) " -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan

try {
    $w = Get-Command winget -ErrorAction SilentlyContinue
    if ($w) {
        Write-Host "[OK] Winget da co san tren he thong tai: $($w.Source)" -ForegroundColor Green
        winget --version
        exit 0
    }

    Write-Host "-> May tinh chua co Winget. Dang ket noi toi may chu Microsoft de tai ve..." -ForegroundColor White

    # Phuong phap 1: AppInstallerUrl qua aka.ms
    try {
        Write-Host "-> Phuong phap 1: Cai dat truc tiep qua AppInstallerUrl..." -ForegroundColor White
        Add-AppxPackage -AppInstallerUrl "https://aka.ms/getwinget" -ErrorAction Stop
        Write-Host "[OK] Cai dat thanh cong qua AppInstallerUrl!" -ForegroundColor Green
        exit 0
    } catch {
        Write-Host "-> Phuong phap 1 khong ho tro, chuyen sang phuong phap 2 (Tai goi msixbundle)..." -ForegroundColor Yellow
    }

    $tempDir = [System.IO.Path]::GetTempPath()

    # 1. Tai va cai dat VCLibs
    $vcUrl = "https://aka.ms/Microsoft.VCLibs.x64.14.00.Desktop.appx"
    $vcFile = Join-Path $tempDir "Microsoft.VCLibs.x64.14.00.Desktop.appx"
    Write-Host "-> Dang tai VCLibs x64 tu Microsoft..." -ForegroundColor White
    Invoke-WebRequest -Uri $vcUrl -OutFile $vcFile -UseBasicParsing
    Add-AppxPackage -Path $vcFile -ErrorAction SilentlyContinue

    # 2. Tai va cai dat Winget Msixbundle
    $wingetUrl = "https://github.com/microsoft/winget-cli/releases/latest/download/Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle"
    $wingetFile = Join-Path $tempDir "Microsoft.DesktopAppInstaller.msixbundle"
    Write-Host "-> Dang tai DesktopAppInstaller (Winget) moi nhat tu GitHub..." -ForegroundColor White
    Invoke-WebRequest -Uri $wingetUrl -OutFile $wingetFile -UseBasicParsing
    Add-AppxPackage -Path $wingetFile -ErrorAction Stop

    Write-Host "[OK] Kich hoat Winget thanh cong tren he thong!" -ForegroundColor Green
} catch {
    Write-Host "[LOI] Khong the cai dat tu dong Winget: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Goi y: Vui long mo Microsoft Store va tim 'App Installer' hoac tai tu github.com/microsoft/winget-cli" -ForegroundColor Yellow
    exit 1
}
