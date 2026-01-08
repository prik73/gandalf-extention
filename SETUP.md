# 🚀 Full Setup Guide - Gandalf with Backend & LLM

## Overview

This guide will help you set up:
1. ✅ PostgreSQL database (Docker)
2. ✅ Node.js backend API
3. ✅ Chrome extension (full-screen)
4. ✅ LLM integration (OpenAI)

---

## Part 1: Database Setup (PostgreSQL in Docker)

### 1.1 Start PostgreSQL

```bash
# From project root
docker-compose up -d
```

This will:
- Start PostgreSQL on port 5432
- Create database `gandalf_db`
- Run initialization script (`backend/init.sql`)
- Create tables: `users`, `browsing_sessions`, `llm_insights`

### 1.2 Verify Database

```bash
# Check if container is running
docker ps | grep gandalf-postgres

# Connect to database (optional)
docker exec -it gandalf-postgres psql -U gandalf -d gandalf_db

# Inside psql, check tables:
\dt

# Exit psql
\q
```

---

## Part 2: Backend API Setup

### 2.1 Install Dependencies

```bash
cd backend
npm install
```

### 2.2 Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

**Required configuration:**

```env
# Database (already configured for Docker)
DATABASE_URL=postgresql://gandalf:gandalf_password@localhost:5432/gandalf_db

# OpenAI API Key (GET FROM: https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-actual-api-key-here

# Server settings
PORT=3000
NODE_ENV=development
LLM_MODEL=gpt-4
```

### 2.3 Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
🚀 Gandalf backend running on http://localhost:3000
📊 Database: localhost:5432/gandalf_db
🤖 LLM Provider: openai
```

### 2.4 Test Backend

```bash
# Health check
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-01-05T..."}
```

---

## Part 3: Chrome Extension Setup

### 3.1 Build Extension

```bash
# From project root (not backend folder)
cd ..
npm run build
```

This creates the `dist/` folder with the compiled extension.

### 3.2 Load in Chrome

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right)
3. Click **"Load unpacked"**
4. Navigate to: `/home/priyanshu/Desktop/chrome-extention/gandalf/dist`
5. Click **"Select Folder"**

### 3.3 Verify Installation

- You should see "Gandalf - Browser History Recap" in your extensions
- The wizard icon 🧙 appears in Chrome toolbar
- Click it → Opens full-screen tab (not popup!)

---

## Part 4: Using the Extension

### 4.1 Grant Permissions

First time you click the extension:
- Chrome asks for "Read browsing history" permission
- Click **"Allow"**

### 4.2 View Analysis

1. Click Gandalf icon → Opens full-screen tab
2. Select time range: **Today** / **Week** / **Month**
3. See your YouTube browsing patterns:
   - Total videos watched
   - Time patterns (morning/afternoon/evening/night)
   - Content categories (learning/entertainment/music/news)
   - Recent videos list

### 4.3 Generate AI Insights

1. After viewing analysis, click **"Generate"** button in "AI Insights" section
2. Wait ~5-10 seconds (calling OpenAI API)
3. See psychological insights about your browsing behavior

**Example AI Insight:**
> "Your browsing today suggests active learning mode. You engaged with 12 tutorial videos between 2-5pm, indicating focused skill acquisition. However, after 8pm, there's a shift to passive consumption (music and entertainment), which is a healthy decompression pattern. No concerning context-switching detected."

---

## Part 5: API Endpoints Reference

### Save Session
```bash
POST http://localhost:3000/api/sessions
Content-Type: application/json

{
  "userId": "user_abc123",
  "timeRange": "today",
  "historyData": [...],
  "analysis": {...}
}
```

### Generate LLM Insights
```bash
POST http://localhost:3000/api/insights
Content-Type: application/json

{
  "userId": "user_abc123",
  "timeRange": "today",
  "analysis": {...}
}
```

### Get User History
```bash
GET http://localhost:3000/api/history/user_abc123?limit=30
```

### Generate Weekly Summary
```bash
POST http://localhost:3000/api/weekly-summary
Content-Type: application/json

