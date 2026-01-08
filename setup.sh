#!/bin/bash

echo "🧙 Gandalf Setup Script"
echo "======================="
echo ""

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "❌ backend/.env not found!"
    echo "Creating from template..."
    cp backend/.env.example backend/.env
fi

echo "📝 Please edit backend/.env and add your OpenAI API key:"
echo ""
echo "   nano backend/.env"
echo ""
echo "   Or manually edit and replace:"
echo "   OPENAI_API_KEY=your-openai-api-key-here"
echo ""
echo "   With your actual key from: https://platform.openai.com/api-keys"
echo ""
echo "   Also update the DATABASE_URL to use port 5433:"
echo "   DATABASE_URL=postgresql://gandalf:gandalf_password@localhost:5433/gandalf_db"
echo ""
read -p "Press Enter after you've added your API key..."

echo ""
echo "✅ Setup complete! Now run:"
echo ""
echo "   cd backend && npm run dev"
echo ""
echo "This will start the backend server on http://localhost:3000"
