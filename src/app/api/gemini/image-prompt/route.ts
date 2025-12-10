import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const { script } = await request.json();

        // Check API Key
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Gemini API Key is missing. Please add GEMINI_API_KEY to .env.local" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-1.5-flash-001 or gemini-pro if flash is unavailable in region
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001", generationConfig: { responseMimeType: "application/json" } });

        const promptText = `
      You are an expert AI Art Director for YouTube Shorts.
      Analyze the following video script and break it down into key visual scenes (e.g., Intro, Main Point 1, Main Point 2, Outro).
      For EACH scene, create a highly detailed, creative image generation prompt.
      
      Constraints:
      1. Aspect Ratio: 9:16 (Vertical)
      2. Style: Cinematic, High Resolution, Visual Storytelling
      3. Language: Output prompts in ENGLISH only.
      4. Format: Return a JSON Object with a key "prompts" containing an array of objects: { "scene": "Scene Description", "image_prompt": "Prompt Text --ar 9:16" }

      Script:
      ${typeof script === 'string' ? script : JSON.stringify(script)}
    `;

        const result = await model.generateContent(promptText);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json(JSON.parse(text));

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
