# D:\AI\borahae1\borahae-fan 에서 서버 실행 후 브라우저 자동 열기
Set-Location "D:\AI\borahae1\borahae-fan"
Write-Host "Starting server on http://localhost:8765/"
$job = Start-Job -ScriptBlock { Set-Location "D:\AI\borahae1\borahae-fan"; python -m http.server 8765 }
Start-Sleep -Seconds 2
Write-Host "Opening browser..."
Start-Process "http://localhost:8765/"
Write-Host "Server is running. Press Enter to stop."
Read-Host
Stop-Job $job; Remove-Job $job
