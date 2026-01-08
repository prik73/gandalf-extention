import dotenv from 'dotenv';
dotenv.config();

/**
 * LLM Service supporting multiple providers:
 * - Ollama (local, free)
 * - OpenAI (paid)
 * - Groq (free tier)
 */

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'ollama';

/**
 * Generate insights using Ollama (local, free)
 */
async function generateWithOllama(prompt) {
    const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

    try {
        const response = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 300,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('❌ Ollama API Error:', error.message);
        throw new Error('Failed to generate insights with Ollama. Make sure Ollama is running: ollama serve');
    }
}

/**
 * Generate insights using OpenAI
 */
async function generateWithOpenAI(prompt) {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const completion = await openai.chat.completions.create({
            model: process.env.LLM_MODEL || 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a behavioral analyst who provides insightful, actionable feedback about browsing patterns. Be specific and psychologically astute.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('❌ OpenAI API Error:', error.message);
        throw new Error('Failed to generate insights from OpenAI');
    }
}

/**
 * Generate insights using Google Gemini (free tier)
 */
async function generateWithGemini(prompt) {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Model name should be just the model name, not include "models/" prefix
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('❌ Gemini API Error:', error.message);
        throw new Error('Failed to generate insights with Gemini');
    }
}

/**
 * Generate insights using Groq (free tier)
 */
async function generateWithGroq(prompt) {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-70b-versatile';

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a behavioral analyst who provides insightful, actionable feedback about browsing patterns.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 300,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Groq API Response:', response.status, errorText);
            throw new Error(`Groq error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('❌ Groq API Error:', error.message);
        throw new Error('Failed to generate insights with Groq');
    }
}

/**
 * Generate insights from browsing history using configured LLM
 */
export async function generateInsights(historyData, timeRange = 'today', userProfile = null) {
    // Handle both formats: analysis.details or direct historyData
    const data = historyData?.details || historyData;

    if (!data) {
        throw new Error('No browsing data provided');
    }

    const {
        totalPages = 0,
        totalTimeMinutes = 0,
        peakBrowsingTime = 'unknown',
        dominantCategory = 'mixed',
        categories = {},
        timePatterns = {},
        topDomains = [],
        contextSwitches = 0
    } = data;

    const topDomainsText = topDomains?.slice(0, 5).map(d => `${d.domain} (${d.count} visits)`).join(', ') || 'N/A';

    // Build user context if profile exists
    const userContext = userProfile ? `
**User Profile:**
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Profession: ${userProfile.profession}
- Goals (6-12 months): ${userProfile.goals}
` : '';

    const prompt = `You are Gandalf, a wise digital mentor analyzing ${userProfile ? userProfile.name + "'s" : "someone's"} browsing patterns.

${userProfile ? `
**About ${userProfile.name}:**
- Age: ${userProfile.age}
- Profession: ${userProfile.profession}
- Goals: ${userProfile.goals}
` : ''}

**Browsing Summary (${timeRange}):**
- **${totalPages} pages** visited
- **${Math.floor(totalTimeMinutes / 60)}h ${totalTimeMinutes % 60}m** total time
- **Peak activity:** ${peakBrowsingTime}
- **Main category:** ${dominantCategory}
- **Context switches:** ${contextSwitches}
- **Top sites:** ${topDomainsText}

**ACTUAL CONTENT CONSUMED:**

${data.contentExamples ? `
**Educational Content:**
${data.contentExamples.learning?.educational?.slice(0, 5).map(item => `- "${item.title}"`).join('\n') || '- None'}

**Tutorials:**
${data.contentExamples.learning?.tutorials?.slice(0, 5).map(item => `- "${item.title}"`).join('\n') || '- None'}

**Entertainment Videos:**
${data.contentExamples.entertainment?.videos?.slice(0, 5).map(item => `- "${item.title}"`).join('\n') || '- None'}

**Gaming:**
${data.contentExamples.entertainment?.gaming?.slice(0, 5).map(item => `- "${item.title}"`).join('\n') || '- None'}

**Social Media:**
${data.contentExamples.entertainment?.social?.slice(0, 5).map(item => `- "${item.title}" (${item.domain})`).join('\n') || '- None'}

**Coding/Development:**
${data.contentExamples.development?.coding?.slice(0, 5).map(item => `- "${item.title}"`).join('\n') || '- None'}

**Tech Articles:**
${data.contentExamples.development?.research?.slice(0, 5).map(item => `- "${item.title}"`).join('\n') || '- None'}
` : ''}

**Your Task:**
Analyze the ACTUAL CONTENT above (not just domains). Provide specific insights about what topics they're learning, what they're consuming for entertainment, and how it aligns with their goals.

Provide a brief, insightful analysis in this EXACT format:

---

**🎯 THE PATTERN I SEE**

[2-3 sentences describing the most important pattern you notice. Be specific with numbers.]

**⚠️ WHAT CONCERNS ME**

• [First concern with specific data]
• [Second concern if critical]

**✅ WHAT'S WORKING**

• [One positive pattern observed]

${userProfile ? `
**🎯 ALIGNMENT WITH YOUR GOALS**

Goal: "${userProfile.goals.split(',')[0].trim()}"

[2 sentences: How does their browsing align or misalign with this goal? Be honest and specific.]
` : ''}

**💡 MY ADVICE**

1. [Specific, actionable step with tool/method]
2. [Another concrete action]
3. [Third action if needed]

---

**CRITICAL RULES:**
- MAX 150 words total
- Be conversational, not formal
- Use **bold** for key numbers and terms
- Be brutally honest but supportive
${userProfile ? `- Address ${userProfile.name} directly\n- Reference their goal: ${userProfile.goals}` : ''}
- Give SPECIFIC actions, not vague advice
- Mention actual tools/apps when relevant

Now provide this analysis for the actual data above. Be concise and actionable.`;

    // Route to appropriate LLM provider
    switch (LLM_PROVIDER.toLowerCase()) {
        case 'gemini':
            return await generateWithGemini(prompt);
        case 'ollama':
            return await generateWithOllama(prompt);
        case 'openai':
            return await generateWithOpenAI(prompt);
        case 'groq':
            return await generateWithGroq(prompt);
        default:
            throw new Error(`Unknown LLM provider: ${LLM_PROVIDER}. Use 'gemini', 'ollama', 'groq', or 'openai'`);
    }
}


/**
 * Generate weekly summary insights
 */
export async function generateWeeklySummary(weeklyData) {
    const prompt = `Analyze this week's browsing patterns and provide a comprehensive weekly summary.

    ** Weekly Stats:**
        ${weeklyData.map(day => `
Day: ${day.date}
- Pages: ${day.totalPages || day.totalVideos}
- Time: ${day.totalTimeMinutes}min
- Peak: ${day.peakBrowsingTime}
- Category: ${day.dominantCategory}
`).join('\n')
        }

** Provide:**
    1. Most productive day and why
2. Patterns across the week
3. Behavioral insights(context - switching, focus, drift)
4. One actionable recommendation

Keep it under 200 words.Be specific and insightful.`;

    // Route to appropriate LLM provider
    switch (LLM_PROVIDER.toLowerCase()) {
        case 'gemini':
            return await generateWithGemini(prompt);
        case 'ollama':
            return await generateWithOllama(prompt);
        case 'openai':
            return await generateWithOpenAI(prompt);
        case 'groq':
            return await generateWithGroq(prompt);
        default:
            throw new Error(`Unknown LLM provider: ${LLM_PROVIDER} `);
    }
}
