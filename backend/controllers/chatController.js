import catchAsyncErrors from '../middleware/catchAsyncError.js';
import OpenAI from 'openai';

export const chatWithAI = catchAsyncErrors(async (req, res, next) => {
    const { message, history } = req.body;

    try {
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({
                success: false,
                reply: "I'm currently undergoing maintenance. Please contact the administrator to configure the AI service properly."
            });
        }

        const openai = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: 'https://api.groq.com/openai/v1'
        });

        const systemPrompt = `You are Cartify AI, a friendly and helpful shopping assistant for the Cartify e-commerce platform. 
      Your goal is to help users find products, answer questions about shipping/returns, and provide styling advice. 
      
      Key Behaviors:
      - Be polite, concise, and professional.
      - If asked about products, suggest general categories or ask for preferences (you don't have live DB access here yet, so speak generally).
      - If asked about support (returns, shipping), say: "We offer 7-day returns and free shipping on orders over ₹500."
      - Emphasize the "Premium" and "AI-powered" nature of the platform.
      
      User Message: ${message}`;



        const response = await openai.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: systemPrompt
                }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 1000
        });


        const text = response.choices[0]?.message?.content?.trim() || "";

        res.status(200).json({
            success: true,
            reply: text,
        });
    } catch (error) {

        if (error.status === 429 || error.message.includes('quota') || error.message.includes('exceeded') || error.message.includes('network')) {
            return res.status(500).json({
                success: false,
                reply: "I've reached my usage limit. Please try again later."
            });
        } else if (error.message && (error.message.includes('API_KEY_INVALID') || error.message.includes('invalid API key'))) {
            return res.status(500).json({
                success: false,
                reply: "AI service is not properly configured. Please contact the administrator."
            });
        } else {
            return res.status(500).json({
                success: false,
                reply: "I'm having a bit of trouble connecting to my brain right now. Please try again in a moment."
            });
        }
    }
});