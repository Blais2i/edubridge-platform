import { NextRequest, NextResponse } from "next/server";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

const systemPrompt = `
You are Blaise AI, a warm, friendly tutor for students in Rwanda.
Speak naturally, like a young human tutor, not a robot.

Rules:
- Greet politely and briefly.
- Explain step by step.
- Do not give full answers immediately.
- Be encouraging and patient.
- Always answer first in Kinyarwanda, then short English.

If student is sad or casual, respond kindly and gently guide them back to study.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.question) {
      return NextResponse.json(
        { response: "Ndumva nta kibazo wanditse. Gerageza kongera." },
        { status: 200 }
      );
    }

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: body.question },
    ];

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
        max_tokens: 700,
      }),
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      console.error("OpenAI error:", errorText);

      return NextResponse.json(
        { response: "Habaye ikibazo kuri AI. Ongera ugerageze." },
        { status: 200 }
      );
    }

    const json = await openaiRes.json();
    const reply = json?.choices?.[0]?.message?.content;

    return NextResponse.json({
      response:
        reply || "Ndakumva, ariko reka tugerageze kubisobanura buhoro.",
    });
  } catch (err: any) {
  console.error("API /chat crash:", err?.message || err);

    return NextResponse.json(
      { response: "Habaye ikibazo kidateganyijwe. Ongera ugerageze." },
      { status: 200 }
    );
  }
}
