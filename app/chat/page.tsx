// app/chat/page.tsx
'use client';

import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import { useState } from 'react';
import { useUser } from '@/app/lib/user-context';

export default function ChatPage() {
  const { user, loading } = useUser();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-lg">Please sign in</h2>
          <p className="text-sm text-gray-500">Go to the home page to register or login.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <Sidebar onOpen={(id) => setActiveConversation(id)} />
        </div>

        <div className="col-span-9">
          <ChatInterface conversationIdProp={activeConversation} onConversationCreated={(id) => setActiveConversation(id)} />
        </div>
      </div>
    </div>
  );
}
