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

export async function listConversations(userId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateConversationTitle(
  conversationId: string,
  title: string
) {
  const { error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("id", conversationId);

  if (error) throw error;
}

export async function deleteConversation(conversationId: string) {
  await supabase.from("messages").delete().eq("conversation_id", conversationId);
  await supabase.from("conversations").delete().eq("id", conversationId);
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    role,
    content,
  });

  if (error) throw error;
}

export async function loadMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}
