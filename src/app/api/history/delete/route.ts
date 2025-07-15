import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    console.log("Delete request ID:", id);

    try {
      const result = db
        .prepare("DELETE FROM sentiment_results WHERE id = ?")
        .run(id);

      console.log("Delete result:", result);
    } catch (e) {
      console.error("Delete DB error:", e);
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sentiment result:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
