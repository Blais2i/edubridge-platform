"use client";

import { useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/app/lib/supabaseClient";

export default function SettingsPage() {
  const { user } = useUser();

  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || ""
  );
  const [language, setLanguage] = useState(
    user?.user_metadata?.language || "rw"
  );

  async function saveSettings() {
    await supabase.auth.updateUser({
      data: { full_name: fullName, language },
    });
    alert("Settings saved.");
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Settings</h1>

      <label className="block mb-2 font-medium">Full name</label>
      <input
        className="w-full border p-2 rounded mb-4"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <label className="block mb-2 font-medium">Preferred language</label>
      <select
        className="w-full border p-2 rounded mb-4"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="rw">Kinyarwanda</option>
        <option value="en">English</option>
      </select>

      <button
        onClick={saveSettings}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
