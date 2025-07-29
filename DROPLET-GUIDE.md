# Digital Ocean Droplet Deployment Guide

## Step 1: Create a Droplet

1. **Login to Digital Ocean**: https://cloud.digitalocean.com/
2. **Create Droplet**:
   - **Image**: Ubuntu 22.04 (LTS) x64
   - **Plan**: Basic - $6/month (1GB RAM, 1 vCPU, 25GB SSD)
   - **Datacenter**: Choose closest to your users
   - **Authentication**: SSH Key (recommended) or Password
   - **Hostname**: scriptblox-bot (or your choice)
   - **Enable**: Monitoring, IPv6 (optional)

3. **Wait for droplet creation** (1-2 minutes)

## Step 2: Connect to Your Droplet

```bash
# Replace YOUR_DROPLET_IP with your actual IP
ssh root@YOUR_DROPLET_IP
```

## Step 3: Run the Setup Script

```bash
# Download and run the setup script
wget https://raw.githubusercontent.com/wjybgnia/Bypasser-Bot/main/droplet-setup.sh
chmod +x droplet-setup.sh
./droplet-setup.sh
```

## Step 4: Configure Your Bot

```bash
# Edit environment variables
nano .env
```

Add your Discord credentials:
```env
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_application_client_id_here
NODE_ENV=production
```

## Step 5: Deploy and Start

```bash
# Deploy Discord commands
npm run deploy

# Start the bot with PM2
npm run pm2:start

# Save PM2 configuration for auto-restart
pm2 save
pm2 startup
# Follow the instructions shown by pm2 startup command
```

## Step 6: Verify Everything Works

```bash
# Check bot status
pm2 status

# View logs
pm2 logs scriptblox-discord-bot

# View real-time logs
pm2 logs scriptblox-discord-bot --follow
```

## Managing Your Bot

### Useful PM2 Commands
```bash
# Restart bot
pm2 restart scriptblox-discord-bot

# Stop bot
pm2 stop scriptblox-discord-bot

# View detailed info
pm2 show scriptblox-discord-bot

# Monitor resources
pm2 monit
```

### Update Your Bot
```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install --production

# Restart the bot
pm2 restart scriptblox-discord-bot
```

### Security Setup (Recommended)
```bash
# Enable firewall
ufw enable
ufw allow ssh
ufw allow 22/tcp

# Create non-root user (optional)
adduser botuser
usermod -aG sudo botuser
```

## Troubleshooting

### Bot Won't Start
```bash
# Check logs for errors
pm2 logs scriptblox-discord-bot

# Check if environment variables are set
cat .env

# Test bot manually
node src/index.js
```

### Discord Commands Not Working
```bash
# Redeploy commands
npm run deploy

# Check bot permissions in Discord server
```

### High Memory Usage
```bash
# Check resource usage
pm2 monit

# Restart if needed
pm2 restart scriptblox-discord-bot
```

## Cost Breakdown

- **Droplet**: $6/month (Basic plan)
- **Bandwidth**: 1TB included (more than enough)
- **Storage**: 25GB SSD (sufficient for bot)

## Backup Strategy

```bash
# Create backup script
echo '#!/bin/bash
cd /home/scriptblox-bot
git add .
git commit -m "Backup $(date)"
git push origin main' > backup.sh

chmod +x backup.sh

# Run weekly backups (cron)
crontab -e
# Add: 0 0 * * 0 /home/scriptblox-bot/backup.sh
```

## Support

- **Digital Ocean Docs**: https://docs.digitalocean.com/
- **PM2 Documentation**: https://pm2.keymetrics.io/docs/
- **Discord.js Guide**: https://discordjs.guide/

Your bot will now run 24/7 with automatic restarts and monitoring!
