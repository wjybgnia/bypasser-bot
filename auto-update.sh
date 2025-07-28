#!/bin/bash

# Auto-Update Script for Bypasser Bot
# This script checks for updates on GitHub and automatically updates the bot

LOG_FILE="/home/scriptblox-bot/logs/auto-update.log"
BOT_DIR="/home/scriptblox-bot"
REPO_URL="https://github.com/wjybgnia/Bypasser-Bot.git"

# Create logs directory if it doesn't exist
mkdir -p /home/scriptblox-bot/logs

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_message "🔄 Starting auto-update check..."

# Change to bot directory
cd "$BOT_DIR" || {
    log_message "❌ Failed to change to bot directory"
    exit 1
}

# Fetch latest changes from remote
git fetch origin main 2>/dev/null

# Check if there are updates available
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/main)

if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
    log_message "✅ Bot is already up to date (commit: ${LOCAL_COMMIT:0:8})"
    exit 0
fi

log_message "📥 New updates found! Updating bot..."
log_message "   Local:  ${LOCAL_COMMIT:0:8}"
log_message "   Remote: ${REMOTE_COMMIT:0:8}"

# Backup current .env file
cp .env .env.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Pull latest changes
if git pull origin main; then
    log_message "✅ Successfully pulled latest changes"
else
    log_message "❌ Failed to pull changes"
    exit 1
fi

# Restore .env file if it was overwritten
if [ -f .env.example ] && [ ! -f .env ]; then
    log_message "🔧 Restoring .env file from backup"
    cp .env.backup.* .env 2>/dev/null || cp .env.example .env
fi

# Install any new dependencies
log_message "📦 Installing/updating dependencies..."
if npm install --production --silent; then
    log_message "✅ Dependencies updated successfully"
else
    log_message "❌ Failed to update dependencies"
    exit 1
fi

# Get the current PM2 process name
PM2_NAME=$(pm2 jlist | jq -r '.[0].name' 2>/dev/null || echo "weao-discord-bot")

# Restart the bot
log_message "🔄 Restarting bot (PM2 name: $PM2_NAME)..."
if pm2 restart "$PM2_NAME"; then
    log_message "✅ Bot restarted successfully"
    
    # Wait a moment and check if bot is running
    sleep 5
    if pm2 show "$PM2_NAME" | grep -q "online"; then
        log_message "✅ Bot is running and healthy"
        
        # Send notification to bot logs
        pm2 logs "$PM2_NAME" --lines 1 | head -n 1 >> "$LOG_FILE"
    else
        log_message "⚠️  Bot may not be running properly, check PM2 status"
    fi
else
    log_message "❌ Failed to restart bot"
    exit 1
fi

log_message "🎉 Auto-update completed successfully!"
log_message "=================================================="
