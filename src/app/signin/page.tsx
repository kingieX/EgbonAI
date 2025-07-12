"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeButton from "@/components/ThemeButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SigninPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign-in failed");
      } else {
        localStorage.setItem("userId", data.userId);
        router.push("/");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
        <div className="w-full max-w-md p-6 bg-card text-card-foreground border border-border rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 bg-input text-foreground border border-border rounded placeholder:text-muted-foreground"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 bg-input text-foreground border border-border rounded placeholder:text-muted-foreground"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded font-semibold hover:opacity-90 transition"
            >
              Sign In
            </button>
            <ThemeButton />
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
