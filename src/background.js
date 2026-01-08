// Background service worker for Chrome extension
console.log('Gandalf background service worker loaded');

// Open full-screen tab when extension icon is clicked
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('index.html'),
    });
});

// Set up notification alarms on install
chrome.runtime.onInstalled.addListener(() => {
    setupAlarms();
    console.log('✅ Gandalf alarms initialized');
});

// Setup alarms for goal tracking
function setupAlarms() {
    const now = new Date();

    // Daily alarm at 10pm
    const today10pm = new Date();
    today10pm.setHours(22, 0, 0, 0);

    // If it's past 10pm today, schedule for tomorrow
    if (now > today10pm) {
        today10pm.setDate(today10pm.getDate() + 1);
    }

    chrome.alarms.create('daily-goal-check', {
        when: today10pm.getTime(),
        periodInMinutes: 1440, // 24 hours
    });

    // Weekly alarm on Sunday at 8pm
    const nextSunday = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7; // If today is Sunday, schedule for next Sunday
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(20, 0, 0, 0);

    chrome.alarms.create('weekly-goal-summary', {
        when: nextSunday.getTime(),
        periodInMinutes: 10080, // 7 days
    });

    console.log('📅 Next daily check:', today10pm.toLocaleString());
    console.log('📊 Next weekly summary:', nextSunday.toLocaleString());
}

// Handle alarm notifications
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'daily-goal-check') {
        await handleDailyGoalCheck();
    } else if (alarm.name === 'weekly-goal-summary') {
        await handleWeeklySummary();
    }
});

// Daily goal check at 10pm
async function handleDailyGoalCheck() {
    try {
        // Get user profile with daily goals
        const profile = await getStoredProfile();

        if (!profile || !profile.dailyGoals || profile.dailyGoals.length === 0) {
            console.log('⚠️ No daily goals set, skipping check');
            return;
        }

        // Analyze today's browsing
        const todayHistory = await fetchBrowsingHistory('today');
        const alignment = calculateDailyAlignment(profile.dailyGoals, todayHistory);

        // Create notification
        const completedCount = profile.dailyGoals.filter(g => g.completed).length;
        const totalCount = profile.dailyGoals.length;
        const percentage = Math.round((completedCount / totalCount) * 100);

        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: `🧙 Daily Goal Check: ${percentage}% Complete`,
            message: `${completedCount}/${totalCount} goals completed today. ${alignment.message}`,
            priority: 2,
            requireInteraction: true,
        });

        chrome.action.setBadgeText({ text: `${percentage}%` });
        chrome.action.setBadgeBackgroundColor({
            color: percentage >= 70 ? '#22c55e' : percentage >= 40 ? '#f59e0b' : '#ef4444'
        });

        console.log('✅ Daily goal check completed:', alignment);
    } catch (error) {
        console.error('❌ Daily goal check failed:', error);
    }
}

// Weekly summary on Sunday at 8pm
async function handleWeeklySummary() {
    try {
        // Get user profile with weekly goals
        const profile = await getStoredProfile();

        if (!profile || !profile.weeklyGoals || profile.weeklyGoals.length === 0) {
            console.log('⚠️ No weekly goals set, skipping summary');
            return;
        }

        // Analyze this week's browsing
        const weekHistory = await fetchBrowsingHistory('week');
        const alignment = calculateWeeklyAlignment(profile.weeklyGoals, weekHistory);

        // Calculate average progress
        const avgProgress = Math.round(
            profile.weeklyGoals.reduce((sum, g) => sum + g.progress, 0) / profile.weeklyGoals.length
        );

        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: `🧙 Weekly Summary: ${avgProgress}% Progress`,
            message: `${alignment.message} Click to review your week.`,
            priority: 2,
            requireInteraction: true,
        });

        chrome.action.setBadgeText({ text: '📊' });
        chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' });

        console.log('✅ Weekly summary completed:', alignment);
    } catch (error) {
        console.error('❌ Weekly summary failed:', error);
    }
}

// Calculate daily goal alignment
function calculateDailyAlignment(dailyGoals, historyItems) {
    const completedCount = dailyGoals.filter(g => g.completed).length;
    const totalCount = dailyGoals.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    let message = '';
    if (percentage >= 80) {
        message = 'Excellent work! You crushed your goals today! 🎉';
    } else if (percentage >= 60) {
        message = 'Good progress! Keep pushing tomorrow.';
    } else if (percentage >= 40) {
        message = 'Some progress made. Focus on priorities tomorrow.';
    } else {
        message = 'Tough day. Reset and try again tomorrow.';
    }

    return {
        percentage,
        completed: completedCount,
        total: totalCount,
        message,
        browsingPages: historyItems.length,
    };
}

// Calculate weekly goal alignment
function calculateWeeklyAlignment(weeklyGoals, historyItems) {
    const avgProgress = Math.round(
        weeklyGoals.reduce((sum, g) => sum + g.progress, 0) / weeklyGoals.length
    );

    let message = '';
    if (avgProgress >= 80) {
        message = 'Outstanding week! You\'re on fire! 🔥';
    } else if (avgProgress >= 60) {
        message = 'Solid progress this week. Keep it up!';
    } else if (avgProgress >= 40) {
        message = 'Moderate progress. Push harder next week.';
    } else {
        message = 'Slow week. Time to refocus and prioritize.';
    }

    return {
        avgProgress,
        goalsCount: weeklyGoals.length,
        message,
        browsingPages: historyItems.length,
    };
}

// Get stored user profile
async function getStoredProfile() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['gandalf_user_profile'], (result) => {
            if (result.gandalf_user_profile) {
                resolve(JSON.parse(result.gandalf_user_profile));
            } else {
                // Fallback to localStorage (for compatibility)
                resolve(null);
            }
        });
    });
}

// Fetch browsing history
async function fetchBrowsingHistory(timeRange = 'today') {
    let startTime;

    switch (timeRange) {
        case 'last24h':
            // Rolling 24-hour window (now - 24 hours)
            startTime = Date.now() - (24 * 60 * 60 * 1000);
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
        default:
            // Default to today (midnight)
            const defaultToday = new Date();
            defaultToday.setHours(0, 0, 0, 0);
            startTime = defaultToday.getTime();
    }

    return new Promise((resolve, reject) => {
        chrome.history.search(
            {
                text: '',
                startTime: startTime,
                maxResults: 10000,
            },
            (historyItems) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                resolve(historyItems);
            }
        );
    });
}

// Handle notification clicks
chrome.notifications.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL('index.html'),
    });

    // Clear badge
    chrome.action.setBadgeText({ text: '' });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getHistory') {
        fetchBrowsingHistory(request.timeRange)
            .then((data) => sendResponse({ success: true, data }))
            .catch((error) => sendResponse({ success: false, error: error.message }));
        return true; // Keep channel open for async response
    } else if (request.action === 'syncProfile') {
        // Sync profile to chrome.storage for background access
        chrome.storage.local.set({ gandalf_user_profile: request.profile }, () => {
            sendResponse({ success: true });
        });
        return true;
    }
});

console.log('🧙 Gandalf background worker ready');
