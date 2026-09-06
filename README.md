# AI Daily Brief

A curated daily digest of emerging AI trends, aggregated from Hacker News, Reddit, GitHub Trending, ArXiv, Product Hunt, and Lobste.rs.

**Live Site:** [goyaladitya.github.io/ai-brief-pages](https://goyaladitya.github.io/ai-brief-pages)

## About

AI Brief automatically aggregates and ranks AI/ML content using:

- **Multi-source aggregation** from 6 platforms
- **Cross-platform detection** - items trending on multiple platforms score higher
- **Composite scoring** - engagement, freshness, cross-platform presence, relevance
- **Deduplication** - merges duplicate items across sources
- **Diversity filtering** - ensures topic variety

## How It Works

Briefs are generated automatically every day at **3 AM UTC** via GitHub Actions.

The scoring algorithm is inspired by industry-standard content ranking systems from Meta and X (Twitter). Each item receives a composite trend score based on:

| Factor | Weight | Description |
|--------|--------|-------------|
| Engagement | 25% | Points, upvotes, stars |
| Freshness | 25% | How recent the content is |
| Cross-platform | 15% | Appears on multiple sources |
| Relevance | 35% | AI/ML keyword matching |

## Data

This repository contains only the static frontend and generated JSON data:

```
├── index.html
├── js/                    # Frontend JavaScript
├── css/                   # Styles
└── data/
    ├── latest.json        # Today's brief
    ├── briefs.json        # History index
    └── briefs/            # Archived briefs by date
        └── YYYY-MM-DD.json
```

## License

MIT
