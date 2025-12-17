import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { conversationId, title } = await req.json();

    if (!conversationId || !title) {
      return NextResponse.json({ success: false });
    }

    await supabase
      .from("conversations")
      .update({ title })
      .eq("id", conversationId);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
