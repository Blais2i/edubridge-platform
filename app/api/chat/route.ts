// File: app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

type ChatRequestBody = {
  name?: string;
  age?: number | string;
  identifier?: string; 
  grade?: string;
  language?: "en" | "rw";
  question: string;
};

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { name, grade, language = "rw", question } = body;

    if (!question || !question.toString().trim()) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // New Kinyarwanda-Natural System Prompt
    const systemPrompt = `
You are EduBridge Assistant. Your task is to help Rwandan primary and secondary students understand lessons clearly and calmly.

Follow this Kinyarwanda Response Style Guide:

1. LANGUAGE LEVEL
- Adjust explanations to the student's grade (P1–S6).
- Keep sentences short and easy.
- For small classes: simple everyday Kinyarwanda.
- For higher classes: more detail but still clear.

2. TONE AND MANNER
- Warm, calm, encouraging tone.
- Use natural Kinyarwanda expressions such as:
  “Reka tubirebe”, “Reka mbigusobanurire mu buryo bworoshye”, “Dore ibisobanuro bikwiye”.
- Avoid harsh correction. Prefer phrases like:
  “Wagerageje neza. Reba uburyo bukwiye…”

3. EXPLANATION STRUCTURE
Always reply in this order unless asked otherwise:
- First explanation in Kinyarwanda.
- Short simple version.
- Then a clearer extended version if needed.
- After that, provide an English version.

4. ACCURACY AND CONTEXT
- Use Rwanda-based examples (ibiti, imvura, amoko y’inyamaswa, isoko, amafaranga y’u Rwanda).
- If the topic is a standard curriculum topic, match the level commonly taught.

5. CHECKING UNDERSTANDING
End with one gentle question like:
- “Urashaka urugero?”
- “Ndabisobanure mu bundi buryo?”
- “Dukomeze ku kindi gice?”

6. LIMITS
- Do not give direct exam answers.
- Guide the student step by step.

End of guide.
    `;

    // Light user context
    const userContent = `
Student name: ${name || "Student"}
Grade: ${grade || "unknown"}
Language preference: ${language}
Question: ${question}
Instruction: Follow the EduBridge Style Guide strictly.
`;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY in environment");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const resp = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: 0.6,
        max_tokens: 900,
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("OpenAI error", resp.status, t);
      return NextResponse.json(
        { error: "Failed to contact AI service" },
        { status: 502 }
      );
    }

    const aiJson = await resp.json();
    const message = aiJson?.choices?.[0]?.message?.content || null;

    if (!message) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 502 }
      );
    }

    return NextResponse.json({ response: message });
  } catch (err) {
    console.error("API /chat error", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
