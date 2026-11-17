# Script liet ke phan mem da cai dat tren he thong
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "    CONG CU QUET VA LIET KE PHAN MEM DA CAI DAT TREN MAY" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dang quet danh sach phan mem tu Registry he thong..." -ForegroundColor Gray

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }
$toolkitRoot = Split-Path -Parent $scriptDir
$scansDir = Join-Path $toolkitRoot "scans"
if (-not (Test-Path $scansDir)) {
    New-Item -ItemType Directory -Path $scansDir -Force | Out-Null
}
$computerName = $env:COMPUTERNAME
$outputTxt = Join-Path $scansDir "Danh_Sach_Phan_Mem_$computerName.txt"
$outputCsv = Join-Path $scansDir "Danh_Sach_Phan_Mem_$computerName.csv"

# Thu thap dinh danh may (PN, SN, Mainboard, CPU, RAM & Bus)
$serialNumber = "N/A"
$productNumber = "N/A"
$motherboard = "N/A"
$cpuName = "N/A"
$ramDisplay = "N/A"
$ramBusDisplay = "Chua ro"

try {
    $biosKey = Get-ItemProperty -Path "HKLM:\HARDWARE\DESCRIPTION\System\BIOS" -ErrorAction SilentlyContinue
    if ($biosKey) {
        if ($biosKey.SystemSKU) { $productNumber = $biosKey.SystemSKU.ToString().Trim() }
        elseif ($biosKey.BaseBoardProduct) { $productNumber = $biosKey.BaseBoardProduct.ToString().Trim() }
        if ($biosKey.BaseBoardManufacturer -or $biosKey.BaseBoardProduct) {
            $motherboard = ("{0} {1}" -f $biosKey.BaseBoardManufacturer, $biosKey.BaseBoardProduct).Trim()
        }
    }
    $cpuKey = Get-ItemProperty -Path "HKLM:\HARDWARE\DESCRIPTION\System\CentralProcessor\0" -ErrorAction SilentlyContinue
    if ($cpuKey -and $cpuKey.ProcessorNameString) {
        $cpuName = $cpuKey.ProcessorNameString.ToString().Trim()
    }
} catch {}

try {
    $cs = Get-CimInstance Win32_ComputerSystem -ErrorAction SilentlyContinue | Select-Object -First 1
    $bios = Get-CimInstance Win32_BIOS -ErrorAction SilentlyContinue | Select-Object -First 1
    $csp = Get-CimInstance Win32_ComputerSystemProduct -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($bios -and $bios.SerialNumber) { $serialNumber = $bios.SerialNumber.ToString().Trim() }
    if ($cs -and $cs.SystemSKUNumber) { $productNumber = $cs.SystemSKUNumber.ToString().Trim() }
    elseif ($csp -and $csp.SKUNumber) { $productNumber = $csp.SKUNumber.ToString().Trim() }

    $dimms = @(Get-CimInstance Win32_PhysicalMemory -ErrorAction SilentlyContinue)
    $memArr = Get-CimInstance Win32_PhysicalMemoryArray -ErrorAction SilentlyContinue | Select-Object -First 1
    $totalBytes = [int64]0
    $busList = @()
    $typeList = @()
    $memTypeMap = @{ 20="DDR"; 21="DDR2"; 24="DDR3"; 26="DDR4"; 27="LPDDR"; 28="LPDDR2"; 29="LPDDR3"; 30="LPDDR4"; 34="DDR5"; 35="LPDDR5"; 36="LPDDR5X" }
    foreach ($d in $dimms) {
        if ($d.Capacity) { $totalBytes += [int64]$d.Capacity }
        $spd = 0
        if ($d.ConfiguredClockSpeed -and [int]$d.ConfiguredClockSpeed -gt 0) { $spd = [int]$d.ConfiguredClockSpeed }
        elseif ($d.Speed -and [int]$d.Speed -gt 0) { $spd = [int]$d.Speed }
        if ($spd -gt 0 -and ($busList -notcontains $spd)) { $busList += $spd }
        $tCode = 0
        if ($d.SMBIOSMemoryType) { $tCode = [int]$d.SMBIOSMemoryType }
        elseif ($d.MemoryType) { $tCode = [int]$d.MemoryType }
        if ($memTypeMap.ContainsKey($tCode)) {
            $tName = $memTypeMap[$tCode]
            if ($typeList -notcontains $tName) { $typeList += $tName }
        }
    }
    if ($totalBytes -le 0 -and $cs -and $cs.TotalPhysicalMemory) {
        $totalBytes = [int64]$cs.TotalPhysicalMemory
    }
    $slotsTotal = if ($memArr -and $memArr.MemoryDevices) { [int]$memArr.MemoryDevices } else { $dimms.Count }
    $slotsInfo = if ($slotsTotal -gt 0) { "$($dimms.Count)/$slotsTotal khe" } else { "$($dimms.Count) thanh" }
    if ($totalBytes -gt 0) {
        $gbVal = [math]::Round($totalBytes / 1GB, 1)
        $typeStr = if ($typeList.Count -gt 0) { ($typeList -join "/") } else { "RAM" }
        $busVal = if ($busList.Count -gt 0) { (($busList -join "/") + " MHz") } else { "Chua ro MHz" }
        $ramBusDisplay = "$busVal ($typeStr) - $slotsInfo"
        $ramDisplay = "$gbVal GB ($ramBusDisplay)"
    }
} catch {}

