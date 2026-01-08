/**
 * Analyzes browsing history and generates patterns WITHOUT LLM
 * Supports ALL websites, not just YouTube
 */

export class HistoryAnalyzer {
    constructor(historyItems) {
        this.historyItems = historyItems;
    }

    // Process all browsing history
    getAllHistory() {
        return this.historyItems
            .map(item => ({
                title: item.title || 'Untitled',
                url: item.url,
                domain: this.extractDomain(item.url),
                visitTime: new Date(item.lastVisitTime),
                visitCount: item.visitCount || 1,
            }))
            .sort((a, b) => b.visitTime - a.visitTime);
    }

    // Extract domain from URL
    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch {
            return 'unknown';
        }
    }

    // Cluster by time of day
    getTimePatterns(items) {
        const patterns = {
            morning: [], // 6am - 12pm
            afternoon: [], // 12pm - 6pm
            evening: [], // 6pm - 10pm
            night: [], // 10pm - 6am
        };

        items.forEach(item => {
            const hour = item.visitTime.getHours();
            if (hour >= 6 && hour < 12) patterns.morning.push(item);
            else if (hour >= 12 && hour < 18) patterns.afternoon.push(item);
            else if (hour >= 18 && hour < 22) patterns.evening.push(item);
            else patterns.night.push(item);
        });

        return patterns;
    }

    // Categorize websites by domain and ACTUAL CONTENT (title-based)
    categorizeContent(items) {
        const categories = {
            learning: {
                educational: [],    // Educational videos, courses
                tutorials: [],      // How-to guides, tutorials
                documentation: [],  // Docs, technical reading
            },
            entertainment: {
                videos: [],         // Entertainment videos
                gaming: [],         // Gaming content
                social: [],         // Social media browsing
                music: [],          // Music, podcasts
            },
            work: {
                emails: [],         // Email, communication
                meetings: [],       // Zoom, Meet
                productivity: [],   // Docs, Sheets, Notion
            },
            development: {
                coding: [],         // GitHub, Stack Overflow
                research: [],       // Tech blogs, articles
            },
            news: [],
            shopping: [],
            other: [],
        };

        // Enhanced keyword matching for granular categorization
        const contentKeywords = {
            learning: {
                educational: ['tutorial', 'course', 'lecture', 'learn', 'explained', 'introduction to',
                    'beginner', 'advanced', 'masterclass', 'bootcamp', 'certification'],
                tutorials: ['how to', 'guide', 'step by step', 'walkthrough', 'demo', 'build', 'create'],
                documentation: ['docs', 'documentation', 'api', 'reference', 'manual', 'specification'],
            },
            entertainment: {
                videos: ['vlog', 'review', 'unboxing', 'reaction', 'compilation', 'highlights', 'top 10',
                    'best of', 'funny', 'comedy', 'prank'],
                gaming: ['gameplay', 'gaming', 'playthrough', 'let\'s play', 'game', 'esports', 'stream'],
                music: ['music', 'song', 'album', 'playlist', 'podcast', 'audio', 'listen'],
            },
            development: {
                coding: ['code', 'programming', 'javascript', 'python', 'react', 'node', 'git', 'debug',
                    'algorithm', 'data structure', 'leetcode', 'coding challenge'],
                research: ['architecture', 'design pattern', 'best practices', 'performance', 'optimization',
                    'scalability', 'microservices', 'devops'],
            },
        };

        items.forEach(item => {
            const title = item.title.toLowerCase();
            const domain = item.domain;
            let categorized = false;

            // Special handling for YouTube - categorize by title content
            if (domain.includes('youtube.com')) {
                // Check if educational
                if (this.matchesKeywords(title, contentKeywords.learning.educational)) {
                    categories.learning.educational.push(item);
                    categorized = true;
                } else if (this.matchesKeywords(title, contentKeywords.learning.tutorials)) {
                    categories.learning.tutorials.push(item);
                    categorized = true;
                } else if (this.matchesKeywords(title, contentKeywords.entertainment.gaming)) {
                    categories.entertainment.gaming.push(item);
                    categorized = true;
                } else if (this.matchesKeywords(title, contentKeywords.entertainment.music)) {
                    categories.entertainment.music.push(item);
                    categorized = true;
                } else {
                    // Default to entertainment videos
                    categories.entertainment.videos.push(item);
                    categorized = true;
                }
            }

            // Development platforms
            else if (domain.includes('github.com') || domain.includes('stackoverflow.com') ||
                domain.includes('gitlab.com')) {
                categories.development.coding.push(item);
                categorized = true;
            }

            // Tech blogs and articles
            else if (domain.includes('medium.com') || domain.includes('dev.to') ||
                domain.includes('hackernoon.com') || domain.includes('techcrunch.com')) {
                if (this.matchesKeywords(title, contentKeywords.development.coding) ||
                    this.matchesKeywords(title, contentKeywords.development.research)) {
                    categories.development.research.push(item);
                } else {
                    categories.news.push(item);
                }
                categorized = true;
            }

            // Social media
            else if (domain.includes('twitter.com') || domain.includes('x.com') ||
                domain.includes('facebook.com') || domain.includes('instagram.com') ||
                domain.includes('reddit.com') || domain.includes('tiktok.com')) {
                categories.entertainment.social.push(item);
                categorized = true;
            }

            // Work/productivity
            else if (domain.includes('gmail.com') || domain.includes('outlook.com')) {
                categories.work.emails.push(item);
                categorized = true;
            }
            else if (domain.includes('zoom.us') || domain.includes('meet.google.com') ||
                domain.includes('teams.microsoft.com')) {
                categories.work.meetings.push(item);
                categorized = true;
            }
            else if (domain.includes('notion.so') || domain.includes('docs.google.com') ||
                domain.includes('sheets.google.com') || domain.includes('trello.com')) {
                categories.work.productivity.push(item);
                categorized = true;
            }

            // Shopping
            else if (domain.includes('amazon.com') || domain.includes('flipkart.com') ||
                domain.includes('ebay.com')) {
                categories.shopping.push(item);
                categorized = true;
            }

            // News
            else if (domain.includes('nytimes.com') || domain.includes('bbc.com') ||
                domain.includes('cnn.com') || domain.includes('reuters.com')) {
                categories.news.push(item);
                categorized = true;
            }

            // Fallback: categorize by title keywords
            if (!categorized) {
                if (this.matchesKeywords(title, contentKeywords.learning.educational) ||
                    this.matchesKeywords(title, contentKeywords.learning.tutorials)) {
                    categories.learning.tutorials.push(item);
                    categorized = true;
                } else if (this.matchesKeywords(title, contentKeywords.development.coding)) {
                    categories.development.coding.push(item);
                    categorized = true;
                }
            }

            // If still not categorized, put in 'other'
            if (!categorized) {
                categories.other.push(item);
            }
        });

        return categories;
    }

    // Helper: Check if title matches any keywords
    matchesKeywords(title, keywords) {
        return keywords.some(keyword => title.includes(keyword));
    }

    // Get top domains visited
    getTopDomains(items, limit = 10) {
        const domainCounts = {};

        items.forEach(item => {
            domainCounts[item.domain] = (domainCounts[item.domain] || 0) + item.visitCount;
        });

        return Object.entries(domainCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([domain, count]) => ({ domain, count }));
    }

    // Calculate total time spent (estimate based on number of pages visited)
    estimateTimeSpent(items, timeRange = 'today') {
        // More realistic estimate: 
        // - Each unique page visit = ~2 minutes average
        // - Cap at 16 hours per day (reasonable max for active browsing)
        const avgMinutesPerPage = 2;
        const uniquePages = items.length; // Each item in the filtered range is a unique page visit
        const estimatedMinutes = uniquePages * avgMinutesPerPage;


        // Scale cap based on time range (assuming reasonable active browsing per day)
        const capsPerRange = {
            'today': 16 * 60,      // 16 hours max for a single day
            'week': 7 * 10 * 60,   // ~10 hours/day * 7 days = 70 hours
            'month': 30 * 8 * 60,  // ~8 hours/day * 30 days = 240 hours
            'year': 365 * 6 * 60,  // ~6 hours/day * 365 days = 2190 hours
            'all': Infinity        // No cap for all-time
        };

        const maxMinutes = capsPerRange[timeRange] || capsPerRange['today'];
        return Math.min(estimatedMinutes, maxMinutes);
    }

    // Detect context switching (rapid domain changes)
    detectContextSwitching(items) {
        let switches = 0;
        for (let i = 1; i < items.length; i++) {
            if (items[i].domain !== items[i - 1].domain) {
                switches++;
            }
        }
        return switches;
    }

    // NEW: Extract top content examples for LLM
    getTopContentExamples(categories, limit = 10) {
        const examples = {
            learning: {
                educational: [],
                tutorials: [],
                documentation: [],
            },
            entertainment: {
                videos: [],
                gaming: [],
                social: [],
                music: [],
            },
            development: {
                coding: [],
                research: [],
            },
        };

        // Extract top titles from each subcategory
        if (categories.learning) {
            examples.learning.educational = categories.learning.educational
                .slice(0, limit)
                .map(item => ({ title: item.title, domain: item.domain }));
            examples.learning.tutorials = categories.learning.tutorials
                .slice(0, limit)
                .map(item => ({ title: item.title, domain: item.domain }));
            examples.learning.documentation = categories.learning.documentation
                .slice(0, limit)
                .map(item => ({ title: item.title, domain: item.domain }));
        }

        if (categories.entertainment) {
            examples.entertainment.videos = categories.entertainment.videos
                .slice(0, limit)
                .map(item => ({ title: item.title, domain: item.domain }));
            examples.entertainment.gaming = categories.entertainment.gaming
                .slice(0, limit)
                .map(item => ({ title: item.title, domain: item.domain }));
            examples.entertainment.social = categories.entertainment.social
                .slice(0, limit)
                .map(item => ({ title: item.title, domain: item.domain }));
        }

        if (categories.development) {
            examples.development.coding = categories.development.coding
                .slice(0, limit)
                .map(item => ({ title: item.title, domain: item.domain }));
            examples.development.research = categories.development.research
                .slice(0, limit)
                .map(item => ({ title: item.title, domain: item.domain }));
        }

        return examples;
    }

    // Helper: Flatten nested categories for counting
    flattenCategories(categories) {
        const flattened = {};

        for (const [mainCat, subCats] of Object.entries(categories)) {
            if (Array.isArray(subCats)) {
                flattened[mainCat] = subCats;
            } else if (typeof subCats === 'object') {
                for (const [subCat, items] of Object.entries(subCats)) {
                    flattened[`${mainCat}_${subCat}`] = items;
                }
            }
        }

        return flattened;
    }

    // Detect browsing patterns
    detectPatterns(items, timeRange = 'today') {
        const timePatterns = this.getTimePatterns(items);
        const categories = this.categorizeContent(items);
        const topDomains = this.getTopDomains(items);
        const totalTime = this.estimateTimeSpent(items, timeRange);
        const contextSwitches = this.detectContextSwitching(items);
        const contentExamples = this.getTopContentExamples(categories, 10);

        // Find peak browsing time
        const peakTime = Object.entries(timePatterns)
            .sort((a, b) => b[1].length - a[1].length)[0];

        // Find dominant category (flatten nested structure)
        const flatCategories = this.flattenCategories(categories);
        const dominantCategory = Object.entries(flatCategories)
            .filter(([key]) => key !== 'other')
            .sort((a, b) => b[1].length - a[1].length)[0];

        return {
            totalPages: items.length,
            totalTimeMinutes: totalTime,
            peakBrowsingTime: peakTime[0],
            peakBrowsingCount: peakTime[1].length,
            dominantCategory: dominantCategory ? dominantCategory[0] : 'mixed',
            dominantCategoryCount: dominantCategory ? dominantCategory[1].length : 0,
            contextSwitches,
            topDomains,
            timePatterns,
            categories,
            contentExamples, // NEW: Actual content for LLM
        };
    }

    // Generate human-readable summary
    generateSummary(timeRange = 'today') {
        const allHistory = this.getAllHistory();

        if (allHistory.length === 0) {
            return {
                summary: "No browsing activity detected in this time period.",
                details: null,
            };
        }

        const patterns = this.detectPatterns(allHistory, timeRange);
        const hours = Math.floor(patterns.totalTimeMinutes / 60);
        const minutes = patterns.totalTimeMinutes % 60;

        let summary = `You visited ${patterns.totalPages} pages`;

        if (hours > 0) {
            summary += ` (~${hours}h ${minutes}m estimated)`;
        } else {
            summary += ` (~${minutes}m estimated)`;
        }

        summary += `. Peak activity: ${patterns.peakBrowsingTime}`;

        if (patterns.dominantCategory !== 'mixed') {
            summary += `. Mostly ${patterns.dominantCategory} activity`;
        }

        if (patterns.contextSwitches > 20) {
            summary += `. High context-switching detected (${patterns.contextSwitches} switches)`;
        }

        return {
            summary,
            details: patterns,
            recentPages: allHistory.slice(0, 20),
            categoryBreakdown: Object.fromEntries(
                Object.entries(patterns.categories).map(([cat, items]) => [cat, items.length])
            )
        };
    }
}

