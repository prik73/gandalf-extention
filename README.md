# 🧙 Gandalf - Browser History Recap

A Chrome extension that analyzes your browsing patterns and provides **AI-powered psychological insights** about your YouTube activity.

## ✨ Features

✅ **Full-Screen Experience** - Opens in a new tab, not a tiny popup  
✅ **Local-First Privacy** - All data processed in your browser  
✅ **YouTube History Analysis** - Track what you watched, when, and for how long  
✅ **Pattern Detection** - Identifies time-of-day patterns (morning, afternoon, evening, night)  
✅ **Content Categorization** - Automatically categorizes videos (learning, entertainment, music, news)  
✅ **AI Insights** - LLM-powered behavioral analysis (OpenAI GPT-4)  
✅ **Backend API** - Node.js + Express + PostgreSQL  
✅ **Docker Support** - Easy database setup  
✅ **Time Range Selection** - View daily, weekly, or monthly recaps  
✅ **Neobrutalism UI** - Bold, modern design with Tailwind CSS

## 🎯 What Makes This Different

**Screen-time apps say:**
> "You spent 2h on Chrome"

**Gandalf says:**
> "You spent 47 minutes reading system design blogs, 1h 12m on YouTube (mostly podcasts), and 38 minutes switching between docs and StackOverflow. Your browsing today suggests active learning mode with healthy decompression after 8pm."

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS (Neobrutalism design)
- **Extension**: Chrome Manifest V3
- **Analysis**: Pure JavaScript (no LLM yet)

## Installation

### Development Mode

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

3. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Development with Hot Reload

```bash
npm run dev
```

Then load the extension from the `dist` folder (you'll need to rebuild and reload after changes).

## How It Works

### Without LLM (Current Implementation)

The extension analyzes your browsing history using:

1. **Time Clustering** - Groups visits by time of day
2. **Keyword Matching** - Categorizes content based on title keywords
3. **Visit Patterns** - Detects frequency and duration patterns
4. **Statistical Analysis** - Generates insights from raw data

### Future: With LLM Integration

For more sophisticated insights, you can add:
- **Node.js Backend** with Express
- **PostgreSQL** for historical data storage
- **LLM API** (OpenAI/Anthropic) for natural language insights

## Project Structure

```
gandalf/
├── public/
│   ├── manifest.json       # Chrome extension manifest
│   └── icons/              # Extension icons
├── src/
│   ├── App.jsx             # Main React component
│   ├── main.jsx            # React entry point
│   ├── index.css           # Tailwind styles
│   ├── background.js       # Service worker (history API)
│   └── utils/
│       └── historyAnalyzer.js  # Pattern detection logic
├── popup.html              # Extension popup HTML
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json
```

## Usage

1. Click the Gandalf extension icon in Chrome
2. Select a time range (Today, Week, Month)
3. View your YouTube browsing patterns:
   - Total videos watched
   - Estimated time spent
   - Peak browsing times
   - Content categories
   - Recent videos list

## Example Insights

**Without LLM:**
> "You watched 47 YouTube videos (~3h 8m estimated). Peak activity: evening. Mostly learning content."

**With LLM (Future):**
> "Today was research-heavy. You jumped between Python tutorials and system design videos, suggesting active learning. However, between 9-10pm, activity shifted to passive consumption (music + entertainment)."

## Next Steps

### Adding LLM Integration

1. **Backend Setup**:
```bash
# In a new directory
npm init -y
npm install express cors openai pg
```

2. **Database** (optional):
```sql
CREATE TABLE browsing_sessions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  session_date DATE,
  history_data JSONB,
  llm_insights TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. **API Endpoint**:
```javascript
app.post('/api/analyze', async (req, res) => {
  const { historyData } = req.body;
  
  // Send to LLM
  const insights = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: "Analyze browsing patterns and provide psychological insights..."
    }, {
      role: "user",
      content: JSON.stringify(historyData)
    }]
  });
  
  res.json({ insights: insights.choices[0].message.content });
});
```

## Privacy

- ✅ All history processing happens locally
- ✅ No data sent to external servers (unless you opt-in to LLM)
- ✅ No tracking or analytics
- ✅ Open source - audit the code yourself

## License

MIT

## Contributing

PRs welcome! Focus areas:
- Better pattern detection algorithms
- More content categories
- Weekly/monthly trend analysis
- LLM prompt engineering
