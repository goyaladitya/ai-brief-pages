/**
 * Utility functions for the frontend
 */

/**
 * Convert ISO datetime string to relative time
 * @param {string} dtStr - ISO datetime string
 * @returns {string} Relative time string (e.g., "2h ago")
 */
function timeago(dtStr) {
    if (!dtStr) return '';

    try {
        const dt = new Date(dtStr);
        const now = new Date();
        const delta = Math.floor((now - dt) / 1000);

        if (delta < 0) return 'just now';

        const days = Math.floor(delta / 86400);
        if (days > 0) return `${days}d ago`;

        const hours = Math.floor(delta / 3600);
        if (hours > 0) return `${hours}h ago`;

        const minutes = Math.floor(delta / 60);
        if (minutes > 0) return `${minutes}m ago`;

        return 'just now';
    } catch (e) {
        return dtStr ? dtStr.substring(0, 10) : '';
    }
}

/**
 * Extract domain from URL
 * @param {string} url - Full URL
 * @returns {string} Domain without www prefix
 */
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        let hostname = urlObj.hostname;
        if (hostname.startsWith('www.')) {
            hostname = hostname.substring(4);
        }
        return hostname;
    } catch (e) {
        return url;
    }
}

/**
 * Get hotness indicator based on trend score
 * @param {number} score - Trend score (0-1 scale)
 * @returns {string} Hotness indicator string
 */
function hotnessSymbol(score) {
    if (score === null || score === undefined) return '[+]';

    // Convert to 0-100 scale if needed
    let normalizedScore = score <= 1 ? score * 100 : score;

    if (normalizedScore >= 80) return '[HOT]';
    if (normalizedScore >= 60) return '[+++]';
    if (normalizedScore >= 40) return '[++]';
    return '[+]';
}

/**
 * Get CSS class for hotness indicator
 * @param {string} hotnessStr - Hotness string from hotnessSymbol
 * @returns {string} CSS class name
 */
function hotnessClass(hotnessStr) {
    switch (hotnessStr) {
        case '[HOT]': return 'hotness-hot';
        case '[+++]': return 'hotness-high';
        case '[++]': return 'hotness-med';
        default: return 'hotness-low';
    }
}

/**
 * Convert score to dots representation
 * @param {number} score - Score (0-1 scale)
 * @returns {string} Dots string (filled and empty circles)
 */
function scoreDots(score) {
    if (score === null || score === undefined) return '○○○○○';

    // Convert to 0-100 scale if needed
    let normalizedScore = score <= 1 ? score * 100 : score;
    let filled = Math.round(normalizedScore / 20);
    filled = Math.max(0, Math.min(5, filled));

    return '●'.repeat(filled) + '○'.repeat(5 - filled);
}

/**
 * Format date for display
 * @param {string} dtStr - ISO datetime string
 * @returns {string} Formatted date (e.g., "January 24, 2026")
 */
function formatDate(dtStr) {
    try {
        const dt = new Date(dtStr);
        return dt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dtStr ? dtStr.substring(0, 10) : '';
    }
}

/**
 * Format time for display
 * @param {string} dtStr - ISO datetime string
 * @returns {string} Formatted time (e.g., "14:30")
 */
function formatTime(dtStr) {
    try {
        const dt = new Date(dtStr);
        return dt.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    } catch (e) {
        return '';
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Zero-pad a number
 * @param {number} num - Number to pad
 * @param {number} size - Target length
 * @returns {string} Padded string
 */
function zeroPad(num, size = 2) {
    return String(num).padStart(size, '0');
}

// Export for use in other modules
window.utils = {
    timeago,
    extractDomain,
    hotnessSymbol,
    hotnessClass,
    scoreDots,
    formatDate,
    formatTime,
    escapeHtml,
    zeroPad
};
