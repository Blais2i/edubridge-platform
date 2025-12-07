// File: components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/lib/user-context';

type EducationLevel = 'primary' | 'oLevel' | 'aLevel';
type Grade = 'P4' | 'P5' | 'P6' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';
type LanguagePref = 'en' | 'rw';

export default function LoginForm() {
  const router = useRouter();
  const { updateUser } = useUser();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [contact, setContact] = useState(''); // phone or email
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('primary');
  const [grade, setGrade] = useState<Grade>('P5');
  const [languagePref, setLanguagePref] = useState<LanguagePref>('rw');

  const gradesByLevel: Record<EducationLevel, Grade[]> = {
    primary: ['P4', 'P5', 'P6'],
    oLevel: ['S1', 'S2', 'S3'],
    aLevel: ['S4', 'S5', 'S6'],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!name.trim() || !contact.trim() || !grade) {
      alert('Please provide name, contact and grade.');
      return;
    }

    const userData = {
      name: name.trim(),
      age: age || undefined,
      email: contact.includes('@') ? contact.trim() : undefined,
      phone: contact.includes('@') ? undefined : contact.trim(),
      educationLevel,
      grade,
      mainSubjects: ['math', 'science', 'english'],
      languagePref,
      isGuest: false,
    };

    // Save to localStorage and update context
    localStorage.setItem('edubridge-user', JSON.stringify(userData));
    updateUser(userData);
    router.push('/dashboard');
  };

  const handleGuest = () => {
    const guest = {
      name: 'Guest',
      age: undefined,
      educationLevel: 'primary' as EducationLevel,
      grade: 'P5' as Grade,
      mainSubjects: ['math', 'science', 'english'],
      languagePref: 'rw' as LanguagePref,
      isGuest: true,
    };
    localStorage.setItem('edubridge-guest', JSON.stringify(guest));
    updateUser(guest);
    router.push('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Sign in / Create account' : 'Create Account'}</h2>
      <p className="text-sm text-gray-600 mb-4">Use phone number or email. This is saved locally for the MVP.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Full name</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded p-2" placeholder="e.g. Blaise" required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Age (optional)</label>
            <input type="number" value={age} onChange={e => setAge(Number(e.target.value) || '')} className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone or Email</label>
            <input value={contact} onChange={e => setContact(e.target.value)} className="w-full border rounded p-2" placeholder="e.g. 0788xxx or you@mail.com" required />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Education Level</label>
            <select value={educationLevel} onChange={e => { setEducationLevel(e.target.value as EducationLevel); setGrade(gradesByLevel[e.target.value as EducationLevel][0]); }} className="w-full border rounded p-2">
              <option value="primary">Primary (P4-P6)</option>
              <option value="oLevel">O-Level (S1-S3)</option>
              <option value="aLevel">A-Level (S4-S6)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Grade</label>
            <select value={grade} onChange={e => setGrade(e.target.value as Grade)} className="w-full border rounded p-2">
              {gradesByLevel[educationLevel].map(g => (<option key={g} value={g}>{g}</option>))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Language preference</label>
          <select value={languagePref} onChange={e => setLanguagePref(e.target.value as LanguagePref)} className="w-full border rounded p-2">
            <option value="rw">Kinyarwanda</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-green-600 text-white rounded px-4 py-2">Continue</button>
          <button type="button" onClick={handleGuest} className="flex-1 bg-gray-100 rounded px-4 py-2">Continue as Guest</button>
        </div>

      </form>
    </div>
  );
}
