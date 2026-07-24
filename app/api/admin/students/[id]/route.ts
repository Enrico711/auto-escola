import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabase, isAuthed } from "@/lib/server";

function guard() {
  const c = cookies().get("sdi_admin")?.value;
  if (!isAuthed(c)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  return null;
}

export async function PATCH(req: Request, ctx: any) {
  const g = guard();
  if (g) return g;
  const body = await req.json();
  const allowed: any = {};
  for (const k of ["name", "cpf", "phone", "address", "category", "notes", "current_phase"]) {
    if (body[k] !== undefined) allowed[k] = body[k];
  }
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("students")
    .update(allowed)
    .eq("id", ctx.params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ student: data });
}

export async function DELETE(req: Request, ctx: any) {
  const g = guard();
  if (g) return g;
  const supabase = getSupabase();
  const { data: docs } = await supabase
    .from("student_documents")
    .select("path")
    .eq("student_id", ctx.params.id);
  if (docs && docs.length > 0) {
    await supabase.storage.from("documentos").remove(docs.map((d: any) => d.path));
  }
  const { error } = await supabase.from("students").delete().eq("id", ctx.params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
