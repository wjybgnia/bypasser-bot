#!/bin/bash

# Auto-update script for ScriptBlox Discord Bot
# This script checks for updates and restarts the bot if changes are found

LOG_FILE="/home/scriptblox-bot/update.log"
BOT_DIR="/home/scriptblox-bot"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

log_message "Checking for updates..."

cd "$BOT_DIR" || {
    log_message "ERROR: Cannot change to bot directory"
    exit 1
}

# Fetch latest changes
git fetch origin main 2>> "$LOG_FILE"

# Check if there are new commits
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    log_message "New changes detected. Updating bot..."
    
    # Backup current state
    git stash 2>> "$LOG_FILE"
    
    # Pull latest changes
    if git pull origin main 2>> "$LOG_FILE"; then
        log_message "Successfully pulled changes"
        
        # Install any new dependencies for both bot and webhook server
        log_message "Installing dependencies..."
        npm install --production 2>> "$LOG_FILE"
        
        # Ensure express is installed for webhook server
        npm install express 2>> "$LOG_FILE"
        
        # Restart the Discord bot
        if pm2 restart scriptblox-discord-bot 2>> "$LOG_FILE"; then
            log_message "Discord bot restarted successfully"
        else
            log_message "ERROR: Failed to restart Discord bot"
        fi
        
        # Restart the webhook server
        if pm2 restart webhook-server 2>> "$LOG_FILE"; then
            log_message "Webhook server restarted successfully"
        else
            log_message "ERROR: Failed to restart webhook server"
        fi
        
        # Deploy commands if needed
        log_message "Deploying Discord commands..."
        npm run deploy 2>> "$LOG_FILE"
        log_message "Commands redeployed successfully"
        
    else
        log_message "ERROR: Failed to pull changes"
        git stash pop 2>> "$LOG_FILE"  # Restore backup
    fi
else
    log_message "No updates available"
fi

# Clean up old log entries (keep last 100 lines)
tail -n 100 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
