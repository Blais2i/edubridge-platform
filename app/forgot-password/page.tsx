"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Logo from "@/components/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleReset() {
    if (!email) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://blaiseai-self.vercel.app/reset-password"
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <div className="flex flex-col items-center mb-6">
          <Logo size={60} />
          <h1 className="text-2xl font-bold mt-2">Reset password</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your email to receive reset instructions</p>
        </div>

        {sent ? (
          <div className="text-center text-green-600 font-medium">
            ✔ A reset link has been sent to your email.
          </div>
        ) : (
          <>
            <input
              className="w-full border rounded-lg p-3 text-gray-700 mb-3"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          Go back to{" "}
          <a className="text-cyan-700 font-semibold" href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
