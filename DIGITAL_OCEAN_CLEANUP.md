# Digital Ocean Cleanup Guide

## Steps to Remove ScriptBlox Bot from Digital Ocean

### 1. Connect to Your Droplet
```bash
ssh root@your-droplet-ip
```

### 2. Stop the Bot
```bash
# Stop PM2 process
pm2 stop scriptblox-discord-bot
pm2 delete scriptblox-discord-bot

# Or if running directly
pkill -f "node.*scriptblox"
```

### 3. Remove Bot Files
```bash
# Remove the bot directory
rm -rf /home/scriptblox-bot

# Remove webhook server if exists
pm2 stop webhook-server
pm2 delete webhook-server
rm -rf /home/webhook-server
```

### 4. Remove Nginx Configuration (if configured)
```bash
# Remove nginx config
rm /etc/nginx/sites-available/scriptblox-bot
rm /etc/nginx/sites-enabled/scriptblox-bot
nginx -t && systemctl reload nginx
```

### 5. Remove Cron Jobs (if any)
```bash
# Check for cron jobs
crontab -l

# Remove any scriptblox-related cron jobs
crontab -e
# Delete any lines related to scriptblox-bot
```

### 6. Clean Up Dependencies (Optional)
```bash
# Remove Node.js if not needed for other projects
apt remove nodejs npm -y
apt autoremove -y

# Remove PM2 if not needed
npm uninstall -g pm2
```

### 7. Remove User (if created specifically for bot)
```bash
# If you created a specific user for the bot
userdel -r scriptblox-bot
```

### Quick Cleanup Script
Run this on your Digital Ocean droplet to remove everything:

```bash
#!/bin/bash
echo "🧹 Cleaning up ScriptBlox Discord Bot from Digital Ocean..."

# Stop and remove PM2 processes
pm2 stop scriptblox-discord-bot 2>/dev/null
pm2 delete scriptblox-discord-bot 2>/dev/null
pm2 stop webhook-server 2>/dev/null  
pm2 delete webhook-server 2>/dev/null

# Remove directories
rm -rf /home/scriptblox-bot
rm -rf /home/webhook-server

# Remove nginx config
rm -f /etc/nginx/sites-available/scriptblox-bot
rm -f /etc/nginx/sites-enabled/scriptblox-bot
nginx -t && systemctl reload nginx 2>/dev/null

# Show remaining PM2 processes
pm2 list

echo "✅ Cleanup complete! Bot removed from Digital Ocean."
echo "💡 Your Heroku deployment is ready to use instead."
```

### 8. Destroy Droplet (Optional)
If you no longer need the Digital Ocean droplet:
- Go to Digital Ocean Dashboard
- Select your droplet
- Click "Destroy"
- Type the droplet name to confirm

## Alternative: Keep Droplet for Other Projects
If you want to keep the droplet for other projects, just remove the bot files and PM2 processes as shown above.
