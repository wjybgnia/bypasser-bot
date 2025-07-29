#!/bin/bash

# Heroku Deployment Script for ScriptBlox Discord Bot
# Run this script to deploy your bot to Heroku

echo "🚀 Starting Heroku deployment for ScriptBlox Discord Bot..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first:"
    echo "   https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please login to Heroku first:"
    heroku login
fi

# Prompt for app name
echo "📝 Enter your Heroku app name (or press Enter for auto-generated):"
read -r APP_NAME

# Create Heroku app
if [ -z "$APP_NAME" ]; then
    echo "🏗️ Creating Heroku app with auto-generated name..."
    heroku create
else
    echo "🏗️ Creating Heroku app: $APP_NAME"
    heroku create "$APP_NAME"
fi

# Check if app was created successfully
if [ $? -ne 0 ]; then
    echo "❌ Failed to create Heroku app. It might already exist."
    echo "📝 Enter the existing app name:"
    read -r EXISTING_APP
    heroku git:remote -a "$EXISTING_APP"
fi

# Set environment variables
echo "🔑 Setting up environment variables..."
echo "Please enter your Discord bot token:"
read -rs DISCORD_TOKEN
heroku config:set DISCORD_TOKEN="$DISCORD_TOKEN"

echo "Please enter your Discord client ID:"
read -r CLIENT_ID
heroku config:set CLIENT_ID="$CLIENT_ID"

echo "Please enter your Discord guild ID (optional, press Enter to skip):"
read -r GUILD_ID
if [ -n "$GUILD_ID" ]; then
    heroku config:set GUILD_ID="$GUILD_ID"
fi

# Deploy to Heroku
echo "📦 Deploying to Heroku..."
git add .
git commit -m "Deploy ScriptBlox Discord Bot to Heroku"
git push heroku main

# Scale the worker dyno
echo "⚡ Scaling worker dyno..."
heroku ps:scale worker=1

# Show app info
echo "✅ Deployment complete!"
heroku info
heroku logs --tail
