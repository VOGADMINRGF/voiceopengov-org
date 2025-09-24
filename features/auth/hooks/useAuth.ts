import { useState } from "react";
import { IUserProfile } from "@/models/pii/UserProfile";

type LoginParams = { email: string; password: string };

export function useAuth() {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<null | { message: string }>(null);

  async function login({ email, password }: LoginParams) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Login fehlgeschlagen");
      setUser(await res.json());
    } catch (e: any) {
      setError({ message: e.message || "Unbekannter Fehler" });
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
  }

  return { user, login, logout, isLoading, error, setUser };
}
