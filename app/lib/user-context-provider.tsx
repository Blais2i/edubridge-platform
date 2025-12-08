// File: app/lib/user-context-provider.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserData = {
  name?: string;
  email?: string;
  phone?: string;
  age?: number | string;
  educationLevel: 'primary' | 'oLevel' | 'aLevel';
  grade: 'P4' | 'P5' | 'P6' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6';
  mainSubjects: string[];
  languagePref: 'en' | 'rw';
  isGuest?: boolean;
};

type UserContextType = {
  user: UserData | null;
  isLoading: boolean;
  updateUser: (data: Partial<UserData>) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage on mount
    const loadUser = () => {
      setIsLoading(true);
      try {
        const savedUser = localStorage.getItem('edubridge-user');
        const guestUser = localStorage.getItem('edubridge-guest');

        if (savedUser) {
          setUser({ ...(JSON.parse(savedUser) as UserData), isGuest: false });
        } else if (guestUser) {
          setUser({ ...(JSON.parse(guestUser) as UserData), isGuest: true });
        } else {
          // Default guest user
          setUser({
            educationLevel: 'primary',
            grade: 'P5',
            mainSubjects: ['math', 'english'],
            languagePref: 'en',
            isGuest: true,
          });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Set default guest user
        setUser({
          educationLevel: 'primary',
          grade: 'P5',
          mainSubjects: ['math', 'english'],
          languagePref: 'en',
          isGuest: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const updateUser = (data: Partial<UserData>) => {
    setUser(prev => {
      const updated = prev ? { ...prev, ...data } : null;
      if (updated && !updated.isGuest) {
        localStorage.setItem('edubridge-user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('edubridge-user');
    localStorage.removeItem('edubridge-guest');
    setUser({
      educationLevel: 'primary',
      grade: 'P5',
      mainSubjects: ['math', 'english'],
      languagePref: 'en',
      isGuest: true,
    });
  };

  return (
    <UserContext.Provider value={{ user, isLoading, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
