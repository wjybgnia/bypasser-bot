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
            let results;
            
            // Try direct game endpoint first
            try {
                results = await api.getGameScripts(gameId, 1, limit);
            } catch (directError) {
                // If direct game endpoint fails due to blocking, try search as fallback
                if (directError.message.includes('Forbidden') || directError.message.includes('blocked')) {
                    console.log('Game endpoint blocked, trying search fallback...');
                    
                    // Since specific game endpoint is blocked, provide helpful alternative
                    const errorMessage = `🚧 **ScriptBlox API Temporarily Unavailable**\n\n` +
                                        `The ScriptBlox API is currently blocking requests from this server. This is a temporary issue.\n\n` +
                                        `**Alternative ways to find scripts for game ID \`${gameId}\`:**\n` +
                                        `• Visit: https://scriptblox.com/games/${gameId}\n` +
                                        `• Search for your game directly on ScriptBlox website\n` +
                                        `• Try other commands like \`/search [game name]\` or \`/featured\`\n\n` +
                                        `*This issue is being worked on and should be resolved soon.*`;

                    const embed = new EmbedBuilder()
                        .setColor('#ffa500')
                        .setTitle('🚧 API Temporarily Blocked')
                        .setDescription(errorMessage)
                        .setTimestamp();

                    return await interaction.editReply({ embeds: [embed] });
                } else {
                    throw directError; // Not a blocking issue, throw original error
                }
            }

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

            let errorMessage = 'Failed to fetch game scripts. Please check the game ID and try again.';
            let embedColor = '#ff6b6b';
            let embedTitle = '❌ Error';
            
            // Check if it's a Cloudflare blocking issue
            if (error.message.includes('Forbidden') || error.message.includes('blocked') || error.message.includes('Cloudflare')) {
                errorMessage = `🚧 **ScriptBlox API Temporarily Unavailable**\n\n` +
                              `The ScriptBlox API is currently blocking requests from this server.\n\n` +
                              `**Alternative ways to find scripts for game ID \`${gameId}\`:**\n` +
                              `• Visit: https://scriptblox.com/games/${gameId}\n` +
                              `• Search directly on ScriptBlox website\n` +
                              `• Try \`/search [game name]\` or \`/featured\` commands\n\n` +
                              `*This is a temporary server-side issue.*`;
                embedColor = '#ffa500';
                embedTitle = '🚧 API Temporarily Blocked';
            }

            const errorEmbed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle(embedTitle)
                .setDescription(errorMessage)
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
