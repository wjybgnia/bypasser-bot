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
        .addBooleanOption(option =>
            option.setName('strict')
                .setDescription('Enable strict searching (more precise results)')
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();

        const query = interaction.options.getString('query');
        const options = {
            max: interaction.options.getInteger('limit') || 20, // Match official API default
            page: interaction.options.getInteger('page') || 1,
            mode: interaction.options.getString('mode'),
            verified: interaction.options.getBoolean('verified'),
            key: interaction.options.getBoolean('key'),
            universal: interaction.options.getBoolean('universal'),
            patched: interaction.options.getBoolean('patched'),
            sortBy: interaction.options.getString('sortby'),
            order: interaction.options.getString('order') || 'desc',
            strict: interaction.options.getBoolean('strict') !== false // Default to true as per API docs
        };

        // Remove null/undefined values
        Object.keys(options).forEach(key => {
            if (options[key] === null || options[key] === undefined) {
                delete options[key];
            }
        });

        try {
            const api = new ScriptBloxAPI();
            const results = await api.searchScripts(query, options);

            if (!results.result || !results.result.scripts || results.result.scripts.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('🔍 Search Results')
                    .setDescription(`No scripts found for "${query}"`)
                    .setTimestamp();

                return await interaction.editReply({ embeds: [embed] });
            }

            const scripts = results.result.scripts.slice(0, options.max || 5);
            const embeds = [];

            // Create filter description
            const filterDesc = [];
            if (options.mode) filterDesc.push(`Mode: ${options.mode}`);
            if (options.verified !== undefined) filterDesc.push(`Verified: ${options.verified ? 'Yes' : 'No'}`);
            if (options.key !== undefined) filterDesc.push(`Key Required: ${options.key ? 'Yes' : 'No'}`);
            if (options.universal !== undefined) filterDesc.push(`Universal: ${options.universal ? 'Yes' : 'No'}`);
            if (options.patched !== undefined) filterDesc.push(`Patched: ${options.patched ? 'Yes' : 'No'}`);
            if (options.sortBy) filterDesc.push(`Sorted by: ${options.sortBy} (${options.order})`);
            if (options.strict !== undefined) filterDesc.push(`Strict: ${options.strict ? 'Yes' : 'No'}`);

            // Main results embed
            const mainEmbed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('🔍 Search Results')
                .setDescription(`Found scripts for "${query}"\nShowing ${scripts.length} results${filterDesc.length > 0 ? `\n**Filters:** ${filterDesc.join(', ')}` : ''}`)
                .setTimestamp();

            embeds.push(mainEmbed);

            for (const script of scripts) {
                const formatted = api.formatScript(script);
                
                const embed = new EmbedBuilder()
                    .setColor('#4ecdc4')
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
                        { name: '📅 Created', value: formatted.createdAt ? new Date(formatted.createdAt).toLocaleDateString() : 'Unknown', inline: true }
                    );

                // Add search matches if available
                if (formatted.matched && formatted.matched.length > 0) {
                    const matchText = formatted.matched.slice(0, 3).map(match => `\`${match}\``).join(', ');
                    embed.addFields({ 
                        name: '🎯 Matches', 
                        value: formatted.matched.length > 3 ? `${matchText} and ${formatted.matched.length - 3} more...` : matchText, 
                        inline: false 
                    });
                }

                embed.setFooter({ text: `Search Result ${index + 1} of ${scripts.length}` })
                     .setTimestamp();

                embeds.push(embed);
            }

            await interaction.editReply({ embeds: embeds });

        } catch (error) {
            console.error('Search command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Error')
                .setDescription('Failed to search scripts. Please try again later.')
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
