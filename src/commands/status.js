const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ScriptBloxAPI = require('../services/scriptblox');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Check ScriptBlox API status and version information')
        .setDefaultMemberPermissions('0'), // Restrict to administrators

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const api = new ScriptBloxAPI();
            
            // Check API health and version
            const [healthStatus, versionInfo] = await Promise.all([
                api.checkAPIHealth(),
                api.getAPIVersion()
            ]);

            // Determine color based on status
            let embedColor;
            switch (healthStatus.status) {
                case 'healthy':
                    embedColor = '#00FF00';
                    break;
                case 'partial':
                    embedColor = '#FFA500';
                    break;
                default:
                    embedColor = '#FF0000';
            }

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle('🔧 ScriptBlox API Status')
                .setDescription(`API Health Check - ${healthStatus.status.toUpperCase()}`)
                .addFields(
                    {
                        name: '🌐 API Status',
                        value: healthStatus.status === 'healthy' ? '✅ Online' : 
                               healthStatus.status === 'partial' ? '⚠️ Partially Available' : '❌ Offline',
                        inline: true
                    },
                    {
                        name: '📡 Base URL',
                        value: api.baseURL,
                        inline: true
                    },
                    {
                        name: '🔑 Authentication',
                        value: api.apiKey ? '✅ Configured' : '⚠️ Not Set',
                        inline: true
                    },
                    {
                        name: '📊 API Version',
                        value: versionInfo.version || 'unknown',
                        inline: true
                    },
                    {
                        name: '🔄 Migration Status',
                        value: versionInfo.migration_required ? '⚠️ Required' : '✅ Up to Date',
                        inline: true
                    },
                    {
                        name: '📅 Deprecation',
                        value: versionInfo.deprecated ? '⚠️ Deprecated' : '✅ Current',
                        inline: true
                    }
                )
                .setFooter({ 
                    text: `Last checked: ${healthStatus.timestamp}` 
                })
                .setTimestamp();

            // Add endpoint status details
            if (healthStatus.endpoints && healthStatus.endpoints.length > 0) {
                const endpointStatus = healthStatus.endpoints.map(ep => {
                    const statusIcon = ep.status === 'working' ? '✅' : '❌';
                    return `${statusIcon} **${ep.name}**: ${ep.status}`;
                }).join('\n');

                embed.addFields({
                    name: `📊 Endpoint Status (${healthStatus.workingCount}/${healthStatus.totalCount} working)`,
                    value: endpointStatus,
                    inline: false
                });
            }

            // Add error details if unhealthy
            if (healthStatus.error) {
                embed.addFields({
                    name: '❌ Error Details',
                    value: healthStatus.error,
                    inline: false
                });
            }

            // Add migration warnings if needed
            if (versionInfo.migration_required || versionInfo.deprecated) {
                embed.addFields({
                    name: '⚠️ Migration Notice',
                    value: versionInfo.migration_required 
                        ? 'API migration is required. Some features may be deprecated.'
                        : 'API version is deprecated. Consider updating soon.',
                    inline: false
                });
            }

            // Add recommendations based on status
            if (healthStatus.status === 'partial') {
                embed.addFields({
                    name: '💡 Recommendations',
                    value: '• Use working endpoints: `/search`, `/featured`, `/trending`\n' +
                           '• Avoid blocked endpoints until resolved\n' +
                           '• Check server logs for Cloudflare blocking issues',
                    inline: false
                });
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Status command error:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Status Check Failed')
                .setDescription('Unable to check API status')
                .addFields({
                    name: 'Error Details',
                    value: `\`\`\`${error.message}\`\`\``,
                    inline: false
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
