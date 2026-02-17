@echo off
cd /d "D:\AI\borahae1\borahae-fan"
set PORT=9321
echo.
echo [1] Starting server on http://localhost:%PORT%/
echo [2] Opening browser in 3 seconds...
echo.
start /B python -m http.server %PORT%
timeout /t 3 /nobreak >nul
start "" "http://localhost:%PORT%/"
echo.
echo Server is running: http://localhost:%PORT%/
echo Close this window to stop the server.
echo.
pause
