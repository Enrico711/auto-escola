import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getSupabase, isAuthed, supabaseConfigured,
  friendlyError, notConfiguredMessage,
} from "@/lib/server";

export const dynamic = "force-dynamic";

function guard() {
  const c = cookies().get("sdi_admin")?.value;
  if (!isAuthed(c)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: notConfiguredMessage() }, { status: 500 });
  }
  return null;
}

export async function PATCH(req: Request, ctx: any) {
  const g = guard();
  if (g) return g;
  try {
    const body = await req.json().catch(() => ({}));
    const allowed: any = {};
    for (const k of ["name", "cpf", "phone", "address", "category", "notes", "current_phase", "total_value", "installments_total", "installments_paid", "cnh_expiry"]) {
      if (body[k] !== undefined) allowed[k] = body[k];
    }
    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: "Nada para atualizar" }, { status: 400 });
    }
    const supabase = getSupabase();
    if (allowed.current_phase !== undefined) {
      // Fase mudou: limpa agendamento antigo (era de outra fase)
      allowed.appointment_date = null;
      allowed.appointment_phase = null;
      allowed.appointment_time = null;
    }
    const { data, error } = await supabase
      .from("students")
      .update(allowed)
      .eq("id", ctx.params.id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ student: data });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: any) {
  const g = guard();
  if (g) return g;
  try {
    const supabase = getSupabase();
    const { data: docs } = await supabase
      .from("student_documents")
      .select("path")
      .eq("student_id", ctx.params.id);
    if (docs && docs.length > 0) {
      await supabase.storage.from("documentos").remove(docs.map((d: any) => d.path));
    }
    const { error } = await supabase.from("students").delete().eq("id", ctx.params.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 });
  }
}
