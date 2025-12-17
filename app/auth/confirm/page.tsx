"use client";

import { useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function ConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const finalizeConfirmation = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/login");
        return;
      }

      router.replace("/chat");
    };

    finalizeConfirmation();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      Confirming your email…
    </div>
  );
}
