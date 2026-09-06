/**
 * API client for AI Brief - Static JSON mode
 * Fetches pre-generated JSON files instead of making API calls
 */

const api = {
    /**
     * Fetch a static JSON file
     * @param {string} path - Path relative to DATA_URL
     * @returns {Promise<any>} Parsed JSON data
     */
    async fetchJSON(path) {
        // Add cache-busting timestamp to prevent stale data
        const cacheBuster = `?t=${Math.floor(Date.now() / 60000)}`; // Changes every minute
        const url = `${window.DATA_URL}${path}${cacheBuster}`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch ${path}: ${response.status}`);
        }

        return response.json();
    },

    /**
     * Get the latest brief
     * @returns {Promise<object|null>} Brief with items or null
     */
    async getLatestBrief() {
        return this.fetchJSON('/latest.json');
    },

    /**
     * List available briefs
     * @param {number} limit - Maximum number of briefs (ignored in static mode)
     * @returns {Promise<Array>} List of brief summaries
     */
    async listBriefs(limit = 30) {
        const index = await this.fetchJSON('/briefs.json');
        if (!index || !index.briefs) {
            return [];
        }

        // Transform index format to match API format
        return index.briefs.slice(0, limit).map(b => ({
            id: b.id,
            generated_at: b.generated_at,
            item_count: b.item_count,
            sources_checked: 6,  // Default value for static mode
            sources_failed: 0
        }));
    },

    /**
     * Get brief by ID
     * @param {number} id - Brief ID
     * @returns {Promise<object>} Brief with items
     */
    async getBriefById(id) {
        // First try to get latest and check if it matches
        const latest = await this.getLatestBrief();
        if (latest && latest.id === id) {
            return latest;
        }

        // Fetch directly by ID
        const brief = await this.fetchJSON(`/briefs/${id}.json`);
        if (brief) {
            return brief;
        }

        throw new Error(`Brief ${id} not found`);
    },

    /**
     * Generate a new brief - NOT AVAILABLE in serverless mode
     * @returns {Promise<never>} Always throws
     */
    async generateBrief() {
        throw new Error('Brief generation is not available. Briefs are updated automatically every day at 3 AM UTC.');
    },

    /**
     * Get configuration - returns static config in serverless mode
     * @returns {Promise<{sources: Array, settings: object}>}
     */
    async getConfig() {
        // Return static config since it can't be changed in serverless mode
        return {
            sources: [
                { key: 'hackernews', name: 'Hacker News', description: 'Tech news and discussions', enabled: true },
                { key: 'reddit', name: 'Reddit', description: 'AI/ML subreddits', enabled: true },
                { key: 'github', name: 'GitHub Trending', description: 'Trending AI/ML repositories', enabled: true },
                { key: 'arxiv', name: 'ArXiv', description: 'Latest research papers', enabled: true },
                { key: 'producthunt', name: 'Product Hunt', description: 'New AI products and tools', enabled: true },
                { key: 'lobsters', name: 'Lobste.rs', description: 'Tech discussions', enabled: true }
            ],
            settings: {
                max_items: 25
            }
        };
    },

    /**
     * Toggle a source - NOT AVAILABLE in serverless mode
     */
    async toggleSource(sourceName, enabled = null) {
        throw new Error('Source configuration is not available in serverless mode.');
    },

    /**
     * Update settings - NOT AVAILABLE in serverless mode
     */
    async updateSettings(settings) {
        throw new Error('Settings configuration is not available in serverless mode.');
    }
};

// Export for use in other modules
window.api = api;
