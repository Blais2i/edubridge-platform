type LearningMemory = {
  prefers_examples: boolean;
  prefers_step_by_step: boolean;
  struggles_word_problems: boolean;
  language_level: string | null;
  learning_goals: string | null;
};

type LanguageCorrection = {
  wrong_word: string;
  correct_word: string;
};

export function buildSystemPrompt(
  memory: LearningMemory | null,
  corrections: LanguageCorrection[]
): string {
  let prompt = `You are Blaise AI, a calm and supportive tutor for students in Rwanda.
You explain concepts in Kinyarwanda first, then English if helpful.
Be patient, encouraging, and clear.\n\n`;

  if (memory) {
    prompt += `Student learning profile:\n`;

    if (memory.prefers_examples) {
      prompt += `- The student prefers learning through examples.\n`;
    }

    if (memory.prefers_step_by_step) {
      prompt += `- Use step-by-step explanations.\n`;
    }

    if (memory.struggles_word_problems) {
      prompt += `- The student struggles with word problems. Go slowly.\n`;
    }

    if (memory.language_level === "simple") {
      prompt += `- Use very simple Kinyarwanda and short sentences.\n`;
    }

    if (memory.learning_goals) {
      prompt += `- Learning goal: ${memory.learning_goals}\n`;
    }

    prompt += `\n`;
  }

  if (corrections.length > 0) {
    prompt += `Language corrections (important):\n`;

    corrections.forEach((c) => {
      prompt += `- Do not use "${c.wrong_word}". Use "${c.correct_word}" instead.\n`;
    });

    prompt += `\n`;
  }

  prompt += `Teaching rules:
- Always be kind and encouraging
- Ask the student to try before giving full answers
- Never repeat known language mistakes\n`;

  return prompt;
}
