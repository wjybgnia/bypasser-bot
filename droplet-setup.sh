#!/bin/bash

# ScriptBlox Discord Bot - Digital Ocean Droplet Setup Script
# Run this script on your fresh Ubuntu 22.04 droplet

set -e  # Exit on any error

echo "🚀 Setting up ScriptBlox Discord Bot on Digital Ocean Droplet..."
echo "=================================================="

# Update system packages
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
apt install -y curl wget git build-essential software-properties-common

# Install Node.js 18.x
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Verify installations
echo "✅ Verifying installations..."
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# Install PM2 globally
echo "🔄 Installing PM2 process manager..."
npm install -g pm2

# Create app directory
echo "📁 Creating application directory..."
cd /home
mkdir -p scriptblox-bot
cd scriptblox-bot

# Clone the repository
echo "📥 Cloning repository..."
git clone https://github.com/wjybgnia/Bypasser-Bot.git .

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install --production

# Create logs directory
mkdir -p logs

# Copy environment template
echo "🔧 Setting up environment configuration..."
cp .env.example .env

echo ""
echo "🎉 Setup Complete!"
echo "=================================================="
echo ""
echo "🔧 Next Steps:"
echo "1. Edit the environment file:"
echo "   nano .env"
echo ""
echo "2. Add your Discord bot credentials:"
echo "   DISCORD_TOKEN=your_bot_token_here"
echo "   CLIENT_ID=your_client_id_here"
echo ""
echo "3. Deploy Discord commands:"
echo "   npm run deploy"
echo ""
echo "4. Start the bot with PM2:"
echo "   npm run pm2:start"
echo ""
echo "5. Save PM2 configuration:"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "6. Check bot status:"
echo "   pm2 status"
echo "   pm2 logs scriptblox-discord-bot"
echo ""
echo "🔐 Security Tip: Consider setting up a firewall:"
echo "   ufw enable"
echo "   ufw allow ssh"
echo ""
echo "✅ Your ScriptBlox Discord Bot is ready to run!"
