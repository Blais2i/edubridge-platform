"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface({
  conversationIdProp,
  onConversationCreated,
}: {
  conversationIdProp: string | null;
  onConversationCreated: (id: string) => void;
}) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(
    conversationIdProp
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Load user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Load profile (NEW — read only)
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
    };

    loadProfile();
  }, [user]);

  // Sync conversationId from parent
  useEffect(() => {
    if (conversationIdProp) {
      setConversationId(conversationIdProp);
    }
  }, [conversationIdProp]);

  // Load messages for conversation
  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
    };

    loadMessages();
  }, [conversationId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Create conversation if none exists
  useEffect(() => {
    if (!user || conversationId) return;

    const createConversation = async () => {
      const { data } = await supabase
        .from("conversations")
        .insert({ user_id: user.id })
        .select()
        .single();

      if (!data) return;

      setConversationId(data.id);
      onConversationCreated(data.id);

      const firstName =
        profile?.full_name?.split(" ")[0] || "inshuti";

      const welcomeMessage: Message = {
        role: "assistant",
        content: `Muraho ${firstName}! Nishimiye kukubona hano. Andika ikibazo cyangwa ingingo ushaka kwiga uyu munsi.\n\nHello ${firstName}! I’m happy to learn with you today.`,
      };

      setMessages([welcomeMessage]);

      await supabase.from("messages").insert({
        conversation_id: data.id,
        role: "assistant",
        content: welcomeMessage.content,
      });
    };

    createConversation();
  }, [user, profile, conversationId, onConversationCreated]);

  async function sendMessage() {
    if (!input.trim() || loading || !conversationId || !user) return;

    const text = input;
    setInput("");
    setLoading(true);

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: text,
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          userId: user.id,
          conversationId: conversationId,
        }),
      });

      const json = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content: json.response,
      };

      setMessages((prev) => [...prev, aiMessage]);

      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: aiMessage.content,
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Habaye ikibazo. Ongera ugerageze.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-md border">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Image
          src="/blaise-ai-logo.png"
          alt="Blaise AI"
          width={32}
          height={32}
        />
        <div>
          <h2 className="font-semibold">Blaise AI</h2>
          <p className="text-xs text-slate-500">
            Your tutor • Kinyarwanda first
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl px-4 py-3 rounded-xl ${
              msg.role === "assistant"
                ? "bg-cyan-50 border border-cyan-200"
                : "bg-gray-100 ml-auto"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Andika ikibazo..."
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
