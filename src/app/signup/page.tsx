"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

export default function SignupPage() {
  const { login } = useAuth();

  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        toast.error(data.error || "Signup failed");
      } else {
        // localStorage.setItem("userId", data.userId);
        // localStorage.setItem("userEmail", data.email || form.email);
        login(data.userId, form.email); // 👈 updates context + localStorage
        toast.success("Account created successfully!");
        router.push("/");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
        <div className="w-full max-w-md p-6 bg-card text-card-foreground border border-border rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Name"
              onChange={handleChange}
              className="w-full p-3 bg-input text-foreground border border-border rounded placeholder:text-muted-foreground"
            />
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
              className="w-full bg-primary text-primary-foreground py-2 rounded font-semibold hover:opacity-70 disabled:opacity-70 transition"
              disabled={!form.name || !form.email || !form.password || loading}
            >
              {/* Sign Up */}
              {loading ? "signing up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}
