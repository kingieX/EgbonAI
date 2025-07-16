/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type User = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

type Stats = {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/signin");
      return;
    }

    fetchProfile(userId);
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setUser(data.user);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
      toast.error("Failed to load profile");
    }
  };

  const clearHistory = async () => {
    if (!user) return;

    try {
      const res = await fetch("/api/history/clear", {
        method: "POST",
        body: JSON.stringify({ userId: user.id }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success("History cleared successfully");
      setStats(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear history");
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-primary">👤 Profile</h1>

        {error && <p className="text-destructive mb-4">{error}</p>}

        {user && (
          <div className="bg-card border border-border rounded p-4 mb-6 text-card-foreground">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Name:</strong> {user.name || "—"}
            </p>
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        )}

        {stats && (
          <div className="bg-card border border-border rounded p-4 text-card-foreground">
            <h2 className="text-lg font-semibold mb-3 text-primary">
              📊 Sentiment Summary
            </h2>
            <p>
              Total Analyzed: <strong>{stats.total}</strong>
            </p>
            <p className="text-green-600">✅ Positive: {stats.positive || 0}</p>
            <p className="text-yellow-500">🟡 Neutral: {stats.neutral || 0}</p>
            <p className="text-red-600">❌ Negative: {stats.negative || 0}</p>
          </div>
        )}

        {user && (
          <div className="mt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="bg-destructive text-white px-4 py-2 rounded hover:opacity-80 transition text-sm">
                  🧹 Clear All History
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to clear all your history?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action is irreversible and will delete all your
                    sentiment analysis logs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-white hover:opacity-80"
                    onClick={clearHistory}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {user && (
          <div className="mt-10 bg-card border border-border p-4 rounded text-card-foreground">
            <h3 className="text-lg font-semibold mb-4">✏️ Edit Profile</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);
                const name = formData.get("name") as string;
                const email = formData.get("email") as string;

                try {
                  const res = await fetch("/api/profile/update", {
                    method: "POST",
                    body: JSON.stringify({ userId: user.id, name, email }),
                    headers: { "Content-Type": "application/json" },
                  });

                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error);

                  toast.success("Profile updated");
                  setUser({ ...user, name, email });
                  localStorage.setItem("userEmail", email); // sync UI
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to update profile");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name}
                  className="w-full p-2 border border-border rounded bg-input text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user.email}
                  className="w-full p-2 border border-border rounded bg-input text-foreground"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-80 transition text-sm"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {user && (
          <div className="mt-10 bg-card border border-border p-4 rounded text-card-foreground">
            <h3 className="text-lg font-semibold mb-4">🔐 Change Password</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);

                const currentPassword = formData.get(
                  "currentPassword"
                ) as string;
                const newPassword = formData.get("newPassword") as string;
                const confirmPassword = formData.get(
                  "confirmPassword"
                ) as string;

                if (newPassword !== confirmPassword) {
                  toast.error("New passwords do not match");
                  return;
                }

                if (
                  newPassword.length < 8 ||
                  !/\d/.test(newPassword) ||
                  !/[A-Z]/.test(newPassword)
                ) {
                  toast.error(
                    "Password must be at least 8 characters long and include a number and uppercase letter"
                  );
                  return;
                }

                try {
                  const res = await fetch("/api/profile/password", {
                    method: "POST",
                    body: JSON.stringify({
                      userId: user.id,
                      currentPassword,
                      newPassword,
                    }),
                    headers: { "Content-Type": "application/json" },
                  });

                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error);

                  toast.success("Password updated successfully");
                  form.reset();
                } catch (err: any) {
                  toast.error(err?.message || "Failed to update password");
                  console.error(err);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  className="w-full p-2 border border-border rounded bg-input text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  className="w-full p-2 border border-border rounded bg-input text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="w-full p-2 border border-border rounded bg-input text-foreground"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-80 transition text-sm"
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
