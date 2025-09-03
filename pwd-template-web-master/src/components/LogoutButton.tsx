import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/utils/api";

const LogoutButton = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleLogout = async () => {
    setAccessToken(null);
  };
};
