@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo [보라해] 로컬 서버를 띄우고 브라우저를 엽니다...
echo.

REM 서버 창이 안 닫히도록 cmd /k 로 실행 (에러 메시지 확인 가능)
start "보라해 로컬서버" cmd /k "python -m http.server 8000"
echo 서버가 켜질 때까지 4초 대기 중...
timeout /t 4 /nobreak >nul
start "" "http://localhost:8000/"

echo.
echo 브라우저가 열렸습니다.
echo "보라해 로컬서버" 창을 닫지 마세요. 닫으면 페이지가 안 보입니다.
pause
