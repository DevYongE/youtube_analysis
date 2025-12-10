import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { type, prompt } = await request.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: "OpenAI API Key is missing" }, { status: 500 });
        }

        if (type === 'find_topics') {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a viral YouTube Shorts expert. Generate 5 highly engaging, viral-potential video topics for the given niche. Return only the topics as a JSON array of strings." },
                    { role: "user", content: `Niche: ${prompt}` }
                ],
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0].message.content;
            const parsed = JSON.parse(content || '{"topics": []}');
            // Handle case where it returns object with key "topics" or just array
            const topics = Array.isArray(parsed) ? parsed : parsed.topics || [];

            return NextResponse.json({ topics });
        }

        if (type === 'generate_content') {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a professional YouTube content creator. Create detailed content for a Shorts video. Return JSON with: title (engaging, viral), description (SEO optimized), script (hook, body, CTA), tags (array of hashtags), imagePrompt (for AI thumbnail generator)." },
                    { role: "user", content: `Topic: ${prompt}` }
                ],
                response_format: { type: "json_object" }
            });

            const content = completion.choices[0].message.content;
            return NextResponse.json(JSON.parse(content || '{}'));
        }

        return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    } catch (error: any) {
        console.error("OpenAI Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
