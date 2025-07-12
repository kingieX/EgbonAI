/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTheme } from "@/context/ThemeProvider";

export default function ThemeButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Theme:</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="px-2 py-1 bg-background text-foreground border border-border rounded"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <span className="text-xs text-gray-500">Current: {resolvedTheme}</span>
    </div>
  );
}
