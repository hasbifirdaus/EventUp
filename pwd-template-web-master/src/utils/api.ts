import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

interface IRefreshResponse {
  accessToken: string;
}

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // Cookie refresh token dikirim otomatis
});

// Request interceptor untuk attach accessToken
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (!config.headers) config.headers = {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor untuk refresh token otomatis
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // kirim refresh token via cookie ke backend
        const res = await axios.post<IRefreshResponse>(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        // simpan accessToken baru
        useAuthStore.getState().setAccessToken(res.data.accessToken);

        // ulang request awal
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;
        return axios(originalRequest);
      } catch {
        // kalau refresh token invalid → logout
        useAuthStore.getState().setAccessToken(null);
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
