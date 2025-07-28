# Auto-Update Setup Guide for Bypasser Bot

## Overview
This guide shows you how to set up automatic updates for your Bypasser Bot running on Digital Ocean.

## Auto-Update Options

### Option 1: Scheduled Updates (Recommended)

Set up a cron job to check for updates every hour:

```bash
# SSH into your droplet
ssh root@157.230.40.134

# Navigate to bot directory
cd /home/scriptblox-bot

# Make auto-update script executable
chmod +x auto-update.sh

# Set up cron job for hourly checks
crontab -e

# Add this line (checks every hour):
0 * * * * /home/scriptblox-bot/auto-update.sh

# Or check every 30 minutes:
*/30 * * * * /home/scriptblox-bot/auto-update.sh

# Or check every 6 hours (recommended):
0 */6 * * * /home/scriptblox-bot/auto-update.sh
```

### Option 2: Manual Update Command

```bash
# SSH into your droplet
ssh root@157.230.40.134

# Run manual update
cd /home/scriptblox-bot
./auto-update.sh
```

### Option 3: GitHub Webhook (Advanced)

For instant updates when you push to GitHub:

1. **Install webhook server**:
```bash
npm install -g webhook
```

2. **Create webhook configuration**:
```bash
cat > /home/scriptblox-bot/webhook.json << 'EOF'
[
  {
    "id": "bypasser-bot-update",
    "execute-command": "/home/scriptblox-bot/webhook-update.sh",
    "command-working-directory": "/home/scriptblox-bot",
    "response-message": "Bot update triggered",
    "trigger-rule": {
      "match": {
        "type": "payload-hash-sha1",
        "secret": "your-webhook-secret-here",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature"
        }
      }
    }
  }
]
EOF
```

3. **Start webhook server**:
```bash
webhook -hooks webhook.json -verbose -port 9000
```

4. **Configure GitHub webhook**:
   - Go to your repository: https://github.com/wjybgnia/Bypasser-Bot/settings/hooks
   - Add webhook: `http://YOUR_DROPLET_IP:9000/hooks/bypasser-bot-update`
   - Secret: Use the same secret from webhook.json
   - Events: Just push events

## Auto-Update Features

✅ **Smart Updates**: Only updates when changes are detected
✅ **Backup Protection**: Automatically backs up your .env file
✅ **Dependency Management**: Installs new npm packages automatically
✅ **Zero Downtime**: Restarts bot after successful update
✅ **Logging**: Complete update logs in `/home/scriptblox-bot/logs/`
✅ **Health Check**: Verifies bot is running after update

## Update Process

When an update runs, it will:

1. 🔍 Check for new commits on GitHub
2. 📥 Pull latest changes if available
3. 💾 Backup your current .env file
4. 📦 Install any new dependencies
5. 🔄 Restart the bot with PM2
6. ✅ Verify bot is running properly
7. 📝 Log everything to update logs

## Monitoring Updates

### View Update Logs
```bash
# SSH into your droplet
ssh root@157.230.40.134

# View latest auto-update log
tail -f /home/scriptblox-bot/logs/auto-update.log

# View all update history
cat /home/scriptblox-bot/logs/auto-update.log
```

### Check Last Update Time
```bash
# Check when bot was last updated
cd /home/scriptblox-bot
git log -1 --format="%cd - %s" --date=local
```

### Manual Update Check
```bash
# Check if updates are available without updating
cd /home/scriptblox-bot
git fetch origin main
git log HEAD..origin/main --oneline
```

## Troubleshooting

### Update Fails
```bash
# Check update logs
tail -20 /home/scriptblox-bot/logs/auto-update.log

# Manual update with verbose output
cd /home/scriptblox-bot
./auto-update.sh
```

### Bot Won't Start After Update
```bash
# Check PM2 logs
pm2 logs weao-discord-bot

# Restart manually
pm2 restart weao-discord-bot

# Check bot status
pm2 status
```

### Restore Previous Version
```bash
# View commit history
cd /home/scriptblox-bot
git log --oneline -5

# Rollback to previous commit
git reset --hard HEAD~1
pm2 restart weao-discord-bot
```

## Best Practices

1. **Test First**: Test updates in a development environment
2. **Monitor Logs**: Check logs after each update
3. **Backup Strategy**: Keep regular backups of your .env file
4. **Update Frequency**: Don't update too frequently (every 6 hours is good)
5. **Health Checks**: Monitor bot status after updates

## Recommended Cron Schedule

```bash
# Every 6 hours (recommended for production)
0 */6 * * * /home/scriptblox-bot/auto-update.sh

# Daily at 3 AM (conservative approach)
0 3 * * * /home/scriptblox-bot/auto-update.sh

# Every 2 hours (for active development)
0 */2 * * * /home/scriptblox-bot/auto-update.sh
```

Your Bypasser Bot will now stay automatically updated with the latest features and fixes! 🚀
