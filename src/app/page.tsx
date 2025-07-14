/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

type SentimentResult = {
  sentiment: "positive" | "neutral" | "negative";
  confidence: number;
  explanation: string;
};

export default function HomePage() {
  const [text, setText] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail");
    setUserId(uid);
    setUserEmail(email);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ text, userId }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);

      if (userId) {
        // Log the result only for authenticated users
        await fetch("/api/log", {
          method: "POST",
          body: JSON.stringify({ userId, text, sentiment: data.sentiment }),
          headers: { "Content-Type": "application/json" },
        });
        alert("Sentiment logged successfully");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <main className="min-h-screen bg-background text-foreground px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-primary">
              EgbónAI Analyzer
            </h1>
            {userId ? (
              <span className="text-sm text-muted-foreground">
                Logged in as {userEmail}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                Using temporary session –{" "}
                <a href="/signin" className="text-primary underline">
                  Sign in
                </a>{" "}
                to save history
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type a Nigerian social media post..."
              className="w-full h-40 p-4 border border-border rounded bg-input text-foreground placeholder:text-muted-foreground resize-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded font-medium hover:opacity-90 disabled:opacity-70 transition"
            >
              {loading ? "Analyzing..." : "Analyze Sentiment"}
            </button>
          </form>

          {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

          {result && (
            <div className="mt-6 border border-border rounded p-4 bg-card text-card-foreground">
              <h2 className="text-lg font-semibold mb-2">Analysis Result</h2>
              <p>
                <strong>Sentiment:</strong>{" "}
                <span
                  className={`font-bold ${
                    result.sentiment === "positive"
                      ? "text-green-600"
                      : result.sentiment === "negative"
                      ? "text-red-600"
                      : "text-yellow-500"
                  }`}
                >
                  {result.sentiment.toUpperCase()}
                </span>
              </p>
              <p>
                <strong>Confidence:</strong> {result.confidence}%
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <strong>Explanation:</strong> {result.explanation}
              </p>
            </div>
          )}
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}
