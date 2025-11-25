import { NextResponse } from 'next/server';
// We import OpenAI but do NOT initialize it at the top level
import OpenAI from 'openai';

export async function POST(request: Request) {
  // 1. Check if Key Exists at Runtime (Protects the Build)
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API Key is missing. AI features are disabled.");
    return NextResponse.json(
      { error: 'AI Service Not Configured' }, 
      { status: 503 }
    );
  }

  try {
    // 2. Initialize ONLY when called
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { prompt } = await request.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({ result: response.choices[0].message.content });

  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' }, 
      { status: 500 }
    );
  }
}