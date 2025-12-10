import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { script } = await request.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OpenAI API Key is missing" }, { status: 500 });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an expert AI Art Director for YouTube Shorts. Analyze the video script and break it down into at least 6 key visual scenes (e.g., Intro, Hype, Main Points, Climax, Outro). For EACH scene, create a highly detailed, creative image generation prompt. Constraints: 1. Aspect Ratio: 9:16 (Vertical) 2. Style: Cinematic, High Resolution, Visual Storytelling 3. Language: Output prompts in ENGLISH only. 4. Format: Return a JSON Object with a key 'prompts' containing an array of objects: { 'scene': 'Scene Description', 'image_prompt': 'Prompt Text --ar 9:16' }"
                },
                { role: "user", content: `Script: ${typeof script === 'string' ? script : JSON.stringify(script)}` }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        const parsed = JSON.parse(content || '{"prompts": []}');
        return NextResponse.json(parsed);

    } catch (error: any) {
        console.error("OpenAI Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
