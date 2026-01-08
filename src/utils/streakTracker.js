// Streak and achievement tracking utility

const STORAGE_KEY = 'gandalf_streak_data';

export function getStreakData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            lastCheckIn: null,
            totalCheckIns: 0,
            achievements: [],
        };
    }
    return JSON.parse(data);
}

export function updateStreak() {
    const data = getStreakData();
    const today = new Date().toDateString();
    const lastCheckIn = data.lastCheckIn;

    // If already checked in today, don't update
    if (lastCheckIn === today) {
        return data;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    // Check if streak continues
    if (lastCheckIn === yesterdayStr) {
        // Streak continues
        data.currentStreak += 1;
    } else if (lastCheckIn === null) {
        // First check-in
        data.currentStreak = 1;
    } else {
        // Streak broken, reset
        data.currentStreak = 1;
    }

    data.lastCheckIn = today;
    data.totalCheckIns += 1;
    data.longestStreak = Math.max(data.longestStreak, data.currentStreak);

    // Check for achievements
    checkAchievements(data);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
}

function checkAchievements(data) {
    const achievements = data.achievements || [];

    // Achievement: First Step
    if (data.currentStreak >= 1 && !achievements.includes('first_step')) {
        achievements.push('first_step');
        showAchievementNotification('First Step', 'You started your mindful browsing journey!');
    }

    // Achievement: Week Warrior
    if (data.currentStreak >= 7 && !achievements.includes('week_warrior')) {
        achievements.push('week_warrior');
        showAchievementNotification('Week Warrior', '7-day streak! You\'re building a habit!');
    }

    // Achievement: Mindful Browser
    if (data.currentStreak >= 30 && !achievements.includes('mindful_browser')) {
        achievements.push('mindful_browser');
        showAchievementNotification('Mindful Browser', '30-day streak! You\'re a master of mindful browsing!');
    }

    // Achievement: Century Club
    if (data.totalCheckIns >= 100 && !achievements.includes('century_club')) {
        achievements.push('century_club');
        showAchievementNotification('Century Club', '100 check-ins! You\'re committed to growth!');
    }

    data.achievements = achievements;
}

function showAchievementNotification(title, message) {
    // Show browser notification if available
    if (chrome?.notifications) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon128.png',
            title: `🏆 Achievement Unlocked: ${title}`,
            message: message,
            priority: 2,
        });
    }
}

export function getAchievementsList() {
    return [
        {
            id: 'first_step',
            title: 'First Step',
            description: 'Start your mindful browsing journey',
            icon: '🎯',
            requirement: '1-day streak',
        },
        {
            id: 'week_warrior',
            title: 'Week Warrior',
            description: 'Maintain a 7-day streak',
            icon: '🔥',
            requirement: '7-day streak',
        },
        {
            id: 'mindful_browser',
            title: 'Mindful Browser',
            description: 'Achieve a 30-day streak',
            icon: '🧘',
            requirement: '30-day streak',
        },
        {
            id: 'century_club',
            title: 'Century Club',
            description: 'Complete 100 check-ins',
            icon: '💯',
            requirement: '100 check-ins',
        },
    ];
}
