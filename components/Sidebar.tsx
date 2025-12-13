"use client";

import Image from "next/image";

export default function Sidebar() {
  return (
    <div className="h-full bg-linear-to-b from-slate-900 to-slate-800 text-white p-4 rounded-xl flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <Image
          src="/blaise-ai-logo.png"
          alt="Blaise AI"
          width={36}
          height={36}
        />
        <div>
          <h2 className="font-semibold">Blaise AI</h2>
          <p className="text-xs text-slate-300">Your tutor</p>
        </div>
      </div>

      {/* New Chat */}
      <button className="bg-linear-to-r from-cyan-500 to-purple-500 text-white rounded-lg py-2 mb-4">
        + New chat
      </button>

      {/* Recent */}
      <div className="text-sm text-slate-300 mb-2">Recent</div>
      <div className="text-slate-400 text-sm mb-6">No chats yet</div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Account */}
      <div className="flex items-center gap-3 border-t border-slate-700 pt-4">
        <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
          B
        </div>
        <div>
          <p className="text-sm">Blaise Iradukunda</p>
          <p className="text-xs text-slate-400">Account & settings</p>
        </div>
      </div>
    </div>
  );
}
