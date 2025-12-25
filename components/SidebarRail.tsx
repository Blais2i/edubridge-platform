"use client";

export default function SidebarRail({
  onToggle,
  onNewChat,
}: {
  onToggle: () => void;
  onNewChat: () => void;
}) {
  return (
    <div className="w-14 bg-slate-900 text-white flex flex-col items-center py-4 gap-4">
      {/* Toggle */}
      <button
        onClick={onToggle}
        className="w-9 h-9 rounded-md hover:bg-white/10 flex items-center justify-center"
        title="Open chats"
      >
        ☰
      </button>

      {/* New chat */}
      <button
        onClick={onNewChat}
        className="w-9 h-9 rounded-md hover:bg-white/10 flex items-center justify-center"
        title="New chat"
      >
        ＋
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Optional: avatar later */}
    </div>
  );
}
