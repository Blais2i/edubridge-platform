import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const systemPrompt = `
You are Blaise AI, a warm, patient tutor for students in Rwanda.

Rules:
- Explain in Kinyarwanda first, then short English
- Be calm, kind, and encouraging
- Guide step by step
- Do NOT say you are an AI language model
- Act like a human tutor who remembers the lesson

Always make the student feel:
"I can learn."
"I am not alone."
"I am getting better."
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, userId, conversationId } = body;

    if (!question || !userId || !conversationId) {
      return NextResponse.json({
        response: "Missing data",
      });
    }

    // 1️⃣ Load recent conversation messages (short-term memory)
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(10);

    // 2️⃣ Build OpenAI messages
    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: question },
    ];

    // 3️⃣ Send to OpenAI
    const openaiRes = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 600,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      console.error("OpenAI error:", err);

      return NextResponse.json({
        response: "AI failed to respond",
      });
    }

    const json = await openaiRes.json();
    const reply = json?.choices?.[0]?.message?.content;

    return NextResponse.json({
      response:
        reply ||
        "Ndumva reka dusubiremo buhoro.",
    });

  } catch (err) {
    console.error("Chat API error:", err);

    return NextResponse.json({
      response: "Habaye ikibazo. Ongera ugerageze.",
    });
  }
}
