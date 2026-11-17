<#
.SYNOPSIS
    Tạo điểm khôi phục hệ thống (System Restore Point) trước khi tối ưu hóa Windows 11.
#>

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[!] Vui lòng chạy với quyền Administrator để tạo Restore Point!" -ForegroundColor Red
    Pause
    Exit
}

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   ĐANG TẠO ĐIỂM KHÔI PHỤC HỆ THỐNG (SYSTEM RESTORE)   " -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan

try {
    Write-Host "[1/2] Đang kích hoạt bảo vệ ổ C:..." -ForegroundColor Green
    Enable-ComputerRestore -Drive "C:\" -ErrorAction SilentlyContinue

    Write-Host "[2/2] Đang tạo Restore Point 'Truoc_Khi_Toi_Uu_Win11'..." -ForegroundColor Green
    Checkpoint-Computer -Description "Truoc_Khi_Toi_Uu_Win11" -RestorePointType "MODIFY_SETTINGS" -ErrorAction Stop

    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host " [✔] ĐÃ TẠO ĐIỂM KHÔI PHỤC THÀNH CÔNG!" -ForegroundColor Green
    Write-Host " Bạn hoàn toàn yên tâm thử nghiệm các thiết lập tối ưu."
    Write-Host "======================================================" -ForegroundColor Cyan
} catch {
    Write-Host "[!] Không thể tạo Restore Point tự động: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Lưu ý: Có thể tính năng System Restore đang bị tắt bởi bản Windows Lite hoặc Policy." -ForegroundColor Yellow
}

if (-not $env:NO_PAUSE) {
    Start-Sleep -Seconds 3
}
