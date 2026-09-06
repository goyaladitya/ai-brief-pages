/**
 * Hash-based router for SPA navigation
 */

const router = {
    routes: {},
    currentRoute: null,

    /**
     * Register a route handler
     * @param {string} pattern - Route pattern (supports :params)
     * @param {function} handler - Async function to handle the route
     */
    on(pattern, handler) {
        this.routes[pattern] = handler;
    },

    /**
     * Navigate to a route
     * @param {string} path - Route path
     */
    navigate(path) {
        window.location.hash = path;
    },

    /**
     * Get current hash path
     * @returns {string} Current path
     */
    getPath() {
        const hash = window.location.hash.slice(1) || '/';
        return hash;
    },

    /**
     * Match a path against registered routes
     * @param {string} path - Path to match
     * @returns {object|null} Matched route with params
     */
    match(path) {
        // Direct match
        if (this.routes[path]) {
            return { handler: this.routes[path], params: {} };
        }

        // Pattern matching with :params
        for (const pattern of Object.keys(this.routes)) {
            const paramNames = [];
            const regexPattern = pattern.replace(/:([^/]+)/g, (_, name) => {
                paramNames.push(name);
                return '([^/]+)';
            });

            const regex = new RegExp(`^${regexPattern}$`);
            const match = path.match(regex);

            if (match) {
                const params = {};
                paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });
                return { handler: this.routes[pattern], params };
            }
        }

        return null;
    },

    /**
     * Handle route change
     */
    async handleRoute() {
        const path = this.getPath();
        const app = document.getElementById('app');

        // Update nav highlighting
        this.updateNav(path);

        const matched = this.match(path);
        if (matched) {
            this.currentRoute = path;
            try {
                await matched.handler(matched.params);
            } catch (error) {
                console.error('Route error:', error);
                app.innerHTML = `
                    <div class="space-y-4">
                        <h1 class="text-lg font-bold"># Error</h1>
                        <p class="text-light-red dark:text-term-red">> ${utils.escapeHtml(error.message)}</p>
                        <p class="text-light-muted dark:text-term-muted">> <a href="#/" class="text-light-link dark:text-term-link hover:underline">Return home</a></p>
                    </div>
                `;
            }
        } else {
            // 404
            app.innerHTML = `
                <div class="space-y-4">
                    <h1 class="text-lg font-bold"># Not Found</h1>
                    <p class="text-light-muted dark:text-term-muted">> Page not found: ${utils.escapeHtml(path)}</p>
                    <p class="text-light-muted dark:text-term-muted">> <a href="#/" class="text-light-link dark:text-term-link hover:underline">Return home</a></p>
                </div>
            `;
        }
    },

    /**
     * Update navigation highlighting
     * @param {string} path - Current path
     */
    updateNav(path) {
        // Remove all active classes
        document.querySelectorAll('[id^="nav-"]').forEach(el => {
            el.classList.remove('nav-active', 'text-light-link', 'dark:text-term-link');
        });

        // Add active class to current nav item
        let navId = 'nav-today';
        if (path.startsWith('/history') || path.startsWith('/brief')) {
            navId = 'nav-history';
        } else if (path === '/config') {
            navId = 'nav-config';
        } else if (path === '/how-it-works') {
            navId = 'nav-how';
        }

        const navEl = document.getElementById(navId);
        if (navEl) {
            navEl.classList.add('nav-active', 'text-light-link', 'dark:text-term-link');
        }
    },

    /**
     * Initialize the router
     */
    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        // Initial route
        this.handleRoute();
    }
};

// Export for use in other modules
window.router = router;
