import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const prompt = "Analyze this: User visited 15 pages in 1 hour, mostly development sites.";

try {
    console.log('Testing Groq API...');
    console.log('Model:', GROQ_MODEL);

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
                    content: 'You are a behavioral analyst.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 150,
        })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
    } else {
        const data = await response.json();
        console.log('✅ Success!');
        console.log(data.choices[0].message.content);
    }
} catch (error) {
    console.error('❌ Error:', error.message);
}
