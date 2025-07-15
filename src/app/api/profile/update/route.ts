import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId, name, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check for email conflict
    const existing = db
      .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
      .get(email, userId);
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    db.prepare("UPDATE users SET name = ?, email = ? WHERE id = ?").run(
      name,
      email,
      userId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
