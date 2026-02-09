# SIMS Fashion AI - GitHub Auto Push Script
# Usage: .\push.ps1

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "SIMS Fashion AI GitHub Push..." -ForegroundColor Cyan

$root = if ($PSScriptRoot) { $PSScriptRoot } else { Get-Location }
Set-Location $root

Write-Host "Pulling latest..." -ForegroundColor Yellow
git pull origin main --no-rebase 2>&1 | Out-Null

$status = git status --porcelain
if ($status) {
    git add .
    $msg = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git commit -m $msg
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Pushing..." -ForegroundColor Yellow
        git push origin main
        if ($LASTEXITCODE -eq 0) { Write-Host "Done." -ForegroundColor Green }
        else { Write-Host "Push failed. Check PAT / GITHUB_SETUP.md" -ForegroundColor Red }
    }
} else {
    Write-Host "No changes." -ForegroundColor Blue
}
