"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { Send, Bot, User } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Muraho! Nishimiye kugufasha. Andika ikibazo ushaka kwiga.",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, role: "user", content: userText },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content: data.response || "Ndumva tugerageze kongera.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "assistant",
          content: "Habaye ikibazo gito. Ongera ugerageze.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col border">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
          <Bot className="text-white" size={18} />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Blaise AI</h2>
          <p className="text-sm text-gray-500">Your tutor • Kinyarwanda</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="mr-3 mt-1">
                  <Bot size={18} className="text-purple-500" />
                </div>
              )}

              <MessageBubble
                text={m.content}
                isUser={m.role === "user"}
              />

              {m.role === "user" && (
                <div className="ml-3 mt-1">
                  <User size={18} className="text-gray-400" />
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Andika ikibazo..."
            className="flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-cyan-500 text-white px-5 rounded-xl hover:bg-cyan-600 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
