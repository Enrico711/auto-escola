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

export async function GET(req: Request, ctx: any) {
  const g = guard();
  if (g) return g;
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("student_documents")
    .select("*")
    .eq("student_id", ctx.params.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const docs = [];
  for (const d of data || []) {
    const { data: signed } = await supabase.storage
      .from("documentos")
      .createSignedUrl(d.path, 60 * 60);
    docs.push({ ...d, url: signed?.signedUrl || null });
  }
  return NextResponse.json({ documents: docs });
}

export async function POST(req: Request, ctx: any) {
  const g = guard();
  if (g) return g;
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const label = (form.get("label") as string) || "Documento";
  if (!file) return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "Arquivo muito grande (máx 4MB)" }, { status: 400 });
  }
  const supabase = getSupabase();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${ctx.params.id}/${Date.now()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await supabase.storage
    .from("documentos")
    .upload(path, buf, { contentType: file.type || "image/jpeg" });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });
  const { data, error } = await supabase
    .from("student_documents")
    .insert({ student_id: ctx.params.id, label, path })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ document: data });
}

export async function DELETE(req: Request, ctx: any) {
  const g = guard();
  if (g) return g;
  const { searchParams } = new URL(req.url);
  const docId = searchParams.get("docId");
  if (!docId) return NextResponse.json({ error: "docId obrigatório" }, { status: 400 });
  const supabase = getSupabase();
  const { data: doc } = await supabase
    .from("student_documents")
    .select("path")
    .eq("id", docId)
    .single();
  if (doc) {
    await supabase.storage.from("documentos").remove([doc.path]);
    await supabase.from("student_documents").delete().eq("id", docId);
  }
  return NextResponse.json({ ok: true });
}
