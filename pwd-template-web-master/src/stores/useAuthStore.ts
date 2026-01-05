import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  referralCode?: string;
}

interface Authstate {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: Authstate["user"]) => void;
  logout: () => void;
  _hasHydrated: boolean;
}

export const useAuthStore = create<Authstate>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAccessToken: (token: string | null) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      logout: () => set({ accessToken: null, user: null }),
      _hasHydrated: false,
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);
