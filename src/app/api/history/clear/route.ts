import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    db.prepare("DELETE FROM sentiment_results WHERE user_id = ?").run(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to clear history:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export {};
