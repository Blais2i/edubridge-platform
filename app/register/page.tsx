"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

function generateEmailFromPhone(phone: string) {
  const clean = phone.replace(/\D/g, "");
  return `parent_${clean}@blaiseai.local`;
}

export default function RegisterPage() {
  const router = useRouter();

  const [childName, setChildName] = useState("");
  const [grade, setGrade] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("rw");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError("");

    if (!childName || !grade || !parentPhone || !password) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const finalEmail = email.trim()
      ? email.trim()
      : generateEmailFromPhone(parentPhone);

    const { error } = await supabase.auth.signUp({
      email: finalEmail,
      password,
      options: {
        data: {
          full_name: childName,
          grade,
          parent_phone: parentPhone,
          language,
          role: "student",
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/success");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size={120} />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">
          Create an account
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Help your child learn with Blaise AI
        </p>

        {/* Child name */}
        <input
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Child full name *"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />

        {/* Grade */}
        <input
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Grade (P4, P6, S2, S6) *"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />

        {/* Parent phone */}
        <input
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Parent phone number *"
          value={parentPhone}
          onChange={(e) => setParentPhone(e.target.value)}
        />

        {/* Optional email */}
        <input
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Language */}
        <select
          className="w-full border rounded-lg p-3 mb-3"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="rw">Kinyarwanda</option>
          <option value="en">English</option>
        </select>

        {/* Password */}
        <input
          type="password"
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-700 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
