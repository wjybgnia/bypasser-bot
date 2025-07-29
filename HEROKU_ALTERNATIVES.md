# Alternative Heroku Deployment Methods

## ⚠️ Heroku CLI Installation Issue Detected

If you're having trouble with Heroku CLI, here are alternative deployment methods:

## Method 1: Manual Installation (Recommended)

### Download and Install Heroku CLI Manually
1. **Download**: Go to https://devcenter.heroku.com/articles/heroku-cli#download-and-install
2. **Choose Windows x64 Installer**: Download the `.exe` file
3. **Run installer**: Right-click → "Run as administrator"
4. **Restart terminal**: Close PowerShell and open a new one
5. **Test**: Run `heroku --version`

## Method 2: GitHub Integration (No CLI Required)

### Deploy via GitHub Integration (Easiest)
1. **Go to Heroku Dashboard**: https://dashboard.heroku.com/
2. **Create New App**: Click "New" → "Create new app"
3. **App Name**: Enter `your-scriptblox-bot-name`
4. **Connect GitHub**: 
   - Go to "Deploy" tab
   - Select "GitHub" as deployment method
   - Connect your GitHub account
   - Search for `scriptblox-discord-bot` repository
   - Click "Connect"

5. **Set Environment Variables**:
   - Go to "Settings" tab
   - Click "Reveal Config Vars"
   - Add these variables:
     ```
     DISCORD_TOKEN = your_discord_bot_token_here
     CLIENT_ID = your_discord_client_id_here
     GUILD_ID = your_discord_guild_id_here (optional)
     ```

6. **Deploy**:
   - Go back to "Deploy" tab
   - Scroll to "Manual deploy"
   - Select "main" branch
   - Click "Deploy Branch"

7. **Scale Worker**:
   - Go to "Resources" tab
   - Turn off "web" dyno (slide to off)
   - Turn on "worker" dyno (slide to on)
   - Click "Confirm"

## Method 3: Fix Heroku CLI

### Troubleshooting Steps
```powershell
# 1. Uninstall current version
Remove-Item "C:\\Program Files\\heroku" -Recurse -Force -ErrorAction SilentlyContinue

# 2. Download latest version
Invoke-WebRequest -Uri "https://cli-assets.heroku.com/install-windows.ps1" -OutFile "install-heroku.ps1"

# 3. Run installer with admin privileges
Start-Process powershell -Verb runAs -ArgumentList "-ExecutionPolicy Bypass -File install-heroku.ps1"

# 4. Restart terminal and test
heroku --version
```

## Method 4: Alternative Platforms

### Deploy to Railway (Heroku Alternative)
1. **Go to**: https://railway.app/
2. **Connect GitHub**: Link your repository
3. **Deploy**: Automatic deployment from GitHub
4. **Cost**: $5/month for hobby plan

### Deploy to Render (Heroku Alternative)
1. **Go to**: https://render.com/
2. **Create Web Service**: Connect GitHub repository  
3. **Cost**: $7/month for basic plan

## ✅ Recommended: GitHub Integration Method

The **GitHub Integration method (Method 2)** is the easiest and doesn't require CLI installation. It provides:
- ✅ Automatic deployments when you push to GitHub
- ✅ Easy environment variable management
- ✅ Built-in monitoring and logs
- ✅ No command line required

## Need Help?

If you choose the GitHub integration method, I can guide you through each step!