{
  "userId": "user_abc123"
}
```

---

## Part 6: Troubleshooting

### Extension Issues

**Extension doesn't open full-screen:**
- Make sure you rebuilt after changes: `npm run build`
- Reload extension: `chrome://extensions/` → Click refresh icon ↻

**No data showing:**
- Check if you have YouTube browsing history
- Try "Week" or "Month" for more data
- Open DevTools: Right-click extension page → Inspect → Check Console

**Permission errors:**
- Go to `chrome://extensions/`
- Click "Details" on Gandalf
- Ensure "Read your browsing history" is enabled

### Backend Issues

**Database connection failed:**
```bash
# Check if PostgreSQL is running
docker ps | grep gandalf-postgres

# Restart if needed
docker-compose restart
```

**LLM API errors:**
- Verify OpenAI API key in `.env`
- Check API key has credits: https://platform.openai.com/usage
- Try changing model to `gpt-3.5-turbo` (cheaper)

**Port 3000 already in use:**
```bash
# Change PORT in backend/.env
PORT=3001

# Restart backend
npm run dev
```

Then update extension's `src/utils/apiClient.js`:
```javascript
const API_URL = 'http://localhost:3001/api';
```

### Docker Issues

**PostgreSQL won't start:**
```bash
# Check logs
docker-compose logs postgres

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

---

## Part 7: Development Workflow

### Making Changes to Extension

1. Edit files in `src/`
2. Rebuild: `npm run build`
3. Reload extension: `chrome://extensions/` → Click ↻
4. Refresh the Gandalf tab

### Making Changes to Backend

1. Edit files in `backend/`
2. Server auto-reloads (if using `npm run dev`)
3. No rebuild needed

### Database Migrations

```bash
# Connect to database
docker exec -it gandalf-postgres psql -U gandalf -d gandalf_db

# Run SQL commands
ALTER TABLE browsing_sessions ADD COLUMN new_field VARCHAR(100);
```

---

## Part 8: Production Deployment

### Backend Deployment (Example: Railway/Render)

1. Push code to GitHub
2. Create new service on Railway/Render
3. Set environment variables:
   - `DATABASE_URL` (from Railway PostgreSQL)
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`
4. Deploy from `backend/` folder

### Extension Deployment (Chrome Web Store)

1. Create developer account: https://chrome.google.com/webstore/devconsole
2. Update `manifest.json` with production API URL
3. Zip the `dist/` folder
4. Upload to Chrome Web Store
5. Submit for review

---

## Part 9: Cost Estimates

### OpenAI API Costs

**GPT-4:**
- ~$0.03 per insight (150 tokens)
- 100 insights/day = ~$3/day = $90/month

**GPT-3.5-Turbo (cheaper):**
- ~$0.001 per insight
- 100 insights/day = ~$0.10/day = $3/month

**Recommendation:** Start with GPT-3.5-Turbo, upgrade to GPT-4 if needed.

### Database Costs

**Local (Docker):** Free
**Hosted (Railway):** ~$5/month for PostgreSQL

---

## Part 10: Next Features to Add

1. **Weekly Email Reports** - Send summary every Sunday
2. **Trend Analysis** - Compare this week vs last week
3. **Goal Setting** - Set browsing goals, track progress
4. **Multi-Browser Support** - Firefox, Edge
5. **Export Data** - Download as PDF/CSV
6. **Privacy Dashboard** - See what data is stored

---

## Quick Commands Cheat Sheet

```bash
# Start everything
docker-compose up -d          # Start PostgreSQL
cd backend && npm run dev     # Start backend
cd .. && npm run build        # Build extension

# Stop everything
docker-compose down           # Stop PostgreSQL
# Ctrl+C in backend terminal  # Stop backend

# Rebuild extension
npm run build

# View logs
docker-compose logs -f postgres  # Database logs
# Backend logs in terminal

# Reset database
docker-compose down -v
docker-compose up -d
```

---

## Support

- **Issues:** Check console logs (DevTools)
- **Database:** `docker-compose logs postgres`
- **Backend:** Check terminal output
- **API Docs:** See Part 5 above

---

**You're all set! 🎉**

Click the Gandalf icon and start analyzing your browsing patterns!
