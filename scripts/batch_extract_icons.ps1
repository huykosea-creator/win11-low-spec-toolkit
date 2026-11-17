param (
    [string]$InputJsonPath,
    [string]$OutputJsonPath
)

Add-Type -AssemblyName System.Drawing

$pinvokeCode = @"
using System;
using System.Runtime.InteropServices;
using System.Drawing;

public class Win32IconExtractor {
    [DllImport("shell32.dll", CharSet = CharSet.Unicode)]
    public static extern uint ExtractIconEx(string lpszFile, int nIconIndex, out IntPtr phiconLarge, out IntPtr phiconSmall, uint nIcons);

    [DllImport("user32.dll", SetLastError = true)]
    public static extern bool DestroyIcon(IntPtr hIcon);

    public static Icon ExtractByIndex(string filePath, int index) {
        IntPtr hLarge = IntPtr.Zero;
        IntPtr hSmall = IntPtr.Zero;
        try {
            uint count = ExtractIconEx(filePath, index, out hLarge, out hSmall, 1);
            IntPtr target = hLarge != IntPtr.Zero ? hLarge : hSmall;
            if (target != IntPtr.Zero) {
                using (Icon temp = Icon.FromHandle(target)) {
                    return (Icon)temp.Clone();
                }
            }
        } catch {
        } finally {
            if (hLarge != IntPtr.Zero) { try { DestroyIcon(hLarge); } catch {} }
            if (hSmall != IntPtr.Zero) { try { DestroyIcon(hSmall); } catch {} }
        }
        return null;
    }
}
"@

try {
    if (-not ("Win32IconExtractor" -as [type])) {
        Add-Type -TypeDefinition $pinvokeCode -ReferencedAssemblies System.Drawing -ErrorAction SilentlyContinue | Out-Null
    }
} catch {}

function Convert-BitmapToDataUri($bitmap) {
    if (-not $bitmap) { return $null }
    try {
        $targetSize = 36
        $outBmp = $bitmap
        $needDispose = $false
        if ($bitmap.Width -gt 48 -or $bitmap.Height -gt 48) {
            $outBmp = New-Object System.Drawing.Bitmap($targetSize, $targetSize)
            $g = [System.Drawing.Graphics]::FromImage($outBmp)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.Clear([System.Drawing.Color]::Transparent)
            $g.DrawImage($bitmap, 0, 0, $targetSize, $targetSize)
            $g.Dispose()
            $needDispose = $true
        }
        $ms = New-Object System.IO.MemoryStream
        $outBmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $b64 = [Convert]::ToBase64String($ms.ToArray())
        $ms.Close()
        if ($needDispose) { $outBmp.Dispose() }
        if ($b64) { return "data:image/png;base64," + $b64 }
    } catch {}
    return $null
}

function Extract-IconSpecDataUri([string]$rawSpec) {
    if ([string]::IsNullOrWhiteSpace($rawSpec)) { return $null }

    $spec = $rawSpec.Trim()
    $filePath = $spec
    $iconIndex = 0

    if ($spec -match '^(.+?),(-?\d+)$') {
        $filePath = $Matches[1].Trim().Trim('"').Trim("'")
        try { $iconIndex = [int]$Matches[2] } catch { $iconIndex = 0 }
    } else {
        $filePath = $spec.Trim('"').Trim("'")
    }

    $filePath = [Environment]::ExpandEnvironmentVariables($filePath)
    if ([string]::IsNullOrWhiteSpace($filePath) -or -not (Test-Path -LiteralPath $filePath -PathType Leaf)) {
        return $null
    }

    $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()

    # Resolve Windows .lnk shortcut target/icon cleanly
    if ($ext -eq ".lnk") {
        try {
            $wsh = New-Object -ComObject WScript.Shell
            $sc = $wsh.CreateShortcut($filePath)
            if ($sc) {
                $loc = $sc.IconLocation
                if (-not [string]::IsNullOrWhiteSpace($loc)) {
                    $locPath = $loc.Split(',')[0].Trim().Trim('"')
                    $locPath = [Environment]::ExpandEnvironmentVariables($locPath)
                    if (-not [string]::IsNullOrWhiteSpace($locPath) -and (Test-Path -LiteralPath $locPath -PathType Leaf)) {
                        $res = Extract-IconSpecDataUri $loc
                        if ($res) { return $res }
                    }
                }
                if (-not [string]::IsNullOrWhiteSpace($sc.TargetPath) -and (Test-Path -LiteralPath $sc.TargetPath -PathType Leaf)) {
                    $res = Extract-IconSpecDataUri $sc.TargetPath
                    if ($res) { return $res }
                }
            }
        } catch {}
    }

    # Direct image files (.png / .jpg / .webp / .bmp)
    if ($ext -in @(".png", ".jpg", ".jpeg", ".bmp")) {
        try {
            $img = [System.Drawing.Image]::FromFile($filePath)
            $bmp = New-Object System.Drawing.Bitmap($img)
            $uri = Convert-BitmapToDataUri $bmp
            $bmp.Dispose()
            $img.Dispose()
            if ($uri) { return $uri }
        } catch {}
    }

    # Direct .ico file
    if ($ext -eq ".ico") {
        try {
            $ico = New-Object System.Drawing.Icon($filePath, 48, 48)
            $bmp = $ico.ToBitmap()
            $uri = Convert-BitmapToDataUri $bmp
            $bmp.Dispose()
            $ico.Dispose()
            if ($uri) { return $uri }
        } catch {}
    }

    # P/Invoke index extraction when explicit index is given (e.g. .dll,-101 or .exe,2)
    if ($iconIndex -ne 0 -and ("Win32IconExtractor" -as [type])) {
        try {
            $icoIdx = [Win32IconExtractor]::ExtractByIndex($filePath, $iconIndex)
            if ($icoIdx) {
                $bmp = $icoIdx.ToBitmap()
                $uri = Convert-BitmapToDataUri $bmp
                $bmp.Dispose()
                $icoIdx.Dispose()
                if ($uri) { return $uri }
            }
        } catch {}
    }

    # Standard associated icon fallback
    try {
        $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($filePath)
        if ($icon) {
            $bmp = $icon.ToBitmap()
            $uri = Convert-BitmapToDataUri $bmp
            $bmp.Dispose()
            $icon.Dispose()
            if ($uri) { return $uri }
        }
    } catch {}

    # Final Win32 index 0 fallback (works for some DLLs where ExtractAssociatedIcon returns null)
    if (("Win32IconExtractor" -as [type])) {
        try {
            $ico0 = [Win32IconExtractor]::ExtractByIndex($filePath, 0)
            if ($ico0) {
                $bmp = $ico0.ToBitmap()
                $uri = Convert-BitmapToDataUri $bmp
                $bmp.Dispose()
                $ico0.Dispose()
                if ($uri) { return $uri }
            }
        } catch {}
    }

    return $null
}

$result = @{}

if (Test-Path -LiteralPath $InputJsonPath) {
    try {
        $rawContent = Get-Content -LiteralPath $InputJsonPath -Raw -Encoding UTF8
        $paths = $rawContent | ConvertFrom-Json
        if ($paths -is [string]) { $paths = @($paths) }
        foreach ($p in $paths) {
            if ([string]::IsNullOrWhiteSpace($p)) { continue }
            $uri = Extract-IconSpecDataUri $p
            if ($uri) {
                $result[$p] = $uri
            }
        }
    } catch {}
}

$result | ConvertTo-Json -Compress | Set-Content -LiteralPath $OutputJsonPath -Encoding UTF8
