// components/Sidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import Logo from './Logo';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/lib/user-context';
import { listConversations, createConversation } from '../app/lib/chat';

type Conv = { id: string; title: string; created_at: string };

export default function Sidebar({ onOpen }: { onOpen?: (id: string) => void }) {
  const { user } = useUser();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conv[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    let mounted = true;
    setLoading(true);
    listConversations(user.id)
      .then((rows: any) => {
        if (!mounted) return;
        setConversations(rows || []);
      })
      .catch((e) => console.error('listConversations', e))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, [user?.id]);

  const handleNew = async () => {
    if (!user?.id) {
      router.push('/login');
      return;
    }
    try {
      setLoading(true);
      const conv = await createConversation(user.id, 'New chat');
      // refresh list quickly
      setConversations((prev) => [conv, ...prev]);
      if (onOpen) onOpen(conv.id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="bg-[#0b1220] text-white p-4 rounded-xl shadow-md h-full">
      <div className="flex items-center gap-3 mb-6">
        <Logo size={48} />
        <div>
          <h4 className="font-bold">Blaise AI</h4>
          <p className="text-xs text-cyan-200">Your tutor</p>
        </div>
      </div>

      <button
        onClick={handleNew}
        className="w-full mb-4 px-3 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-medium rounded hover:brightness-95"
      >
        + New chat
      </button>

      <div className="text-xs text-cyan-200 mb-3">Recent</div>

      <div className="space-y-2 overflow-auto max-h-[60vh]">
        {loading && <div className="text-sm text-cyan-300">Loading...</div>}
        {conversations.length === 0 && !loading && (
          <div className="text-sm text-gray-300">No chats yet. Create one.</div>
        )}
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => onOpen?.(c.id)}
            className="p-3 rounded hover:bg-[#0f1724] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{c.title || 'Chat'}</div>
              <div className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</div>
            </div>
            <div className="text-xs text-gray-300">Open chat</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
