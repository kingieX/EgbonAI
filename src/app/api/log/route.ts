import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { userId, text, sentiment } = await req.json();

    if (!userId || !text || !sentiment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Log request:", { userId, text, sentiment });

    const id = randomUUID();

    try {
      db.prepare(
        `INSERT INTO sentiment_results (id, user_id, text_content, sentiment)
     VALUES (?, ?, ?, ?)`
      ).run(id, userId, text, sentiment);
    } catch (e) {
      console.error("DB insert error:", e);
      return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to log sentiment result:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
