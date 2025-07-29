# ScriptBlox Discord Bot - Command Testing Guide

## Bot Deployment Status ✅
- **GitHub Repository**: https://github.com/wjybgnia/scriptblox-discord-bot
- **Digital Ocean Server**: 157.230.40.134 (Ubuntu 22.04)
- **Auto-Update System**: ✅ Active via GitHub webhooks
- **Process Management**: PM2 with auto-restart

## Available Commands

### 1. `/search [query]` ✅ **WORKING**
- Searches for scripts by name/description
- Example: `/search Arsenal` or `/search auto farm`
- **Status**: No blocking issues detected

### 2. `/featured` ✅ **WORKING**  
- Shows featured/trending scripts
- **Status**: No blocking issues detected

### 3. `/trending` ✅ **WORKING**
- Shows currently trending scripts  
- **Status**: No blocking issues detected

### 4. `/game [id]` ⚠️ **IMPROVED WITH FALLBACK**
- Gets scripts for specific game ID
- Now uses intelligent search fallback when direct API is blocked
- Example: `/game 155615604` or `/game Arsenal`
- **Status**: Enhanced to work around Cloudflare blocking

### 5. `/random` ⚠️ **MAY BE AFFECTED**
- Shows random scripts
- **Status**: May experience intermittent blocking

### 6. `/help` ✅ **ALWAYS WORKING**
- Shows bot help information
- **Status**: Local command, no API dependency

### 7. `/ping` ✅ **ALWAYS WORKING**
- Tests bot responsiveness
- **Status**: Local command, no API dependency

### 8. `/stats` ✅ **ALWAYS WORKING**
- Shows bot statistics
- **Status**: Local command, no API dependency

### 9. `/info` ✅ **ALWAYS WORKING**
- Shows detailed script information
- **Status**: Local command, no API dependency

## Current Issues & Solutions

### Cloudflare IP Blocking
**Problem**: ScriptBlox's Cloudflare protection occasionally blocks the server IP (157.230.40.134)

**Current Solutions**:
1. ✅ Search fallback in `/game` command
2. ✅ Browser-like headers to mimic real users
3. ✅ Intelligent error handling with helpful alternatives
4. ✅ Multiple endpoint redundancy

**Working Around Issues**:
- If `/game [id]` doesn't work, try `/search [game name]` instead
- Use `/featured` or `/trending` to discover popular scripts
- Direct website links provided in error messages

## Testing Commands

To test the bot, try these commands in Discord:

```
/ping
/help
/search Adopt Me
/featured
/trending
/game 920587237
```

## Auto-Update Status

The bot automatically updates when code is pushed to GitHub:
- ✅ Webhook server running on port 3001
- ✅ GitHub webhook configured and active
- ✅ PM2 process restart on updates
- ✅ No manual deployment needed

## Troubleshooting

If commands aren't working:
1. Check if the bot is online in Discord
2. Try `/ping` to test basic connectivity
3. Use `/search` instead of `/game` for finding scripts
4. Visit the ScriptBlox website directly as an alternative

Last updated: July 29, 2025
