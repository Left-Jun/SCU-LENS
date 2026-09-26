$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$libraryRoot = Join-Path $projectRoot 'content\photo-library'
$metadataPath = Join-Path $libraryRoot 'metadata.csv'
$outputRoot = Join-Path $projectRoot 'public\images\gallery-generated'
$dataDir = Join-Path $projectRoot 'src\data'
$dataPath = Join-Path $dataDir 'gallery.generated.json'

$categoryMap = [ordered]@{
  '校园' = @{ slug = 'campus'; title = '校园'; en = 'Campus' }
  '人文' = @{ slug = 'humanity'; title = '人文'; en = 'Humanity' }
  '城市' = @{ slug = 'urban'; title = '城市'; en = 'Urban' }
  '自然' = @{ slug = 'nature'; title = '自然'; en = 'Nature' }
  '人像' = @{ slug = 'portrait'; title = '人像'; en = 'Portrait' }
  '动物' = @{ slug = 'animals'; title = '动物'; en = 'Animals' }
}

$issueMap = @{
  '2025-12' = @{ title = '黄色'; href = '/monthly-nine/2025-yellow' }
}

if (-not (Test-Path -LiteralPath $metadataPath)) {
  throw "Missing metadata.csv: $metadataPath"
}

New-Item -ItemType Directory -Force -Path $outputRoot, $dataDir | Out-Null

$metadata = Import-Csv -LiteralPath $metadataPath
$metadataByName = @{}
foreach ($row in $metadata) { $metadataByName[$row.filename] = $row }

Add-Type -AssemblyName System.Drawing

function Get-PhotoId([string]$value) {
  $sha1 = [System.Security.Cryptography.SHA1]::Create()
  try {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($value)
    $hash = $sha1.ComputeHash($bytes)
    return ([System.BitConverter]::ToString($hash).Replace('-', '').ToLowerInvariant()).Substring(0, 16)
  }
  finally { $sha1.Dispose() }
}

function Fix-Orientation([System.Drawing.Image]$image) {
  try {
    if ($image.PropertyIdList -contains 274) {
      $orientation = $image.GetPropertyItem(274).Value[0]
      switch ($orientation) {
        2 { $image.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX) }
        3 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
        4 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipX) }
        5 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipX) }
        6 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
        7 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipX) }
        8 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
      }
    }
  }
  catch { }
}

function Write-BrowserJpeg([string]$source, [string]$destination, [int]$maxEdge, [long]$quality) {
  $sourceImage = [System.Drawing.Image]::FromFile($source)
  try {
    Fix-Orientation $sourceImage
    $ratio = [Math]::Min(1.0, $maxEdge / [double][Math]::Max($sourceImage.Width, $sourceImage.Height))
    $width = [Math]::Max(1, [int][Math]::Round($sourceImage.Width * $ratio))
    $height = [Math]::Max(1, [int][Math]::Round($sourceImage.Height * $ratio))
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.DrawImage($sourceImage, 0, 0, $width, $height)
      }
      finally { $graphics.Dispose() }

      $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg' | Select-Object -First 1
      $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)
      $bitmap.Save($destination, $jpegCodec, $parameters)
      $parameters.Dispose()
      return [ordered]@{ width = $width; height = $height }
    }
    finally { $bitmap.Dispose() }
  }
  finally { $sourceImage.Dispose() }
}

$items = New-Object System.Collections.Generic.List[object]
$seenOutput = New-Object System.Collections.Generic.HashSet[string]

foreach ($folder in $categoryMap.Keys) {
  $info = $categoryMap[$folder]
  $folderPath = Join-Path $libraryRoot $folder
  $categoryOutput = Join-Path $outputRoot $info.slug
  New-Item -ItemType Directory -Force -Path $categoryOutput | Out-Null

  $sourceFiles = Get-ChildItem -LiteralPath $folderPath -File -ErrorAction SilentlyContinue | Sort-Object Name
  foreach ($file in $sourceFiles) {
    if (-not $metadataByName.ContainsKey($file.Name)) {
      Write-Warning "No metadata row for $($file.Name); skipped."
      continue
    }

    $row = $metadataByName[$file.Name]
    $id = Get-PhotoId $file.Name
    # Conservative responsive JPEG ladder. Every derivative is rendered once
    # from the archived source, never from another compressed derivative.
    $variants = @(
      @{ edge = 960; quality = 88 },
      @{ edge = 1440; quality = 90 },
      @{ edge = 1800; quality = 91 }
    )
    $generated = New-Object System.Collections.Generic.List[object]
    foreach ($variant in $variants) {
      $outputName = "$id-$($variant.edge).jpg"
      $outputPath = Join-Path $categoryOutput $outputName
      $dimensions = Write-BrowserJpeg $file.FullName $outputPath $variant.edge $variant.quality
      [void]$seenOutput.Add($outputPath)
      $generated.Add([ordered]@{
        edge = $variant.edge
        width = $dimensions.width
        height = $dimensions.height
        src = "/images/gallery-generated/$($info.slug)/$outputName"
      }) | Out-Null
    }

    $listVariant = $generated | Select-Object -First 1
    $viewerVariant = $generated | Select-Object -Last 1
    $srcset = ($generated | ForEach-Object { "$($_.src) $($_.width)w" }) -join ', '

    $issue = $null
    if ($row.monthly_nine_issue -and $issueMap.ContainsKey($row.monthly_nine_issue)) {
      $mapped = $issueMap[$row.monthly_nine_issue]
      $issue = [ordered]@{
        issue = $row.monthly_nine_issue
        title = $mapped.title
        href = $mapped.href
      }
    }

    $items.Add([ordered]@{
      id = $id
      submissionId = if ($row.submission_id) { $row.submission_id } else { $null }
      filename = $file.Name
      src = $listVariant.src
      srcset = $srcset
      viewerSrc = $viewerVariant.src
      originalSrc = $viewerVariant.src
      width = $viewerVariant.width
      height = $viewerVariant.height
      category = $info.slug
      categoryTitle = $info.title
      categoryEn = $info.en
      date = $row.date
      section = $row.section
      author = $row.author
      title = if ($row.title) { $row.title } else { $null }
      titleSource = if ($row.title_source) { $row.title_source } else { $null }
      caption = if ($row.caption) { $row.caption } else { $null }
      description = $row.description
      tags = @($row.tags -split '\s*[;,，；]\s*' | Where-Object { $_ })
      monthlyNine = $issue
    }) | Out-Null
  }
}

# Remove stale generated browser images that no longer correspond to a classified source.
Get-ChildItem -LiteralPath $outputRoot -Recurse -File -Filter '*.jpg' -ErrorAction SilentlyContinue | ForEach-Object {
  if (-not $seenOutput.Contains($_.FullName)) { Remove-Item -LiteralPath $_.FullName -Force }
}

$payload = [ordered]@{
  generatedAt = (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssK')
  total = $items.Count
  items = $items
}
$json = $payload | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($dataPath, $json, (New-Object System.Text.UTF8Encoding($false)))

Write-Output "Generated $($items.Count) classified gallery items."
foreach ($folder in $categoryMap.Keys) {
  $slug = $categoryMap[$folder].slug
  $count = @($items | Where-Object category -eq $slug).Count
  Write-Output "$folder / $slug = $count"
}
