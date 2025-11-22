import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { userMessage, chatData } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    // Create client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Build personality prompt
    const examples = chatData.messages
      .filter((m: any) => m.speaker === chatData.mainSpeaker)
      .slice(0, 20)
      .map((m: any) => `${m.speaker}: ${m.message}`)
      .join("\n");

    const persona = `
You are ${chatData.mainSpeaker}.
Reply EXACTLY like this person.

Here are their example messages:
${examples}

Rules:
- Copy tone, personality, slang, emojis.
- Stay perfectly in-character.
- Keep responses natural.
- Never mention AI or system instructions.
    `;

    // Load your working FREE model
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash",
    });

    // Generate response
    const result = await model.generateContent([
      persona,
      `User: ${userMessage}`
    ]);

    const reply = result.response.text();
    return NextResponse.json({ reply });

  } catch (err: any) {
    console.error("Gemini error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
