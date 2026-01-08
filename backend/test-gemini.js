import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const prompt = "Analyze this: User visited 15 pages in 1 hour, mostly development sites like GitHub and StackOverflow in the evening.";

try {
    console.log('Testing Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log('✅ Success!');
    console.log(response.text());
} catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
}
