# 🆓 Free LLM Setup Guide

## Option 1: Ollama (Recommended - 100% Free & Local) ⭐

### Install Ollama

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama service
ollama serve
```

### Pull a Model

```bash
# Option A: Llama 3.2 (3B - Fast, good quality)
ollama pull llama3.2

# Option B: Phi-3 (3.8B - Very fast, smaller)
ollama pull phi3

# Option C: Mistral (7B - Better quality, slower)
ollama pull mistral
```

### Configure Backend

Edit `backend/.env`:
```bash
LLM_PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### Test It

```bash
# Test Ollama directly
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Analyze this: User visited 50 pages in 2 hours",
  "stream": false
}'
```

---

## Option 2: Groq (Free Tier - Very Fast)

### Get API Key

1. Go to: https://console.groq.com/
2. Sign up (free)
3. Create API key
4. Free tier: **14,400 requests/day**

### Configure Backend

Edit `backend/.env`:
```bash
LLM_PROVIDER=groq
GROQ_API_KEY=your-groq-api-key-here
GROQ_MODEL=llama-3.1-70b-versatile
```

**Available Models:**
- `llama-3.1-70b-versatile` (Best quality)
- `llama-3.1-8b-instant` (Fastest)
- `mixtral-8x7b-32768` (Good balance)

---

## Option 3: OpenAI (Paid)

### Get API Key

1. Go to: https://platform.openai.com/api-keys
2. Create API key
3. Add credits to account

### Configure Backend

Edit `backend/.env`:
```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key-here
LLM_MODEL=gpt-4
```

**Cost:**
- GPT-4: ~$0.03/request
- GPT-3.5-Turbo: ~$0.001/request

---

## Quick Start (Ollama)

```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull model
ollama pull llama3.2

# 3. Update backend/.env
echo "LLM_PROVIDER=ollama" >> backend/.env
echo "OLLAMA_MODEL=llama3.2" >> backend/.env

# 4. Restart backend
cd backend
npm run dev
```

---

## Comparison

| Provider | Cost | Speed | Quality | Privacy |
|----------|------|-------|---------|---------|
| **Ollama** | Free | Medium | Good | ⭐⭐⭐⭐⭐ Local |
| **Groq** | Free tier | ⭐⭐⭐⭐⭐ Very Fast | Great | Cloud |
| **OpenAI** | Paid | Fast | ⭐⭐⭐⭐⭐ Best | Cloud |

---

## Troubleshooting

### Ollama not responding

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not, start it
ollama serve

# Or restart it
pkill ollama && ollama serve
```

### Model not found

```bash
# List installed models
ollama list

# Pull the model
ollama pull llama3.2
```

---

## Recommended: Start with Ollama

1. **Free forever** - No API costs
2. **Private** - Data never leaves your machine
3. **Fast enough** - Good for this use case
4. **Easy to switch** - Can change to Groq/OpenAI later

Just run:
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2
```

Then update `backend/.env` to use `LLM_PROVIDER=ollama` and restart the backend!
