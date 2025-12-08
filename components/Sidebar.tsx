// components/Sidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from './Logo';

type ChatItem = { id: string; title: string; last: string };

export default function Sidebar() {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('chat-list') || '[]';
      setChats(JSON.parse(raw));
    } catch {
      setChats([]);
    }
  }, []);

  const newChat = () => {
    const id = `c-${Date.now()}`;
    const title = 'New chat';
    const item = { id, title, last: new Date().toISOString() };
    const updated = [item, ...chats];
    setChats(updated);
    localStorage.setItem('chat-list', JSON.stringify(updated));
    // store empty conversation
    localStorage.setItem(`chat-history-${id}`, JSON.stringify([]));
    // navigate to chat (we keep single chat interface for MVP)
    router.push('/chat');
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex items-center gap-3 mb-4">
        <Logo size={40} />
        <div>
          <h4 className="font-semibold">Blaise AI</h4>
          <p className="text-xs text-gray-500">Your tutor</p>
        </div>
      </div>

      <button onClick={newChat} className="w-full mb-4 px-3 py-2 bg-cyan-50 text-cyan-700 rounded hover:bg-cyan-100">+ New chat</button>

      <div className="space-y-2">
        {chats.length === 0 && <p className="text-sm text-gray-400">No chats yet. Create one.</p>}
        {chats.map((c) => (
          <div key={c.id} className="p-2 rounded hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{c.title}</div>
              <div className="text-xs text-gray-400">·</div>
            </div>
            <div className="text-xs text-gray-500">{new Date(c.last).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
