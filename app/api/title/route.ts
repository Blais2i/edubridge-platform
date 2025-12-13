// app/api/title/route.ts
import { NextRequest, NextResponse } from "next/server";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ title: "New chat" });
    }

    const resp = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "Generate a short chat title (6 to 8 words). Simple, clear. No punctuation at the end.",
          },
          { role: "user", content: message },
        ],
        temperature: 0.4,
        max_tokens: 20,
      }),
    });

    const json = await resp.json();
    const title =
      json?.choices?.[0]?.message?.content?.trim() || "New chat";

    return NextResponse.json({ title });
  } catch {
    return NextResponse.json({ title: "New chat" });
  }
}
