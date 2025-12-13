"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useUser();

  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("");
  const [language, setLanguage] = useState("rw");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Load profile info
  useEffect(() => {
    if (user?.user_metadata) {
      setFullName(user.user_metadata.full_name || "");
      setGrade(user.user_metadata.grade || "");
      setLanguage(user.user_metadata.language || "rw");
    }
  }, [user]);

  async function saveChanges() {
    if (!user) return;
    setSaving(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          grade,
          language
        }
      });

      if (error) throw error;

      setMessage("Changes saved successfully.");
    } catch (err: any) {
      setMessage("Failed to update profile.");
      console.error(err);
    }

    setSaving(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return <div className="p-10 text-center text-gray-600">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-700">You are not signed in.</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
        
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

        {/* Avatar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-gray-700 text-white rounded-full flex items-center justify-center text-xl font-bold">
            {fullName ? fullName[0].toUpperCase() : (user.email || "U")[0].toUpperCase()}
          </div>

          <div>
            <p className="font-semibold">{fullName || "Unknown user"}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Editable fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              className="w-full mt-1 border rounded px-3 py-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Grade</label>
            <input
              className="w-full mt-1 border rounded px-3 py-2"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Example: P5, S2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Preferred Language</label>
            <select
              className="w-full mt-1 border rounded px-3 py-2"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="rw">Kinyarwanda</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* System message */}
        {message && (
          <p className="mt-4 text-sm text-center text-green-600">{message}</p>
        )}

        {/* Save button */}
        <button
          className="w-full mt-6 bg-cyan-500 text-white py-2 rounded hover:opacity-95"
          onClick={saveChanges}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full mt-3 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>

      </div>
    </div>
  );
}
