import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessionToken } from "@/lib/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ADMIN_PASSWORD não configurado no servidor" }, { status: 500 });
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }
  cookies().set("sdi_admin", sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().delete("sdi_admin");
  return NextResponse.json({ ok: true });
}
