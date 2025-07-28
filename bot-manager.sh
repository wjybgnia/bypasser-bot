#!/bin/bash

# Quick Bot Management Script for Digital Ocean Droplet
# Place this in /home/scriptblox-bot/ directory

case "$1" in
    start)
        echo "🚀 Starting ScriptBlox Discord Bot..."
        pm2 start ecosystem.config.json
        ;;
    stop)
        echo "🛑 Stopping ScriptBlox Discord Bot..."
        pm2 stop scriptblox-discord-bot
        ;;
    restart)
        echo "🔄 Restarting ScriptBlox Discord Bot..."
        pm2 restart scriptblox-discord-bot
        ;;
    status)
        echo "📊 Bot Status:"
        pm2 status
        ;;
    logs)
        echo "📝 Bot Logs:"
        pm2 logs scriptblox-discord-bot
        ;;
    update)
        echo "📥 Updating bot from GitHub..."
        ./auto-update.sh
        ;;
    auto-update)
        echo "🤖 Setting up automatic updates..."
        chmod +x auto-update.sh
        echo "Select update frequency:"
        echo "1) Every 6 hours (recommended)"
        echo "2) Every 2 hours"
        echo "3) Daily at 3 AM"
        read -p "Enter choice (1-3): " choice
        case $choice in
            1) CRON_SCHEDULE="0 */6 * * *" ;;
            2) CRON_SCHEDULE="0 */2 * * *" ;;
            3) CRON_SCHEDULE="0 3 * * *" ;;
            *) echo "Invalid choice"; exit 1 ;;
        esac
        (crontab -l 2>/dev/null; echo "$CRON_SCHEDULE /home/scriptblox-bot/auto-update.sh") | crontab -
        echo "✅ Auto-update scheduled: $CRON_SCHEDULE"
        ;;
    logs-update)
        echo "📝 Auto-update logs:"
        tail -20 /home/scriptblox-bot/logs/auto-update.log
        ;;
    check-updates)
        echo "🔍 Checking for available updates..."
        git fetch origin main
        LOCAL=$(git rev-parse HEAD)
        REMOTE=$(git rev-parse origin/main)
        if [ "$LOCAL" = "$REMOTE" ]; then
            echo "✅ Bot is up to date"
        else
            echo "📥 Updates available:"
            git log HEAD..origin/main --oneline
        fi
        ;;
    update)
        echo "📥 Updating bot from GitHub..."
        git pull origin main
        npm install --production
        pm2 restart scriptblox-discord-bot
        echo "✅ Bot updated and restarted!"
        ;;
    deploy)
        echo "🔧 Deploying Discord commands..."
        npm run deploy
        ;;
    monitor)
        echo "📈 Opening PM2 Monitor..."
        pm2 monit
        ;;
    backup)
        echo "💾 Creating backup..."
        git add .
        git commit -m "Backup $(date '+%Y-%m-%d %H:%M:%S')"
        git push origin main
        echo "✅ Backup complete!"
        ;;
    *)
        echo "🤖 Bypasser Bot Management"
        echo "Usage: $0 {start|stop|restart|status|logs|update|auto-update|check-updates|logs-update|deploy|monitor|backup}"
        echo ""
        echo "Commands:"
        echo "  start        - Start the bot"
        echo "  stop         - Stop the bot"
        echo "  restart      - Restart the bot"
        echo "  status       - Show bot status"
        echo "  logs         - Show bot logs"
        echo "  update       - Manual update from GitHub"
        echo "  auto-update  - Setup automatic updates (cron)"
        echo "  check-updates- Check if updates are available"
        echo "  logs-update  - Show auto-update logs"
        echo "  deploy       - Deploy Discord slash commands"
        echo "  monitor      - Open PM2 resource monitor"
        echo "  backup       - Backup configuration to GitHub"
        ;;
esac