if ($ramDisplay -eq "N/A") {
    try {
        $compInfo = Get-CimInstance Win32_OperatingSystem -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($compInfo -and $compInfo.TotalVisibleMemorySize) {
            $gbOs = [math]::Round(($compInfo.TotalVisibleMemorySize * 1KB) / 1GB, 1)
            $ramDisplay = "$gbOs GB (Usable)"
        }
    } catch {}
}

# Cac duong dan Registry chua thong tin phan mem
$registryPaths = @(
    "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*",
    "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*"
)

$installedApps = Get-ItemProperty -Path $registryPaths -ErrorAction SilentlyContinue |
    Where-Object { 
        $_.DisplayName -and 
        $_.SystemComponent -ne 1 -and 
        (-not $_.ParentKeyName) 
    } |
    Select-Object @{Name="TenPhanMem"; Expression={$_.DisplayName.ToString().Trim()}},
                  @{Name="PhienBan"; Expression={if ($_.DisplayVersion) { $_.DisplayVersion.ToString() } else { "N/A" }}},
                  @{Name="NhaPhatTrien"; Expression={if ($_.Publisher) { $_.Publisher.ToString() } else { "N/A" }}},
                  @{Name="NgayCaiDat"; Expression={if ($_.InstallDate) { $_.InstallDate.ToString() } else { "N/A" }}} |
    Sort-Object TenPhanMem -Unique

$totalCount = 0
if ($installedApps) {
    $totalCount = ($installedApps | Measure-Object).Count
}

Write-Host ""
Write-Host "[OK] Da quet xong! Tim thay $totalCount phan mem da cai dat tren may." -ForegroundColor Green
Write-Host ("  - Ten may (Host):  {0}" -f $computerName) -ForegroundColor Cyan
Write-Host ("  - Ma SP (PN):      {0}" -f $productNumber) -ForegroundColor Cyan
Write-Host ("  - So Serial (SN):  {0}" -f $serialNumber) -ForegroundColor Cyan
Write-Host ("  - Bo mach / CPU:   {0} | {1}" -f $motherboard, $cpuName) -ForegroundColor Cyan
Write-Host ("  - RAM & Bus:       {0}" -f $ramDisplay) -ForegroundColor Cyan
Write-Host ""

# 1. Xuat file CSV de mo bang Excel
$installedApps | Export-Csv -Path $outputCsv -NoTypeInformation -Encoding UTF8

# 2. Xuat file TXT
$report = @()
$report += "======================================================================"
$report += "DANH SACH PHAN MEM & CAU HINH MAY TINH: $computerName"
$report += "Ma San Pham (PN): $productNumber | So Serial (SN): $serialNumber"
$report += "Mainboard: $motherboard"
$report += "CPU: $cpuName"
$report += "RAM & Bus: $ramDisplay"
$report += "Thoi gian quet: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')"
$report += "Tong so ung dung: $totalCount"
$report += "======================================================================"
$report += ""

$index = 1
foreach ($app in $installedApps) {
    $name = $app.TenPhanMem
    $ver = $app.PhienBan
    $pub = $app.NhaPhatTrien
    $report += ("{0,3}. {1,-45} | Phien ban: {2,-15} | Hang: {3}" -f $index, $name, $ver, $pub)
    $index++
}

$report | Out-File -FilePath $outputTxt -Encoding UTF8

Write-Host "Da luu ket qua tai:" -ForegroundColor Cyan
Write-Host "  - File Text: $outputTxt" -ForegroundColor White
Write-Host "  - File CSV:  $outputCsv" -ForegroundColor White
Write-Host ""

if ((Test-Path $outputTxt) -and ($env:TOOLKIT_NO_GUI -ne "1")) {
    Start-Process notepad.exe $outputTxt
}
