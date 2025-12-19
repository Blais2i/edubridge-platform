"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = {
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

  // IMPORTANT: start with no conversation
  const [conversationId, setConversationId] = useState<string | null>(
    conversationIdProp
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------
     Load user
  --------------------------------------------------- */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  /* ---------------------------------------------------
     Load profile (read only)
  --------------------------------------------------- */
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

  /* ---------------------------------------------------
     Sync conversation from sidebar selection
  --------------------------------------------------- */
  useEffect(() => {
    if (conversationIdProp) {
      setConversationId(conversationIdProp);
    }
  }, [conversationIdProp]);

  /* ---------------------------------------------------
     Load messages ONLY for existing conversations
  --------------------------------------------------- */
  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
    };

    loadMessages();
  }, [conversationId]);

  /* ---------------------------------------------------
     Auto scroll
  --------------------------------------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------------------------------------------
     Send message (THIS is where chat is created)
  --------------------------------------------------- */
  async function sendMessage() {
    if (!input.trim() || loading || !user) return;

    const text = input;
    setInput("");
    setLoading(true);

    let convoId = conversationId;

    // 🔑 Create conversation ONLY on first message
    if (!convoId) {
      const { data } = await supabase
        .from("conversations")
        .insert({ user_id: user.id })
        .select()
        .single();

      if (!data) {
        setLoading(false);
        return;
      }

      convoId = data.id;
      setConversationId(convoId);
      onConversationCreated(convoId as string);
    }

    const userMessage: Message = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    await supabase.from("messages").insert({
      conversation_id: convoId,
      role: "user",
      content: text,
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const json = await res.json();

      const aiMessage: Message = {
        role: "assistant",
        content: json.response,
      };

      setMessages((prev) => [...prev, aiMessage]);

      await supabase.from("messages").insert({
        conversation_id: convoId,
        role: "assistant",
        content: aiMessage.content,
      });
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------------------------------
     UI
  --------------------------------------------------- */
  const firstName =
    profile?.full_name?.split(" ")[0] || "inshuti";

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-md border">

      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Image
          src="/blaise-ai-logo.png"
          alt="Blaise AI"
          width={28}
          height={28}
        />
        <div>
          <h2 className="font-semibold">Blaise AI</h2>
          <p className="text-xs text-slate-500">
            Your tutor • Kinyarwanda first
          </p>
        </div>
      </div>

      {/* Messages / Idle state */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* 🟢 Idle state */}
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-center text-slate-500">
            <div>
              <p className="text-lg font-medium mb-2">
                Muraho {firstName}.
              </p>
              <p>
                Nditeguye kugufasha uyu munsi.  
                Andika ikibazo wifuza kwiga.
              </p>
              <p className="text-sm mt-3 text-slate-400">
                I’m ready to learn with you today.
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl px-4 py-3 rounded-xl ${
              msg.role === "assistant"
                ? "bg-cyan-50 border border-cyan-200"
                : "bg-gray-100 ml-auto"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">
              {msg.content}
            </p>
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
