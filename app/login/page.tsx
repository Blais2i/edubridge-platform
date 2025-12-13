"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/chat");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>

      <input className="input" placeholder="Email"
        value={email} onChange={(e) => setEmail(e.target.value)}
      />

      <input className="input" type="password" placeholder="Password"
        value={password} onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <button onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded">
        Login
      </button>
    </div>
  );
}
