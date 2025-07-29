const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ScriptBloxAPI = require('../services/scriptblox');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Search scripts with advanced filters')
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
        .addIntegerOption(option =>
            option.setName('limit')
                .setDescription('Number of results (1-20)')
                .setMinValue(1)
                .setMaxValue(20)
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();

        const options = {
            mode: interaction.options.getString('mode'),
            verified: interaction.options.getBoolean('verified'),
            key: interaction.options.getBoolean('key'),
            universal: interaction.options.getBoolean('universal'),
            patched: interaction.options.getBoolean('patched'),
            sortBy: interaction.options.getString('sortby'),
            order: interaction.options.getString('order') || 'desc',
            max: interaction.options.getInteger('limit') || 5
        };

        // Remove null/undefined values
        Object.keys(options).forEach(key => {
            if (options[key] === null || options[key] === undefined) {
                delete options[key];
            }
        });

        try {
            const api = new ScriptBloxAPI();
            const results = await api.getScripts(options);

            if (!results.result || !results.result.scripts || results.result.scripts.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('🔍 Filtered Search Results')
                    .setDescription('No scripts found matching your filters.')
                    .setTimestamp();

                return await interaction.editReply({ embeds: [embed] });
            }

            const scripts = results.result.scripts;
            const embeds = [];

            // Create filter description
            const filterDesc = [];
            if (options.mode) filterDesc.push(`Mode: ${options.mode}`);
            if (options.verified !== undefined) filterDesc.push(`Verified: ${options.verified ? 'Yes' : 'No'}`);
            if (options.key !== undefined) filterDesc.push(`Key Required: ${options.key ? 'Yes' : 'No'}`);
            if (options.universal !== undefined) filterDesc.push(`Universal: ${options.universal ? 'Yes' : 'No'}`);
            if (options.patched !== undefined) filterDesc.push(`Patched: ${options.patched ? 'Yes' : 'No'}`);
            if (options.sortBy) filterDesc.push(`Sorted by: ${options.sortBy} (${options.order})`);

            // Main results embed
            const mainEmbed = new EmbedBuilder()
                .setColor('#a29bfe')
                .setTitle('🔍 Filtered Search Results')
                .setDescription(`Found ${scripts.length} scripts\n${filterDesc.length > 0 ? `**Filters:** ${filterDesc.join(', ')}` : ''}`)
                .setTimestamp();

            embeds.push(mainEmbed);

            // Script embeds
            for (let i = 0; i < Math.min(scripts.length, options.max); i++) {
                const script = scripts[i];
                const formatted = api.formatScript(script);
                
                const embed = new EmbedBuilder()
                    .setColor('#a29bfe')
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
                        { name: '✅ Verified', value: formatted.verified ? 'Yes' : 'No', inline: true },
                        { name: '🔐 Key Required', value: formatted.key ? 'Yes' : 'No', inline: true }
                    );

                if (script.isUniversal !== undefined) {
                    embed.addFields({ name: '🌐 Universal', value: script.isUniversal ? 'Yes' : 'No', inline: true });
                }
                if (script.isPatched !== undefined) {
                    embed.addFields({ name: '🔧 Patched', value: script.isPatched ? 'Yes' : 'No', inline: true });
                }
                if (script.scriptType) {
                    embed.addFields({ name: '💰 Type', value: script.scriptType, inline: true });
                }

                embed.setFooter({ text: `Script ID: ${formatted.id}` })
                     .setTimestamp();

                embeds.push(embed);
            }

            await interaction.editReply({ embeds: embeds });

        } catch (error) {
            console.error('Filter command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Error')
                .setDescription('Failed to fetch filtered scripts. Please try again later.')
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
