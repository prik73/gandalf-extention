import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import { generateInsights, generateWeeklySummary } from './llmService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Save browsing session
app.post('/api/sessions', async (req, res) => {
    const { userId, timeRange, historyData, analysis } = req.body;

    if (!userId || !timeRange || !historyData || !analysis) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Ensure user exists
        await pool.query(
            'INSERT INTO users (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
            [userId]
        );

        // Save session
        const result = await pool.query(
            `INSERT INTO browsing_sessions 
       (user_id, session_date, time_range, history_data, total_videos, total_time_minutes, peak_browsing_time, dominant_category)
       VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, session_date, time_range) 
       DO UPDATE SET 
         history_data = EXCLUDED.history_data,
         total_videos = EXCLUDED.total_videos,
         total_time_minutes = EXCLUDED.total_time_minutes,
         peak_browsing_time = EXCLUDED.peak_browsing_time,
         dominant_category = EXCLUDED.dominant_category,
         created_at = NOW()
       RETURNING id`,
            [
                userId,
                timeRange,
                JSON.stringify(historyData),
                analysis.totalVideos,
                analysis.totalTimeMinutes,
                analysis.peakBrowsingTime,
                analysis.dominantCategory
            ]
        );

        res.json({
            success: true,
            sessionId: result.rows[0].id,
            message: 'Session saved successfully'
        });
    } catch (error) {
        console.error('❌ Database error:', error);
        res.status(500).json({ error: 'Failed to save session' });
    }
});

// Generate LLM insights for a session
app.post('/api/insights', async (req, res) => {
    const { userId, timeRange, analysis, userProfile } = req.body;

    if (!userId || !timeRange || !analysis) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        console.log('📥 Insights request received');
        console.log('Analysis data:', JSON.stringify(analysis?.details || {}, null, 2));

        // Generate insights using LLM with user profile
        const insights = await generateInsights(analysis, timeRange, userProfile);

        console.log('✅ Insights generated successfully');
        console.log('Insights preview:', insights?.substring(0, 100) + '...');

        // Try to save to database if session exists, but don't fail if it doesn't
        try {
            const sessionResult = await pool.query(
                'SELECT id FROM browsing_sessions WHERE user_id = $1 AND session_date = CURRENT_DATE AND time_range = $2',
                [userId, timeRange]
            );

            if (sessionResult.rows.length > 0) {
                const sessionId = sessionResult.rows[0].id;
                await pool.query(
                    'INSERT INTO llm_insights (session_id, insights, generated_at) VALUES ($1, $2, NOW())',
                    [sessionId, insights]
                );
                console.log('💾 Insights saved to database');
            } else {
                console.log('⚠️ No session found, returning insights without saving');
            }
        } catch (dbError) {
            console.warn('⚠️ Database save failed, but returning insights anyway:', dbError.message);
        }

        // Return insights directly as string
        res.json({
            success: true,
            insights: insights
        });
    } catch (error) {
        console.error('❌ LLM error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate insights'
        });
    }
});

// Get user's browsing history
app.get('/api/history/:userId', async (req, res) => {
    const { userId } = req.params;
    const { limit = 30 } = req.query;

    try {
        const result = await pool.query(
            `SELECT 
        bs.id,
        bs.session_date,
        bs.time_range,
        bs.total_videos,
        bs.total_time_minutes,
        bs.peak_browsing_time,
        bs.dominant_category,
        bs.created_at,
        li.insight_text,
        li.llm_model
       FROM browsing_sessions bs
       LEFT JOIN llm_insights li ON bs.id = li.session_id
       WHERE bs.user_id = $1
       ORDER BY bs.session_date DESC, bs.created_at DESC
       LIMIT $2`,
            [userId, limit]
        );

        res.json({
            success: true,
            history: result.rows
        });
    } catch (error) {
        console.error('❌ Database error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Generate weekly summary
app.post('/api/weekly-summary', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        // Get last 7 days of data
        const result = await pool.query(
            `SELECT 
        session_date as date,
        total_videos,
        total_time_minutes,
        peak_browsing_time,
        dominant_category
       FROM browsing_sessions
       WHERE user_id = $1 
         AND session_date >= CURRENT_DATE - INTERVAL '7 days'
         AND time_range = 'today'
       ORDER BY session_date ASC`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No data available for weekly summary' });
        }

        const weeklyInsights = await generateWeeklySummary(result.rows);

        res.json({
            success: true,
            weeklyInsights,
            daysAnalyzed: result.rows.length
        });
    } catch (error) {
        console.error('❌ Error generating weekly summary:', error);
        res.status(500).json({ error: error.message || 'Failed to generate weekly summary' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Gandalf backend running on http://localhost:${PORT}`);
    console.log(`📊 Database: ${process.env.DATABASE_URL?.split('@')[1] || 'Not configured'}`);
    console.log(`🤖 LLM Provider: ${process.env.LLM_PROVIDER || 'openai'}`);
});
