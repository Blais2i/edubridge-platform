// app/chat/page.tsx
'use client';

import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import { useUser } from '@/app/lib/user-context';

export default function ChatPage() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

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
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      <TopBar />
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <aside className="col-span-3">
          <Sidebar />
        </aside>

        <main className="col-span-9">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}
