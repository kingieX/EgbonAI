import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch user details
    const user = db
      .prepare("SELECT id, email, name, created_at FROM users WHERE id = ?")
      .get(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch sentiment summary
    const stats = db
      .prepare(
        `
        SELECT
          COUNT(*) as total,
          SUM(sentiment = 'positive') AS positive,
          SUM(sentiment = 'neutral') AS neutral,
          SUM(sentiment = 'negative') AS negative
        FROM sentiment_results
        WHERE user_id = ?
      `
      )
      .get(userId);

    return NextResponse.json({ success: true, user, stats });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
