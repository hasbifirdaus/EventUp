// src/stores/usePointStore.ts
import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

interface IPointDetail {
  amount: number;
  createdAt: string;
  expirationDate: string;
}

interface IPointState {
  totalPoints: number;
  details: IPointDetail[];
  fetchPoints: () => Promise<void>;
}

interface IPointResponse {
  totalPoints: number;
  details: IPointDetail[];
}

export const usePointStore = create<IPointState>((set) => ({
  totalPoints: 0,
  details: [],
  fetchPoints: async () => {
    try {
      const token = useAuthStore.getState().accessToken; // ambil JWT dari auth store
      const res = await axios.get<IPointResponse>(
        "http://localhost:8000/api/points",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      set({
        totalPoints: res.data.totalPoints,
        details: res.data.details,
      });
    } catch (error) {
      console.error("Gagal fetch points:", error);
    }
  },
}));
