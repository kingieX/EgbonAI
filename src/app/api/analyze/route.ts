/* eslint-disable @typescript-eslint/no-unused-vars */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { text, userId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a sentiment analysis AI trained on Nigerian social media texts.

Analyze the following post and return a valid JSON object with the following:
{
  "sentiment": "positive" | "neutral" | "negative",
  "confidence": number (0-100),
  "explanation": string (short reason why this sentiment was chosen)
}

Post:
"${text}"
`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Clean up markdown-like response
    const cleaned = raw
      .replace(/^```json/i, "") // remove starting ```json
      .replace(/^```/, "") // fallback: just ```
      .replace(/```$/, "") // remove ending ```
      .trim();

    console.log("Result: ", cleaned);

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.warn("Fallback: AI response not JSON:", raw);
      parsed = {
        sentiment:
          ["positive", "neutral", "negative"].find((s) =>
            raw.toLowerCase().includes(s)
          ) || "neutral",
        confidence: 50,
        explanation:
          "The sentiment was auto-detected due to unstructured response.",
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
