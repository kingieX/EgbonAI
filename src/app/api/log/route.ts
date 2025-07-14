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

    const id = randomUUID();

    db.prepare(
      `INSERT INTO sentiment_results (id, user_id, text_content, sentiment)
   VALUES (?, ?, ?, ?)`
    ).run(id, userId, text, sentiment);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to log sentiment result:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
