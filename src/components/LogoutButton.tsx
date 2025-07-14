"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    router.push("/signin");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-3 py-1 bg-red-700 text-white hover:opacity-70"
    >
      Logout
    </button>
  );
}
