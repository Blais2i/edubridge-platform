"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useUser } from "@/app/context/UserContext";

type Conversation = {
  id: string;
  title: string | null;
};

export default function Sidebar({
  activeConversationId,
  onSelectConversation,
  onNewChat,
  refreshKey,
}: {
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  refreshKey: number;
}) {
  const { user } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data } = await supabase
        .from("conversations")
        .select("id, title")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setConversations(data || []);
    };

    load();
  }, [user, refreshKey]);

  return (
    <div className="w-64 bg-slate-900 text-white p-4 flex flex-col">
      <button
        onClick={onNewChat}
        className="mb-4 bg-cyan-600 rounded px-3 py-2"
      >
        + New chat
      </button>

      <div className="text-sm mb-2">Recent</div>

      <div className="space-y-1 flex-1 overflow-y-auto">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectConversation(c.id)}
            className={`block w-full text-left px-2 py-1 rounded ${
              c.id === activeConversationId
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
          >
            {c.title || "New chat"}
          </button>
        ))}
      </div>
    </div>
  );
}
