"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout(); //Clear token & user dari store
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2  bg-gray-300 text-red-500 rounded-lg hover:bg-gray-400 hover:font-bold"
    >
      Keluar
    </button>
  );
}
