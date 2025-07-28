const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ScriptBloxAPI = require('../services/scriptblox');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('script')
        .setDescription('Get details of a specific script')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Script ID')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        const scriptId = interaction.options.getString('id');

        try {
            const api = new ScriptBloxAPI();
            const result = await api.getScript(scriptId);

            if (!result.script) {
                const embed = new EmbedBuilder()
                    .setColor('#ff6b6b')
                    .setTitle('❌ Script Not Found')
                    .setDescription(`No script found with ID: ${scriptId}`)
                    .setTimestamp();

                return await interaction.editReply({ embeds: [embed] });
            }

            const formatted = api.formatScript(result.script);
            
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle(`📜 ${formatted.title}`)
                .setURL(formatted.url)
                .setDescription(formatted.description || formatted.features || 'No description available')
                .addFields(
                    { name: '🎮 Game', value: formatted.game, inline: true },
                    { name: '🆔 Game ID', value: formatted.gameId.toString(), inline: true },
                    { name: '👤 Author', value: `${formatted.owner}${formatted.ownerVerified ? ' ✅' : ''}`, inline: true },
                    { name: '👁️ Views', value: formatted.views.toString(), inline: true },
                    { name: '👍 Likes', value: formatted.likes.toString(), inline: true },
                    { name: '👎 Dislikes', value: formatted.dislikes.toString(), inline: true },
                    { name: '✅ Verified', value: formatted.verified ? 'Yes' : 'No', inline: true },
                    { name: '🔐 Key Required', value: formatted.key ? 'Yes' : 'No', inline: true },
                    { name: '💰 Type', value: formatted.scriptType, inline: true }
                );

            // Add optional fields if available
            if (formatted.isUniversal !== undefined) {
                embed.addFields({ name: '🌐 Universal', value: formatted.isUniversal ? 'Yes' : 'No', inline: true });
            }
            if (formatted.isPatched !== undefined) {
                embed.addFields({ name: '🔧 Patched', value: formatted.isPatched ? 'Yes' : 'No', inline: true });
            }
            if (formatted.visibility) {
                embed.addFields({ name: '👁️ Visibility', value: formatted.visibility, inline: true });
            }

            // Add tags if available
            if (formatted.tags && formatted.tags.length > 0) {
                const tagsText = formatted.tags.slice(0, 5).map(tag => `\`${tag}\``).join(', ');
                embed.addFields({ 
                    name: '🏷️ Tags', 
                    value: formatted.tags.length > 5 ? `${tagsText} and ${formatted.tags.length - 5} more...` : tagsText, 
                    inline: false 
                });
            }

            // Add creation date
            if (formatted.createdAt) {
                embed.addFields({ 
                    name: '📅 Created', 
                    value: new Date(formatted.createdAt).toLocaleDateString(), 
                    inline: true 
                });
            }

            // Add update date if different from creation
            if (formatted.updatedAt && formatted.updatedAt !== formatted.createdAt) {
                embed.addFields({ 
                    name: '🔄 Updated', 
                    value: new Date(formatted.updatedAt).toLocaleDateString(), 
                    inline: true 
                });
            }

            // Set thumbnail if available
            if (formatted.gameImageUrl) {
                embed.setThumbnail(formatted.gameImageUrl);
            }

            embed.setFooter({ text: `Script ID: ${formatted.id}` })
                 .setTimestamp();

            // Create action row with buttons
            const buttons = [
                new ButtonBuilder()
                    .setLabel('View on ScriptBlox')
                    .setStyle(ButtonStyle.Link)
                    .setURL(formatted.url),
                new ButtonBuilder()
                    .setCustomId('show_script')
                    .setLabel('Show Script Code')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📄')
            ];

            // Add key link button if available
            if (formatted.keyLink) {
                buttons.push(
                    new ButtonBuilder()
                        .setLabel('Get Key')
                        .setStyle(ButtonStyle.Link)
                        .setURL(formatted.keyLink)
                        .setEmoji('�')
                );
            }

            const row = new ActionRowBuilder().addComponents(buttons);

            await interaction.editReply({ 
                embeds: [embed], 
                components: [row] 
            });

            // Handle button interactions
            const filter = (buttonInteraction) => {
                return buttonInteraction.user.id === interaction.user.id;
            };

            const collector = interaction.channel.createMessageComponentCollector({ 
                filter, 
                time: 300000 // 5 minutes
            });

            collector.on('collect', async (buttonInteraction) => {
                if (buttonInteraction.customId === 'show_script') {
                    await buttonInteraction.deferReply({ ephemeral: true });

                    const scriptCode = formatted.script;
                    
                    if (scriptCode.length > 4000) {
                        // If script is too long, truncate it
                        const truncatedScript = scriptCode.substring(0, 3900) + '\n\n... (truncated)';
                        
                        await buttonInteraction.editReply({
                            content: `\`\`\`lua\n${truncatedScript}\n\`\`\``,
                            ephemeral: true
                        });
                    } else {
                        await buttonInteraction.editReply({
                            content: `\`\`\`lua\n${scriptCode}\n\`\`\``,
                            ephemeral: true
                        });
                    }
                }
            });

            collector.on('end', () => {
                // Disable buttons after collector ends
                const disabledButtons = [
                    new ButtonBuilder()
                        .setLabel('View on ScriptBlox')
                        .setStyle(ButtonStyle.Link)
                        .setURL(formatted.url),
                    new ButtonBuilder()
                        .setCustomId('show_script')
                        .setLabel('Show Script Code')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📄')
                        .setDisabled(true)
                ];

                // Add key link button if available
                if (formatted.keyLink) {
                    disabledButtons.push(
                        new ButtonBuilder()
                            .setLabel('Get Key')
                            .setStyle(ButtonStyle.Link)
                            .setURL(formatted.keyLink)
                            .setEmoji('🔐')
                    );
                }

                const disabledRow = new ActionRowBuilder().addComponents(disabledButtons);

                interaction.editReply({ 
                    embeds: [embed], 
                    components: [disabledRow] 
                }).catch(() => {
                    // Ignore errors if message is already deleted
                });
            });

        } catch (error) {
            console.error('Script command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff6b6b')
                .setTitle('❌ Error')
                .setDescription('Failed to fetch script details. Please check the script ID and try again.')
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
