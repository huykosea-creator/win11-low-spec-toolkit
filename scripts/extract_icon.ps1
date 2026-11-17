param (
    [string]$FilePath
)

Add-Type -AssemblyName System.Drawing

if ([string]::IsNullOrWhiteSpace($FilePath) -or -not (Test-Path $FilePath)) {
    exit 0
}

try {
    $icon = [System.Drawing.Icon]::ExtractAssociatedIcon($FilePath)
    if ($icon) {
        $bitmap = $icon.ToBitmap()
        $ms = New-Object System.IO.MemoryStream
        $bitmap.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $b64 = [Convert]::ToBase64String($ms.ToArray())
        $ms.Close()
        $bitmap.Dispose()
        $icon.Dispose()
        Write-Output ("data:image/png;base64," + $b64)
    }
} catch {
    # Ignore errors
}
