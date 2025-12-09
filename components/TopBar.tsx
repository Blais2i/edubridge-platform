// components/TopBar.tsx
'use client';

import Logo from './Logo';
import { useUser } from '@/app/lib/user-context';

export default function TopBar() {
  const { user } = useUser();

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <div>
            <h3 className="text-lg font-semibold">Blaise AI</h3>
            <p className="text-xs text-gray-500">Learning assistant • Kinyarwanda first</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-700">{user?.user_metadata?.full_name || user?.email || 'Guest'}</div>
          <button
            onClick={() => {/* TODO: Add logout handler */}}
            className="px-3 py-1 rounded border border-gray-200 text-sm hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
