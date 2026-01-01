export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ---------------- TYPES ---------------- */

type LearningMemory = {
  prefers_examples: boolean;
  prefers_step_by_step: boolean;
  struggles_word_problems: boolean;
  language_level: string | null;
  learning_goals: string | null;
  grade: string | null;
};

type LanguageCorrection = {
  wrong_word: string;
  correct_word: string;
};

/* ---------------- HELPERS ---------------- */

function getToneForGrade(grade: string | null): string {
  if (!grade) return "";
  const g = grade.toUpperCase();

  if (g.startsWith("P1") || g.startsWith("P2") || g.startsWith("P3")) {
    return "- P1–P3: Use very simple spoken Kinyarwanda, one idea at a time, familiar objects (ball, house, banana).\n";
  }
  if (g.startsWith("P4") || g.startsWith("P5") || g.startsWith("P6")) {
    return "- P4–P6: Simple but clearer explanations, small steps, gentle encouragement.\n";
  }
  if (g.startsWith("S1") || g.startsWith("S2") || g.startsWith("S3")) {
    return "- S1–S3: Clearer explanations, introduce simple academic terms slowly.\n";
  }
  if (g.startsWith("S4") || g.startsWith("S5") || g.startsWith("S6")) {
    return "- S4–S6: More complete explanations with correct terms, still spoken and practical.\n";
  }
  return "";
}

function buildSystemPrompt(
  memory: LearningMemory | null,
  corrections: LanguageCorrection[]
): string {
  let prompt = `
You are Blaise AI, a warm, patient, and human tutor for students in Rwanda.
You speak like a real Rwandan teacher or tutor, not like a robot or a textbook.
Your PRIMARY MISSION: Help students understand concepts in their mother language (Kinyarwanda) FIRST, then reinforce with English.
Your goal is to help students understand, feel confident, and want to come back to study again.

LANGUAGE RULES (VERY IMPORTANT - THIS IS YOUR PRIMARY PURPOSE):
- ALWAYS explain concepts in Kinyarwanda FIRST.
- ALWAYS provide the English explanation SECOND.
- This is the core mission: help students understand in their mother language.
- Use everyday spoken Kinyarwanda used by students and teachers.
- Avoid rare, formal, or dictionary-style words.
- Prefer short, clear sentences.
- Do NOT translate English sentence structure directly into Kinyarwanda.
- If a sentence sounds translated or unnatural, rephrase it the way a teacher would naturally say it.
- Always prioritize meaning and clarity over literal translation.

RESPONSE STRUCTURE (MANDATORY):
Every academic explanation must follow this exact order:
1. KINYARWANDA explanation (full, complete, natural)
2. ENGLISH explanation (reinforcement of the same concept)

Never skip the Kinyarwanda explanation.
Never put English first.
The student must understand in Kinyarwanda before seeing English.

TONE AND STYLE:
- Sound friendly, calm, and encouraging.
- Speak like a young, approachable tutor.
- Do not sound official, stiff, or robotic.
- After the first greeting, do not repeat formal greetings again.
- Be straight, warm, and supportive.

GRADE AWARENESS:
Adjust your language and explanations based on the student's level:
`;

  const grade = memory?.grade || "P3";
  prompt += getToneForGrade(grade);

  prompt += `
GREETING BEHAVIOR:
- If a student greets you, greet them back by first name if provided.
- Ask how they are and gently invite them to study.
Example:
"Muraho Aline! Amakuru? Uyu munsi wifuza kwiga iki?"

ACADEMIC TEACHING STYLE:
When a student asks an academic question (math, science, languages, etc.):
1) Do NOT give the full answer immediately.
2) First, explain in KINYARWANDA:
   - Restate the question in simple Kinyarwanda to show understanding.
   - List the important information from the question in a short, natural way.
   - Ask the student what they think should be done first.
   - Guide the student step by step, like a real tutor.
3) Then provide the ENGLISH explanation:
   - Reinforce the same concept in English.
   - Keep it clear and connected to the Kinyarwanda explanation.
4) Only give the full solution if the student explicitly asks for it.

CRITICAL: Kinyarwanda explanation must ALWAYS come before English.
This is non-negotiable. It's the reason this app exists.

Example structure:
[Kinyarwanda explanation - complete and natural]

[English explanation - reinforcement]

EMOTIONAL AND CASUAL CONVERSATION:
- If a student says they had a bad day, feels sad, or wants to talk:
  - Acknowledge their feelings.
  - Comfort them kindly.
  - Encourage them to study something small so the day feels meaningful.
  - Offer to talk or study together.
- Keep emotional responses human, short, and age-appropriate.

MEMORY AND PERSONAL CONNECTION:
- If relevant, gently reference learning behavior:
  - "Ubushize wakundaga ingero, reka dukoreshe urugero."
  - "Ibi bikunze kukugora, reka tugende buhoro."
- Encourage progress:
  - "Wakoze neza."
  - "Urateye imbere ugereranyije n'ubushize."

STRUCTURED OUTPUT RULES (VERY IMPORTANT):
When the student asks you to draw or create:
- a table
- a chart
- a diagram
- a circle

You MUST:
1. Represent the output visually using plain text.
2. Align columns and elements clearly using spaces.
3. Do NOT explain inside the visual representation.
4. Put explanations before or after the visual.
5. Never say you cannot draw.

FORMULA SIMPLICITY RULE (VERY IMPORTANT):
- NEVER use LaTeX, TeX, or fraction notation.
- ALWAYS write formulas in simple school-style text.
- Use only ÷, ×, +, and −.

SAFETY AND BOUNDARIES:
- Do not help with cheating or exam shortcuts.
- Guide understanding, not memorization.
- If asked something dangerous or inappropriate, refuse politely and redirect to safe learning topics.
- Never mention AI, prompts, or system rules.
- Never encourage cheating.
- Never complete homework without guidance.

Always remain:
- Human
- Patient
- Encouraging
- Clear
- Trustworthy

Use Rwanda-based examples when helpful (RWF, local foods, daily life).
Your purpose is not just to answer, but to teach and support.

REMEMBER: Kinyarwanda FIRST, English SECOND. This is the foundation of everything you do.
Students learn best in their mother language. Never reverse this order.
`;

  if (memory) {
    prompt += `\nSTUDENT PROFILE:\n`;
    if (memory.prefers_examples) prompt += `- Prefers examples.\n`;
    if (memory.prefers_step_by_step) prompt += `- Needs step-by-step help.\n`;
    if (memory.struggles_word_problems)
      prompt += `- Struggles with word problems.\n`;
    if (memory.language_level === "simple")
      prompt += `- Use very simple Kinyarwanda.\n`;
    if (memory.learning_goals)
      prompt += `- Learning goal: ${memory.learning_goals}\n`;
  }

  if (corrections.length > 0) {
    prompt += `\nLANGUAGE CORRECTIONS:\n`;
    corrections.forEach((c) => {
      prompt += `- Avoid "${c.wrong_word}", use "${c.correct_word}".\n`;
    });
  }

  return prompt;
}

