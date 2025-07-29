const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ScriptBloxAPI = require('../services/scriptblox');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('featured')
        .setDescription('Get featured scripts from ScriptBlox')
        .addIntegerOption(option =>
            option.setName('limit')
                .setDescription('Number of scripts to show (1-20)')
                .setMinValue(1)
                .setMaxValue(20)
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();

        const limit = interaction.options.getInteger('limit') || 5;

        try {
            const api = new ScriptBloxAPI();
            const results = await api.getFeaturedScripts(limit);

            if (!results.result || !results.result.scripts || results.result.scripts.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('⭐ Featured Scripts')
                    .setDescription('No featured scripts found at the moment.')
                    .setTimestamp();

                return await interaction.editReply({ embeds: [embed] });
            }

            const scripts = results.result.scripts.slice(0, limit);
            const embeds = [];

            for (const script of scripts) {
                const formatted = api.formatScript(script);
                
                const embed = new EmbedBuilder()
                    .setColor('#ffd93d')
                    .setTitle(`⭐ ${formatted.title}`)
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
                    )
                    .setFooter({ text: `Featured Script ${scripts.indexOf(script) + 1} of ${scripts.length}` })
                    .setTimestamp();

                embeds.push(embed);
            }

            // Send main embed with featured info
            const mainEmbed = new EmbedBuilder()
                .setColor('#ffd93d')
                .setTitle('⭐ Featured Scripts')
                .setDescription(`Showing ${scripts.length} featured scripts from ScriptBlox`)
                .setTimestamp();

            await interaction.editReply({ embeds: [mainEmbed, ...embeds] });

        } catch (error) {
            console.error('Featured command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Error')
                .setDescription('Failed to fetch featured scripts. Please try again later.')
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
