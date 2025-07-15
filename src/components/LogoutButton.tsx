"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    // localStorage.removeItem("userId");
    // localStorage.removeItem("userEmail");
    logout();
    toast.success("Logged out successfully");
    router.push("/signin");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-sm px-3 py-2 bg-red-700 text-white hover:opacity-70 cursor-pointer"
    >
      Logout
    </button>
  );
}
