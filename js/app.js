/**
 * Main application logic
 */

// Template functions
const templates = {
    /**
     * Render a brief item
     */
    briefItem(item, index) {
        const hotness = utils.hotnessSymbol(item.trend_score);
        const hotnessClassStr = utils.hotnessClass(hotness);

        return `
            <li class="py-2">
                <!-- Line 1: Number + Headline -->
                <div class="flex gap-2">
                    <span class="text-light-muted dark:text-term-muted">[${utils.zeroPad(index)}]</span>
                    <a href="${utils.escapeHtml(item.url)}"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="text-light-link dark:text-term-link hover:underline">
                        ${utils.escapeHtml(item.headline)}
                    </a>
                </div>

                <!-- Line 2: Metadata (indented) -->
                <div class="pl-7 text-sm text-light-muted dark:text-term-muted">
                    ${utils.extractDomain(item.url)} · ${utils.escapeHtml(item.platforms)} · ${utils.timeago(item.published_at)}
                </div>

                <!-- Line 3: Scores (indented) -->
                <div class="pl-7 text-sm flex gap-3">
                    <span class="${hotnessClassStr}">${hotness}</span>
                    <span class="text-light-muted dark:text-term-muted">${Math.round(item.trend_score * 100)}</span>
                    <span class="score-dots">
                        E${utils.scoreDots(item.engagement_score)}
                        F${utils.scoreDots(item.freshness_score)}
                        X${utils.scoreDots(item.cross_platform_score)}
                        R${utils.scoreDots(item.relevance_score)}
                    </span>
                </div>
            </li>
        `;
    },

    /**
     * Render the brief page
     */
    briefPage(brief, pageTitle, isToday = false) {
        if (!brief) {
            return `
                <div class="py-16">
                    <p class="text-lg font-bold"># No brief available</p>
                    <p class="text-light-muted dark:text-term-muted mt-2">> Briefs are generated daily at 3 AM UTC.</p>
                </div>
            `;
        }

        const items = brief.items || [];
        const itemsHtml = items.length > 0
            ? `<ol class="space-y-4">${items.map((item, i) => templates.briefItem(item, i + 1)).join('')}</ol>`
            : '<p class="text-light-muted dark:text-term-muted py-8">> No items in this brief.</p>';

        const failedSourcesHtml = brief.failed_sources ? `
            <details class="mt-2 text-sm text-light-muted dark:text-term-muted">
                <summary class="cursor-pointer hover:text-light-text dark:hover:text-term-text">> show failed sources</summary>
                <pre class="mt-1 text-xs whitespace-pre-wrap pl-4">${utils.escapeHtml(brief.failed_sources)}</pre>
            </details>
        ` : '';

        return `
            <div class="space-y-4">
                <!-- Header -->
                <div class="mb-6">
                    <h1 class="text-lg font-bold"># ${utils.escapeHtml(pageTitle)}</h1>
                    <p class="text-light-muted dark:text-term-muted mt-1">
                        > ${items.length} items · ${brief.sources_checked} sources · ${utils.timeago(brief.generated_at)}
                        ${brief.sources_failed > 0 ? `<span class="text-light-yellow dark:text-term-yellow">· ${brief.sources_failed} failed</span>` : ''}
                    </p>
                    ${failedSourcesHtml}
                </div>

                <!-- Horizontal rule -->
                <div class="text-light-border dark:text-term-border overflow-hidden whitespace-nowrap">────────────────────────────────────────────────────────────────────────────────</div>

                <!-- Items List -->
                ${itemsHtml}

                ${items.length > 0 ? `
                <!-- Horizontal rule -->
                <div class="text-light-border dark:text-term-border overflow-hidden whitespace-nowrap">────────────────────────────────────────────────────────────────────────────────</div>
                ` : ''}
            </div>
        `;
    },

    /**
     * Render history list page
     */
    historyPage(briefs) {
        const briefRows = briefs.map(b => {
            const date = b.generated_at.substring(0, 10);
            const time = b.generated_at.substring(11, 16);
            return `
                <li>
                    <a href="#/brief/${b.id}"
                       class="text-light-link dark:text-term-link hover:underline">
                        ${date}  ${time}   ${String(b.item_count).padStart(3, ' ')}    ${b.sources_checked}
                    </a>
                </li>
            `;
        }).join('');

        return `
            <div class="space-y-4">
                <!-- Header -->
                <div class="mb-6">
                    <h1 class="text-lg font-bold"># Brief History</h1>
                    <p class="text-light-muted dark:text-term-muted mt-1">> Previous briefs</p>
                </div>

                <!-- Horizontal rule -->
                <div class="text-light-border dark:text-term-border overflow-hidden whitespace-nowrap">────────────────────────────────────────────────────────────────────────────────</div>

                ${briefs.length > 0 ? `
                <!-- Table header -->
                <div class="text-sm text-light-muted dark:text-term-muted">
                    DATE        TIME   ITEMS  SOURCES
                </div>

                <!-- Brief list -->
                <ul class="space-y-1">
                    ${briefRows}
                </ul>

                <!-- Horizontal rule -->
                <div class="text-light-border dark:text-term-border overflow-hidden whitespace-nowrap mt-4">────────────────────────────────────────────────────────────────────────────────</div>
                ` : `
                <p class="text-light-muted dark:text-term-muted py-8">> No history yet.</p>
                `}
            </div>
        `;
    },

    /**
     * Render how it works page (v3 - cluster-based)
     */
    howItWorksPage() {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="mb-6">
                    <h1 class="text-lg font-bold"># How It Works</h1>
                    <p class="text-light-muted dark:text-term-muted mt-1">> Cluster-based trend detection (v3) - surfaces emerging themes</p>
                </div>

                <!-- Horizontal rule -->
                <div class="text-light-border dark:text-term-border overflow-hidden whitespace-nowrap">────────────────────────────────────────────────────────────────────────────────</div>

                <!-- Sources -->
                <details open>
                    <summary class="cursor-pointer font-bold hover:text-light-link dark:hover:text-term-link">## Sources</summary>
                    <div class="pl-3 mt-2 text-sm">
                        <p class="text-light-muted dark:text-term-muted mb-3">
                            Content is aggregated from 6 platforms:
                        </p>
                        <ul class="space-y-1">
                            <li class="flex items-center gap-2">
                                <span class="text-light-green dark:text-term-green">[x]</span>
                                <span class="text-light-yellow dark:text-term-yellow">Y</span>
                                <span>Hacker News</span>
                                <span class="text-light-muted dark:text-term-muted">- Tech news and discussions</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-light-green dark:text-term-green">[x]</span>
                                <span class="text-light-yellow dark:text-term-yellow">R</span>
                                <span>Reddit</span>
                                <span class="text-light-muted dark:text-term-muted">- AI/ML subreddits</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-light-green dark:text-term-green">[x]</span>
                                <span class="text-light-yellow dark:text-term-yellow">G</span>
                                <span>GitHub Trending</span>
                                <span class="text-light-muted dark:text-term-muted">- Trending AI/ML repos</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-light-green dark:text-term-green">[x]</span>
                                <span class="text-light-yellow dark:text-term-yellow">A</span>
                                <span>ArXiv</span>
                                <span class="text-light-muted dark:text-term-muted">- Latest research papers</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-light-green dark:text-term-green">[x]</span>
                                <span class="text-light-yellow dark:text-term-yellow">P</span>
                                <span>Product Hunt</span>
                                <span class="text-light-muted dark:text-term-muted">- New AI products</span>
                            </li>
                            <li class="flex items-center gap-2">
                                <span class="text-light-green dark:text-term-green">[x]</span>
                                <span class="text-light-yellow dark:text-term-yellow">L</span>
                                <span>Lobste.rs</span>
                                <span class="text-light-muted dark:text-term-muted">- Tech discussions</span>
                            </li>
                        </ul>
                    </div>
                </details>

                <!-- Pipeline Overview -->
                <details>
                    <summary class="cursor-pointer font-bold hover:text-light-link dark:hover:text-term-link">## Pipeline (v3)</summary>
                    <div class="pl-3 mt-2 text-sm">
                        <p class="text-light-muted dark:text-term-muted mb-3">
                            8-stage cluster-based pipeline groups related items into emerging themes:
                        </p>
                        <div class="flex flex-wrap gap-2 text-light-muted dark:text-term-muted text-xs">
                            <span>[Fetch]</span>
                            <span class="text-light-link dark:text-term-link">-></span>
                            <span>[Dedup]</span>
                            <span class="text-light-link dark:text-term-link">-></span>
                            <span>[Filter]</span>
                            <span class="text-light-link dark:text-term-link">-></span>
                            <span>[Cluster]</span>
                            <span class="text-light-link dark:text-term-link">-></span>
                            <span>[Score]</span>
                            <span class="text-light-link dark:text-term-link">-></span>
                            <span>[Link]</span>
                            <span class="text-light-link dark:text-term-link">-></span>
                            <span>[Select]</span>
                            <span class="text-light-link dark:text-term-link">-></span>
                            <span>[Output]</span>
                        </div>
                    </div>
                </details>

                <!-- Clustering -->
                <details>
                    <summary class="cursor-pointer font-bold hover:text-light-link dark:hover:text-term-link">## Clustering</summary>
                    <div class="pl-3 mt-2 text-sm">
                        <p class="text-light-muted dark:text-term-muted mb-3">
                            Related items are grouped using TF-IDF similarity (threshold: 0.40):
                        </p>
                        <pre class="bg-light-surface dark:bg-term-surface p-3 border border-light-border dark:border-term-border text-xs">
Item 1: "Claude 3.5 released"       ─┐
Item 2: "Claude benchmarks"         ─┼─> Cluster (3 items)
Item 3: "New Claude API"            ─┘   Show 1-2 representatives</pre>
                        <p class="text-light-muted dark:text-term-muted mt-2">
                            Typical: 300 items → 20-30 clusters
                        </p>
                    </div>
                </details>

                <!-- Cluster Scoring -->
                <details>
                    <summary class="cursor-pointer font-bold hover:text-light-link dark:hover:text-term-link">## Cluster Scoring</summary>
                    <div class="pl-3 mt-2 text-sm">
                        <p class="text-light-muted dark:text-term-muted mb-3">
                            Clusters are ranked by momentum, novelty, and adoption:
                        </p>
                        <pre class="text-light-muted dark:text-term-muted mb-3">
Momentum (60%)   High engagement relative to age (rising fast)
Novelty (30%)    Genuinely new vs rehashed discussions
Adoption (10%)   GitHub stars/forks validation</pre>
                        <pre class="bg-light-surface dark:bg-term-surface p-3 border border-light-border dark:border-term-border text-xs">
cluster_score = (M × 0.60) + (N × 0.30) + (A × 0.10)

Momentum = engagement_percentile / (age_hours + 1)
Novelty = 1 - similarity_to_recent_clusters
Adoption = normalized_github_stars</pre>
                    </div>
                </details>

                <!-- Trend Linking -->
                <details>
                    <summary class="cursor-pointer font-bold hover:text-light-link dark:hover:text-term-link">## Trend Linking</summary>
                    <div class="pl-3 mt-2 text-sm">
                        <p class="text-light-muted dark:text-term-muted mb-3">
                            Clusters are linked to recent trends (last 7 days) for continuity:
                        </p>
                        <pre class="bg-light-surface dark:bg-term-surface p-3 border border-light-border dark:border-term-border text-xs">
Day 1: "GPT-5 announcement" (trend_id: abc-123)
Day 2: "GPT-5 benchmarks"   (linked → abc-123)
Day 3: "Claude 4 release"   (new → def-456)</pre>
                        <p class="text-light-muted dark:text-term-muted mt-2">
                            Linking criteria: similarity ≥ 0.60 AND term overlap ≥ 2
                        </p>
                    </div>
                </details>

                <!-- Deduplication -->
                <details>
                    <summary class="cursor-pointer font-bold hover:text-light-link dark:hover:text-term-link">## Deduplication</summary>
                    <div class="pl-3 mt-2 text-sm">
                        <p class="text-light-muted dark:text-term-muted mb-3">
                            Three-level filtering: URL merge + content hash + history check
                        </p>
                        <pre class="bg-light-surface dark:bg-term-surface p-3 border border-light-border dark:border-term-border text-xs">
HN: "New LLM Framework" (150 pts)  ─┐
Reddit: Same link (200 upvotes)    ─┴─> Merged (2 platforms)</pre>
                    </div>
                </details>

                <!-- Horizontal rule -->
                <div class="text-light-border dark:text-term-border overflow-hidden whitespace-nowrap">────────────────────────────────────────────────────────────────────────────────</div>

                <!-- References -->
                <div>
                    <h2 class="font-bold mb-2">## References</h2>
                    <ul class="pl-3 space-y-1 text-sm">
                        <li>
                            <a href="https://github.com/goyaladitya/ai-brief/blob/main/AGENTS.md"
                               target="_blank" rel="noopener noreferrer"
                               class="text-light-link dark:text-term-link hover:underline">
                                [1] AI Brief: Technical Architecture
                            </a>
                        </li>
                        <li>
                            <a href="https://en.wikipedia.org/wiki/Tf%E2%80%93idf"
                               target="_blank" rel="noopener noreferrer"
                               class="text-light-link dark:text-term-link hover:underline">
                                [2] TF-IDF: Term Frequency-Inverse Document Frequency
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    },

    /**
     * Loading indicator
     */
    loading(message = 'Loading...') {
        return `
            <div class="text-light-muted dark:text-term-muted">
                <span class="spinner">|</span> ${utils.escapeHtml(message)}
            </div>
        `;
    }
};

