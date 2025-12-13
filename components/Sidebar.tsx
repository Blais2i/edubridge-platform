"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { useUser } from "@/app/context/UserContext";
import { listConversations, createConversation } from "@/app/lib/chat";

type Conversation = {
  id: string;
  title: string;
  created_at: string;
};

export default function Sidebar({ onOpen }: { onOpen?: (id: string) => void }) {
  const { user } = useUser();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    listConversations(user.id)
      .then((rows: any) => setConversations(rows || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleNewChat = async () => {
    if (!user?.id) return router.push("/login");

    const conv = await createConversation(user.id, "New chat");
    setConversations((prev) => [conv, ...prev]);
    onOpen?.(conv.id);
  };

  return (
    <aside className="bg-[#0b1220] text-white h-full rounded-xl p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <Logo size={48} />
        <div>
          <h2 className="font-bold">Blaise AI</h2>
          <p className="text-xs text-cyan-200">Your tutor</p>
        </div>
      </div>

      {/* New chat */}
      <button
        onClick={handleNewChat}
        className="mb-5 w-full py-2 rounded-lg bg-linear-to-r from-cyan-500 to-purple-500 text-black font-medium hover:brightness-95"
      >
        + New chat
      </button>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto">
        <div className="text-xs text-cyan-200 mb-3">Recent</div>

        {loading && (
          <div className="text-sm text-cyan-300">Loading...</div>
        )}

        {!loading && conversations.length === 0 && (
          <div className="text-sm text-gray-400">No chats yet</div>
        )}

        <div className="space-y-2">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => onOpen?.(c.id)}
              className="p-3 rounded-lg cursor-pointer hover:bg-[#111a2f] transition"
            >
              <div className="font-medium truncate">
                {c.title || "Chat"}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(c.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      {user && (
        <div
          onClick={() => router.push("/settings")}
          className="mt-4 pt-4 border-t border-white/10 cursor-pointer hover:bg-white/5 rounded-lg p-2 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-black">
              {(user.user_metadata?.full_name || user.email || "U")[0]}
            </div>

            <div className="min-w-0">
              <div className="text-sm font-medium truncate">
                {user.user_metadata?.full_name || "Student"}
              </div>
              <div className="text-xs text-gray-400">
                Account & settings
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
