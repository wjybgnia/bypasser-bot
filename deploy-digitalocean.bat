@echo off
REM Digital Ocean Deployment Script for ScriptBlox Discord Bot (Windows)
echo 🚀 Deploying ScriptBlox Discord Bot to Digital Ocean...

REM Check if doctl is installed
where doctl >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ doctl CLI not found. Please install it first:
    echo    Visit: https://docs.digitalocean.com/reference/doctl/how-to/install/
    exit /b 1
)

REM Check if user is authenticated
doctl auth list >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Not authenticated with Digital Ocean. Please run:
    echo    doctl auth init
    exit /b 1
)

echo ✅ Digital Ocean CLI ready

REM Create the app
echo 📦 Creating Digital Ocean App...
doctl apps create .do/app.yaml

echo.
echo 🔧 Next steps:
echo 1. Go to your Digital Ocean dashboard: https://cloud.digitalocean.com/apps
echo 2. Find your new app and configure environment variables:
echo    - DISCORD_TOKEN: Your bot token
echo    - CLIENT_ID: Your Discord application client ID
echo 3. Deploy the app
echo.
echo ✅ Deployment configuration complete!
pause
