import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabase, isAuthed, generateTrackingCode } from "@/lib/server";

function guard() {
  const c = cookies().get("sdi_admin")?.value;
  if (!isAuthed(c)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const g = guard();
  if (g) return g;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ students: data });
}

export async function POST(req: Request) {
  const g = guard();
  if (g) return g;
  const body = await req.json();
  if (!body.name || !body.cpf) {
    return NextResponse.json({ error: "Nome e CPF são obrigatórios" }, { status: 400 });
  }
  const supabase = getSupabase();
  let tracking_code = generateTrackingCode();
  for (let i = 0; i < 5; i++) {
    const { data: exists } = await supabase
      .from("students")
      .select("id")
      .eq("tracking_code", tracking_code)
      .maybeSingle();
    if (!exists) break;
    tracking_code = generateTrackingCode();
  }
  const { data, error } = await supabase
    .from("students")
    .insert({
      tracking_code,
      name: body.name,
      cpf: body.cpf,
      phone: body.phone || null,
      address: body.address || null,
      category: body.category || null,
      notes: body.notes || null,
      current_phase: 0,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ student: data });
}
