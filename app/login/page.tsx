// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { useUser } from '@/app/lib/user-context';
import type { UserData } from '@/app/lib/user-context-provider';

export default function LoginPage() {
  const router = useRouter();
  const { updateUser } = useUser();
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Lightweight MVP: local "login" by loading saved user if exists
    const saved = localStorage.getItem('edubridge-user');
    if (saved) {
      const user = JSON.parse(saved);
      updateUser(user);
      router.push('/chat');
      return;
    }
    // If no user saved, create minimal guest-like user with provided contact
    const user: Partial<UserData> = {
      name: contact.includes('@') ? contact.split('@')[0] : contact,
      email: contact.includes('@') ? contact : undefined,
      phone: contact.includes('@') ? undefined : contact,
      grade: 'P5' as UserData['grade'],
      educationLevel: 'primary' as UserData['educationLevel'],
      languagePref: 'rw',
      isGuest: false,
    };
    localStorage.setItem('edubridge-user', JSON.stringify(user));
    updateUser(user);
    router.push('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-white to-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow">
        <div className="flex items-center gap-4 mb-6">
          <Logo size={56} />
          <div>
            <h1 className="text-xl font-bold">Blaise AI</h1>
            <p className="text-sm text-gray-500">Sign in to continue learning</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone or email</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} required className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-cyan-200" placeholder="0788xxx or you@mail.com" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password (any)</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-cyan-200" placeholder="••••••" />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-cyan-500 text-white rounded px-4 py-2">Sign in</button>
            <button type="button" onClick={() => { localStorage.removeItem('edubridge-user'); router.push('/register'); }} className="flex-1 bg-white border rounded px-4 py-2">Create account</button>
          </div>

          <p className="text-xs text-gray-400 text-center">For MVP: login saves locally for quick testing.</p>
        </form>
      </div>
    </div>
  );
}
