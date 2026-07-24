import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getSupabase, isAuthed, supabaseConfigured,
  friendlyError, notConfiguredMessage, PHASES,
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

export async function GET() {
  const g = guard();
  if (g) return g;
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("phase_items")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ items: data || [] });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const g = guard();
  if (g) return g;
  try {
    const body = await req.json().catch(() => ({}));
    const phase = Number(body.phase);
    const label = String(body.label || "").trim();
    if (isNaN(phase) || phase < 0 || phase >= PHASES.length) {
      return NextResponse.json({ error: "Etapa inválida" }, { status: 400 });
    }
    if (!label) {
      return NextResponse.json({ error: "Informe o nome do item" }, { status: 400 });
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("phase_items")
      .insert({
        phase,
        label,
        address: body.address || null,
        price: body.price || null,
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const g = guard();
  if (g) return g;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
    const supabase = getSupabase();
    const { error } = await supabase.from("phase_items").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 });
  }
}
