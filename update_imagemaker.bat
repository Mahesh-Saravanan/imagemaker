@echo off
title Update SKTC Image Maker

echo ==========================================
echo Updating SKTC Image Maker from GitHub...
echo ==========================================

:: Change directory to the folder where this .bat file is located
cd /d "%~dp0"

echo Pulling latest changes...
git fetch --all
git pull origin main

echo.
echo Installing any new dependencies...
npm install

echo.
echo Update Complete! You can now close this window and run start_imagemaker.bat.
pause
