# Digital Ocean Deployment Guide

## Prerequisites

1. **Digital Ocean Account**: Sign up at https://digitalocean.com
2. **doctl CLI**: Install from https://docs.digitalocean.com/reference/doctl/how-to/install/
3. **GitHub Repository**: Your code is already pushed to https://github.com/wjybgnia/Bypasser-Bot

## Deployment Methods

### Option 1: App Platform (Recommended - Easiest)

1. **Authenticate with Digital Ocean**:
   ```bash
   doctl auth init
   ```

2. **Deploy using the script**:
   ```bash
   # Windows
   deploy-digitalocean.bat
   
   # Linux/Mac
   chmod +x deploy-digitalocean.sh
   ./deploy-digitalocean.sh
   ```

3. **Configure Environment Variables** in the Digital Ocean dashboard:
   - `DISCORD_TOKEN`: Your Discord bot token
   - `CLIENT_ID`: Your Discord application client ID

### Option 2: Manual App Platform Setup

1. Go to https://cloud.digitalocean.com/apps
2. Click "Create App"
3. Connect your GitHub repository `wjybgnia/Bypasser-Bot`
4. Use these settings:
   - **Source**: GitHub repository
   - **Branch**: main
   - **Build Command**: npm install
   - **Run Command**: node src/index.js
   - **Environment**: Node.js
   - **Plan**: Basic ($5/month)

### Option 3: Droplet (VPS) Deployment

1. **Create a Droplet**:
   - Ubuntu 22.04 LTS
   - Basic plan ($6/month)
   - Enable monitoring

2. **SSH into your droplet**:
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs
   ```

4. **Clone and setup your bot**:
   ```bash
   git clone https://github.com/wjybgnia/Bypasser-Bot.git
   cd Bypasser-Bot
   npm install
   ```

5. **Configure environment**:
   ```bash
   cp .env.example .env
   nano .env
   # Add your DISCORD_TOKEN and CLIENT_ID
   ```

6. **Install PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name "scriptblox-bot"
   pm2 save
   pm2 startup
   ```

## Environment Variables Required

- `DISCORD_TOKEN`: Your Discord bot token from https://discord.com/developers/applications
- `CLIENT_ID`: Your Discord application client ID
- `NODE_ENV`: production (set automatically)

## Monitoring and Logs

### App Platform
- View logs in the Digital Ocean dashboard
- Automatic scaling and health checks

### Droplet
```bash
# View PM2 status
pm2 status

# View logs
pm2 logs scriptblox-bot

# Restart bot
pm2 restart scriptblox-bot
```

## Cost Estimate

- **App Platform**: $5/month (basic plan)
- **Droplet**: $6/month (basic droplet)

Both options include:
- 24/7 uptime
- Automatic restarts
- Monitoring
- SSL certificates

## Support

If you encounter issues:
1. Check the Digital Ocean documentation
2. Review bot logs for errors
3. Verify environment variables are set correctly
4. Ensure Discord bot permissions are configured
