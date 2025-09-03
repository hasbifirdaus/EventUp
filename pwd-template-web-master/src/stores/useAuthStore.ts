import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Authstate {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<Authstate>((set) => ({
  accessToken: null, //awalnya null
  setAccessToken: (token: string | null) => set({ accessToken: token }),
}));
