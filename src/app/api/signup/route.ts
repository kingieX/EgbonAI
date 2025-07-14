import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import type { SignupPayload } from "@/types/auth";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as SignupPayload;
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = randomUUID();

    db.prepare(
      "INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)"
    ).run(id, email, name, password_hash);

    return NextResponse.json({ success: true, userId: id });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
