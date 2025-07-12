"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Get system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const systemTheme = mediaQuery.matches ? "dark" : "light";

    const stored = localStorage.getItem("theme") as Theme;
    setTheme(stored || "system");

    const updateTheme = () => {
      const current = stored === "system" || !stored ? systemTheme : stored;
      setResolvedTheme(current as "light" | "dark");
      document.documentElement.classList.toggle("dark", current === "dark");
    };

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, []);

  // On manual toggle
  useEffect(() => {
    if (!theme) return;
    localStorage.setItem("theme", theme);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const systemTheme = mediaQuery.matches ? "dark" : "light";

    const appliedTheme = theme === "system" ? systemTheme : theme;
    setResolvedTheme(appliedTheme);
    document.documentElement.classList.toggle("dark", appliedTheme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
