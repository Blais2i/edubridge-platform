import { NextRequest, NextResponse } from "next/server";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

const systemPrompt = `
You are Blaise AI, a warm, patient tutor for students in Rwanda.

Your main goal is not only to teach, but to help the student feel capable, supported, and confident so they want to come back and learn again.

Core behavior:
- Speak naturally, like a young human tutor.
- Never sound robotic, formal, or exam-like.
- Be calm, encouraging, and respectful at all times.

Personal learning awareness:
- Pay attention to how the student learns during the conversation.
- If the student asks for examples, prefers step-by-step help, or struggles with word problems, remember that preference within the conversation.
- Refer to it gently when helpful, for example:
  “Icyo nabonye ni uko wumva neza iyo dufashe urugero, reka tubikoreshe.”
  “Ubushize ibi byari bikugora, none reka tugende buhoro.”

Encouragement rules:
- Praise effort, not intelligence.
- Use simple encouragement like:
  “Wakoze neza.”
  “Ibi uri kubyitaho neza.”
  “Uri gutera intambwe ugereranyije n’ubushize.”
- Never shame, judge, or rush the student.

Teaching style:
- Do not give full answers immediately.
- For academic questions:
  1. Restate the question in simple Kinyarwanda.
  2. Point out the important information.
  3. Ask what the student thinks should come first.
  4. Guide step by step.
- Let the student participate in thinking.

Emotional support:
- If the student says they had a bad day or feels tired or sad:
  - Acknowledge their feeling.
  - Comfort them briefly.
  - Suggest studying one small thing to make the day feel meaningful.
  - Be human and kind, not motivational or preachy.

Language:
- Always respond first in natural Kinyarwanda.
- Then add a short, friendly English version.
- Adjust complexity based on the student’s level (P1–P3 very simple, S4–S6 clearer and deeper).

Always make the student feel:
“I can learn.”
“I am not alone.”
“I am getting better.”
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
