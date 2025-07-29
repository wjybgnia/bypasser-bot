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
                results = await api.getGameScripts(gameId, { max: limit });
            } catch (directError) {
                // If direct game endpoint fails, try search as fallback
                console.log('Game endpoint failed, trying search fallback...');
                
                try {
                    // Search for scripts related to the game ID
                    // This might find scripts if the gameId is in the title or description
                    results = await api.searchScripts(gameId, 1, limit);
                    
                    if (results && results.scripts && results.scripts.length > 0) {
                        // Filter to prioritize exact game ID matches
                        const exactMatches = results.scripts.filter(script => 
                            script.game && script.game.gameId == gameId
                        );
                        
                        if (exactMatches.length > 0) {
                            results.scripts = exactMatches.slice(0, limit);
                            console.log(`Found ${exactMatches.length} exact game ID matches via search`);
                        } else {
                            // Keep all search results if no exact matches
                            results.scripts = results.scripts.slice(0, limit);
                            console.log(`Found ${results.scripts.length} potential matches via search`);
                        }
                    } else {
                        throw new Error('No scripts found via search fallback');
                    }
                } catch (searchError) {
                    console.log('Search fallback also failed:', searchError.message);
                    
                    // Both methods failed, show helpful error message
                    const errorMessage = `🚧 **Unable to Fetch Game Scripts**\n\n` +
                                        `Could not retrieve scripts for game ID \`${gameId}\`. This may be due to:\n` +
                                        `• Server-side API blocking\n` +
                                        `• Invalid or non-existent game ID\n` +
                                        `• Temporary service unavailability\n\n` +
                                        `**Alternative solutions:**\n` +
                                        `• Visit: https://scriptblox.com/\n` +
                                        `• Search for your game name using \`/search [game name]\`\n` +
                                        `• Try browsing \`/featured\` or \`/trending\` scripts\n` +
                                        `• Use a valid Roblox place ID (numbers only)\n\n` +
                                        `*For Roblox place IDs, you can find them in the game URL.*`;

                    const embed = new EmbedBuilder()
                        .setColor('#ff6b6b')
                        .setTitle('❌ Game Scripts Unavailable')
                        .setDescription(errorMessage)
                        .setTimestamp();

                    return await interaction.editReply({ embeds: [embed] });
                }
            }

            // Check if we used search fallback (results.scripts exists instead of results.result.scripts)
            const usedSearchFallback = results.scripts && !results.result;
            const scriptsArray = usedSearchFallback ? results.scripts : results.result.scripts;
            const displayLimit = Math.min(scriptsArray.length, limit);
            
            if (!scriptsArray || scriptsArray.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('🎮 Game Scripts')
                    .setDescription(`No scripts found for game ID: ${gameId}`)
                    .setTimestamp();

                return await interaction.editReply({ embeds: [embed] });
            }

            const scripts = scriptsArray.slice(0, limit);
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
                        { name: '� Script ID', value: formatted.id, inline: true },
                        { name: '�🎮 Game', value: formatted.game, inline: true },
                        { name: '👤 Author', value: formatted.owner, inline: true },
                        { name: '👁️ Views', value: formatted.views.toString(), inline: true },
                        { name: '👍 Likes', value: formatted.likes.toString(), inline: true },
                        { name: '👎 Dislikes', value: formatted.dislikes.toString(), inline: true },
                        { name: '✅ Verified', value: formatted.verified ? 'Yes' : 'No', inline: true },
                        { name: '🔑 Key Required', value: formatted.key ? 'Yes' : 'No', inline: true },
                        { name: '💰 Script Type', value: formatted.scriptType, inline: true },
                        { name: '🌐 Universal', value: formatted.isUniversal ? 'Yes' : 'No', inline: true },
                        { name: '🔧 Patched', value: formatted.isPatched ? 'Yes' : 'No', inline: true },
                        { name: '� Created', value: formatted.createdAt ? new Date(formatted.createdAt).toLocaleDateString() : 'Unknown', inline: true }
                    )
                    .setFooter({ text: `Game Script ${index + 1} of ${scripts.length}` })
                    .setTimestamp();

                embeds.push(embed);
            }

            // Send main embed with game info
            const mainDescription = usedSearchFallback 
                ? `Found scripts via search for: ${gameId}\nShowing ${displayLimit} results\n\n*Note: Using search fallback due to API limitations*`
                : `Found ${scriptsArray.length} scripts for game ID: ${gameId}\nShowing ${displayLimit} results`;
                
            const mainEmbed = new EmbedBuilder()
                .setColor('#6c5ce7')
                .setTitle('🎮 Game Scripts')
                .setDescription(mainDescription)
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
