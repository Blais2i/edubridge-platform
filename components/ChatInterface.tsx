// components/ChatInterface.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@/app/lib/user-context';
import MessageBubble from './MessageBubble';
import { createConversation, saveMessage, loadMessages } from '../app/lib/chat';

type Msg = { id: string; role: string; content: string; created_at: string };

export default function ChatInterface({ conversationIdProp, onConversationCreated }: { conversationIdProp?: string | null; onConversationCreated?: (id: string) => void }) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(conversationIdProp || null);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (conversationId) {
      (async () => {
        try {
          const rows: any = await loadMessages(conversationId);
          setMessages(rows || []);
        } catch (e) {
          console.error('loadMessages', e);
        }
      })();
    } else {
      // show welcome if no conversation
      const language = user?.user_metadata?.language || 'rw';
      const fullName = user?.user_metadata?.full_name || 'Student';
      const welcome = language === 'rw'
        ? `Muraho ${fullName}! Twagufasha gute uyu munsi?`
        : `Hello ${fullName}! How can I help today?`;
      setMessages([{ id: 'welcome', role: 'assistant', content: welcome, created_at: new Date().toISOString() }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (conversationIdProp) setConversationId(conversationIdProp);
  }, [conversationIdProp]);

  const ensureConversation = async () => {
    if (conversationId) return conversationId;
    if (!user?.id) throw new Error('Not signed in');
    const conv = await createConversation(user.id, 'New chat');
    setConversationId(conv.id);
    onConversationCreated?.(conv.id);
    return conv.id;
  };

  const sendMessage = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput('');
    setLoading(true);

    try {
      // ensure conversation exists
      const cid = await ensureConversation();

      // save user message
      await saveMessage(cid, 'user', q);
      setMessages((m) => [...m, { id: `u-${Date.now()}`, role: 'user', content: q, created_at: new Date().toISOString() }]);

      // call AI endpoint
      const payload = {
        name: user?.user_metadata?.full_name,
        grade: user?.user_metadata?.grade || 'P5',
        language: user?.user_metadata?.language || 'rw',
        question: q,
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      const aiReply = json?.response || (payload.language === 'rw' ? 'Ndabona hari ikibazo kuri server.' : 'Server error');

      // save assistant reply
      await saveMessage(cid, 'assistant', aiReply);
      setMessages((m) => [...m, { id: `ai-${Date.now()}`, role: 'assistant', content: aiReply, created_at: new Date().toISOString() }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { id: `err-${Date.now()}`, role: 'assistant', content: 'Icyabaye: hari ikibazo. Ongera ugerageze.' , created_at: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  };

  const quicks = [
    'Sobanura photosynthesis mu buryo bworoshye',
    'Nigute tubara area ya rectangle?',
    'Sobanura fractions mu buryo bworoshye'
  ];

  return (
    <div className="bg-white rounded-xl shadow p-0 flex flex-col h-[70vh] md:h-[80vh]">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Edu Assistant</h2>
          <div className="text-xs text-gray-500">{(user as any)?.user_metadata?.grade || (user as any)?.grade || 'P5'} • {(user as any)?.user_metadata?.language || (user as any)?.languagePref || 'Kinyarwanda'}</div>
        </div>
        <div className="text-sm text-gray-500">{loading ? 'AI iri gutekereza...' : 'AI iri online'}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <MessageBubble text={m.content} isUser={m.role === 'user'} />
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t">
        <div className="flex gap-2 mb-2">
          {quicks.map((q,i) => (
            <button key={i} onClick={() => sendMessage(q)} className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">{q}</button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Andika ikibazo..."
            className="flex-1 border rounded px-4 py-3 focus:ring-2 focus:ring-cyan-100"
            disabled={loading}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="px-5 py-3 rounded bg-cyan-500 text-white disabled:opacity-50">
            {loading ? '...' : 'Ohereza'}
          </button>
        </div>
      </div>
    </div>
  );
}
