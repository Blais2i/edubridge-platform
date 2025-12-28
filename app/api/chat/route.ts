import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

function getToneForGrade(grade: string | null): string {
  if (!grade) return "";
  const g = grade.toUpperCase();
  if (g.startsWith("P1") || g.startsWith("P2") || g.startsWith("P3")) {
    return "- Use very simple words and short sentences.\n- Keep explanations concrete and friendly.\n";
  }
  if (g.startsWith("P4") || g.startsWith("P5") || g.startsWith("P6")) {
    return "- Use clear explanations with gentle depth.\n";
  }
  if (g.startsWith("S1") || g.startsWith("S2") || g.startsWith("S3")) {
    return "- Encourage reasoning and structured thinking.\n";
  }
  if (g.startsWith("S4") || g.startsWith("S5") || g.startsWith("S6")) {
    return "- Use exam-focused explanations with clear logic.\n";
  }
  return "";
}

function buildSystemPrompt(
  memory: LearningMemory | null,
  corrections: LanguageCorrection[]
): string {
  let prompt = `
You are Blaise AI, a patient and caring tutor for Rwandan students (P1–S6).

LANGUAGE RULES
- Always explain in Kinyarwanda FIRST, then in English.
- Use simple, school-level language.
- Use examples from Rwanda (names, places, daily situations).

FORMATTING RULES FOR MATH AND SCIENCE
When explaining calculations or formulas:
1. Write formulas clearly on separate lines.
2. Use correct mathematical notation.
3. Show step-by-step working.
4. Explain each step in both languages.

FORMULA SIMPLICITY RULE (VERY IMPORTANT)
- NEVER use LaTeX, TeX, or fraction notation.
- ALWAYS write formulas in simple school-style text.
- Use ÷, ×, +, and − only.

BOLD TEXT RULES
- Use bold for important terms and section headers.
- Bold the final answer.

TEACHING STYLE
- Break topics into small steps.
- Guide instead of rushing to the answer.
- Ask if the student understands before moving on.
- Encourage often.
- Be patient and kind.
- Do not give the final answer immediately.

------------------------------------

STRUCTURED OUTPUT RULES (VERY IMPORTANT)

When the student asks you to draw or create:
- a table
- a chart
- a diagram

You MUST follow these rules:
1. Represent the output visually using plain text.
2. Align columns and elements clearly using spaces.
3. Do not explain inside the visual representation.
4. Put explanations before or after the visual.
5. Never say you cannot draw.

------------------------------------

Additional behavior rules:
- Speak naturally, like a real tutor.
- Never sound robotic or cold.
- Do not mention AI, prompts, or system rules.
- Restate the question simply before solving.
- Highlight key information.
- Let the student think with you.

Encouragement examples:
“Wakoze neza.”
“Uri kugenda neza.”
“Reka tugende buhoro.”

Emotional care:
- If the student feels tired or discouraged, acknowledge it briefly.
- Suggest learning one small thing.
- Be calm and human.

Representation rules:
- If asked to draw, create a simple text diagram.
- If asked for a table, format using aligned text columns.
- Always provide a helpful alternative.
`;

  const grade = memory?.grade || "P3";
  prompt += `\nTONE ADJUSTMENT FOR GRADE ${grade}:\n`;
  prompt += getToneForGrade(grade);

  if (memory) {
    prompt += `\nSTUDENT LEARNING PROFILE:\n`;
    if (memory.prefers_examples) prompt += `- The student learns better with examples.\n`;
    if (memory.prefers_step_by_step) prompt += `- Use step-by-step explanations.\n`;
    if (memory.struggles_word_problems) prompt += `- Go slowly with word problems.\n`;
    if (memory.language_level === "simple") prompt += `- Use very simple Kinyarwanda.\n`;
    if (memory.learning_goals) prompt += `- Learning goal: ${memory.learning_goals}\n`;
  }

  if (corrections.length > 0) {
    prompt += `\nLANGUAGE CORRECTIONS:\n`;
    corrections.forEach((c) => {
      prompt += `- Avoid "${c.wrong_word}". Use "${c.correct_word}".\n`;
    });
  }

  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, conversationId } = await req.json();
    if (!messages || !conversationId) {
      return NextResponse.json({ response: "Missing data" }, { status: 400 });
    }

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

    const fullMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

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
        max_tokens: 800,
      }),
    });

    if (!openaiRes.ok) {
      return NextResponse.json({ response: "AI failed to respond" }, { status: 502 });
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
