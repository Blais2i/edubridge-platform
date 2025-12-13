"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, FileText } from "lucide-react";
import MessageBubble from "./MessageBubble";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Muraho! Nishimiye kugufasha. Wumva ushaka kwiga iki uyu munsi?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ REAL sendMessage (THIS FIXES EVERYTHING)
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setLoading(true);

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: userText,
    };

    const typingId = Date.now() + 1;

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: typingId,
        role: "assistant",
        content: "Blaise AI irimo gutekereza...",
      },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText }),
      });

      const data = await res.json();

      const aiReply =
        typeof data?.response === "string"
          ? data.response
          : "Habaye ikibazo gito. Ongera ugerageze.";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingId
            ? { ...msg, content: aiReply }
            : msg
        )
      );
    } catch (err) {
      console.error("Chat error:", err);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingId
            ? {
                ...msg,
                content:
                  "Habaye ikibazo kuri server. Ongera ugerageze.",
              }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h2 className="font-semibold">Blaise AI</h2>
            <p className="text-xs text-gray-500">
              Your tutor • Kinyarwanda first
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText size={16} />
          AI Online
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <MessageBubble
              text={msg.content}
              isUser={msg.role === "user"}
            />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Andika ikibazo..."
            rows={1}
            className="flex-1 resize-none border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-cyan-600 text-white p-3 rounded-xl disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
