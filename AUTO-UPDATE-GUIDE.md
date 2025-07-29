# Auto-Update Setup Guide

## 🚨 **WEBHOOK TROUBLESHOOTING - SIGNATURE ISSUE IDENTIFIED**

The webhook server is **WORKING** and receiving GitHub requests, but failing signature verification.

### 🔍 **Current Status:**
- ✅ Webhook server listening on port 3001
- ✅ GitHub sending push events to server  
- ❌ Signature verification failing

### 🔧 **REQUIRED FIX:**

**GitHub Webhook Settings:** `https://github.com/wjybgnia/Bypasser-Bot/settings/hooks`

1. **Payload URL**: `http://157.230.40.134:3001/webhook` ✅
2. **Content Type**: **`application/json`** ⚠️ **CRITICAL - Must be JSON!**
3. **Secret**: `scriptblox-webhook-secret-2025` ✅  
4. **Events**: Push events ✅
5. **Active**: Enabled ✅

### 📋 **Most Common Issue:**
Content Type set to `application/x-www-form-urlencoded` instead of `application/json`

### 🧪 **Test Results:**
- Webhook server: ONLINE and receiving requests
- Signature verification: FAILING (wrong content type suspected)
- Auto-update system: Ready once signature fixed

---

## 🚀 Auto-Update System Setup Guide
This guide sets up automatic updates for your ScriptBlox Discord bot whenever you push changes to your GitHub repository.

## Method 1: GitHub Webhook + Simple Server (Recommended)

### Step 1: Setup Webhook Server on Your Droplet

1. **Create webhook server script** (already provided in `webhook-update.sh`)
2. **Install webhook dependencies**:
   ```bash
   ssh root@157.230.40.134 "cd /home/scriptblox-bot && npm install express crypto"
   ```

3. **Create webhook server**:
   ```bash
   ssh root@157.230.40.134 "cd /home/scriptblox-bot && node webhook-server.js"
   ```

### Step 2: Configure GitHub Webhook

1. Go to your repository: https://github.com/wjybgnia/scriptblox-discord-bot
2. Click **Settings** → **Webhooks** → **Add webhook**
3. Configure:
   - **Payload URL**: `http://YOUR_DROPLET_IP:3001/webhook`
   - **Content type**: `application/json`
   - **Secret**: Use a strong secret (save it for later)
   - **Events**: Select "Just the push event"
   - **Active**: ✅ Checked

### Step 3: Setup Environment Variables
```bash
ssh root@157.230.40.134 "cd /home/scriptblox-bot && echo 'WEBHOOK_SECRET=your_secret_here' >> .env"
```

## Method 2: Cron Job Auto-Update (Simple Alternative)

### Setup Automatic Git Pull Every 5 Minutes
```bash
ssh root@157.230.40.134 "cd /home/scriptblox-bot && chmod +x auto-update.sh"
ssh root@157.230.40.134 "crontab -e"
# Add this line:
# */5 * * * * /home/scriptblox-bot/auto-update.sh
```

## Method 3: GitHub Actions (Advanced)

### Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Digital Ocean
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.PRIVATE_KEY }}
        script: |
          cd /home/scriptblox-bot
          git pull origin main
          npm install --production
          pm2 restart scriptblox-discord-bot
```

## Security Considerations

1. **Firewall setup**:
   ```bash
   ssh root@157.230.40.134 "ufw allow 3001/tcp"
   ```

2. **Use HTTPS webhook URL** (recommended with reverse proxy)

3. **Verify webhook signatures** for security

## Testing Your Auto-Update

1. **Make a small change** to your bot code locally
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Test auto-update"
   git push origin main
   ```
3. **Check if bot updated**:
   ```bash
   ssh root@157.230.40.134 "pm2 logs scriptblox-discord-bot"
   ```

## Monitoring Auto-Updates

### Check update logs:
```bash
ssh root@157.230.40.134 "tail -f /home/scriptblox-bot/update.log"
```

### Manual update trigger:
```bash
ssh root@157.230.40.134 "cd /home/scriptblox-bot && ./auto-update.sh"
```

## Rollback Strategy

If an update breaks something:
```bash
ssh root@157.230.40.134 "cd /home/scriptblox-bot && git reset --hard HEAD~1 && pm2 restart scriptblox-discord-bot"
```

Choose the method that best fits your needs:
- **Method 1**: Instant updates with webhooks
- **Method 2**: Simple cron-based updates every 5 minutes  
- **Method 3**: GitHub Actions for advanced CI/CD
