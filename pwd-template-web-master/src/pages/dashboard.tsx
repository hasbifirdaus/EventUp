import api from "@/utils/api";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");
        setUserData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  return <div>{userData ? `Hello ${userData.username}` : "Loading..."}</div>;
};

export default Dashboard;
