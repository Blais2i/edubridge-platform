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
  imageUrl?: string;
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

  const [conversationId, setConversationId] =
    useState<string | null>(conversationIdProp);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [visionAttempts, setVisionAttempts] = useState<number>(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- USER ---------------- */

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });

    supabase
      .from("vision_usage")
      .select("attempts")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setVisionAttempts(data.attempts);
      });
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

    supabase
      .from("messages")
      .select("role, content, image_url")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        setMessages(
          data.map((m) => ({
            role: m.role,
            content: m.content,
            imageUrl: m.image_url || undefined,
          }))
        );
      });
  }, [conversationId]);

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ---------------- FILE HANDLING ---------------- */

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (visionAttempts >= 3) {
      alert("Igerageza ryawe ryarangiye.");
      return;
    }

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];

    if (!allowed.includes(file.type)) {
      alert("Only images or PDF files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File must be less than 5MB.");
      return;
    }

    setUploadedFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------------- SEND MESSAGE ---------------- */

  async function sendMessage() {
    if ((!input.trim() && !uploadedFile) || loading || !user) return;

    setLoading(true);
    const text = input;
    setInput("");

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
    }

    let fileUrl: string | null = null;

    if (uploadedFile) {
      const path = `${convoId}/${Date.now()}_${uploadedFile.name}`;

      const { error } = await supabase.storage
        .from("chat-files")
        .upload(path, uploadedFile);

      if (!error) {
        const { data } = supabase.storage
          .from("chat-files")
          .getPublicUrl(path);
        fileUrl = data.publicUrl;
      }
    }

    const userMessage: Message = {
      role: "user",
      content: text || "Please analyze the uploaded file.",
      imageUrl: fileUrl || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);

    await supabase.from("messages").insert({
      conversation_id: convoId,
      role: "user",
      content: userMessage.content,
      image_url: fileUrl,
    });

    clearFile();

    /* ---------- 🚫 PDF BLOCK (FRONTEND ENFORCED) ---------- */
    if (fileUrl && fileUrl.endsWith(".pdf")) {
      const warningMessage: Message = {
        role: "assistant",
        content:
`Nyamuneka fata ifoto y'urupapuro ushaka gusobanukirwa.

Please upload a photo of the page you want help with.`,
      };

      setMessages((prev) => [...prev, warningMessage]);

      await supabase.from("messages").insert({
        conversation_id: convoId,
        role: "assistant",
        content: warningMessage.content,
      });

      setLoading(false);
      return;
    }

    /* ---------- 🧠 IMAGE → VISION ---------- */
    if (fileUrl) {
      const res = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl,
          userId: user.id,
        }),
      });

      const json = await res.json();
      setVisionAttempts((v) => Math.min(v + 1, 3));

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

      setLoading(false);
      return;
    }

    /* ---------- 💬 TEXT CHAT ---------- */
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: convoId,
        messages: [...messages, userMessage],
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

    // Generate intelligent title for new conversations
    if (messages.length === 0) {
      try {
        const titleRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: convoId,
            messages: [
              {
                role: "user",
                content: `Generate a very short title (max 4-5 words) that summarizes this conversation. Only respond with the title, nothing else: "${userMessage.content}"`
              }
            ],
          }),
        });

        const titleJson = await titleRes.json();
        const title = titleJson.response.slice(0, 40);
        
        await supabase
          .from("conversations")
          .update({ title })
          .eq("id", convoId);
      } catch (err) {
        // Fallback to truncated user message if title generation fails
        const fallbackTitle = userMessage.content.slice(0, 30) + "...";
        await supabase
          .from("conversations")
          .update({ title: fallbackTitle })
          .eq("id", convoId);
      }
    }

    setLoading(false);
  }

  const firstName = profile?.full_name?.split(" ")[0] || "inshuti";

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col h-full bg-white border rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 p-4 border-b">
        <Logo size={28} />
        <div>
          <h2 className="font-semibold">Blaise AI</h2>
          <p className="text-xs text-gray-600">
            {conversationId ? "Your tutor • Kinyarwanda first" : "Kinyarwanda first"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center px-4">
            <p className="font-bold text-xl mb-3 text-gray-900">Muraho {firstName}.</p>
            <p className="text-gray-700 font-medium text-base leading-relaxed">Nditeguye kugufasha uyu munsi. Andika ikibazo wifuza kwiga.</p>
            <p className="text-sm text-gray-600 mt-2 font-normal">I'm ready to learn with you today.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-xl p-3 ${
              msg.role === "assistant"
                ? "bg-cyan-50 border text-gray-900"
                : "bg-gray-100 ml-auto max-w-[85%] text-gray-900"
            }`}
            style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}
          >
            {msg.imageUrl && (
              <div className="mb-2">
                {msg.imageUrl.endsWith(".pdf") ? (
                  <a
                    href={msg.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 underline"
                  >
                    📄 View PDF
                  </a>
                ) : (
                  <a
                    href={msg.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={msg.imageUrl}
                      className="max-w-[220px] max-h-[220px] rounded border object-contain"
                    />
                  </a>
                )}
              </div>
            )}

            <MessageRenderer content={msg.content} />
          </div>
        ))}

        {loading && (
          <p className="italic text-base text-gray-700 font-medium">
            Blaise AI irimo gutekereza…
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t p-3 flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/jpg,application/pdf"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={visionAttempts >= 3}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
        >
          📎
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Andika ikibazo..."
          className="flex-1 border rounded px-3 py-2 text-base text-gray-900"
          style={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-cyan-500 text-white px-4 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>

      {visionAttempts >= 3 && (
        <p className="text-center text-sm text-red-600 pb-2">
          Igerageza ryawe ryarangiye.
        </p>
      )}
    </div>
  );
}