const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ScriptBloxAPI = require('../services/scriptblox');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('raw')
        .setDescription('Get raw script content for a specific script')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Script ID')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const scriptId = interaction.options.getString('id');

        try {
            const api = new ScriptBloxAPI();
            const rawContent = await api.getRawScript(scriptId);

            if (!rawContent || typeof rawContent !== 'string') {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Script Not Found')
                    .setDescription(`No raw script content found for ID: ${scriptId}`)
                    .setTimestamp();

                return await interaction.editReply({ embeds: [embed] });
            }

            // Discord has a 2000 character limit for messages
            if (rawContent.length > 1900) {
                // If script is too long, provide it in chunks or truncate
                const truncatedScript = rawContent.substring(0, 1800) + '\n\n... (truncated - script too long for Discord)';
                
                const embed = new EmbedBuilder()
                    .setColor('#4ecdc4')
                    .setTitle('📄 Raw Script Content')
                    .setDescription(`Script ID: ${scriptId}\n\n\`\`\`lua\n${truncatedScript}\n\`\`\``)
                    .addFields({
                        name: '⚠️ Notice',
                        value: `Script was truncated. Full script has ${rawContent.length} characters.\nUse the "View on ScriptBlox" button for complete content.`,
                        inline: false
                    })
                    .setFooter({ text: 'Raw script content from ScriptBlox API' })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#4ecdc4')
                    .setTitle('📄 Raw Script Content')
                    .setDescription(`Script ID: ${scriptId}\n\n\`\`\`lua\n${rawContent}\n\`\`\``)
                    .setFooter({ text: 'Raw script content from ScriptBlox API' })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            }

        } catch (error) {
            console.error('Raw script command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Error')
                .setDescription('Failed to fetch raw script content. Please check the script ID and try again.')
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
