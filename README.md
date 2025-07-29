# ScriptBlox Discord Bot

A powerful Discord bot that integrates with the ScriptBlox API to provide comprehensive Roblox script search, browsing, and information features.

## 🚀 Features

- **🔍 Advanced Script Search** - Search scripts with filters (game, type, verification status)
- **📈 Trending Scripts** - Browse community trending scripts with pagination
- **📋 Script Details** - Get comprehensive script information and metadata
- **💻 Raw Script Access** - View and copy raw script code directly
- **🎮 Game-Specific Scripts** - Find scripts for specific Roblox games
- **📚 Interactive Help** - Comprehensive command documentation
- **🎨 Rich Embeds** - Beautiful Discord embeds with interactive buttons
- **⚡ Real-time Updates** - Latest data from ScriptBlox API

## 📦 Installation

### Prerequisites
- **Node.js** 16.0.0 or higher
- **Discord Application** with bot permissions
- **Git** (for cloning)

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/wjybgnia/scriptblox-discord-bot.git
   cd scriptblox-discord-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Discord bot credentials:
   ```env
   DISCORD_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_discord_application_client_id_here
   GUILD_ID=your_discord_server_id_here  # Optional: for faster dev deployment
   ```

4. **Deploy slash commands**
   ```bash
   npm run deploy
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | ✅ | Your Discord bot token from Discord Developer Portal |
| `CLIENT_ID` | ✅ | Your Discord application client ID |
| `GUILD_ID` | ❌ | Your Discord server ID (speeds up command deployment) |
| `SCRIPTBLOX_API_BASE` | ❌ | ScriptBlox API base URL (default: https://scriptblox.com/api) |
| `SCRIPTBLOX_API_KEY` | ❌ | ScriptBlox API key (if required) |

## 🎯 Commands

| Command | Description | Parameters |
|---------|-------------|------------|
| `/search` | Search for scripts with advanced filters | query, limit, game, scripttype, verified |
| `/trending` | Get community most interactive scripts | limit |
| `/game` | Get scripts for a specific game | game, limit |
| `/script` | Get detailed script information | script_id |
| `/raw` | Get raw script code | script_id |
| `/help` | Show comprehensive help information | - |

### `/search` - Advanced Script Search
Search for scripts with powerful filtering options:
- **Query**: Script name or description keywords
- **Game**: Filter by specific Roblox game
- **Script Type**: Free, Paid, or Any
- **Verified Only**: Show only verified scripts
- **Max Results**: Limit number of results (1-20)

### `/trending` - Trending Scripts
Browse community trending scripts with:
- **Limit**: Number of scripts to show (1-10)
- **Interactive Navigation**: Browse through pages
- **Rich Metadata**: Views, likes, verification status

### `/script` - Detailed Script Information
Get comprehensive details about any script:
- **Script ID**: Enter the ScriptBlox script ID
- **Complete Metadata**: Author, game, stats, creation date
- **Interactive Buttons**: View code, visit page

### `/raw` - Raw Script Code
View and copy raw script code:
- **Script ID**: Enter the ScriptBlox script ID
- **Formatted Display**: Clean code presentation
- **Copy-Friendly**: Easy to copy and use

### `/game` - Game-Specific Scripts
Find scripts for specific Roblox games:
- **Game Name**: Search by game title
- **Filtered Results**: Only scripts for that game
- **Verification Filters**: Show verified scripts only

### `/help` - Interactive Help
Comprehensive command documentation with:
- **Command Explanations**: Detailed usage instructions
- **Parameter Guides**: Required and optional parameters
- **Example Usage**: Practical command examples

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Project Structure
```
src/
├── commands/           # Discord slash commands
│   ├── search.js      # Script search functionality
│   ├── trending.js    # Trending scripts
│   ├── script.js      # Script details
│   ├── raw.js         # Raw script code
│   ├── game.js        # Game-specific scripts
│   └── help.js        # Help command
├── services/
│   └── scriptblox.js  # ScriptBlox API integration
├── deploy-commands.js # Command deployment utility
└── index.js          # Bot main entry point
```

### Available Scripts
- `npm start` - Start the bot in production mode
- `npm run dev` - Start with auto-restart (development)
- `npm run deploy` - Deploy slash commands to Discord
- `npm test` - Run tests (not implemented)

## 🔗 API Integration

This bot integrates with the official ScriptBlox API endpoints:

- **`/script/search`** - Advanced script search with filters
- **`/script/trending`** - Community trending scripts
- **`/script/:id`** - Individual script details
- **`/script/raw/:id`** - Raw script content
- **`/script/fetch`** - Fetch scripts with game filters

All endpoints are fully documented and compliant with the [ScriptBlox API Documentation](https://scriptblox.com/docs).

## 🚀 Deployment

### Local Development
1. Follow the installation steps above
2. Use `npm run dev` for development with auto-restart
3. Test commands in your Discord server

### Production Deployment
1. Set up a VPS or cloud server
2. Clone the repository and install dependencies
3. Configure environment variables
4. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name scriptblox-bot
   ```

### Heroku Deployment
The project includes Heroku deployment scripts:
```bash
./deploy-heroku.bat  # Windows
./deploy-heroku.sh   # Linux/Mac
```

## 🎮 Bot Permissions

The bot requires the following Discord permissions:
- **Use Slash Commands** - For command functionality
- **Send Messages** - To respond to commands
- **Embed Links** - For rich script displays
- **Read Message History** - For interaction handling

## 📋 Getting Discord Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Bot" section and click "Add Bot"
4. Copy the bot token (keep it secret!)
5. Under "Privileged Gateway Intents", enable if needed
6. Go to OAuth2 > URL Generator:
   - Scopes: `bot` and `applications.commands`
   - Permissions: `Send Messages`, `Use Slash Commands`, `Embed Links`
   - Use generated URL to invite bot to your server

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and structure
- Test all commands thoroughly before submitting
- Update documentation for new features
- Ensure API compliance with ScriptBlox documentation

## 🔧 Troubleshooting

### Common Issues

**Bot not responding to commands:**
- Check bot is online and has proper permissions
- Verify slash commands are deployed (`npm run deploy`)
- Check console for error messages

**API errors:**
- ScriptBlox API may be temporarily down
- Check your internet connection
- Verify API endpoints in documentation

**Environment variable errors:**
- Double-check `.env` file exists and has correct values
- Ensure no spaces around the `=` sign
- Restart bot after changing environment variables

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/wjybgnia/scriptblox-discord-bot/issues)
- **Documentation**: [ScriptBlox API Docs](https://scriptblox.com/docs)
- **Discord.js Guide**: [Discord.js Documentation](https://discord.js.org/)

## ⚠️ Disclaimer

This bot is not officially affiliated with ScriptBlox or Roblox Corporation. It uses the public ScriptBlox API to provide script information. Please respect their terms of service and rate limits.

## 🎉 Acknowledgments

- **ScriptBlox** for providing the comprehensive Roblox script API
- **Discord.js** for the excellent Discord bot framework
- **Roblox Community** for script sharing and development

---

**Made with ❤️ for the Roblox scripting community**
