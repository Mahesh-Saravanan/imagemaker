@echo off
title SKTC Image Maker

echo ==========================================
echo Starting SKTC Image Maker...
echo ==========================================

:: Change directory to the absolute path of the project on the Windows machine
cd /d "C:\Users\SKTC\Documents\imagemaker"

:: Start a background process that waits 4 seconds and then opens the browser in full screen without headers
start cmd /c "timeout /t 4 /nobreak > nul & start chrome --start-fullscreen --app=http://localhost:3000 || start msedge --kiosk http://localhost:3000 || start http://localhost:3000"

:: Run the Next.js development server in this window
npm run dev
