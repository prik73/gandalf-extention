# 🚀 Quick Reference - Start Everything

## 1️⃣ Add Your OpenAI API Key (One-time)

```bash
nano backend/.env
```

Replace `your-openai-api-key-here` with your actual key from:
https://platform.openai.com/api-keys

---

## 2️⃣ Start Backend Server

```bash
cd backend
npm run dev
```

**Expected output:**
```
🚀 Gandalf backend running on http://localhost:3000
📊 Database: localhost:5433/gandalf_db
🤖 LLM Provider: openai
✅ Connected to PostgreSQL database
```

**Keep this terminal running!**

---

## 3️⃣ Load Extension in Chrome

1. Go to: `chrome://extensions/`
2. Enable "Developer mode" (top-right)
3. Click "Load unpacked"
4. Select: `/home/priyanshu/Desktop/chrome-extention/gandalf/dist`

---

## 4️⃣ Use the Extension

1. Click Gandalf icon 🧙 in Chrome toolbar
2. Select time range (Today/Week/Month)
3. View your YouTube patterns
4. Click "Generate" for AI insights

---

## 🛠️ Useful Commands

```bash
# Check if database is running
docker ps | grep gandalf-postgres

# Start database
docker compose up -d

# Stop database
docker compose down

# Rebuild extension after changes
npm run build

# View backend logs
# (just check the terminal where npm run dev is running)

# Test backend health
curl http://localhost:3000/health
```

---

## 📂 Important Files

- `backend/.env` - **Add your OpenAI API key here**
- `dist/` - Built extension (load this in Chrome)
- `SETUP.md` - Detailed setup guide
- `FINAL_SUMMARY.md` - Complete walkthrough

---

## ⚡ Current Status

✅ PostgreSQL: Running on port 5433  
✅ Backend: Dependencies installed  
✅ Extension: Built and ready  
⚠️ **TODO: Add OpenAI API key and start backend**

---

## 💡 Tips

- Use GPT-3.5-Turbo for cheaper insights (~$0.30/month vs $9/month)
- Backend auto-saves sessions (optional)
- All data stays local unless you click "Generate"
- Extension works without backend (just no AI insights)
