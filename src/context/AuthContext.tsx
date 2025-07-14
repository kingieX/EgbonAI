"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  userId: string | null;
  userEmail: string | null;
  login: (id: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail");
    if (id) setUserId(id);
    if (email) setUserEmail(email);
  }, []);

  const login = (id: string, email: string) => {
    localStorage.setItem("userId", id);
    localStorage.setItem("userEmail", email);
    setUserId(id);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    setUserId(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ userId, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
