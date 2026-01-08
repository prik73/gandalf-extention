// API Client - now calls Gemini directly (no backend needed)
import { generateInsights, generateWeeklySummary } from './geminiService';

// Generate a simple user ID for analytics
function getUserId() {
    let userId = localStorage.getItem('gandalf_user_id');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('gandalf_user_id', userId);
    }
    return userId;
}

/**
 * Get LLM insights - now calls Gemini directly
 */
export async function getLLMInsights(analysis, timeRange, userProfile = null) {
    try {
        return await generateInsights(analysis, timeRange, userProfile);
    } catch (error) {
        console.error('Failed to generate insights:', error);
        throw error;
    }
}

/**
 * Get weekly summary
 */
export async function getWeeklySummary(weeklyData) {
    try {
        return await generateWeeklySummary(weeklyData);
    } catch (error) {
        console.error('Failed to generate weekly summary:', error);
        throw error;
    }
}

// Export getUserId for other modules
export { getUserId };
