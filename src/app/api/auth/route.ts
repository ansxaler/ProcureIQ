import { NextRequest, NextResponse } from "next/server";

const PASSWORD = "onjob!";
const COOKIE_NAME = "procureiq-auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === PASSWORD) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, PASSWORD, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  return NextResponse.json({ error: "wrong" }, { status: 401 });
}
