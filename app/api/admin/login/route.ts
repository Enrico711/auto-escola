import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessionToken, adminPassword } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const typed = String(body.password ?? "").trim();
  const expected = adminPassword();

  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD não configurado no servidor" },
      { status: 500 }
    );
  }
  if (typed !== expected) {
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
