// app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { useUser } from '@/app/lib/user-context';
import type { UserData } from '@/app/lib/user-context-provider';

export default function RegisterPage() {
  const router = useRouter();
  const { updateUser } = useUser();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState<'P4' | 'P5' | 'P6' | 'S1' | 'S2' | 'S3'>('P5');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const user: Partial<UserData> = {
      name: name || (contact.includes('@') ? contact.split('@')[0] : contact),
      email: contact.includes('@') ? contact : undefined,
      phone: contact.includes('@') ? undefined : contact,
      age: age || '',
      grade,
      educationLevel: (grade.startsWith('P') ? 'primary' : 'oLevel') as UserData['educationLevel'],
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
            <h1 className="text-xl font-bold">Create account</h1>
            <p className="text-sm text-gray-500">Join Blaise AI — it's free for testing</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-cyan-200" placeholder="Blaise" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone or email</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} required className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-cyan-200" placeholder="0788xxx or you@mail.com" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Age (optional)</label>
              <input value={age} onChange={(e) => setAge(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Grade</label>
                <select value={grade} onChange={(e) => setGrade(e.target.value as 'P4' | 'P5' | 'P6' | 'S1' | 'S2' | 'S3')} className="w-full border rounded px-3 py-2">
                  <option value="P4">P4</option>
                  <option value="P5">P5</option>
                  <option value="P6">P6</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-cyan-500 text-white rounded px-4 py-2">Create account</button>
            <button type="button" onClick={() => router.push('/login')} className="flex-1 bg-white border rounded px-4 py-2">Sign in</button>
          </div>

          <p className="text-xs text-gray-400 text-center">Your info is stored locally during MVP testing.</p>
        </form>
      </div>
    </div>
  );
}
