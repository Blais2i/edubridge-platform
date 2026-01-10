# Blaise AI

**Blaise AI** is a Kinyarwanda-first learning assistant designed for students in Rwanda.  
It helps learners understand school concepts through guided explanation, not shortcuts or direct answers.

The platform behaves like a **real tutor**: warm, patient, and step-by-step.

---

## 🎯 Purpose

Many students can memorize but struggle to understand.  
Blaise AI focuses on **thinking, clarity, and confidence**, using language students naturally understand.

The assistant:
- Explains first in **Kinyarwanda**, then in **English**
- Guides students step by step instead of giving instant answers
- Adapts tone based on the student’s grade (P1–S6)
- Responds with warmth, encouragement, and patience

---

## 🧠 How Blaise AI Teaches

Blaise AI does **not** act like a homework cheat tool.

When a student asks a question:
1. The assistant restates the question in simple Kinyarwanda
2. Identifies important details
3. Asks the student what they think should be done first
4. Guides the student step by step
5. Only gives a full solution if the student explicitly asks

For emotional or casual messages, Blaise AI responds like a caring tutor and gently encourages learning.

---

## 🌍 Language Approach

- Kinyarwanda-first, natural spoken language
- Avoids literal translations and robotic tone
- Uses everyday examples from Rwanda (RWF, daily life, local objects)
- Adjusts language complexity based on grade level

---

## ✨ Key Features

- 👩🏽‍🏫 Tutor-like AI behavior (not robotic)
- 🇷🇼 Kinyarwanda → English explanations
- 📚 Grade-aware teaching (P1–S6)
- 💬 Saved chat history
- 🧠 Conversation titles generated automatically
- 🔐 Secure authentication (Supabase)
- 🎨 Modern, ChatGPT-style interface
- 📱 Designed for web, mobile-friendly

---

## 🛠 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- Tailwind CSS

**Backend**
- Next.js API routes
- OpenAI API (GPT-4o-mini)

**Authentication & Database**
- Supabase Auth
- Supabase PostgreSQL (conversations & messages)

**Deployment**
- Vercel

---

## 🧪 Pilot Testing

Blaise AI is currently in **pilot testing** with students and youth learning centers in Rwanda.

The goal of the pilot:
- Observe how students interact with a Kinyarwanda-first tutor
- Improve clarity, tone, and learning flow
- Ensure trust from teachers and parents

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/blaise-ai.git
cd blaise-ai
