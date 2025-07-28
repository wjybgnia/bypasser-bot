const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get all command files
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => 
    file.endsWith('.js') && 
    !file.includes('-') && 
    !file.includes('2') && 
    !file.includes('new') && 
    !file.includes('info') &&
    !file.includes('.bak')
);

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Deploy commands
const deployCommands = async () => {
    try {
        const token = process.env.DISCORD_TOKEN;
        const clientId = process.env.CLIENT_ID;
        const guildId = process.env.GUILD_ID; // Optional: for guild-specific commands

        if (!token) {
            console.error('❌ No Discord token provided! Please set DISCORD_TOKEN in your .env file');
            return;
        }

        if (!clientId) {
            console.error('❌ No client ID provided! Please set CLIENT_ID in your .env file');
            return;
        }

        const rest = new REST().setToken(token);

        console.log(`🚀 Started refreshing ${commands.length} application (/) commands.`);

        let data;
        if (guildId) {
            // Deploy to specific guild (faster for development)
            data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );
            console.log(`✅ Successfully reloaded ${data.length} guild application (/) commands.`);
        } else {
            // Deploy globally (takes up to 1 hour to update)
            data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );
            console.log(`✅ Successfully reloaded ${data.length} global application (/) commands.`);
        }

    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
};

// Run if called directly
if (require.main === module) {
    deployCommands();
}

module.exports = { deployCommands };
