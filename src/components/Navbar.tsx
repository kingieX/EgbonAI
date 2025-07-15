"use client";

import Link from "next/link";
import ThemeToggleIcon from "./ThemeToggleIcon";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { userId, userEmail } = useAuth();

  return (
    <nav className="w-full border-b border-border bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-lg font-bold text-primary">
          EgbónAI
        </Link>

        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="px-2 py-2 hover:bg-muted transition">
            Home
          </Link>

          {userId ? (
            <div className="flex items-center gap-2">
              <Link
                href="/history"
                className="px-2 py-2 hover:bg-muted transition"
              >
                History
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* <Button variant="outline">Open</Button> */}
                  <div className="w-9 h-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center cursor-pointer">
                    {userEmail?.charAt(0).toUpperCase() || "U"}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem variant="default">
                    <Link
                      href="/profile"
                      className="w-full px-3 py-2 hover:bg-muted transition"
                    >
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
          <ThemeToggleIcon />
        </div>
      </div>
    </nav>
  );
}
