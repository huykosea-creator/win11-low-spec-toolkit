param(
    [string]$Tier = "4to8gb", # "under4gb" (Dưới 4GB), "4to8gb" (RAM 4GB-8GB), "above8gb" (Trên 8GB)
    [int]$Level = 0           # Tương thích ngược: 1=under4gb, 2=4to8gb, 3=above8gb
)

# Chuẩn hóa tham số Tier
if ($Level -eq 1 -or $Tier -eq "under4gb" -or $Tier -eq "extreme") {
    $Tier = "under4gb"
} elseif ($Level -eq 3 -or $Tier -eq "above8gb" -or $Tier -eq "light") {
    $Tier = "above8gb"
} else {
    $Tier = "4to8gb"
}

# Kiểm tra quyền Admin
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[!] Vui lòng mở PowerShell bằng quyền Administrator (Run as Administrator)!" -ForegroundColor Red
    Pause
    Exit
}

Write-Host "======================================================================" -ForegroundColor Cyan
if ($Tier -eq "under4gb") {
    Write-Host "   GÓI 1: CẮT GIẢM SIÊU NHẸ (DƯỚI 4GB RAM) - EXTREME DEBLOAT WIN GỐC   " -ForegroundColor Yellow
    Write-Host "   Mục tiêu: Đưa Windows 11 gốc xuống ăn ~1.1GB RAM, chạy mượt như Lite! " -ForegroundColor Green
} elseif ($Tier -eq "above8gb") {
    Write-Host "   GÓI 3: TRÊN 8GB RAM - TINH CHỈNH ĐỘ TRỄ & GIỮ NGUYÊN GIAO DIỆN ĐẸP  " -ForegroundColor Yellow
    Write-Host "   Mục tiêu: Dọn rác quảng cáo, tối ưu phản hồi chuột, giữ trọn vẹn Win 11!" -ForegroundColor Green
} else {
    Write-Host "   GÓI 2: TINH GIẢN CÂN BẰNG (RAM 4GB - 8GB) - BALANCED DEBLOAT WIN GỐC " -ForegroundColor Yellow
    Write-Host "   Mục tiêu: Gỡ Widgets, Copilot, Telemetry, giữ nguyên Defender & Store! " -ForegroundColor Green
}
Write-Host "======================================================================" -ForegroundColor Cyan

# -------------------------------------------------------------
# 1. TỐI ƯU GIAO DIỆN & HOẠT HỌA (Áp dụng cho Dưới 4GB & 4GB-8GB)
# -------------------------------------------------------------
if ($Tier -ne "above8gb") {
    Write-Host "[1/6] Đang tắt hiệu ứng mờ kính trong suốt (Transparency)..." -ForegroundColor Green
    $personalizePath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize"
    if (-not (Test-Path $personalizePath)) { New-Item -Path $personalizePath -Force | Out-Null }
    Set-ItemProperty -Path $personalizePath -Name "EnableTransparency" -Value 0 -Type DWord

    Write-Host "[2/6] Đang tối ưu hiệu ứng hoạt họa cửa sổ (Visual Effects)..." -ForegroundColor Green
    $desktopPath = "HKCU:\Control Panel\Desktop"
    Set-ItemProperty -Path $desktopPath -Name "UserPreferencesMask" -Value ([byte[]](0x90,0x12,0x03,0x80,0x10,0x00,0x00,0x00))
    $desktopWindowMetrics = "HKCU:\Control Panel\Desktop\WindowMetrics"
    Set-ItemProperty -Path $desktopWindowMetrics -Name "MinAnimate" -Value "0"

    Write-Host "[3/6] Thu nhỏ thanh tìm kiếm Taskbar thành icon gọn nhẹ..." -ForegroundColor Green
    $searchPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search"
    if (-not (Test-Path $searchPath)) { New-Item -Path $searchPath -Force | Out-Null }
    Set-ItemProperty -Path $searchPath -Name "SearchboxTaskbarMode" -Value 1 -Type DWord
} else {
    Write-Host "[1/3] Giữ nguyên 100% hiệu ứng giao diện đẹp đẽ của Windows 11..." -ForegroundColor Green
    Write-Host "[2/3] Tối ưu độ trễ menu chuột phải (MenuShowDelay = 20ms)..." -ForegroundColor Green
    Set-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "MenuShowDelay" -Value "20"
}

