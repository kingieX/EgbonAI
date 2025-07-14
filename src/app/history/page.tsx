"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type SentimentResult = {
  id: string;
  text: string;
  sentiment: "positive" | "neutral" | "negative";
  created_at: string;
};

export default function HistoryPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [results, setResults] = useState<SentimentResult[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) {
      router.push("/signin");
      return;
    }

    setUserId(uid);

    fetch("/api/history", {
      method: "POST",
      body: JSON.stringify({ userId: uid }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.error);
        setResults(data.results);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load history");
      });
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/history/delete", {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResults(results.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete this entry.");
    }
  };

  const summary = {
    positive: results.filter((r) => r.sentiment === "positive").length,
    neutral: results.filter((r) => r.sentiment === "neutral").length,
    negative: results.filter((r) => r.sentiment === "negative").length,
  };

  const pieData = [
    { name: "Positive", value: summary.positive },
    { name: "Neutral", value: summary.neutral },
    { name: "Negative", value: summary.negative },
  ];

  const COLORS = ["#34d399", "#facc15", "#f87171"];

  return (
    <main className="min-h-screen px-4 py-8 bg-background text-foreground">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-primary">
          📜 Sentiment History
        </h1>

        {error && <p className="text-red-500">{error}</p>}

        {results.length > 0 && (
          <div className="mb-6 text-sm text-muted-foreground flex flex-wrap gap-4">
            <div>
              ✅ Positive: <strong>{summary.positive}</strong>
            </div>
            <div>
              🟡 Neutral: <strong>{summary.neutral}</strong>
            </div>
            <div>
              ❌ Negative: <strong>{summary.negative}</strong>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="w-full h-[250px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {results.length === 0 ? (
          <p className="text-muted-foreground">No sentiment history found.</p>
        ) : (
          <ul className="space-y-4">
            {results.map((entry) => (
              <li
                key={entry.id}
                className="p-4 border border-border bg-card rounded text-card-foreground"
              >
                <div className="text-sm mb-1 text-muted-foreground">
                  {new Date(entry.created_at).toLocaleString()}
                </div>
                <p className="mb-2">{entry.text}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-bold ${
                      entry.sentiment === "positive"
                        ? "text-green-600"
                        : entry.sentiment === "negative"
                        ? "text-red-600"
                        : "text-yellow-500"
                    }`}
                  >
                    {entry.sentiment.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
