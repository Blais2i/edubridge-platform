// File: components/ChatInterface.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/app/lib/user-context';

type ChatMessage = {
  id: string;
  text: string;
  isUser: boolean;
  createdAt: string;
};

function nowIso() {
  return new Date().toISOString();
}

export default function ChatInterface() {
  const { user, updateUser } = useUser();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  // localStorage key uses identifier (email or phone) if available, otherwise fallback to 'guest'
  const storageKey = user?.email || user?.phone || 'edubridge-guest';

  useEffect(() => {
    // load history for this user
    try {
      const raw = localStorage.getItem(`chat-history-${storageKey}`);
      if (raw) {
        setMessages(JSON.parse(raw));
      } else {
        // initial welcome message
        const welcome = user?.languagePref === 'rw'
          ? `Muraho ${user?.name || ''}! Twagufasha gute uyu munsi?` 
          : `Hello ${user?.name || ''}! How can I help you today?`;
        setMessages([
          { id: `sys-${Date.now()}`, text: welcome, isUser: false, createdAt: nowIso() }
        ]);
      }
    } catch (e) {
      console.error('Load chat error', e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    // save on messages change
    try {
      localStorage.setItem(`chat-history-${storageKey}`, JSON.stringify(messages));
    } catch (e) {
      console.error('Save chat error', e);
    }
  }, [messages, storageKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-xl shadow">
        <p className="text-gray-600">Please sign in to use the learning assistant.</p>
      </div>
    );
  }

  const sendMessage = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question) return;
    if (isLoading) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      text: question,
      isUser: true,
      createdAt: nowIso(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const payload = {
        name: user.name || '',
        age: user.age || '',
        identifier: user.email || user.phone || 'guest',
        grade: user.grade || '',
        language: user.languagePref || 'rw',
        question,
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.response) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          text: json.response,
          isUser: false,
          createdAt: nowIso(),
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const errText = json?.error || 'AI service unavailable.';
        setMessages(prev => [
          ...prev,
          { id: `err-${Date.now()}`, text: user.languagePref === 'rw' ? `Ikosa: ${errText}` : `Error: ${errText}`, isUser: false, createdAt: nowIso() }
        ]);
      }
    } catch (error) {
      console.error('Chat send error', error);
      setMessages(prev => [
        ...prev,
        { id: `err-${Date.now()}`, text: user.languagePref === 'rw' ? 'Hari ikibazo kuri server. Ongera ugerageze.' : 'Server error. Please try again.', isUser: false, createdAt: nowIso() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    user.languagePref === 'rw'
      ? 'Sobanura photosynthesis mu buryo bworoshye'
      : 'Explain photosynthesis simply',
    user.languagePref === 'rw'
      ? 'Mfasha kumenya area ya rectangle'
      : 'Help me calculate the area of a rectangle',
    user.languagePref === 'rw'
      ? 'Sobanura icyo fraction 1/2 isobanura'
      : 'Explain what the fraction 1/2 means',
  ];

  return (
    <div className="bg-white rounded-xl shadow p-0 flex flex-col h-[75vh] md:h-[82vh]">
      <div className="p-4 border-b flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">EduBridge Assistant</h2>
          <p className="text-sm text-gray-600">
            {user.languagePref === 'rw' ? `Muraho ${user.name || ''}!` : `Hello ${user.name || ''}!`}
            <span className="mx-2">•</span>
            {user.grade}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {isLoading ? (user.languagePref === 'rw' ? 'AI iri gutekereza...' : 'AI thinking...') : (user.languagePref === 'rw' ? 'AI iri online' : 'AI online')}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`${msg.isUser ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'} max-w-[85%] p-3 rounded-2xl`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={`text-xs mt-2 ${msg.isUser ? 'text-green-200' : 'text-gray-500'}`}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Quick prompts */}
      <div className="p-3 border-t">
        <div className="flex gap-2 mb-2">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
              disabled={isLoading}
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            className="flex-1 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
            placeholder={user.languagePref === 'rw' ? 'Andika ikibazo cyawe hano...' : 'Type your question here...'}
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="bg-green-600 text-white px-5 py-3 rounded-lg disabled:opacity-50"
          >
            {isLoading ? '...' : (user.languagePref === 'rw' ? 'Ohereza' : 'Send')}
          </button>
        </div>
      </div>
    </div>
  );
}
