const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Show help information for all available commands'),

	async execute(interaction) {
		try {
			const helpEmbed = {
				color: 0x00ff00,
				title: '🤖 ScriptBlox Discord Bot - Help',
				description: 'Complete guide to all available commands',
				fields: [
					{
						name: '🔍 Search Commands',
						value: '`/search <query>` - Search for scripts\n`/filter` - Advanced search with filters\n`/game <game>` - Get scripts for specific game',
						inline: false
					},
					{
						name: '📊 Browse Commands', 
						value: '`/featured` - Get featured scripts from homepage\n`/trending` - Browse trending scripts',
						inline: false
					},
					{
						name: '📋 Script Commands',
						value: '`/script <id>` - Get detailed script information\n`/raw <id>` - View raw script code',
						inline: false
					},
					{
						name: '⚙️ Utility Commands',
						value: '`/status` - Check API health and bot status\n`/help` - Show this help message',
						inline: false
					},
					{
						name: '🔗 Useful Links',
						value: '[ScriptBlox Website](https://scriptblox.com)\n[API Documentation](https://scriptblox.com/docs)\n[Bot Source Code](https://github.com/wjybgnia/Bypasser-Bot)',
						inline: false
					}
				],
				footer: {
					text: 'ScriptBlox Discord Bot | Made with Discord.js',
					icon_url: 'https://scriptblox.com/favicon.ico'
				},
				timestamp: new Date().toISOString()
			};

			await interaction.reply({ embeds: [helpEmbed] });
		} catch (error) {
			console.error('Error in help command:', error);
			await interaction.reply({
				content: '❌ An error occurred while showing help information.',
				ephemeral: true
			});
		}
	},
};
