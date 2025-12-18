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
}: {
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  refreshKey: number;
}) {
  const { user } = useUser();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm("Do you want to log out?");
    if (!confirmed) return;

    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="w-64 h-full bg-slate-900 text-white p-4 flex flex-col rounded-xl">

      {/* New chat */}
      <button
        onClick={onNewChat}
        className="mb-4 bg-linear-to-r from-cyan-500 to-purple-500 rounded-lg px-3 py-2 shrink-0"
      >
        + New chat
      </button>

      {/* Label */}
      <div className="text-sm text-slate-300 mb-2 shrink-0">
        Recent
      </div>

      {/* Scrollable chat list */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 sidebar-scrollbar">
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectConversation(c.id)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm transition ${
              c.id === activeConversationId
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
          >
            {c.title || "New chat"}
          </button>
        ))}
      </div>

      {/* Account section */}
      <div
        ref={menuRef}
        className="mt-4 pt-4 border-t border-slate-700 relative"
      >
        <button
          onClick={() => setMenuOpen((v) => !v)}
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

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute bottom-14 left-0 w-full bg-slate-800 rounded-lg shadow-lg overflow-hidden text-sm">
            <button
              onClick={() => {
                setMenuOpen(false);
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
    </div>
  );
}
