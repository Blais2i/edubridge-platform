"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Supabase puts tokens in the URL hash
    const hash = window.location.hash;
    if (!hash) return;

    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        setError("Invalid or expired password reset link.");
      }
    });
  }, []);

  const handleReset = async () => {
    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      alert("Password updated successfully.");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-lg font-semibold mb-4">Reset password</h1>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {error && (
          <p className="text-sm text-red-600 mb-3">{error}</p>
        )}

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-cyan-500 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </div>
    </div>
  );
}