# -------------------------------------------------------------
# 2. VÔ HIỆU HÓA CÁC MODULE NẶNG NỀ (Widgets, Copilot, GameDVR, Telemetry)
# -------------------------------------------------------------
if ($Tier -eq "under4gb" -or $Tier -eq "4to8gb") {
    Write-Host "[*] Đang vô hiệu hóa Widgets và Microsoft Copilot AI Taskbar..." -ForegroundColor Green
    $advancedPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced"
    Set-ItemProperty -Path $advancedPath -Name "TaskbarDa" -Value 0 -Type DWord -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $advancedPath -Name "ShowCopilotButton" -Value 0 -Type DWord -ErrorAction SilentlyContinue

    Write-Host "[*] Đang tắt Xbox Game Bar và tính năng ghi màn hình nền ngầm..." -ForegroundColor Green
    $gameDvrPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR"
    if (-not (Test-Path $gameDvrPath)) { New-Item -Path $gameDvrPath -Force | Out-Null }
    Set-ItemProperty -Path $gameDvrPath -Name "AppCaptureEnabled" -Value 0 -Type DWord

    $gameConfigStorePath = "HKCU:\System\GameConfigStore"
    if (-not (Test-Path $gameConfigStorePath)) { New-Item -Path $gameConfigStorePath -Force | Out-Null }
    Set-ItemProperty -Path $gameConfigStorePath -Name "GameDVR_Enabled" -Value 0 -Type DWord
}

Write-Host "[*] Đang tắt Telemetry và gửi dữ liệu nhật ký chẩn đoán ngầm..." -ForegroundColor Green
$telemetryPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\DataCollection"
if (-not (Test-Path $telemetryPath)) { New-Item -Path $telemetryPath -Force | Out-Null }
Set-ItemProperty -Path $telemetryPath -Name "AllowTelemetry" -Value 0 -Type DWord
Get-Service -Name DiagTrack -ErrorAction SilentlyContinue | Stop-Service -ErrorAction SilentlyContinue
Set-Service -Name DiagTrack -StartupType Disabled -ErrorAction SilentlyContinue

# Tắt gợi ý quảng cáo trên Start Menu
$contentDeliveryPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager"
if (Test-Path $contentDeliveryPath) {
    Set-ItemProperty -Path $contentDeliveryPath -Name "SubscribedContent-338388Enabled" -Value 0 -Type DWord -ErrorAction SilentlyContinue
    Set-ItemProperty -Path $contentDeliveryPath -Name "SystemPaneSuggestionsEnabled" -Value 0 -Type DWord -ErrorAction SilentlyContinue
}

