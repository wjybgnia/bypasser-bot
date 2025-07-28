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

            const embed = new EmbedBuilder()
                .setColor(healthStatus.status === 'healthy' ? '#00FF00' : '#FF0000')
                .setTitle('🔧 ScriptBlox API Status')
                .setDescription(`API Health Check - ${healthStatus.status.toUpperCase()}`)
                .addFields(
                    {
                        name: '🌐 API Status',
                        value: healthStatus.status === 'healthy' ? '✅ Online' : '❌ Offline',
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
                        value: versionInfo.version || 'Unknown',
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

            // Add error details if unhealthy
            if (healthStatus.status === 'unhealthy') {
                embed.addFields({
                    name: '❌ Error Details',
                    value: `\`\`\`${healthStatus.error}\`\`\``,
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
