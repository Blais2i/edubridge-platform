"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type UserContextType = {
  user: User | null;
  meta: any | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: null,
  meta: null,
  loading: true,
  logout: async () => {}
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [meta, setMeta] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
      setMeta(data.user?.user_metadata || null);
      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setMeta(session?.user?.user_metadata || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setMeta(null);
      // Optional: Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, meta, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}