export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function convertPdfToImages(pdfPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const outputDir = pdfPath.replace(".pdf", "_pages");

    fs.mkdirSync(outputDir, { recursive: true });

    exec(
      `pdftoppm "${pdfPath}" "${outputDir}/page" -png`,
      (err) => {
        if (err) return reject(err);

        const files = fs
          .readdirSync(outputDir)
          .filter((f) => f.endsWith(".png"))
          .map((f) => path.join(outputDir, f));

        resolve(files);
      }
    );
  });
}

async function callVision(imageUrl: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are Blaise AI. Explain the content in Kinyarwanda first, then English. Be step by step.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Explain this page carefully." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 600,
    }),
  });

  const json = await res.json();
  return json?.choices?.[0]?.message?.content || "";
}

export async function POST(req: NextRequest) {
  try {
    const { fileUrl, userId } = await req.json();

    if (!fileUrl || !userId) {
      return NextResponse.json(
        { error: "Missing file or user" },
        { status: 400 }
      );
    }

    /* ----- LIMIT CHECK ----- */

    const { data: usage } = await supabase
      .from("vision_usage")
      .select("attempts")
      .eq("user_id", userId)
      .single();

    if (usage && usage.attempts >= 3) {
      return NextResponse.json(
        { response: "Igerageza ryawe ryarangiye." },
        { status: 403 }
      );
    }

    /* ----- IMAGE CASE ----- */

    if (!fileUrl.endsWith(".pdf")) {
      const answer = await callVision(fileUrl);

      await supabase
        .from("vision_usage")
        .upsert({ user_id: userId, attempts: (usage?.attempts || 0) + 1 });

      return NextResponse.json({ response: answer });
    }

    /* ----- PDF CASE ----- */

    const pdfRes = await fetch(fileUrl);
    const buffer = Buffer.from(await pdfRes.arrayBuffer());

    const tempPdf = `/tmp/${Date.now()}.pdf`;
    fs.writeFileSync(tempPdf, buffer);

    const pages = await convertPdfToImages(tempPdf);

    let finalAnswer = "";

    for (let i = 0; i < pages.length; i++) {
      // Upload each page to Supabase temporarily
      const pageBuffer = fs.readFileSync(pages[i]);

      const pagePath = `vision-pages/${Date.now()}_${i}.png`;

      await supabase.storage
        .from("chat-files")
        .upload(pagePath, pageBuffer, {
          contentType: "image/png",
          upsert: true,
        });

      const { data } = supabase.storage
        .from("chat-files")
        .getPublicUrl(pagePath);

      finalAnswer += `\n\n--- Page ${i + 1} ---\n`;
      finalAnswer += await callVision(data.publicUrl);
    }

    await supabase
      .from("vision_usage")
      .upsert({ user_id: userId, attempts: (usage?.attempts || 0) + 1 });

    return NextResponse.json({ response: finalAnswer });
  } catch (err) {
    console.error("Vision PDF error:", err);
    return NextResponse.json(
      { response: "Habaye ikibazo mu gusoma inyandiko." },
      { status: 500 }
    );
  }
}
