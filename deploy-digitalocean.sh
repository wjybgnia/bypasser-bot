#!/bin/bash

# Digital Ocean Deployment Script for ScriptBlox Discord Bot
echo "🚀 Deploying ScriptBlox Discord Bot to Digital Ocean..."

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ doctl CLI not found. Please install it first:"
    echo "   Visit: https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
fi

# Check if user is authenticated
if ! doctl auth list &> /dev/null; then
    echo "❌ Not authenticated with Digital Ocean. Please run:"
    echo "   doctl auth init"
    exit 1
fi

echo "✅ Digital Ocean CLI ready"

# Create the app
echo "📦 Creating Digital Ocean App..."
doctl apps create .do/app.yaml

echo "🔧 Next steps:"
echo "1. Go to your Digital Ocean dashboard: https://cloud.digitalocean.com/apps"
echo "2. Find your new app and configure environment variables:"
echo "   - DISCORD_TOKEN: Your bot token"
echo "   - CLIENT_ID: Your Discord application client ID"
echo "3. Deploy the app"
echo ""
echo "✅ Deployment configuration complete!"
