// Direct Groq API integration for Chrome extension
// Groq provides fast, free LLM inference

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // Updated to current model

/**
 * Generate insights using Groq API
 */
export async function generateInsights(analysis, timeRange, userProfile = null) {
    console.log('🤖 Groq API - generateInsights called');
    console.log('API Key present:', !!GROQ_API_KEY);
    console.log('Analysis:', analysis);
    console.log('Time Range:', timeRange);
    console.log('User Profile:', userProfile);

    if (!GROQ_API_KEY) {
        throw new Error('Groq API key not configured. Please add VITE_GROQ_API_KEY to your .env file');
    }

    const prompt = buildPrompt(analysis, timeRange, userProfile);
    console.log('📝 Prompt built:', prompt.substring(0, 200) + '...');

    try {
        console.log('🌐 Calling Groq API...');
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [{
                    role: 'system',
                    content: 'You are Gandalf, a wise productivity assistant. Provide insights in JSON format.'
                }, {
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 1024,
                response_format: { type: 'json_object' }
            })
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Groq API error:', error);
            throw new Error(`Groq API error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('📦 Response data:', data);

        const text = data.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error('No response from Groq');
        }

        const insights = parseInsights(text);
        console.log('✅ Insights parsed:', insights);
        return insights;
    } catch (error) {
        console.error('❌ Groq API Error:', error);
        throw error;
    }
}

/**
 * Build prompt for LLM
 */
function buildPrompt(analysis, timeRange, userProfile) {
    // Handle both analysis.details and direct analysis object
    const details = analysis.details || analysis;
    const { totalPages, totalTimeMinutes, peakBrowsingTime, dominantCategory, contextSwitches } = details;

    let prompt = `Analyze this browsing data and provide insights:

**Time Range:** ${timeRange}
**Pages Visited:** ${totalPages || 0}
**Time Spent:** ${Math.floor((totalTimeMinutes || 0) / 60)}h ${Math.round((totalTimeMinutes || 0) % 60)}m
**Peak Activity:** ${peakBrowsingTime || 'Unknown'}
**Main Focus:** ${dominantCategory || 'Mixed'}
**Context Switches:** ${contextSwitches || 0}

`;

    if (userProfile) {
        prompt += `**User Profile:**
- Name: ${userProfile.name || 'Not provided'}
- Age: ${userProfile.age || 'Not provided'}
- Profession: ${userProfile.profession || 'Not provided'}
- Goals: ${userProfile.goals || 'Not provided'}

`;
    }

    prompt += `Provide a JSON response with:
{
  "insight": "1-2 sentence key observation about browsing pattern",
  "score": <number 1-10>,
  "recommendations": ["actionable tip 1", "actionable tip 2", "actionable tip 3"],
  "encouragement": "1 sentence motivational message"
}

Keep it concise, friendly, and actionable.`;

    return prompt;
}

/**
 * Parse LLM response into structured insights
 */
function parseInsights(text) {
    try {
        return JSON.parse(text);
    } catch (error) {
        // Fallback: return raw text
        console.warn('Could not parse JSON, returning fallback');
        return {
            insight: text,
            score: 7,
            recommendations: ['Review the insights above', 'Stay focused on your goals', 'Take regular breaks'],
            encouragement: 'Keep up the good work!'
        };
    }
}

/**
 * Generate weekly summary
 */
export async function generateWeeklySummary(weeklyData) {
    if (!GROQ_API_KEY) {
        throw new Error('Groq API key not configured');
    }

    const prompt = `Create a weekly productivity summary:

${JSON.stringify(weeklyData, null, 2)}

Provide:
1. Overall productivity trend
2. Best day of the week
3. Areas for improvement
4. Next week's focus

Keep it motivational and under 200 words.`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [{
                    role: 'system',
                    content: 'You are Gandalf, creating weekly productivity summaries.'
                }, {
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 512
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate weekly summary');
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'No summary generated';
    } catch (error) {
        console.error('❌ Weekly Summary Error:', error);
        throw error;
    }
}
