import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

interface ICoupon {
  code: string;
  discount: string;
  validUntil: string;
  status: "active" | "expired";
}

interface ICouponState {
  coupons: ICoupon[];
  fetchCoupons: () => Promise<void>;
}

interface ICouponResponse {
  coupons: ICoupon[];
}

export const useCouponStore = create<ICouponState>((set) => ({
  coupons: [],
  fetchCoupons: async () => {
    try {
      const token = useAuthStore.getState().accessToken;
      const res = await axios.get<ICouponResponse>(
        "http://localhost:8000/api/referral/my-coupons",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ coupons: res.data.coupons });
    } catch (error) {
      console.error(error);
    }
  },
}));