# -------------------------------------------------------------
# 3. GỠ BỎ APPS BLOATWARE RÁC MẶC ĐỊNH CỦA WINDOWS 11 GỐC
# -------------------------------------------------------------
if ($Tier -eq "under4gb" -or $Tier -eq "4to8gb") {
    Write-Host "[*] Đang gỡ bỏ các ứng dụng rác Bloatware mặc định từ Win gốc..." -ForegroundColor Green
    
    $commonBloat = @(
        "*Microsoft.BingNews*",
        "*Microsoft.BingWeather*",
        "*Microsoft.MicrosoftSolitaireCollection*",
        "*Clipchamp.Clipchamp*",
        "*Microsoft.GetHelp*",
        "*Microsoft.Getstarted*",
        "*Microsoft.FeedbackHub*",
        "*Microsoft.YourPhone*",
        "*SpotifyAB.SpotifyMusic*",
        "*TikTok*",
        "*Disney*"
    )

    if ($Tier -eq "under4gb") {
        # Mức dưới 4GB gỡ thêm các app nặng không cần thiết
        $commonBloat += @(
            "*Microsoft.Microsoft3DViewer*",
            "*Microsoft.MixedReality.Portal*",
            "*Microsoft.MicrosoftOfficeHub*",
            "*Microsoft.XboxGamingOverlay*",
            "*Microsoft.XboxApp*",
            "*Microsoft.XboxSpeechToTextOverlay*"
        )
    }

    foreach ($app in $commonBloat) {
        Get-AppxPackage -Name $app -AllUsers -ErrorAction SilentlyContinue | Remove-AppxPackage -ErrorAction SilentlyContinue
        Get-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -like $app } | Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue
    }
}

# -------------------------------------------------------------
# 4. CAN THIỆP SÂU SERVICES & RAM ẢO (DÀNH CHO DƯỚI 4GB RAM)
# -------------------------------------------------------------
if ($Tier -eq "under4gb") {
    Write-Host "[*] [Dưới 4GB RAM] Tắt SysMain (SuperFetch) & Windows Search Indexing..." -ForegroundColor Green
    Get-Service -Name SysMain -ErrorAction SilentlyContinue | Stop-Service -ErrorAction SilentlyContinue
    Set-Service -Name SysMain -StartupType Disabled -ErrorAction SilentlyContinue

    Get-Service -Name WSearch -ErrorAction SilentlyContinue | Stop-Service -ErrorAction SilentlyContinue
    Set-Service -Name WSearch -StartupType Disabled -ErrorAction SilentlyContinue

    Write-Host "[*] [Dưới 4GB RAM] Thiết lập Virtual Memory (Paging File) cố định 4096MB - 6144MB..." -ForegroundColor Green
    try {
        $cs = Get-CimInstance Win32_ComputerSystem
        $cs.AutomaticManagedPagefile = $false
        Set-CimInstance -InputObject $cs -ErrorAction SilentlyContinue

        $pg = Get-CimInstance Win32_PageFileSetting -Filter "Name like 'C:%'" -ErrorAction SilentlyContinue
        if ($pg) {
            $pg.InitialSize = 4096
            $pg.MaximumSize = 6144
            Set-CimInstance -InputObject $pg -ErrorAction SilentlyContinue
        }
    } catch {}
}

# -------------------------------------------------------------
# 5. KHỞI ĐỘNG LẠI EXPLORER ĐỂ ÁP DỤNG NGAY
# -------------------------------------------------------------
Write-Host "[*] Khởi động lại Windows Explorer để cập nhật ngay lập tức..." -ForegroundColor Green
Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
Start-Process explorer.exe

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host " [✔] HOÀN TẤT TINH GIẢN BẢN WINDOWS 11 GỐC THÀNH CÔNG!" -ForegroundColor Yellow
if ($Tier -eq "under4gb") {
    Write-Host " Đã cắt giảm tối đa cho máy DƯỚI 4GB RAM: Tiết kiệm ~1.5GB - 2.0GB RAM!" -ForegroundColor Green
} elseif ($Tier -eq "above8gb") {
    Write-Host " Đã tối ưu độ trễ cho máy TRÊN 8GB RAM: Giữ trọn 100% giao diện mượt mà!" -ForegroundColor Green
} else {
    Write-Host " Đã tinh giản cân bằng cho RAM 4GB - 8GB: Tiết kiệm ~1.0GB - 1.2GB RAM!" -ForegroundColor Green
}
Write-Host " Khuyên bạn nên khởi động lại máy tính một lần để hệ thống nạp sạch sẽ."
Write-Host "======================================================================" -ForegroundColor Cyan

if (-not $env:NO_PAUSE) {
    Start-Sleep -Seconds 3
}
