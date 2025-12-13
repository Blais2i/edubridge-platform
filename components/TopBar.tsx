"use client";

import Logo from "./Logo";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div className="leading-tight">
            <h1 className="text-lg font-semibold">Blaise AI</h1>
            <p className="text-xs text-gray-500">
              Learning assistant • Kinyarwanda first
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            {user?.user_metadata?.full_name || user?.email}
          </span>

          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded border text-sm hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
