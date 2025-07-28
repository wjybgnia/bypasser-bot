const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ScriptBloxAPI = require('../services/scriptblox');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Get scripts for a specific game')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Game ID (Roblox game ID)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('limit')
                .setDescription('Number of scripts to show (1-20)')
                .setMinValue(1)
                .setMaxValue(20)
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();

        const gameId = interaction.options.getString('id');
        const limit = interaction.options.getInteger('limit') || 5;

        try {
            const api = new ScriptBloxAPI();
            const results = await api.getGameScripts(gameId, 1, limit);

            if (!results.result || !results.result.scripts || results.result.scripts.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('🎮 Game Scripts')
                    .setDescription(`No scripts found for game ID: ${gameId}`)
                    .setTimestamp();

                return await interaction.editReply({ embeds: [embed] });
            }

            const scripts = results.result.scripts.slice(0, limit);
            const embeds = [];

            for (const script of scripts) {
                const formatted = api.formatScript(script);
                
                const embed = new EmbedBuilder()
                    .setColor('#6c5ce7')
                    .setTitle(`📜 ${formatted.title}`)
                    .setURL(formatted.url)
                    .setDescription(formatted.description.length > 200 
                        ? formatted.description.substring(0, 200) + '...' 
                        : formatted.description)
                    .addFields(
                        { name: '🎮 Game', value: formatted.game, inline: true },
                        { name: '👤 Author', value: formatted.owner, inline: true },
                        { name: '👁️ Views', value: formatted.views.toString(), inline: true },
                        { name: '👍 Likes', value: formatted.likes.toString(), inline: true },
                        { name: '👎 Dislikes', value: formatted.dislikes.toString(), inline: true },
                        { name: '✅ Verified', value: formatted.verified ? 'Yes' : 'No', inline: true }
                    )
                    .setFooter({ text: `Script ID: ${formatted.id}` })
                    .setTimestamp();

                if (formatted.key) {
                    embed.addFields({ name: '🔐 Key Required', value: 'Yes', inline: true });
                }

                embeds.push(embed);
            }

            // Send main embed with game info
            const mainEmbed = new EmbedBuilder()
                .setColor('#6c5ce7')
                .setTitle('🎮 Game Scripts')
                .setDescription(`Found ${results.result.scripts.length} scripts for game ID: ${gameId}\nShowing ${scripts.length} results`)
                .setTimestamp();

            await interaction.editReply({ embeds: [mainEmbed, ...embeds] });

        } catch (error) {
            console.error('Game command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Error')
                .setDescription('Failed to fetch game scripts. Please check the game ID and try again.')
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