/**
 * Main function to analyze browsing history for a given time range
 */
export default async function analyzeBrowsingHistory(timeRange = 'today') {
    const msPerDay = 24 * 60 * 60 * 1000;
    let startTime;

    switch (timeRange) {
        case 'last24h':
            // Rolling 24-hour window (now - 24 hours)
            startTime = Date.now() - msPerDay;
            break;
        case 'today':
            // Start from midnight of current day (calendar-based)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            startTime = today.getTime();
            break;
        case 'week':
            // Start from midnight 7 days ago
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            weekAgo.setHours(0, 0, 0, 0);
            startTime = weekAgo.getTime();
            break;
        case 'month':
            // Start from midnight 30 days ago
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            monthAgo.setHours(0, 0, 0, 0);
            startTime = monthAgo.getTime();
            break;
        case 'year':
            // Start from midnight 365 days ago
            const yearAgo = new Date();
            yearAgo.setDate(yearAgo.getDate() - 365);
            yearAgo.setHours(0, 0, 0, 0);
            startTime = yearAgo.getTime();
            break;
        case 'all':
            startTime = 0;
            break;
        default:
            // Default to today (midnight)
            const defaultToday = new Date();
            defaultToday.setHours(0, 0, 0, 0);
            startTime = defaultToday.getTime();
    }

    const historyItems = await chrome.history.search({
        text: '',
        startTime: startTime,
        maxResults: 10000
    });

    const analyzer = new HistoryAnalyzer(historyItems);
    return analyzer.generateSummary(timeRange);
}
