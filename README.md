# ScriptBlox Discord Bot

A Discord bot that integrates with the ScriptBlox API to provide easy access to Roblox scripts directly from Discord.

## Features

- 🔍 **Advanced Search**: Search with multiple filters, sorting options, and relevance ranking
- ⭐ **Featured Scripts**: Get the latest featured scripts from ScriptBlox homepage
- � **Trending Scripts**: View community's most interactive scripts
- 🎮 **Game Scripts**: Find scripts for specific Roblox games
- 📜 **Script Details**: View detailed information about specific scripts
- 💻 **Raw Script Code**: View script code directly in Discord
- � **Advanced Filtering**: Filter scripts by type, verification status, key requirements, and more
- 📊 **Sorting Options**: Sort by views, likes, creation date, relevance, and more
- 🎯 **Search Matches**: See which parts of scripts matched your search query
- 🔐 **Key Links**: Direct access to script key pages when available
- 🔗 **Direct Links**: Quick access to ScriptBlox website
- 💡 **API Health**: Monitor ScriptBlox API status and compatibility

## Commands

| Command | Description | Usage | Parameters |
|---------|-------------|-------|------------|
| `/search` | Search for scripts with advanced filters | `/search <query>` | query, limit, mode, verified, key, universal, patched, strict, sortby, order |
| `/featured` | Get featured scripts from homepage | `/featured` | limit |
| `/trending` | Get community most interactive scripts | `/trending` | limit |
| `/game` | Get scripts for a specific game | `/game <game_id>` | game_id, limit |
| `/script` | Get detailed script information | `/script <script_id>` | script_id |
| `/raw` | Get raw script code | `/raw <script_id>` | script_id |
| `/status` | Check ScriptBlox API health status | `/status` | - |
| `/help` | Show comprehensive help information | `/help` | - |

## Quick Setup (Heroku)

### Prerequisites

- Node.js 16.0.0 or higher
- Discord Application and Bot Token
- ScriptBlox API access (optional for enhanced features)
### 🚀 Easy Deployment (Recommended)

**Option 1: Automated Script**
```bash
# Windows
.\deploy-heroku.bat

# Mac/Linux
chmod +x deploy-heroku.sh
./deploy-heroku.sh
```

**Option 2: Manual Heroku Deployment**
1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Login: `heroku login`
3. Create app: `heroku create your-bot-name`
4. Set environment variables:
   ```bash
   heroku config:set DISCORD_TOKEN=your_discord_bot_token
   heroku config:set CLIENT_ID=your_discord_client_id
   heroku config:set GUILD_ID=your_discord_guild_id_optional
   ```
5. Deploy: `git push heroku main`
6. Scale worker: `heroku ps:scale worker=1`

## Local Setup Instructions

### Prerequisites

- Node.js 16.0.0 or higher
- Discord Application and Bot Token
- Git

### Installation

1. **Clone and setup the project**:
   ```bash
   git clone https://github.com/wjybgnia/scriptblox-discord-bot.git
   cd scriptblox-discord-bot
   npm install
   ```

2. **Create a Discord Application**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to "Bot" section and create a bot
   - Copy the bot token
   - Note down the Application ID (Client ID)

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your values:
   ```env
   DISCORD_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_discord_application_id_here
   GUILD_ID=your_discord_server_id_here # Optional
   ```

4. **Invite the bot to your server**:
   - Go to Discord Developer Portal > Your App > OAuth2 > URL Generator
   - Select scopes: `bot` and `applications.commands`
   - Select bot permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`
   - Use the generated URL to invite your bot

5. **Deploy slash commands**:
   ```bash
   npm run deploy
   ```

6. **Start the bot**:
   ```bash
   npm start
   ```

### Development

For development with auto-restart:
```bash
npm run dev
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Discord bot token | ✅ |
| `CLIENT_ID` | Discord application ID | ✅ |
| `GUILD_ID` | Discord server ID (optional, for faster dev updates) | ❌ |

### Bot Permissions

The bot requires the following Discord permissions:
- Use Slash Commands
- Send Messages
- Embed Links
- Read Message History

## API Integration

This bot integrates with the ScriptBlox API to fetch:
- Advanced script search results with filters
- Featured scripts from homepage
- Trending community scripts
- Individual script details and raw code
- Game-specific scripts
- Script metadata (views, likes, author info)

### API Endpoints Used
- `/api/script/search` - Search scripts with advanced filters
- `/api/script/fetch` - Fetch scripts with sorting options
- `/api/script/trending` - Get community trending scripts
- `/api/script/:id` - Get individual script details
- `/api/script/raw/:id` - Get raw script code

## Deployment Options

### Heroku (Recommended)
- **Cost**: ~$5/month for Eco dyno
- **Pros**: Easy deployment, automatic scaling, built-in monitoring
- **Cons**: Requires payment (free tier discontinued)

### Local Hosting
- **Cost**: Free (uses your computer/server)
- **Pros**: No monthly cost, full control
- **Cons**: Requires keeping computer/server running 24/7
- Game-specific scripts
- Script metadata (views, likes, author info)

## Project Structure

```
src/
├── commands/           # Slash command handlers
│   ├── search.js      # Search scripts command
│   ├── featured.js    # Featured scripts command
│   ├── script.js      # Script details command
│   ├── game.js        # Game scripts command
│   └── help.js        # Help command
├── services/          # External service integrations
│   └── scriptblox.js  # ScriptBlox API service
├── index.js           # Main bot file
└── deploy-commands.js # Command deployment script
```

## Error Handling

The bot includes comprehensive error handling:
- API rate limiting protection
- Network error recovery
- Invalid input validation
- Graceful failure messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:
1. Check the issues section
2. Create a new issue with detailed information
3. Join our Discord server (if available)

## Disclaimer

This bot is not officially affiliated with ScriptBlox. It uses their public API to provide script information. Please respect their terms of service and rate limits.
