"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("");
  const [language, setLanguage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          grade,
          language
        }
      }
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/chat");
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Create an account</h1>

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Full name"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Grade"
        value={grade}
        onChange={e => setGrade(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Language"
        value={language}
        onChange={e => setLanguage(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-3"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <button
        onClick={handleRegister}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Register
      </button>

      <p className="mt-4 text-center">
        Already have an account?
        <a href="/login" className="text-blue-600 ml-1">Sign in</a>
      </p>
    </div>
  );
}
