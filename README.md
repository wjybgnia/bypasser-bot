# Sc## Features

- 🔍 **Advanced Search**: Search with multiple filters, sorting options, and relevance ranking
- ⭐ **Featured Scripts**: Get the latest featured scripts
- 🔧 **Advanced Filtering**: Filter scripts by type, verification status, key requirements, and more
- 📜 **Script Details**: View detailed information about specific scripts
- 🎮 **Game Scripts**: Find scripts for specific Roblox games
- 💻 **Script Code**: View script code directly in Discord (with button interaction)
- 📊 **Sorting Options**: Sort by views, likes, creation date, relevance, and more
- 🎯 **Search Matches**: See which parts of scripts matched your search query
- 🔐 **Key Links**: Direct access to script key pages when available
- 🔗 **Direct Links**: Quick access to ScriptBlox websiteiscord Bot

A Discord bot that integrates with the ScriptBlox API to provide easy access to Roblox scripts directly from Discord.

## Features

- 🔍 **Search Scripts**: Search for scripts using keywords
- ⭐ **Featured Scripts**: Get the latest featured scripts
- � **Advanced Filtering**: Filter scripts by type, verification status, key requirements, and more
- �📜 **Script Details**: View detailed information about specific scripts
- 🎮 **Game Scripts**: Find scripts for specific Roblox games
- 💻 **Script Code**: View script code directly in Discord (with button interaction)
- 📊 **Sorting Options**: Sort by views, likes, creation date, and more
- 🔗 **Direct Links**: Quick access to ScriptBlox website

## Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/search` | Search for scripts | `/search <query> [limit]` |
| `/featured` | Get featured scripts | `/featured [limit]` |
| `/script` | Get script details | `/script <id>` |
| `/game` | Get scripts for a game | `/game <game_id> [limit]` |
| `/help` | Show help information | `/help` |

## Setup Instructions

### Prerequisites

- Node.js 16.0.0 or higher
- Discord Application and Bot Token
- ScriptBlox API access (optional for enhanced features)

### Installation

1. **Clone and setup the project**:
   ```bash
   git clone <your-repo-url>
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
   GUILD_ID=your_discord_server_id_here # Optional: for faster command updates during development
   SCRIPTBLOX_API_BASE=https://scriptblox.com/api
   SCRIPTBLOX_API_KEY=your_scriptblox_api_key_here # Optional: for enhanced rate limits
   PREFIX=!
   OWNER_ID=your_discord_user_id_here
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
| `GUILD_ID` | Discord server ID (for dev) | ❌ |
| `SCRIPTBLOX_API_BASE` | ScriptBlox API base URL | ❌ |
| `SCRIPTBLOX_API_KEY` | ScriptBlox API key | ❌ |
| `PREFIX` | Bot prefix for text commands | ❌ |
| `OWNER_ID` | Bot owner Discord ID | ❌ |

### Bot Permissions

The bot requires the following Discord permissions:
- Use Slash Commands
- Send Messages
- Embed Links

## API Integration

This bot integrates with the ScriptBlox API to fetch:
- Script search results
- Featured scripts
- Individual script details
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
