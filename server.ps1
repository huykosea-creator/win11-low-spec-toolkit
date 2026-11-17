# PowerShell Native Web Server & Command Runner (Zero Antivirus Flags, Built-in .NET)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$port = 5678
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $root) { $root = (Get-Location).Path }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
} catch {
    Write-Host "[!] Port $port dang ban. Dang mo truc tiep index.html..." -ForegroundColor Yellow
    Start-Process (Join-Path $root "index.html")
    exit
}

Write-Host "==================================================================" -ForegroundColor Magenta
Write-Host "    WINDOWS 11 TOOLKIT & HUB - RUNNER ENGINE DANG CHAY" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Magenta
Write-Host "  Dia chi Web:   http://localhost:$port/" -ForegroundColor White
Write-Host "  Trang thai:    San sang thuc thi lenh truc tiep tu WebUI!" -ForegroundColor Green
Write-Host "  Luu y:         Giu cua so nay thu nho khi dang su dung WebUI." -ForegroundColor Gray
Write-Host "==================================================================" -ForegroundColor Magenta

# Tu dong mo trinh duyet
Start-Process "http://localhost:$port/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $urlPath = $request.Url.LocalPath

        # API: Kiem tra trang thai
        if ($urlPath -eq "/api/status") {
            $json = '{"status":"ok","direct_execution":true,"version":"2.5"}'
            $buf = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.OutputStream.Write($buf, 0, $buf.Length)
            $response.Close()
            continue
        }

        # API: Thuc thi lenh Windows truc tiep
        if ($urlPath -eq "/api/run") {
            $action = $request.QueryString["action"]
            $statusMsg = "OK"

            switch ($action) {
                "install" {
                    $packages = $request.QueryString["packages"]
                    if ($packages) {
                        Start-Process cmd.exe -ArgumentList "/k title Cai dat phan mem qua Winget && echo Dang tai va cai dat cac goi da chon... && winget install $packages --accept-package-agreements --accept-source-agreements && echo. && echo [OK] Hoan tat! Ban co the dong cua so nay. && pause"
                        $statusMsg = "Da mo cua so cai dat ung dung!"
                    }
                }
                "optimize" {
                    $optScript = Join-Path $root "scripts\optimize-low-spec.ps1"
                    Start-Process powershell.exe -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$optScript`""
                    $statusMsg = "Da khoi chay script toi uu hoa he thong!"
                }
                "restore" {
                    $restoreScript = Join-Path $root "scripts\restore-defaults.ps1"
                    Start-Process powershell.exe -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$restoreScript`""
                    $statusMsg = "Da khoi chay script khoi phuc mac dinh!"
                }
                "rearm" {
                    Start-Process cmd.exe -Verb RunAs -ArgumentList "/k title Reset Grace Period Windows && echo Dang reset thoi han dung thu 30 ngay... && cscript //nologo %windir%\system32\slmgr.vbs /rearm && echo. && echo [OK] Da gui lenh thanh cong! Hay khoi dong lai may de co hieu luc. && pause"
                    $statusMsg = "Da chay lenh reset grace period slmgr /rearm!"
                }
                "watermark-menu" {
                    $wmScript = Join-Path $root "scripts\hide-activation-watermark.bat"
                    Start-Process cmd.exe -Verb RunAs -ArgumentList "/k `"$wmScript`""
                    $statusMsg = "Da mo menu quan ly watermark!"
                }
                "scan-old" {
                    $scanScript = Join-Path $root "scripts\export-installed-software.bat"
                    Start-Process cmd.exe -ArgumentList "/k `"$scanScript`""
                    $statusMsg = "Da khoi chay tien trinh quet phan mem tren may!"
                }
                "open-folder" {
                    $folderRel = $request.QueryString["folder"]
                    if ($folderRel) {
                        $targetDir = Join-Path $root $folderRel
                        if (Test-Path $targetDir) {
                            Start-Process explorer.exe -ArgumentList "`"$targetDir`""
                            $statusMsg = "Da mo thu muc $folderRel"
                        }
                    }
                }
            }

            $json = "{`"status`":`"success`",`"message`":`"$statusMsg`"}"
            $buf = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json; charset=utf-8"
            $response.OutputStream.Write($buf, 0, $buf.Length)
            $response.Close()
            continue
        }

        # Doc va tra ve file tinh (HTML, CSS, JS, JSON)
        $relPath = $urlPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($relPath)) { $relPath = "index.html" }
        $filePath = Join-Path $root $relPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = "text/plain"
            switch ($ext) {
                ".html" { $mime = "text/html; charset=utf-8" }
                ".htm"  { $mime = "text/html; charset=utf-8" }
                ".css"  { $mime = "text/css; charset=utf-8" }
                ".js"   { $mime = "application/javascript; charset=utf-8" }
                ".json" { $mime = "application/json; charset=utf-8" }
                ".png"  { $mime = "image/png" }
                ".jpg"  { $mime = "image/jpeg" }
                ".svg"  { $mime = "image/svg+xml" }
            }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # Bo qua loi client ngat ket noi dot ngot
    }
}
