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
    const { data: slots, error } = await supabase
      .from("phase_availability")
      .select("*")
      .order("date", { ascending: true });
    if (error) throw error;

    const { data: booked } = await supabase
      .from("students")
      .select("name, appointment_date, appointment_phase, appointment_time")
      .not("appointment_date", "is", null);

    const result = (slots || []).map((s: any) => ({
      ...s,
      bookings: (booked || [])
        .filter(
          (b: any) =>
            b.appointment_date === s.date &&
            b.appointment_phase === s.phase &&
            (b.appointment_time || "") === (s.slot_time || "")
        )
        .map((b: any) => b.name),
    }));

    return NextResponse.json({ slots: result });
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
    const date = String(body.date || "").slice(0, 10);
    const slot_time = String(body.slot_time || "").trim().slice(0, 5);
    if (isNaN(phase) || phase < 0 || phase >= PHASES.length) {
      return NextResponse.json({ error: "Etapa inválida" }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Data inválida" }, { status: 400 });
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("phase_availability")
      .upsert({ phase, date, slot_time }, { onConflict: "phase,date,slot_time" })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ slot: data });
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
    const { error } = await supabase.from("phase_availability").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500 });
  }
}