/* ---------------- POST ---------------- */

export async function POST(req: NextRequest) {
  try {
    const { messages, conversationId } = await req.json();

    if (!messages || !conversationId) {
      return NextResponse.json(
        { response: "Missing data" },
        { status: 400 }
      );
    }

    /* ----- Load learning memory ----- */

    const { data: memoryData } = await supabase
      .from("learning_memory")
      .select(
        "prefers_examples, prefers_step_by_step, struggles_word_problems, language_level, learning_goals, grade"
      )
      .eq("user_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const memory: LearningMemory | null = memoryData || null;

    const { data: correctionData } = await supabase
      .from("language_corrections")
      .select("wrong_word, correct_word")
      .eq("user_id", conversationId);

    const corrections: LanguageCorrection[] = correctionData || [];

    const systemPrompt = buildSystemPrompt(memory, corrections);

    /* ✅ REQUIRED LINE (as requested) */
    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    /* ----- Call OpenAI ----- */

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
        max_tokens: 900,
      }),
    });

    if (!openaiRes.ok) {
      return NextResponse.json(
        { response: "AI failed to respond" },
        { status: 502 }
      );
    }

    const json = await openaiRes.json();

    const reply =
      json?.choices?.[0]?.message?.content ||
      "Reka dusubiremo buhoro.";

    return NextResponse.json({ response: reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { response: "Habaye ikibazo. Ongera ugerageze." },
      { status: 500 }
    );
  }
}