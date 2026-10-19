@echo off
setlocal

set "XDG_CONFIG_HOME=%CD%\.xdg"
set "CHROME_EXE=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME_EXE%" set "CHROME_EXE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

start "" /B "%CD%\scripts\dev-local.cmd"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$deadline=(Get-Date).AddSeconds(35); do { try { $r=Invoke-WebRequest -Uri 'http://127.0.0.1:3000' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Milliseconds 750 } while ((Get-Date) -lt $deadline); exit 1"
if errorlevel 1 (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
  exit /b 1
)

"%CHROME_EXE%" --headless=new --virtual-time-budget=1500 --disable-gpu --disable-gpu-sandbox --disable-software-rasterizer --disable-dev-shm-usage --no-sandbox --no-first-run --no-default-browser-check --user-data-dir="%CD%\.chrome-profile" --screenshot="%CD%\visual-desktop.png" --window-size=1440,1100 http://127.0.0.1:3000/
"%CHROME_EXE%" --headless=new --virtual-time-budget=1500 --disable-gpu --disable-gpu-sandbox --disable-software-rasterizer --disable-dev-shm-usage --no-sandbox --no-first-run --no-default-browser-check --user-data-dir="%CD%\.chrome-profile-mobile" --screenshot="%CD%\visual-mobile.png" --window-size=390,1200 http://127.0.0.1:3000/
"%CHROME_EXE%" --headless=new --virtual-time-budget=2500 --disable-gpu --disable-gpu-sandbox --disable-software-rasterizer --disable-dev-shm-usage --no-sandbox --no-first-run --no-default-browser-check --user-data-dir="%CD%\.chrome-profile-ticket" --screenshot="%CD%\visual-ticket.png" --window-size=1440,1100 http://127.0.0.1:3000/?visual=hero#top

powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
