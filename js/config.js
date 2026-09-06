/**
 * Configuration for static deployment
 * Data is served from the same origin as static JSON files
 */

// Data URL - relative path to static JSON files
const DATA_URL = './data';

// Export for use in other modules
window.DATA_URL = DATA_URL;

// Serverless mode flag - config changes require code updates
window.SERVERLESS_MODE = true;
