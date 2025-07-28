#!/bin/bash

# Webhook Auto-Update Script
# This script can be triggered by GitHub webhooks for instant updates

LOG_FILE="/home/scriptblox-bot/logs/webhook-update.log"
BOT_DIR="/home/scriptblox-bot"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_message "🚀 Webhook triggered auto-update..."

# Change to bot directory
cd "$BOT_DIR" || exit 1

# Update bot
if ./auto-update.sh; then
    log_message "✅ Webhook update completed successfully"
    
    # Optional: Send Discord notification (if you set up a webhook URL)
    # DISCORD_WEBHOOK_URL="your_webhook_url_here"
    # curl -H "Content-Type: application/json" \
    #      -d '{"content":"🤖 Bypasser Bot has been updated automatically!"}' \
    #      "$DISCORD_WEBHOOK_URL"
else
    log_message "❌ Webhook update failed"
    exit 1
fi
