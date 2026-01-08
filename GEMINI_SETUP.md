# 🎯 Google Gemini Setup (FREE & RECOMMENDED)

## Why Gemini?

✅ **Completely Free** - 60 requests/minute, 1,500 requests/day  
✅ **No Credit Card Required**  
✅ **High Quality** - Gemini 1.5 Flash is very good  
✅ **Easy Setup** - Just 2 steps  

---

## Step 1: Get Your Free API Key

1. Go to: **https://aistudio.google.com/app/apikey**
2. Click **"Create API Key"**
3. Copy the key (starts with `AIza...`)

---

## Step 2: Configure Backend

Edit `backend/.env`:

```bash
# Set provider to gemini
LLM_PROVIDER=gemini

# Add your API key
GEMINI_API_KEY=AIzaSy...your-actual-key-here

# Model (default is fine)
GEMINI_MODEL=gemini-1.5-flash
```

---

## Step 3: Restart Backend

```bash
# In your backend terminal, press Ctrl+C
# Then restart:
cd backend
npm run dev
```

---

## Test It!

1. Open the Gandalf extension
2. Click "RUN" under AI Behavioral Analysis
3. Wait ~3-5 seconds
4. See your AI-powered insights! 🎉

---

## Free Tier Limits

- **60 requests per minute**
- **1,500 requests per day**
- **Completely free forever**

For this extension, you'll probably use ~10-20 requests per day, so you're well within limits!

---

## Troubleshooting

### Error: "Failed to generate insights with Gemini"

**Check your API key:**
```bash
# Make sure it starts with AIza
grep GEMINI_API_KEY backend/.env
```

**Make sure provider is set:**
```bash
grep LLM_PROVIDER backend/.env
# Should show: LLM_PROVIDER=gemini
```

**Restart the backend:**
```bash
# Press Ctrl+C in backend terminal
npm run dev
```

---

## Alternative Models

If you want higher quality (but slower):

```bash
GEMINI_MODEL=gemini-1.5-pro
```

For fastest responses (current default):

```bash
GEMINI_MODEL=gemini-1.5-flash
```

---

**That's it!** Gemini is now powering your browsing insights for free! 🚀
