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
        echo "🤖 ScriptBlox Discord Bot Management"
        echo "Usage: $0 {start|stop|restart|status|logs|update|deploy|monitor|backup}"
        echo ""
        echo "Commands:"
        echo "  start    - Start the bot"
        echo "  stop     - Stop the bot"
        echo "  restart  - Restart the bot"
        echo "  status   - Show bot status"
        echo "  logs     - Show bot logs"
        echo "  update   - Update bot from GitHub and restart"
        echo "  deploy   - Deploy Discord slash commands"
        echo "  monitor  - Open PM2 resource monitor"
        echo "  backup   - Backup configuration to GitHub"
        ;;
esac
