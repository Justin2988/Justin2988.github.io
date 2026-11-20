# Generates assets/img/og-image.png, the 1200x630 card shown when the site is
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
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Palette mirrors the dark theme in assets/css/site.css
$bg        = [System.Drawing.Color]::FromArgb(12, 16, 24)
$surface   = [System.Drawing.Color]::FromArgb(22, 28, 41)
$text      = [System.Drawing.Color]::FromArgb(232, 235, 241)
$textSoft  = [System.Drawing.Color]::FromArgb(186, 194, 208)
$accent    = [System.Drawing.Color]::FromArgb(227, 182, 110)
$ruleColor = [System.Drawing.Color]::FromArgb(54, 65, 90)

$g.Clear($bg)

# Soft gold glow in the top-right corner
$glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowPath.AddEllipse(700, -380, 900, 760)
$glow = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
$glow.CenterColor = [System.Drawing.Color]::FromArgb(34, 227, 182, 110)
$glow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 227, 182, 110))
$g.FillPath($glow, $glowPath)

$textBrush     = New-Object System.Drawing.SolidBrush($text)
$textSoftBrush = New-Object System.Drawing.SolidBrush($textSoft)
$accentBrush   = New-Object System.Drawing.SolidBrush($accent)

# Gold band down the left edge
$g.FillRectangle($accentBrush, 0, 0, 12, $H)

# Gold diamond, matching the favicon mark
$pts = @(
  (New-Object System.Drawing.Point(98, 88)),
  (New-Object System.Drawing.Point(122, 112)),
  (New-Object System.Drawing.Point(98, 136)),
  (New-Object System.Drawing.Point(74, 112))
)
$g.FillPolygon($accentBrush, $pts)

$L = 152
$dot = [string][char]0x00B7   # middle dot, built from its code point so the file stays ASCII-safe

$fEyebrow = New-Object System.Drawing.Font("Segoe UI Semibold", 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString("ED.D., EDUCATIONAL LEADERSHIP   $dot   ADULT EDUCATOR", $fEyebrow, $accentBrush, $L, 102)

$fName = New-Object System.Drawing.Font("Georgia", 94, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString("Justin", $fName, $textBrush, ($L - 10), 152)
$g.DrawString("Barczewski", $fName, $textBrush, ($L - 10), 262)

$rulePen = New-Object System.Drawing.Pen($ruleColor, 1)
$g.DrawLine($rulePen, $L, 408, ($W - 92), 408)

$fSub = New-Object System.Drawing.Font("Georgia", 33, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString("Online Teaching   $dot   Doctoral Mentoring", $fSub, $textSoftBrush, ($L - 5), 438)
$g.DrawString("Instructional Design   $dot   Adult Learning", $fSub, $textSoftBrush, ($L - 5), 486)

$fUrl = New-Object System.Drawing.Font("Segoe UI", 21, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$g.DrawString("justin2988.github.io", $fUrl, $accentBrush, $L, 548)

$outDir = Join-Path $PSScriptRoot "..\assets\img"
$out = Join-Path $outDir "og-image.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)

$glow.Dispose()
$glowPath.Dispose()
$g.Dispose()
$bmp.Dispose()

Write-Output "Saved $out"
