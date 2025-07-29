# Heroku Deployment Guide for ScriptBlox Discord Bot

## Prerequisites
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Create a Heroku account: https://signup.heroku.com/

## Deployment Steps

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create Heroku App
```bash
heroku create your-scriptblox-bot-name
```

### 3. Set Environment Variables
```bash
heroku config:set DISCORD_TOKEN=your_discord_bot_token
heroku config:set CLIENT_ID=your_discord_client_id
heroku config:set GUILD_ID=your_discord_guild_id
```

### 4. Deploy to Heroku
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 5. Scale the Worker
```bash
heroku ps:scale worker=1
```

### 6. View Logs
```bash
heroku logs --tail
```

### 7. Enable Auto-Deploy (Optional but Recommended)
**Via Heroku Dashboard:**
1. Go to https://dashboard.heroku.com/apps/your-app-name
2. Click "Deploy" tab
3. Under "Deployment method", connect to GitHub
4. Search and connect your repository
5. In "Automatic deploys" section:
   - Select branch: `main`
   - Click "Enable Automatic Deploys"

**Result:** Every `git push origin main` will auto-deploy to Heroku!

## Environment Variables Required
- `DISCORD_TOKEN`: Your Discord bot token
- `CLIENT_ID`: Your Discord application client ID  
- `GUILD_ID`: Your Discord server ID (optional, for guild-specific commands)

## Heroku Configuration
- **Dyno Type**: Worker (not web)
- **Buildpack**: Node.js (auto-detected)
- **Node Version**: >=16.0.0 (specified in package.json)

## Commands to Deploy
```bash
# From your project directory
heroku create scriptblox-discord-bot-[unique-name]
heroku config:set DISCORD_TOKEN=your_token_here
heroku config:set CLIENT_ID=your_client_id_here
git push heroku main
heroku ps:scale worker=1

# Enable auto-deploy via dashboard for future updates
# Go to: https://dashboard.heroku.com/apps/your-app-name
# Deploy tab → Connect GitHub → Enable Automatic Deploys
```

## Auto-Deploy Workflow
Once auto-deploy is enabled:
```bash
# Make changes to your bot
git add .
git commit -m "Update bot features"
git push origin main  # This triggers automatic Heroku deployment!
```

**No more manual `git push heroku main` needed!**

## Cost
- Heroku Eco dynos: $5/month (550-1000 dyno hours)
- Free tier discontinued as of November 2022
