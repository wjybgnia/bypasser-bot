const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const commands = [];
const foldersPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ Loaded command: ${command.data.name}`);
    } else {
        console.log(`❌ Warning: Command at ${filePath} is missing "data" or "execute" property.`);
    }
}

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log(`🚀 Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
        
        // List all deployed commands
        console.log('\n📋 Deployed commands:');
        commands.forEach(command => {
            console.log(`   • /${command.name} - ${command.description}`);
        });
        
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
})();
