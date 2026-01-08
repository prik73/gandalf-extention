-- Initialize Gandalf database schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS browsing_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(user_id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    time_range VARCHAR(50) NOT NULL, -- 'today', 'week', 'month'
    history_data JSONB NOT NULL,
    total_videos INTEGER,
    total_time_minutes INTEGER,
    peak_browsing_time VARCHAR(50),
    dominant_category VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, session_date, time_range)
);

CREATE TABLE IF NOT EXISTS llm_insights (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES browsing_sessions(id) ON DELETE CASCADE,
    insight_text TEXT NOT NULL,
    llm_model VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_browsing_sessions_user_date ON browsing_sessions(user_id, session_date DESC);
CREATE INDEX idx_llm_insights_session ON llm_insights(session_id);

-- Sample data for testing
INSERT INTO users (user_id) VALUES ('test-user-123') ON CONFLICT DO NOTHING;
