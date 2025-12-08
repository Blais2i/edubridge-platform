// components/ChatInterface.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@/app/lib/user-context';
import MessageBubble from './MessageBubble';

type Msg = { id: string; text: string; isUser: boolean; createdAt: string };

export default function ChatInterface() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const storageKey = user?.email || user?.phone || 'edubridge-guest';

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`chat-history-${storageKey}`);
      if (raw) setMessages(JSON.parse(raw));
      else {
        const welcome = (user?.languagePref === 'rw' ? `Muraho ${user?.name || ''}! Twagufasha gute uyu munsi?` : `Hello ${user?.name || ''}! How can I help today?`);
        setMessages([{ id: `sys-${Date.now()}`, text: welcome, isUser: false, createdAt: new Date().toISOString() }]);
      }
    } catch {
      setMessages([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(`chat-history-${storageKey}`, JSON.stringify(messages));
    } catch {}
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, storageKey]);

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    const userMsg: Msg = { id: `u-${Date.now()}`, text: q, isUser: true, createdAt: new Date().toISOString() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const payload = {
        name: user?.name,
        grade: user?.grade,
        language: user?.languagePref || 'rw',
        question: q,
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      const reply = json?.response || (user?.languagePref === 'rw' ? 'Hari ikibazo kuri server. Ongera ugerageze.' : 'Server issue. Please try again.');

      const aiMsg: Msg = { id: `ai-${Date.now()}`, text: reply, isUser: false, createdAt: new Date().toISOString() };
      setMessages(m => [...m, aiMsg]);
    } catch (err) {
      const errMsg: Msg = { id: `err-${Date.now()}`, text: user?.languagePref === 'rw' ? 'Hari ikibazo kuri server.' : 'Server error', isUser: false, createdAt: new Date().toISOString() };
      setMessages(m => [...m, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quicks = user?.languagePref === 'rw'
    ? ['Sobanura photosynthesis mu buryo bworoshye', 'Nigute tubara area ya rectangle?', 'Sobanura fractions mu buryo bworoshye']
    : ['Explain photosynthesis simply', 'How to calculate rectangle area?', 'Explain fractions simply'];

  return (
    <div className="bg-white rounded-xl shadow p-0 flex flex-col h-[70vh] md:h-[80vh]">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Edu Assistant</h2>
          <div className="text-xs text-gray-500">{user?.grade} • {user?.languagePref === 'rw' ? 'Kinyarwanda' : 'English'}</div>
        </div>
        <div className="text-sm text-gray-500">{loading ? (user?.languagePref === 'rw' ? 'AI iri gutekereza...' : 'AI thinking...') : (user?.languagePref === 'rw' ? 'AI iri online' : 'AI online')}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}>
            <MessageBubble text={m.text} isUser={m.isUser} />
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t">
        <div className="flex gap-2 mb-2">
          {quicks.map((q, i) => (
            <button key={i} onClick={() => send(q)} className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">{q}</button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={user?.languagePref === 'rw' ? 'Andika ikibazo...' : 'Type your question...'}
            className="flex-1 border rounded px-4 py-3 focus:ring-2 focus:ring-cyan-100"
            disabled={loading}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()} className="px-5 py-3 rounded bg-cyan-500 text-white disabled:opacity-50">
            {loading ? '...' : (user?.languagePref === 'rw' ? 'Ohereza' : 'Send')}
          </button>
        </div>
      </div>
    </div>
  );
}
