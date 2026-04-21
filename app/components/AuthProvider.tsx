"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  getSession,
  login as loginUser,
  signup as signupUser,
  type SessionUser,
} from "@/app/lib/auth";

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  login: (input: { email: string; password: string }) => SessionUser;
  signup: (input: { name: string; email: string; password: string }) => SessionUser;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getSession());
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: (input) => {
        const session = loginUser(input);
        setUser(session);
        return session;
      },
      signup: (input) => {
        const session = signupUser(input);
        setUser(session);
        return session;
      },
      logout: () => {
        clearSession();
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

