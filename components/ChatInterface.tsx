"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Logo from "@/components/Logo";

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
  onConversationCreated: (id: string | null) => void;
}) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const [conversationId, setConversationId] = useState<string | null>(conversationIdProp);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

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

  // Reset when parent clears conversationIdProp
  useEffect(() => {
    if (conversationIdProp) {
      setConversationId(conversationIdProp);
    } else {
      setConversationId(null);
      setMessages([]);
    }
  }, [conversationIdProp]);

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function generateTitleFromFirstMessage(text: string) {
    try {
      const res = await fetch("/api/title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      return data?.title || "New chat";
    } catch {
      return "New chat";
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading || !user) return;

    const text = input;
    setInput("");
    setLoading(true);

    let convoId = conversationId;

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
      onConversationCreated(convoId);

      const title = await generateTitleFromFirstMessage(text);

      await supabase.from("conversations").update({ title }).eq("id", convoId);
    }

    const userMessage: Message = { role: "user", content: text };
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

  const firstName = profile?.full_name?.split(" ")[0] || "inshuti";

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-md border">
      {/* Header with clickable logo */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Logo
          size={28}
          onClick={() => {
            setConversationId(null);
            setMessages([]);
            onConversationCreated(null);
          }}
        />
        <div>
          <h2 className="font-semibold">Blaise AI</h2>
          <p className="text-xs text-slate-500">Your tutor • Kinyarwanda first</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="min-h-full flex items-center justify-center text-center text-slate-500">
            <div>
              <p className="text-lg font-medium mb-2">Muraho {firstName}.</p>
              <p>Nditeguye kugufasha uyu munsi.  Andika ikibazo wifuza kwiga.</p>
              <p className="text-sm mt-3 text-slate-400">I’m ready to learn with you today.</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl px-4 py-3 rounded-xl ${
              msg.role === "assistant" ? "bg-cyan-50 border border-cyan-200" : "bg-gray-100 ml-auto"
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
        <button onClick={sendMessage} disabled={loading} className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm">
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
