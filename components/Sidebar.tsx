"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";

type Conversation = {
  id: string;
  title: string | null;
};

export default function Sidebar({
  activeConversationId,
  onSelectConversation,
  onNewChat,
  refreshKey,
  isOpen,          // NEW
  onClose,         // NEW
}: {
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  refreshKey: number;
  isOpen: boolean;     // NEW
  onClose: () => void; // NEW
}) {
  const { user } = useUser();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [openChatMenuId, setOpenChatMenuId] = useState<string | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const chatMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("conversations")
      .select("id, title")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setConversations(data || []));
  }, [user, refreshKey]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (chatMenuRef.current && !chatMenuRef.current.contains(e.target as Node)) {
        setOpenChatMenuId(null);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (id: string) => {
    onSelectConversation(id);
    onClose(); // NEW: auto-close on mobile
  };

  const handleNewChat = () => {
    onNewChat();
    onClose(); // NEW
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static z-40
          h-full w-64
          bg-slate-900 text-white p-4 flex flex-col
          transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <button
          onClick={handleNewChat}
          className="mb-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg px-3 py-2 text-white font-medium"
        >
          + New chat
        </button>

        <div className="text-sm text-slate-300 mb-2">Recent</div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                c.id === activeConversationId ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <button
                onClick={() => handleSelect(c.id)}
                className="flex-1 text-left truncate"
              >
                {c.title || "New chat"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <button
            onClick={() => router.push("/profile")}
            className="w-full text-left px-2 py-2 hover:bg-white/10"
          >
            Profile
          </button>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
            className="w-full text-left px-2 py-2 text-red-400 hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
