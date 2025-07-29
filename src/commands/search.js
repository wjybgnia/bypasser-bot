const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ScriptBloxAPI = require('../services/scriptblox');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for scripts on ScriptBlox with advanced options')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Search query')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('limit')
                .setDescription('Number of results (1-20, default: 20)')
                .setMinValue(1)
                .setMaxValue(20)
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number for pagination')
                .setMinValue(1)
                .setRequired(false))
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Script type')
                .addChoices(
                    { name: 'Free', value: 'free' },
                    { name: 'Paid', value: 'paid' }
                )
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('verified')
                .setDescription('Only verified scripts')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('key')
                .setDescription('Scripts with key system')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('universal')
                .setDescription('Universal scripts')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('patched')
                .setDescription('Patched scripts')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('sortby')
                .setDescription('Sort criteria')
                .addChoices(
                    { name: 'Relevance (Accuracy)', value: 'accuracy' },
                    { name: 'Views', value: 'views' },
                    { name: 'Likes', value: 'likeCount' },
                    { name: 'Created Date', value: 'createdAt' },
                    { name: 'Updated Date', value: 'updatedAt' },
                    { name: 'Dislikes', value: 'dislikeCount' }
                )
                .setRequired(false))
        .addStringOption(option =>
            option.setName('order')
                .setDescription('Sort order')
                .addChoices(
                    { name: 'Descending (High to Low)', value: 'desc' },
                    { name: 'Ascending (Low to High)', value: 'asc' }
                )
                .setRequired(false))
        .addStringOption(option =>
            option.setName('creator')
                .setDescription('Search by creator username')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('strict')
                .setDescription('Enable strict searching (more precise results)')
                .setRequired(false)),

    async execute(interaction) {
        let isDeferred = false;

        try {
            // Try to defer reply, but handle if already acknowledged
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply();
                isDeferred = true;
            }

            const query = interaction.options.getString('query');
            const options = {
                max: interaction.options.getInteger('limit') || 20,
                page: interaction.options.getInteger('page') || 1,
                mode: interaction.options.getString('mode'),
                verified: interaction.options.getBoolean('verified'),
                key: interaction.options.getBoolean('key'),
                universal: interaction.options.getBoolean('universal'),
                patched: interaction.options.getBoolean('patched'),
                sortBy: interaction.options.getString('sortby'),
                order: interaction.options.getString('order') || 'desc',
                creator: interaction.options.getString('creator')
            };

            // Validate required query parameter
            if (!query) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Error')
                    .setDescription('Please provide a search query.')
                    .setTimestamp();

                if (isDeferred) {
                    return await interaction.editReply({ embeds: [embed] });
                } else {
                    return await interaction.reply({ embeds: [embed] });
                }
            }

            const api = new ScriptBloxAPI();
            const results = await api.searchScripts(query, options);

            if (!results.result || !results.result.scripts || results.result.scripts.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('🔍 Search Results')
                    .setDescription(`No scripts found for query: "${query}"`)
                    .addFields(
                        { name: '💡 Suggestions', value: '• Try different keywords\n• Check your spelling\n• Use broader search terms\n• Remove filters to expand results' }
                    )
                    .setTimestamp();

                if (isDeferred) {
                    return await interaction.editReply({ embeds: [embed] });
                } else {
                    return await interaction.reply({ embeds: [embed] });
                }
            }

            const scripts = results.result.scripts;
            const totalFound = results.result.totalFound || scripts.length;
            
            // Create embeds for scripts (limit to avoid Discord limits)
            const embeds = [];
            const maxScripts = Math.min(scripts.length, 10); // Limit to 10 scripts max

            // Main search results embed
            const mainEmbed = new EmbedBuilder()
                .setColor('#00d4aa')
                .setTitle('🔍 Search Results')
                .setDescription(`Found **${totalFound}** scripts for: "${query}"\nShowing ${maxScripts} results`)
                .addFields(
                    { name: '📄 Page', value: `${options.page}`, inline: true },
                    { name: '📊 Per Page', value: `${options.max}`, inline: true },
                    { name: '🎯 Results', value: `${maxScripts}/${totalFound}`, inline: true }
                );

            if (options.mode) mainEmbed.addFields({ name: '🎮 Mode', value: options.mode, inline: true });
            if (options.verified !== null) mainEmbed.addFields({ name: '✅ Verified', value: options.verified ? 'Yes' : 'No', inline: true });
            if (options.sortBy) mainEmbed.addFields({ name: '📈 Sort', value: `${options.sortBy} (${options.order})`, inline: true });

            mainEmbed.setTimestamp();
            embeds.push(mainEmbed);

            // Add script embeds
            for (let i = 0; i < maxScripts; i++) {
                const script = scripts[i];
                const formatted = api.formatScript(script);
                
                const embed = new EmbedBuilder()
                    .setColor('#ffd93d')
                    .setTitle(`📜 ${formatted.title}`)
                    .setURL(formatted.url)
                    .setDescription(formatted.description.length > 150 
                        ? formatted.description.substring(0, 150) + '...' 
                        : formatted.description)
                    .addFields(
                        { name: '🆔 ID', value: formatted.id, inline: true },
                        { name: '🎮 Game', value: formatted.game, inline: true },
                        { name: '👤 Author', value: formatted.owner, inline: true },
                        { name: '👁️ Views', value: formatted.views.toString(), inline: true },
                        { name: '👍 Likes', value: formatted.likes.toString(), inline: true },
                        { name: '👎 Dislikes', value: formatted.dislikes.toString(), inline: true }
                    )
                    .setFooter({ text: `Result ${i + 1} of ${maxScripts} • Script ID: ${formatted.id}` })
                    .setTimestamp();

                // Add verification status
                if (formatted.verified) embed.addFields({ name: '✅ Status', value: 'Verified', inline: true });
                if (formatted.key) embed.addFields({ name: '🔑 Key', value: 'Required', inline: true });

                embeds.push(embed);
            }

            if (isDeferred) {
                await interaction.editReply({ embeds: embeds });
            } else {
                await interaction.reply({ embeds: embeds });
            }

        } catch (error) {
            console.error('Search command error:', error);
            
            // Handle defer error specifically
            if (error.code === 40060) {
                console.log('Interaction already acknowledged before defer');
                return;
            }
            
            try {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Error')
                    .setDescription('Failed to search scripts. Please try again later.')
                    .setTimestamp();

                if (isDeferred) {
                    await interaction.editReply({ embeds: [errorEmbed] });
                } else if (!interaction.replied) {
                    await interaction.reply({ embeds: [errorEmbed] });
                }
            } catch (replyError) {
                console.error('Failed to send error message:', replyError);
            }
        }
    },
};
