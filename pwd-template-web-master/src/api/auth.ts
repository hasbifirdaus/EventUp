import { useAuthStore } from "@/stores/useAuthStore";

export const handleLogin = async (email: string, password: string) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  //1.Simpan accessToken di zustand store
  useAuthStore.getState().setAccessToken(data.accessToken);

  // 2. RefreshToken biasanya dikirim backend sebagai HttpOnly cookie
  // Frontend tidak bisa akses cookie ini (lebih aman dari XSS)
  // Cookie ini otomatis dikirim saat request ke server
};
