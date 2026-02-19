# 영상 압축 (원본 덮어쓰기) — ffmpeg 필요
# 사용: .\scripts\optimize-videos.ps1
# 근거: docs/압축_최적화_근거.md — CRF 24 = 화질 유지

$root = Resolve-Path "$PSScriptRoot\.."
$dirs = @(
    "$root\image",
    "$root\movie"
)
$crf = 24
$count = 0

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) { continue }
    Get-ChildItem -Path $dir -Recurse -Filter "*.mp4" | ForEach-Object {
        $f = $_.FullName
        $tmp = "$f.tmp.mp4"
        & ffmpeg -y -i $f -c:v libx264 -crf $crf -preset medium -c:a aac -b:a 128k $tmp 2>$null
        if (Test-Path $tmp) {
            Remove-Item $f -Force
            Rename-Item $tmp $f
            $count++
            Write-Host "OK: $f"
        }
    }
}
Write-Host "완료: $count 개"
