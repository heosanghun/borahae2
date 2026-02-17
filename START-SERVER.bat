@echo off
title Borahae Local Server
cd /d "%~dp0"

echo.
echo [1] Checking port 3000...
netstat -ano | findstr ":3000" >nul 2>&1
if %errorlevel%==0 (
  echo      Port 3000 is in use. Try closing other apps or use 3001.
  echo      Starting on 3001 instead...
  echo.
  set PORT=3001
) else (
  set PORT=3000
)
echo      Will use port %PORT%

echo [2] Starting server in this folder:
echo      %cd%
echo.

where node >nul 2>&1
if %errorlevel%==0 (
  echo [3] Using Node.js server (port %PORT%)...
  echo.
  echo      Open in browser:  http://localhost:%PORT%/
  echo.
  start "" "http://localhost:%PORT%/"
  set PORT=%PORT%
  node server.js
) else (
  echo [3] Node not found. Using Python (port %PORT%)...
  echo.
  echo      Open in browser:  http://localhost:%PORT%/
  echo.
  start "" "http://localhost:%PORT%/"
  python -m http.server %PORT%
)

echo.
pause
