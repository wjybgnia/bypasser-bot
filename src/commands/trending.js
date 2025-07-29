const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require('discord.js');
const ScriptBloxAPI = require('../services/scriptblox');

// Helper function to validate and build thumbnail URL
const getValidThumbnailUrl = (gameImageUrl) => {
    if (!gameImageUrl || 
        gameImageUrl.trim() === '' || 
        gameImageUrl === '/images/no-script.webp' ||
        !gameImageUrl.startsWith('/')) {
        return null;
    }
    
    try {
        const fullUrl = `https://scriptblox.com${gameImageUrl}`;
        // Basic URL validation
        new URL(fullUrl);
        return fullUrl;
    } catch {
        return null;
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trending')
        .setDescription('Browse trending scripts from ScriptBlox')
        .addIntegerOption(option =>
            option.setName('limit')
                .setDescription('Number of scripts to show (1-20)')
                .setMinValue(1)
                .setMaxValue(20)
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('page')
                .setDescription('Page number to start from (for pagination)')
                .setMinValue(1)
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Script type filter')
                .addChoices(
                    { name: 'Free', value: 'free' },
                    { name: 'Paid', value: 'paid' }
                )
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName('verified')
                .setDescription('Only verified scripts')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName('key')
                .setDescription('Scripts with key system')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName('universal')
                .setDescription('Universal scripts')
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName('patched')
                .setDescription('Patched scripts')
                .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const api = new ScriptBloxAPI();
            const limit = interaction.options.getInteger('limit') || 10;
            const page = interaction.options.getInteger('page') || 1;
            
            // Collect filter options
            const options = {
                max: limit,
                page: page,
                sortBy: 'views', // For trending, we want most viewed
                order: 'desc'
            };
            
            // Add filter parameters if specified
            const mode = interaction.options.getString('mode');
            if (mode) options.mode = mode;
            
            const verified = interaction.options.getBoolean('verified');
            if (verified !== null) options.verified = verified ? 1 : 0;
            
            const key = interaction.options.getBoolean('key');
            if (key !== null) options.key = key ? 1 : 0;
            
            const universal = interaction.options.getBoolean('universal');
            if (universal !== null) options.universal = universal ? 1 : 0;
            
            const patched = interaction.options.getBoolean('patched');
            if (patched !== null) options.patched = patched ? 1 : 0;
            
            // Use the fetch endpoint for trending with view-based sorting
            const data = await api.fetchScripts(options);
            
            if (!data.result?.scripts || data.result.scripts.length === 0) {
                return await interaction.editReply({
                    content: '❌ No trending scripts found with the specified filters.',
                    flags: MessageFlags.Ephemeral
                });
            }

            const scripts = data.result.scripts;
            let currentPage = 0;

            const generateEmbed = (page) => {
                const script = scripts[page];
                const formatted = api.formatScript(script);
                
                // Extract description explicitly as string
                const description = formatted.description || 'No description available';
                const descString = typeof description === 'string' ? description : String(description);
                const finalDesc = descString.length > 200 ? descString.substring(0, 200) + '...' : descString;

                // Generate filter summary for footer
                const activeFilters = [];
                if (mode) activeFilters.push(`Mode: ${mode}`);
                if (verified !== null) activeFilters.push(`Verified: ${verified ? 'Yes' : 'No'}`);
                if (key !== null) activeFilters.push(`Key: ${key ? 'Yes' : 'No'}`);
                if (universal !== null) activeFilters.push(`Universal: ${universal ? 'Yes' : 'No'}`);
                if (patched !== null) activeFilters.push(`Patched: ${patched ? 'Yes' : 'No'}`);
                
                const filterText = activeFilters.length > 0 ? ` • Filters: ${activeFilters.join(', ')}` : '';
                const pageInfo = data.result.totalPages ? ` • API Page ${page} of ${data.result.totalPages}` : '';

                const embed = new EmbedBuilder()
                    .setColor('#FF6B6B')
                    .setTitle(`🔥 ${formatted.title}`)
                    .setURL(formatted.url)
                    .setDescription(finalDesc)
                    .addFields(
                        { name: '� Script ID', value: formatted.id, inline: true },
                        { name: '�🎮 Game', value: formatted.game, inline: true },
                        { name: '👤 Author', value: formatted.owner, inline: true },
                        { name: '👁️ Views', value: formatted.views.toString(), inline: true },
                        { name: '👍 Likes', value: formatted.likes.toString(), inline: true },
                        { name: '🔑 Key System', value: formatted.key ? 'Yes' : 'No', inline: true },
                        { name: '💰 Script Type', value: formatted.scriptType, inline: true },
                        { name: '🌐 Universal', value: formatted.isUniversal ? 'Yes' : 'No', inline: true },
                        { name: '🔧 Patched', value: formatted.isPatched ? 'Yes' : 'No', inline: true },
                        { name: '📅 Created', value: formatted.createdAt ? new Date(formatted.createdAt).toLocaleDateString() : 'Unknown', inline: true }
                    )
                    .setFooter({ 
                        text: `Page ${page + 1} of ${scripts.length}${filterText}${pageInfo}` 
                    })
                    .setTimestamp();

                // Set thumbnail - prioritize script image, then game image
                let thumbnailUrl = null;
                
                // Try script's own image first
                if (formatted.imageUrl && formatted.imageUrl.trim() !== '' && formatted.imageUrl !== '/images/no-script.webp') {
                    thumbnailUrl = getValidThumbnailUrl(formatted.imageUrl);
                }
                
                // Fall back to game image if no script image
                if (!thumbnailUrl && formatted.gameImageUrl && formatted.gameImageUrl.trim() !== '' && formatted.gameImageUrl !== '/images/no-script.webp') {
                    thumbnailUrl = getValidThumbnailUrl(formatted.gameImageUrl);
                }
                
                if (thumbnailUrl) {
                    embed.setThumbnail(thumbnailUrl);
                }

                return embed;
            };

            const generateButtons = (page) => {
                const buttons = [];

                // Navigation buttons
                if (scripts.length > 1) {
                    buttons.push(
                        new ButtonBuilder()
                            .setCustomId('trending_prev')
                            .setLabel('◀ Previous')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(page === 0),
                        new ButtonBuilder()
                            .setCustomId('trending_next')
                            .setLabel('Next ▶')
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(page === scripts.length - 1)
                    );
                }

                // Action buttons
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(`script_details_${scripts[page]._id}`)
                        .setLabel('📋 Details')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(`raw_script_${scripts[page]._id}`)
                        .setLabel('📄 Raw Code')
                        .setStyle(ButtonStyle.Success)
                );

                // Create rows (max 5 buttons per row)
                const rows = [];
                for (let i = 0; i < buttons.length; i += 5) {
                    rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
                }

                return rows;
            };

            const embed = generateEmbed(currentPage);
            const components = generateButtons(currentPage);

            const response = await interaction.editReply({
                embeds: [embed],
                components: components
            });

            // Handle button interactions
            const filter = (buttonInteraction) => {
                return buttonInteraction.user.id === interaction.user.id &&
                       buttonInteraction.message.id === response.id;
            };

            const collector = response.createMessageComponentCollector({
                filter,
                time: 300000 // 5 minutes
            });

            collector.on('collect', async (buttonInteraction) => {
                try {
                    if (buttonInteraction.customId === 'trending_prev' && currentPage > 0) {
                        currentPage--;
                        const newEmbed = generateEmbed(currentPage);
                        const newComponents = generateButtons(currentPage);
                        
                        await buttonInteraction.update({
                            embeds: [newEmbed],
                            components: newComponents
                        });
                    } else if (buttonInteraction.customId === 'trending_next' && currentPage < scripts.length - 1) {
                        currentPage++;
                        const newEmbed = generateEmbed(currentPage);
                        const newComponents = generateButtons(currentPage);
                        
                        await buttonInteraction.update({
                            embeds: [newEmbed],
                            components: newComponents
                        });
                    } else if (buttonInteraction.customId.startsWith('script_details_')) {
                        const scriptId = buttonInteraction.customId.replace('script_details_', '');
                        const scriptData = await api.getScript(scriptId);
                        
                        if (scriptData.script) {
                            const script = scriptData.script;
                            const formatted = api.formatScript(script);
                            
                            const detailEmbed = new EmbedBuilder()
                                .setColor('#4ECDC4')
                                .setTitle(`📋 ${formatted.title}`)
                                .setURL(formatted.url)
                                .setDescription(String(formatted.description || 'No description available'))
                                .addFields(
                                    { name: '� Script ID', value: formatted.id, inline: true },
                                    { name: '�🎮 Game', value: formatted.game, inline: true },
                                    { name: '👤 Author', value: formatted.owner, inline: true },
                                    { name: '👁️ Views', value: formatted.views.toString(), inline: true },
                                    { name: '👍 Likes', value: formatted.likes.toString(), inline: true },
                                    { name: '👎 Dislikes', value: formatted.dislikes.toString(), inline: true },
                                    { name: '🔑 Key System', value: formatted.key ? 'Yes' : 'No', inline: true },
                                    { name: '✅ Verified', value: formatted.verified ? 'Yes' : 'No', inline: true },
                                    { name: '💰 Script Type', value: formatted.scriptType, inline: true },
                                    { name: '🌐 Universal', value: formatted.isUniversal ? 'Yes' : 'No', inline: true },
                                    { name: '🔧 Patched', value: formatted.isPatched ? 'Yes' : 'No', inline: true },
                                    { name: '📅 Created', value: formatted.createdAt ? new Date(formatted.createdAt).toLocaleDateString() : 'Unknown', inline: true }
                                );
                            
                            // Set thumbnail - prioritize script image, then game image
                            let detailThumbnailUrl = null;
                            
                            // Try script's own image first
                            if (formatted.imageUrl && formatted.imageUrl.trim() !== '' && formatted.imageUrl !== '/images/no-script.webp') {
                                detailThumbnailUrl = getValidThumbnailUrl(formatted.imageUrl);
                            }
                            
                            // Fall back to game image if no script image
                            if (!detailThumbnailUrl && formatted.gameImageUrl && formatted.gameImageUrl.trim() !== '' && formatted.gameImageUrl !== '/images/no-script.webp') {
                                detailThumbnailUrl = getValidThumbnailUrl(formatted.gameImageUrl);
                            }
                            
                            if (detailThumbnailUrl) {
                                detailEmbed.setThumbnail(detailThumbnailUrl);
                            }
                            
                            await buttonInteraction.reply({
                                embeds: [detailEmbed],
                                flags: MessageFlags.Ephemeral
                            });
                        } else {
                            await buttonInteraction.reply({
                                content: '❌ Script details not found.',
                                flags: MessageFlags.Ephemeral
                            });
                        }
                    } else if (buttonInteraction.customId.startsWith('raw_script_')) {
                        const scriptId = buttonInteraction.customId.replace('raw_script_', '');
                        const rawData = await api.getRawScript(scriptId);
                        
                        if (rawData.result?.script) {
                            let scriptContent = rawData.result.script;
                            
                            // Truncate if too long for Discord
                            const maxLength = 1900;
                            let truncated = false;
                            if (scriptContent.length > maxLength) {
                                scriptContent = scriptContent.substring(0, maxLength);
                                truncated = true;
                            }
                            
                            const codeEmbed = new EmbedBuilder()
                                .setColor('#FFD93D')
                                .setTitle(`📄 Raw Script Code`)
                                .setDescription(`\`\`\`lua\n${scriptContent}\n\`\`\`${truncated ? '\n⚠️ Code truncated due to length limits.' : ''}`)
                                .setFooter({ text: `Script ID: ${scriptId}` });
                            
                            await buttonInteraction.reply({
                                embeds: [codeEmbed],
                                flags: MessageFlags.Ephemeral
                            });
                        } else {
                            await buttonInteraction.reply({
                                content: '❌ Script code not available.',
                                flags: MessageFlags.Ephemeral
                            });
                        }
                    }
                } catch (error) {
                    console.error('Button interaction error:', error);
                    await buttonInteraction.reply({
                        content: '❌ An error occurred while processing your request.',
                        flags: MessageFlags.Ephemeral
                    });
                }
            });

            collector.on('end', async () => {
                try {
                    // Disable all buttons when collector expires
                    const disabledComponents = components.map(row => {
                        const newRow = new ActionRowBuilder();
                        row.components.forEach(button => {
                            newRow.addComponents(
                                ButtonBuilder.from(button).setDisabled(true)
                            );
                        });
                        return newRow;
                    });
                    
                    await interaction.editReply({
                        embeds: [embed],
                        components: disabledComponents
                    });
                } catch (error) {
                    // Ignore errors when disabling buttons (message might be deleted)
                }
            });

        } catch (error) {
            console.error('Trending command error:', error);
            const errorMessage = error.message?.includes('Rate limit') 
                ? '⏰ Rate limit exceeded. Please try again later.'
                : '❌ Failed to fetch trending scripts. Please try again later.';
            
            await interaction.editReply({
                content: errorMessage,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
