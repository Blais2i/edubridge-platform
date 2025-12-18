"use client";

import Logo from "./Logo";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const confirmed = window.confirm(
      "Do you want to log out?"
    );

    if (!confirmed) return;

    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
        
        {/* LEFT: quiet identity */}
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="text-sm font-medium text-gray-800">
            Blaise
          </span>
        </div>

        {/* RIGHT: student name + logout */}
        <div className="flex items-center gap-4">
          
          {/* Clickable student name */}
          <button
            onClick={handleProfileClick}
            className="text-sm text-gray-700 hover:underline"
          >
            {user?.user_metadata?.full_name || user?.email}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
