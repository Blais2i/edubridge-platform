// File: app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { useUser } from '@/app/lib/user-context';

export default function Dashboard() {
  const { user, isLoading, logout } = useUser();
  const [userView, setUserView] = useState<'student' | 'parent'>('student');

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-xl">Session expired</h2>
          <a href="/" className="mt-4 inline-block text-green-600">Go back</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">EduBridge</h1>
            <p className="text-sm text-gray-600">{user.name} • {user.grade}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setUserView(prev => prev === 'student' ? 'parent' : 'student')} className="px-3 py-1 bg-blue-100 rounded">
              {userView === 'student' ? 'Parent View' : 'Student View'}
            </button>
            <button onClick={logout} className="px-3 py-1 bg-gray-100 rounded">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {userView === 'student' ? (
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">Muraho {user.name || ''} — Welcome</h2>
              <p className="text-gray-600">Ask anything you studied and the assistant will explain in Kinyarwanda first, then English.</p>
            </div>

            <ChatInterface />
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-2xl font-semibold">Parent dashboard</h2>
            <p className="text-gray-600 mt-2">Summary for {user.name}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-green-50 rounded">
                <div className="text-sm text-gray-600">Learning Time</div>
                <div className="text-2xl font-bold">—</div>
              </div>
              <div className="p-4 bg-blue-50 rounded">
                <div className="text-sm text-gray-600">Concepts practiced</div>
                <div className="text-2xl font-bold">—</div>
              </div>
              <div className="p-4 bg-purple-50 rounded">
                <div className="text-sm text-gray-600">Practice accuracy</div>
                <div className="text-2xl font-bold">—</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
