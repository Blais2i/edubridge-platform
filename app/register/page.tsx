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
  const [schoolName, setSchoolName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("rw");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError("");

    if (!childName || !grade || !schoolName || !parentPhone || !password) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);

    const finalEmail = email.trim()
      ? email.trim()
      : generateEmailFromPhone(parentPhone);

    try {
      // Clear any existing session
      await supabase.auth.signOut();

      // ✅ ONLY create auth user
      const { error: signUpError } = await supabase.auth.signUp({
        email: finalEmail,
        password,
        options: {
          emailRedirectTo: "http://localhost:3000/auth/confirm",
          data: {
            full_name: childName,
            grade,
            school_name: schoolName,
            parent_phone: parentPhone,
            language,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // ✅ Profile is created by database trigger
      router.push("/success");
    } catch {
      setError("Registration failed. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        <div className="flex justify-center mb-6">
          <Logo size={120} />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">
          Create an account
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Help your child learn with Blaise AI
        </p>

        <input
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Child full name *"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />

        <input
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Grade (P4, P6, S2, S6) *"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />

        <input
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="School name *"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
        />

        <input
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Parent phone number *"
          value={parentPhone}
          onChange={(e) => setParentPhone(e.target.value)}
        />

        <input
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="w-full border rounded-lg p-3 mb-3"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="rw">Kinyarwanda</option>
          <option value="en">English</option>
        </select>

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