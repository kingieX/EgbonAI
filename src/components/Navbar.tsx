"use client";

import Link from "next/link";
import ThemeToggleIcon from "./ThemeToggleIcon";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-border bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-lg font-bold text-primary">
          EgbónAI
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/signin" className="hover:text-primary transition">
            Sign In
          </Link>
          <Link href="/signup" className="hover:text-primary transition">
            Sign Up
          </Link>
          <ThemeToggleIcon />
        </div>
      </div>
    </nav>
  );
}
