"use client";

import Logo from "./Logo";
import { useUser } from "@/app/context/UserContext";

export default function TopBar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { user } = useUser();

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="md:hidden text-xl"
          >
            ☰
          </button>

          <Logo size={28} />
          <span className="text-sm sm:text-base font-medium">Blaise</span>
        </div>

        <div className="text-sm sm:text-base text-gray-700 truncate max-w-[150px] sm:max-w-xs">
          {user?.user_metadata?.full_name || user?.email}
        </div>
      </div>
    </header>
  );
}
