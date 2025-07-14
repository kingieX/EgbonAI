import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const results = db
      .prepare(
        `SELECT id, text_content AS text, sentiment, timestamp AS created_at
     FROM sentiment_results
     WHERE user_id = ?
     ORDER BY created_at DESC`
      )
      .all(userId);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Failed to fetch sentiment history:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
