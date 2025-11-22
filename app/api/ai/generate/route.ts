import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { jobTitle, type } = await request.json();

    let prompt = "";
    
    if (type === 'summary') {
      prompt = `Write a professional, concise resume summary for a ${jobTitle}. Focus on achievements and professional tone. Maximum 3 sentences.`;
    } else if (type === 'skills') {
      prompt = `List 10 key technical and soft skills for a ${jobTitle}, separated by commas.`;
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo", // or "gpt-4o-mini" for cheaper/faster results
    });

    const text = completion.choices[0].message.content;
    return NextResponse.json({ text });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'AI Failed' }, { status: 500 });
  }
}