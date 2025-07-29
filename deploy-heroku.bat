@echo off
REM Heroku Deployment Script for ScriptBlox Discord Bot (Windows)
echo 🚀 Starting Heroku deployment for ScriptBlox Discord Bot...

REM Check if Heroku CLI is installed
where heroku >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Heroku CLI is not installed. Please install it first:
    echo    https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

REM Check if user is logged in to Heroku
heroku auth:whoami >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 🔐 Please login to Heroku first:
    heroku login
)

REM Prompt for app name
set /p APP_NAME="📝 Enter your Heroku app name (or press Enter for auto-generated): "

REM Create Heroku app
if "%APP_NAME%"=="" (
    echo 🏗️ Creating Heroku app with auto-generated name...
    heroku create
) else (
    echo 🏗️ Creating Heroku app: %APP_NAME%
    heroku create %APP_NAME%
)

REM Check if app was created successfully
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to create Heroku app. It might already exist.
    set /p EXISTING_APP="📝 Enter the existing app name: "
    heroku git:remote -a %EXISTING_APP%
)

REM Set environment variables
echo 🔑 Setting up environment variables...
set /p DISCORD_TOKEN="Please enter your Discord bot token: "
heroku config:set DISCORD_TOKEN="%DISCORD_TOKEN%"

set /p CLIENT_ID="Please enter your Discord client ID: "
heroku config:set CLIENT_ID="%CLIENT_ID%"

set /p GUILD_ID="Please enter your Discord guild ID (optional, press Enter to skip): "
if not "%GUILD_ID%"=="" (
    heroku config:set GUILD_ID="%GUILD_ID%"
)

REM Deploy to Heroku
echo 📦 Deploying to Heroku...
git add .
git commit -m "Deploy ScriptBlox Discord Bot to Heroku"
git push heroku main

REM Scale the worker dyno
echo ⚡ Scaling worker dyno...
heroku ps:scale worker=1

REM Show app info
echo ✅ Deployment complete!
heroku info
heroku logs --tail

pause
