# Generates assets/img/og-image.png — the 1200x630 card shown when the site is
# shared on LinkedIn, Slack, iMessage, etc.
#
# Run once from the repository root:
#
#   powershell -ExecutionPolicy Bypass -File tools\make-og-image.ps1
#
# Re-run it any time the tagline changes. Windows only (uses System.Drawing).

Add-Type -AssemblyName System.Drawing

$W = 1200
$H = 630

$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# Palette mirrors assets/css/site.css
$parchment = [System.Drawing.Color]::FromArgb(250, 247, 242)
$ink       = [System.Drawing.Color]::FromArgb(18, 35, 63)
$inkSoft   = [System.Drawing.Color]::FromArgb(61, 78, 104)
$brass     = [System.Drawing.Color]::FromArgb(166, 124, 61)
$brassText = [System.Drawing.Color]::FromArgb(122, 86, 32)
$ruleColor = [System.Drawing.Color]::FromArgb(226, 217, 204)

$g.Clear($parchment)

$inkBrush       = New-Object System.Drawing.SolidBrush($ink)
$inkSoftBrush   = New-Object System.Drawing.SolidBrush($inkSoft)
$brassBrush     = New-Object System.Drawing.SolidBrush($brass)
$brassTextBrush = New-Object System.Drawing.SolidBrush($brassText)

# Ink band down the left edge
$g.FillRectangle($inkBrush, 0, 0, 20, $H)

# Brass diamond, matching the favicon mark
$pts = @(
  (New-Object System.Drawing.Point(98, 88)),
  (New-Object System.Drawing.Point(122, 112)),
  (New-Object System.Drawing.Point(98, 136)),
  (New-Object System.Drawing.Point(74, 112))
)
$g.FillPolygon($brassBrush, $pts)

$L = 152

$fEyebrow = New-Object System.Drawing.Font("Segoe UI Semibold", 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString("EDD CANDIDATE   -   EDUCATIONAL LEADERSHIP", $fEyebrow, $brassTextBrush, $L, 102)

$fName = New-Object System.Drawing.Font("Georgia", 94, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString("Justin", $fName, $inkBrush, ($L - 10), 152)
$g.DrawString("Barczewski", $fName, $inkBrush, ($L - 10), 262)

$rulePen = New-Object System.Drawing.Pen($ruleColor, 1)
$g.DrawLine($rulePen, $L, 408, ($W - 92), 408)

$fSub = New-Object System.Drawing.Font("Georgia", 33, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString("Program Development   -   Academic Assessment", $fSub, $inkSoftBrush, ($L - 5), 438)
$g.DrawString("Instructional Design   -   Adult Learning", $fSub, $inkSoftBrush, ($L - 5), 486)

$fUrl = New-Object System.Drawing.Font("Segoe UI", 21, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString("justin2988.github.io", $fUrl, $brassTextBrush, $L, 548)

$outDir = Join-Path $PSScriptRoot "..\assets\img"
$out = Join-Path $outDir "og-image.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()

Write-Output "Saved $out"
