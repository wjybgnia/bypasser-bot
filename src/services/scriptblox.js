const axios = require('axios');

class ScriptBloxAPI {
    constructor() {
        this.baseURL = process.env.SCRIPTBLOX_API_BASE || 'https://scriptblox.com/api';
        this.apiKey = process.env.SCRIPTBLOX_API_KEY;
        
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://scriptblox.com/',
                'Origin': 'https://scriptblox.com',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            }
        });

        // Add API key to requests if available
        if (this.apiKey) {
            this.client.defaults.headers.common['Authorization'] = `Bearer ${this.apiKey}`;
        }
    }

    /**
     * Search for scripts with advanced options
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @param {number} options.page - Page number (default: 1)
     * @param {number} options.max - Results per page (default: 10, max: 20)
     * @param {string} options.mode - Script type: 'free' or 'paid'
     * @param {boolean} options.patched - Whether script is patched (converted to 1/0)
     * @param {boolean} options.key - Whether script has key system (converted to 1/0)
     * @param {boolean} options.universal - Whether script is universal (converted to 1/0)
     * @param {boolean} options.verified - Whether script is verified (converted to 1/0)
     * @param {string} options.sortBy - Sort by: 'views', 'likeCount', 'createdAt', 'updatedAt', 'dislikeCount', 'accuracy'
     * @param {string} options.order - Sort order: 'asc' or 'desc'
     * @param {boolean} options.strict - Strict search matching (true/false)
     * @returns {Promise<Object>} Search results
     */
    async searchScripts(query = '', options = {}) {
        try {
            const params = {
                q: query,
                page: options.page || 1,
                max: Math.min(options.max || 10, 20)
            };

            // Add optional parameters (convert booleans to 1/0 as per API docs)
            if (options.mode) params.mode = options.mode;
            if (options.patched !== undefined) params.patched = options.patched ? 1 : 0;
            if (options.key !== undefined) params.key = options.key ? 1 : 0;
            if (options.universal !== undefined) params.universal = options.universal ? 1 : 0;
            if (options.verified !== undefined) params.verified = options.verified ? 1 : 0;
            if (options.sortBy) params.sortBy = options.sortBy;
            if (options.order) params.order = options.order;
            if (options.strict !== undefined) params.strict = options.strict;

            const response = await this.client.get('/script/search', { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get scripts with filtering options
     * @param {Object} options - Filter options
     * @param {number} options.page - Page number (default: 1)
     * @param {number} options.max - Results per page (default: 10, max: 20)
     * @param {string} options.exclude - Script ID to exclude from results
     * @param {string} options.mode - Script type: 'free' or 'paid'
     * @param {boolean} options.verified - Whether script is verified
     * @param {boolean} options.key - Whether script has key system
     * @param {boolean} options.universal - Whether script is universal
     * @param {boolean} options.patched - Whether script is patched
     * @param {string} options.sortBy - Sort by: 'views', 'likeCount', 'createdAt', 'updatedAt', 'dislikeCount'
     * @param {string} options.order - Sort order: 'asc' or 'desc'
     * @returns {Promise<Object>} Filtered scripts
     */
    async getScripts(options = {}) {
        try {
            const params = {
                page: options.page || 1,
                max: Math.min(options.max || 10, 20)
            };

            // Add optional parameters (convert booleans to 1/0 as per API docs)
            if (options.exclude) params.exclude = options.exclude;
            if (options.mode) params.mode = options.mode;
            if (options.verified !== undefined) params.verified = options.verified ? 1 : 0;
            if (options.key !== undefined) params.key = options.key ? 1 : 0;
            if (options.universal !== undefined) params.universal = options.universal ? 1 : 0;
            if (options.patched !== undefined) params.patched = options.patched ? 1 : 0;
            if (options.sortBy) params.sortBy = options.sortBy;
            if (options.order) params.order = options.order;

            const response = await this.client.get('/script/fetch', { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get a specific script by ID
     * @param {string} scriptId - Script ID
     * @returns {Promise<Object>} Script details
     */
    async getScript(scriptId) {
        try {
            const response = await this.client.get(`/script/${scriptId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get raw script content by ID
     * @param {string} scriptId - Script ID
     * @returns {Promise<Object>} Raw script content
     */
    async getRawScript(scriptId) {
        try {
            const response = await this.client.get(`/script/raw/${scriptId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get scripts for a specific game
     * @param {string} gameId - Game ID
     * @param {Object} options - Options
     * @param {number} options.max - Number of scripts to fetch (default: 10, max: 20)
     * @returns {Promise<Object>} Game scripts
     */
    async getGameScripts(gameId, options = {}) {
        try {
            const params = {
                max: Math.min(options.max || 10, 20)
            };

            const response = await this.client.get(`/script/game/${gameId}`, { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get featured scripts (home page scripts)
     * @param {number} limit - Number of scripts to fetch (default: 10, max: 20)
     * @returns {Promise<Object>} Featured scripts
     */
    async getFeaturedScripts(limit = 10) {
        try {
            const response = await this.client.get('/script/fetch', {
                params: {
                    page: 1,
                    max: Math.min(limit, 20)
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get trending scripts
     * @param {number} limit - Number of scripts to fetch (default: 10, max: 20)
     * @returns {Promise<Object>} Trending scripts
     */
    async getTrendingScripts(limit = 10) {
        try {
            const response = await this.client.get('/script/trending', {
                params: {
                    max: Math.min(limit, 20)
                }
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Handle API errors with migration-aware messages
     * @param {Error} error - The error object
     * @returns {Error} Formatted error
     */
    handleError(error) {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            const message = data.message || data.error || 'Unknown error';
            
            // Check for Cloudflare blocking
            if (typeof data === 'string' && data.includes('Cloudflare') && data.includes('blocked')) {
                return new Error('ScriptBlox API access blocked by Cloudflare. Server IP may be blacklisted. Please contact support or use a different server.');
            }
            
            switch (status) {
                case 400:
                    return new Error(`Bad Request: ${message}`);
                case 401:
                    return new Error('Unauthorized: Invalid API key or authentication required');
                case 403:
                    return new Error('Forbidden: Access denied to this resource. Server may be blocked by ScriptBlox.');
                case 404:
                    return new Error('Not Found: Resource does not exist');
                case 410:
                    return new Error('Gone: This API endpoint has been deprecated. Please update the bot.');
                case 426:
                    return new Error('Upgrade Required: API version no longer supported. Please update the bot.');
                case 429:
                    return new Error('Rate limit exceeded. Please try again later.');
                case 500:
                    return new Error('Internal server error. Please try again later.');
                case 502:
                    return new Error('Bad Gateway: API server temporarily unavailable');
                case 503:
                    return new Error('Service Unavailable: API maintenance in progress');
                default:
                    return new Error(`API Error ${status}: ${message}`);
            }
        } else if (error.request) {
            // No response received
            return new Error('No response from ScriptBlox API. Server may be blocked by Cloudflare. Please try again later.');
        } else {
            // Request setup error
            return new Error(`Request Error: ${error.message}`);
        }
    }

    /**
     * Format script data for Discord embeds
     * @param {Object} script - Script object from API
     * @returns {Object} Formatted script data
     */
    formatScript(script) {
        return {
            id: script._id || script.id,
            title: script.title || 'Untitled Script',
            description: String(script.description || script.features || 'No description available'),
            game: script.game?.name || 'Unknown Game',
            gameId: script.game?.gameId || script.game?._id || 'N/A',
            owner: script.owner?.username || 'Unknown',
            ownerVerified: script.owner?.verified || false,
            ownerProfilePicture: script.owner?.profilePicture || '',
            ownerStatus: script.owner?.status || '',
            verified: script.verified || false,
            key: script.key || false,
            keyLink: script.keyLink || '',
            views: script.views || 0,
            likes: script.likes || script.likeCount || 0,
            dislikes: script.dislikes || script.dislikeCount || 0,
            isUniversal: script.isUniversal || script.universal || false,
            isPatched: script.isPatched || script.patched || false,
            scriptType: script.scriptType || script.mode || 'Unknown',
            visibility: script.visibility || 'public',
            tags: script.tags || [],
            features: script.features || '',
            slug: script.slug || '',
            imageUrl: script.image || script.imageUrl || '',
            gameImageUrl: script.game?.imageUrl || '',
            liked: script.liked || false,
            disliked: script.disliked || false,
            isFav: script.isFav || false,
            matched: script.matched || [], // Search matches
            createdAt: script.createdAt || script.created || null,
            updatedAt: script.updatedAt || script.updated || undefined,
            url: `https://scriptblox.com/script/${script._id || script.id}`,
            script: script.script || 'No script content available'
        };
    }

    /**
     * Check API health and version compatibility
     * @returns {Promise<Object>} API status
     */
    async checkAPIHealth() {
        try {
            const response = await this.client.get('/health');
            return {
                status: 'healthy',
                version: response.data.version || 'unknown',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: this.handleError(error).message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Get API version information
     * @returns {Promise<Object>} Version info
     */
    async getAPIVersion() {
        try {
            const response = await this.client.get('/version');
            return response.data;
        } catch (error) {
            // If version endpoint doesn't exist, try to infer from other calls
            return {
                version: 'unknown',
                deprecated: false,
                migration_required: false
            };
        }
    }

    /**
     * Check for API migration requirements and deprecated endpoints
     * @returns {Promise<Object>} Migration status and recommendations
     */
    async checkMigrationStatus() {
        try {
            // Test current endpoints to detect deprecated or changed APIs
            const endpointTests = [
                { name: 'fetch', endpoint: '/script/fetch', params: { max: 1 } },
                { name: 'search', endpoint: '/script/search', params: { q: 'test', max: 1 } },
                { name: 'trending', endpoint: '/script/trending', params: { max: 1 } }
            ];

            const results = [];
            for (const test of endpointTests) {
                try {
                    const response = await this.client.get(test.endpoint, { params: test.params });
                    results.push({
                        endpoint: test.name,
                        status: 'working',
                        httpStatus: response.status,
                        hasDeprecationHeaders: !!(response.headers['deprecation'] || response.headers['sunset'])
                    });
                } catch (error) {
                    results.push({
                        endpoint: test.name,
                        status: 'error',
                        httpStatus: error.response?.status || 'network_error',
                        errorMessage: error.response?.data?.message || error.message,
                        migrationRequired: error.response?.status === 410 || error.response?.status === 426
                    });
                }
            }

            return {
                timestamp: new Date().toISOString(),
                endpoints: results,
                requiresMigration: results.some(r => r.migrationRequired || r.hasDeprecationHeaders),
                summary: this.generateMigrationSummary(results)
            };
        } catch (error) {
            return {
                timestamp: new Date().toISOString(),
                error: 'Failed to check migration status',
                details: error.message
            };
        }
    }

    /**
     * Generate a human-readable migration summary
     * @private
     * @param {Array} results - Endpoint test results
     * @returns {string} Migration summary
     */
    generateMigrationSummary(results) {
        const working = results.filter(r => r.status === 'working').length;
        const deprecated = results.filter(r => r.hasDeprecationHeaders).length;
        const broken = results.filter(r => r.migrationRequired).length;

        if (broken > 0) {
            return `❌ Critical: ${broken} endpoints require immediate migration`;
        } else if (deprecated > 0) {
            return `⚠️ Warning: ${deprecated} endpoints are deprecated`;
        } else if (working === results.length) {
            return `✅ All endpoints are working normally`;
        } else {
            return `🔧 Some endpoints are experiencing issues`;
        }
    }

    /**
     * Get comprehensive API status including migration information
     * @returns {Promise<Object>} Complete API status
     */
    async getComprehensiveStatus() {
        try {
            const [health, version, migration] = await Promise.all([
                this.checkAPIHealth(),
                this.getAPIVersion(),
                this.checkMigrationStatus()
            ]);

            return {
                timestamp: new Date().toISOString(),
                health,
                version,
                migration,
                recommendations: this.generateRecommendations(health, version, migration)
            };
        } catch (error) {
            return {
                timestamp: new Date().toISOString(),
                error: 'Failed to get comprehensive status',
                details: error.message
            };
        }
    }

    /**
     * Generate actionable recommendations based on API status
     * @private
     * @param {Object} health - Health check results
     * @param {Object} version - Version information
     * @param {Object} migration - Migration status
     * @returns {Array} List of recommendations
     */
    generateRecommendations(health, version, migration) {
        const recommendations = [];

        if (health.status === 'unhealthy') {
            recommendations.push('🔴 API is currently unavailable - check ScriptBlox status page');
        }

        if (version.deprecated) {
            recommendations.push('⚠️ API version is deprecated - plan for migration');
        }

        if (version.migration_required) {
            recommendations.push('🚨 Immediate migration required - bot may stop working');
        }

        if (migration.requiresMigration) {
            recommendations.push('📋 Some endpoints need updates - check migration status details');
        }

        if (!this.apiKey) {
            recommendations.push('🔑 Consider adding API key for better rate limits');
        }

        if (recommendations.length === 0) {
            recommendations.push('✅ Bot is fully up to date and operational');
        }

        return recommendations;
    }
}

module.exports = ScriptBloxAPI;
