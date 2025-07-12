"use client";

import { useTheme } from "@/context/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggleIcon() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-border bg-muted text-muted-foreground transition hover:ring-2 hover:ring-ring"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun size={18} className="text-primary transition-all duration-300" />
      ) : (
        <Moon size={18} className="text-accent transition-all duration-300" />
      )}
    </button>
  );
}
