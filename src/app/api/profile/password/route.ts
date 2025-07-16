import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcrypt";

type PasswordChangePayload = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

type ApiSuccess = {
  success: true;
};

type ApiError = {
  error: string;
};

export async function POST(
  req: NextRequest
): Promise<NextResponse<ApiSuccess | ApiError>> {
  try {
    const { userId, currentPassword, newPassword } =
      (await req.json()) as PasswordChangePayload;

    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const isStrong =
      newPassword.length >= 8 &&
      /\d/.test(newPassword) &&
      /[A-Z]/.test(newPassword);

    if (!isStrong) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and include an uppercase letter and number",
        },
        { status: 400 }
      );
    }

    const user = db
      .prepare("SELECT password_hash FROM users WHERE id = ?")
      .get(userId) as { password_hash: string } | undefined;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 403 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
      newHash,
      userId
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password update error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