// Route handlers
const handlers = {
    async home() {
        const app = document.getElementById('app');
        app.innerHTML = templates.loading('Loading brief...');

        try {
            const brief = await api.getLatestBrief();
            const pageTitle = brief ? "Today's Brief" : "No Brief Available";
            app.innerHTML = templates.briefPage(brief, pageTitle, true);
        } catch (error) {
            app.innerHTML = templates.briefPage(null, "Today's Brief");
        }
    },

    async history() {
        const app = document.getElementById('app');
        app.innerHTML = templates.loading('Loading history...');

        const briefs = await api.listBriefs(30);
        app.innerHTML = templates.historyPage(briefs);
    },

    async briefById(params) {
        const app = document.getElementById('app');
        app.innerHTML = templates.loading('Loading brief...');

        const brief = await api.getBriefById(parseInt(params.id));
        const dateDisplay = utils.formatDate(brief.generated_at) + ' at ' + utils.formatTime(brief.generated_at);
        app.innerHTML = templates.briefPage(brief, `Brief from ${dateDisplay}`);
    },

    howItWorks() {
        const app = document.getElementById('app');
        app.innerHTML = templates.howItWorksPage();
    }
};

// Initialize application
function init() {
    // Register routes
    router.on('/', handlers.home);
    router.on('/history', handlers.history);
    router.on('/brief/:id', handlers.briefById);
    router.on('/how-it-works', handlers.howItWorks);

    // Initialize router
    router.init();

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', function() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
    });
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
