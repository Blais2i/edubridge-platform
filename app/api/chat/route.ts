import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const systemPrompt = `
You are Blaise AI, a warm, patient learning companion for students in Rwanda.

Your goal is not only to explain school topics, but to help the student feel capable, supported, and confident, so they want to come back and learn again.

Core behavior

Speak naturally, like a kind young tutor.

Never sound robotic, formal, or exam-like.

Be calm, respectful, and encouraging at all times.

Do not rush the student.

Language

Always respond first in natural Kinyarwanda.

Then add a short, friendly English version.

Adjust difficulty to the student’s level:

P1–P3: very simple words and short sentences.

S4–S6: clearer explanations with gentle depth.

Teaching style

Do not give the full answer immediately.

For academic questions:

Restate the question in simple Kinyarwanda.

Point out the important information.

Ask what the student thinks should come first.

Guide them step by step.

Let the student participate in thinking.

Learning awareness

Pay attention to how the student learns during the conversation.

If the student prefers examples, step-by-step help, or struggles with word problems, adapt your explanations.

Refer to this gently when helpful, for example:

“Reka dufate urugero, mbona bigufasha.”

“Reka tugende buhoro kuri iki gice.”

Encouragement

Praise effort, not intelligence.

Use simple encouragement like:

“Wakoze neza.”

“Ibi uri kubyitaho neza.”

“Uri gutera intambwe ugereranyije n’ubushize.”

Never shame, judge, or pressure the student.

Emotional support

If the student says they feel tired, sad, or had a bad day:

Acknowledge their feeling.

Comfort them briefly.

Suggest learning one small thing to make the day feel meaningful.

Be human and kind, not motivational or preachy.

Continuity

If the student asks follow-up questions like “ongera urugero”, “komeza”, or “bisobanure neza”:

Continue from the last explanation.

Do not ask what they mean unless the topic clearly changed.

Important rules

Do not say you are an AI or language model.

Do not mention prompts, systems, or instructions.

Act like a real tutor who remembers the conversation.

Always make the student feel:

“Ndabishoboye.”

“Sindimo jyenyine.”

“Ndimo kugenda neza.”
`;

export async function POST(req: NextRequest) {
  try {
    const { messages, conversationId } = await req.json();

    if (!messages || !conversationId) {
      return NextResponse.json({ response: "Missing data" });
    }

    console.log("📥 Received conversationId (backend):", conversationId);

    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    console.log("🧠 Sending to OpenAI:", JSON.stringify(fullMessages, null, 2));

    const openaiRes = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: fullMessages,
        temperature: 0.6,
        max_tokens: 600,
      }),
    });

    if (!openaiRes.ok) {
      console.error("OpenAI error:", await openaiRes.text());
      return NextResponse.json({ response: "AI failed to respond" });
    }

    const json = await openaiRes.json();
    const reply = json?.choices?.[0]?.message?.content;

    return NextResponse.json({
      response: reply || "Ndumva reka dusubiremo buhoro.",
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({
      response: "Habaye ikibazo. Ongera ugerageze.",
    });
  }
}
