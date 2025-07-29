@echo off
title ScriptBlox Discord Bot
echo ========================================
echo    ScriptBlox Discord Bot Launcher
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Check if .env file exists
if not exist ".env" (
    echo [WARNING] .env file not found!
    echo Please create a .env file with your Discord bot token and other settings.
    echo See .env.example for reference.
    echo.
    pause
    exit /b 1
)

echo [1/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [✓] Dependencies installed successfully!
echo.

echo [2/3] Deploying Discord commands...
call npm run deploy
if errorlevel 1 (
    echo [ERROR] Failed to deploy commands
    pause
    exit /b 1
)
echo [✓] Commands deployed successfully!
echo.

echo [3/3] Starting the bot...
echo [INFO] Bot is starting... Press Ctrl+C to stop
echo ========================================
call npm start

echo.
echo Bot has stopped.
pause
