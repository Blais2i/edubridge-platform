"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/chat");
  };

  return (
    <div className="min-h-screen bg-white sm:bg-linear-to-br sm:from-cyan-50 sm:to-blue-50 flex items-center justify-center px-4 py-6">
      <div className="bg-white w-full max-w-md rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-8 border border-gray-100">
        
        <div className="flex justify-center mb-6">
          <Logo size={100} />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-center mb-2 text-gray-900">
          Sign in
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Welcome back to Blaise AI
        </p>

        <input
          className="w-full border border-gray-300 bg-white rounded-lg p-3 mb-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border border-gray-300 bg-white rounded-lg p-3 mb-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        {error && (
          <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4 text-sm">
          <a
            href="/forgot-password"
            className="text-cyan-600 hover:text-cyan-700 font-medium"
          >
            Forgot password?
          </a>

          <a
            href="/register"
            className="text-cyan-600 font-semibold hover:text-cyan-700"
          >
            Don't have an account?
          </a>
        </div>
      </div>
    </div>
  );
}