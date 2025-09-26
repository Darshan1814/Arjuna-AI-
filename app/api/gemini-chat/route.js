import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import RiskAnalyzer from "../../../lib/riskAnalyzer.js";
import escalationService from "../../../lib/escalationService.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const riskAnalyzer = new RiskAnalyzer();

export async function POST(req) {
  try {
    const { messages, userId } = await req.json();
    const userMessage = messages[messages.length - 1]?.content || "";

    const systemPrompt = `
You are Yantra, an empathetic and highly knowledgeable virtual assistant specialized in Aadhaar and DBT banking guidance for students.
Your primary mission is to help students understand the difference between an Aadhaar-linked bank account and a Direct Beneficiary Transfer (DBT) enabled Aadhaar-seeded bank account.
Provide clear, step-by-step guidance for all queries related to pre-matric and post-matric scholarships for SC students.
Always explain concepts in simple language and provide practical, actionable steps.
`;

    const userInput = messages.map(m => `${m.role}: ${m.content}`).join("\n");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const geminiResult = await model.generateContent(`${systemPrompt}\n${userInput}\n\nIMPORTANT: Respond in plain text only. Do not use any markdown formatting like **, *, _, or other special characters for formatting. Use simple, clear text.`);
    let reply = geminiResult.response.text();
    
    // Remove any markdown formatting
    reply = reply.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold **text**
    reply = reply.replace(/\*(.*?)\*/g, '$1'); // Remove italic *text*
    reply = reply.replace(/_(.*?)_/g, '$1'); // Remove underline _text_
    reply = reply.replace(/`(.*?)`/g, '$1'); // Remove code `text`
    reply = reply.replace(/#{1,6}\s/g, ''); // Remove headers
    reply = reply.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links [text](url)
    
    return NextResponse.json({ reply });

  } catch (err) {
    console.error('Gemini API Error:', err);
    
    // Check if it's an API key issue
    if (err.message?.includes('API key') || err.status === 401) {
      return NextResponse.json({ 
        reply: "I need to be configured with a valid API key. Please contact support.",
        error: "Configuration Error" 
      }, { status: 200 });
    }
    
    return NextResponse.json({ 
      reply: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
      error: "API Error" 
    }, { status: 200 });
  }
}