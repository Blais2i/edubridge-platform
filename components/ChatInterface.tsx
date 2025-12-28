"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Logo from "@/components/Logo";
import MessageRenderer from "@/components/MessageRenderer";

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

  const [conversationId, setConversationId] = useState<string | null>(
    conversationIdProp
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  /* ---------------- USER ---------------- */

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

  /* ---------------- CONVERSATION ---------------- */

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

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ---------------- HELPERS ---------------- */

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

  /* ---------------- SEND MESSAGE ---------------- */

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
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    await supabase.from("messages").insert({
      conversation_id: convoId,
      role: "user",
      content: text,
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convoId,
          messages: updatedMessages,
        }),
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

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col h-full bg-white font-sans rounded-none sm:rounded-xl sm:shadow-md sm:border overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 sm:p-4 border-b bg-white sticky top-0 z-10">
        <Logo
          size={28}
          onClick={() => {
            setConversationId(null);
            setMessages([]);
            onConversationCreated(null);
          }}
        />
        <div>
          <h2 className="font-semibold text-sm sm:text-base text-gray-900">
            Blaise AI
          </h2>
          <p className="text-xs text-gray-600">
            Your tutor • Kinyarwanda first
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-white">
        {messages.length === 0 && !loading && (
          <div className="min-h-full flex items-center justify-center text-center text-slate-500 px-4">
            <div>
              <p className="text-base sm:text-lg font-medium mb-2 text-gray-800">
                Muraho {firstName}.
              </p>
              <p className="text-sm sm:text-base text-gray-700">
                Nditeguye kugufasha uyu munsi. Andika ikibazo wifuza kwiga.
              </p>
              <p className="text-xs sm:text-sm mt-3 text-gray-500">
                I'm ready to learn with you today.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base shadow-sm ${
              msg.role === "assistant"
                ? "w-full bg-cyan-50 border border-cyan-200 text-slate-800"
                : "max-w-[85%] ml-auto bg-gray-100 text-slate-900 border border-gray-200"
            }`}
          >
            <MessageRenderer content={msg.content} />
          </div>
        ))}

        {loading && (
          <div className="w-full sm:max-w-xl px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-cyan-50 border border-cyan-200 text-sm text-slate-600 italic shadow-sm">
            Blaise AI irimo gutekereza…
            <br />
            <span className="text-xs">Blaise AI is thinking…</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-3 sm:p-4 flex gap-2 sm:gap-3 bg-white sticky bottom-0 z-10">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Andika ikibazo..."
          style={{ color: "#111827" }}
          className="flex-1 border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-cyan-500 text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
