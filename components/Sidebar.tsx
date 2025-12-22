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
  isOpen,
  onClose,
}: {
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  refreshKey: number;
  isOpen: boolean;
  onClose: () => void;
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

  const renameChat = async (id: string, currentTitle: string | null) => {
    const newTitle = window.prompt("Rename chat", currentTitle || "New chat");
    if (!newTitle) return;

    await supabase.from("conversations").update({ title: newTitle }).eq("id", id);

    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
    setOpenChatMenuId(null);
  };

  const deleteChat = async (id: string) => {
    const confirmed = window.confirm("Delete this chat?");
    if (!confirmed) return;

    await supabase.from("messages").delete().eq("conversation_id", id);
    await supabase.from("conversations").delete().eq("id", id);

    setConversations((prev) => prev.filter((c) => c.id !== id));
    setOpenChatMenuId(null);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("Do you want to log out?");
    if (!confirmed) return;

    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static z-50 md:z-auto
          top-0 left-0 h-full
          w-64 bg-slate-900 text-white
          p-4 flex flex-col
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="md:hidden text-right text-slate-400 mb-2"
        >
          ✕
        </button>

        {/* New chat */}
        <button
          type="button"
          onClick={onNewChat}
          className="mb-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg px-3 py-2 text-white font-medium hover:opacity-90 transition"
        >
          + New chat
        </button>

        <div className="text-sm text-slate-300 mb-2">Recent</div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1 sidebar-scrollbar">
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`group relative flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                c.id === activeConversationId
                  ? "bg-white/20"
                  : "hover:bg-white/10"
              }`}
            >
              <button
                onClick={() => onSelectConversation(c.id)}
                className="flex-1 text-left truncate"
              >
                {c.title || "New chat"}
              </button>

              <button
                onClick={() =>
                  setOpenChatMenuId(openChatMenuId === c.id ? null : c.id)
                }
                className="opacity-0 group-hover:opacity-100 px-2"
              >
                ⋯
              </button>

              {openChatMenuId === c.id && (
                <div
                  ref={chatMenuRef}
                  className="absolute right-2 top-9 w-32 bg-slate-800 rounded-md shadow-lg overflow-hidden z-10"
                >
                  <button
                    onClick={() => renameChat(c.id, c.title)}
                    className="w-full text-left px-3 py-2 hover:bg-white/10"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => deleteChat(c.id)}
                    className="w-full text-left px-3 py-2 hover:bg-white/10 text-red-400"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Account section */}
        <div
          ref={accountMenuRef}
          className="mt-4 pt-4 border-t border-slate-700 relative"
        >
          <button
            onClick={() => setAccountMenuOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/10"
          >
            <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center font-semibold">
              {user?.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">
                {user?.user_metadata?.full_name || "Student"}
              </p>
              <p className="text-xs text-slate-400">Account</p>
            </div>
          </button>

          {accountMenuOpen && (
            <div className="absolute bottom-14 left-0 w-full bg-slate-800 rounded-lg shadow-lg overflow-hidden text-sm">
              <button
                onClick={() => {
                  setAccountMenuOpen(false);
                  router.push("/profile");
                }}
                className="w-full text-left px-4 py-2 hover:bg-white/10"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-white/10 text-red-400"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}