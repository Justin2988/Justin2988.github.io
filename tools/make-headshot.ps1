# Generates assets/img/justin-barczewski.jpg — the hero portrait on index.html.
#
# Drop the highest-resolution original into _incoming/headshot-source.jpg, then
# run from the repository root:
#
#   powershell -ExecutionPolicy Bypass -File tools\make-headshot.ps1
#
# Center-crops to the 4:5 frame the hero expects and caps the long edge at
# 1000px. It never upscales, so the result is only as sharp as the source —
# re-run it whenever a better original turns up. Windows only (uses System.Drawing).

param(
  [string]$Source = (Join-Path $PSScriptRoot "..\_incoming\headshot-source.jpg")
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $Source)) {
  Write-Error "No source image at $Source"
  exit 1
}

$src = [System.Drawing.Image]::FromFile((Resolve-Path $Source))

# Honor the EXIF orientation tag if the camera set one (phone photos).
if ($src.PropertyIdList -contains 274) {
  switch ($src.GetPropertyItem(274).Value[0]) {
    3 { $src.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
    6 { $src.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
    8 { $src.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
  }
}

# Crop to 4:5. A source wider than that loses the sides evenly; a taller one
# loses mostly the bottom, which keeps the headroom above the subject.
$target = 4 / 5
$aspect = $src.Width / $src.Height

if ($aspect -gt $target) {
  $cropH = $src.Height
  $cropW = [int][Math]::Round($src.Height * $target)
  $cropX = [int][Math]::Round(($src.Width - $cropW) / 2)
  $cropY = 0
} else {
  $cropW = $src.Width
  $cropH = [int][Math]::Round($src.Width / $target)
  $cropX = 0
  $cropY = [int][Math]::Round(($src.Height - $cropH) * 0.2)
}

# Scale down to the 800x1000 the layout wants, but never up.
$scale = [Math]::Min(1000 / $cropH, 1)
$outW = [int][Math]::Round($cropW * $scale)
$outH = [int][Math]::Round($cropH * $scale)

$bmp = New-Object System.Drawing.Bitmap($outW, $outH)
$bmp.SetResolution(72, 72)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$dstRect = New-Object System.Drawing.Rectangle(0, 0, $outW, $outH)
$g.DrawImage($src, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, 90)

$out = Join-Path $PSScriptRoot "..\assets\img\justin-barczewski.jpg"
$bmp.Save($out, $codec, $params)

$g.Dispose()
$bmp.Dispose()
$src.Dispose()

Write-Output "Saved $out ($outW x $outH)"
