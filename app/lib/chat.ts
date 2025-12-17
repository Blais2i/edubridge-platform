import { supabase } from "./supabaseClient";

export async function createConversation(userId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: userId,
      title: "New chat",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLatestConversation(userId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) return [];
  return data || [];
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  await supabase.from("messages").insert({
    conversation_id: conversationId,
    role,
    content,
  });

  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);
}

export async function loadMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) return [];
  return data || [];
}
