import { access } from "fs";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface Authstate {
  accessToken: string | null;
  user: { id: string; username: string; email: string; role: string } | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: Authstate["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<Authstate>()(
  persist(
    (set) => ({
      accessToken: null, //awalnya null
      user: null,
      setAccessToken: (token: string | null) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "auth-storage", //nama key di localStorage
    }
  )
);
