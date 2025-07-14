"use client";

import Link from "next/link";
// import { useEffect, useState } from "react";
import ThemeToggleIcon from "./ThemeToggleIcon";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  // const [userId, setUserId] = useState<string | null>(null);
  // const [userEmail, setUserEmail] = useState<string | null>(null);
  const { userId, userEmail } = useAuth();

  // useEffect(() => {
  //   const id = localStorage.getItem("userId");
  //   const email = localStorage.getItem("userEmail"); // optional
  //   if (id) setUserId(id);
  //   if (email) setUserEmail(email);
  //   // console.log("Navbar userId:", id, "userEmail:", email);
  // }, []);

  return (
    <nav className="w-full border-b border-border bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-lg font-bold text-primary">
          EgbónAI
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <ThemeToggleIcon />

          {userId ? (
            <div className="relative group">
              <div className="w-9 h-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center cursor-pointer">
                {userEmail?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute right-0 mt-2 hidden group-hover:flex flex-col w-40 bg-card border border-border rounded shadow text-sm z-10">
                <span className="px-4 py-2 border-b border-border">
                  {userEmail}
                </span>
                <Link
                  href="/history"
                  className="px-4 py-2 hover:bg-muted transition"
                >
                  History
                </Link>
                <Link
                  href="/profile"
                  className="px-4 py-2 hover:bg-muted transition"
                >
                  Profile
                </Link>
                <LogoutButton />
              </div>
            </div>
          ) : (
            <>
              <Link href="/signin" className="hover:text-primary transition">
                Sign In
              </Link>
              <Link href="/signup" className="hover:text-primary transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
