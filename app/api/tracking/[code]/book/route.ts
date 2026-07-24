import { NextResponse } from "next/server";
import {
  getSupabase, PHASES, supabaseConfigured,
  friendlyError, notConfiguredMessage, noStore
} from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request, ctx: any) {
  const code = String(ctx.params.code || "").toUpperCase().trim();
  if (!code) {
    return NextResponse.json({ error: "Código inválido" }, { status: 400, headers: noStore });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: notConfiguredMessage() }, { status: 500, headers: noStore });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const date = String(body.date || "").slice(0, 10);
    const time = String(body.time || "").trim().slice(0, 5);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Data inválida" }, { status: 400, headers: noStore });
    }

    const supabase = getSupabase();
    const { data: student, error } = await supabase
      .from("students")
      .select("id, current_phase")
      .eq("tracking_code", code)
      .maybeSingle();
    if (error) throw error;
    if (!student) {
      return NextResponse.json({ error: "Matrícula não encontrada" }, { status: 404, headers: noStore });
    }

    const phase = Math.min(Math.max(Number(student.current_phase) || 0, 0), PHASES.length - 1);
    const today = new Date().toISOString().slice(0, 10);

    const { data: slot } = await supabase
      .from("phase_availability")
      .select("id")
      .eq("phase", phase)
      .eq("date", date)
      .eq("slot_time", time)
      .maybeSingle();

    if (!slot || date < today) {
      return NextResponse.json(
        { error: "Esse horário não está mais disponível. Escolha outro." },
        { status: 400 }
      );
    }

    const { error: upErr } = await supabase
      .from("students")
      .update({
        appointment_date: date,
        appointment_phase: phase,
        appointment_time: time,
      })
      .eq("id", student.id);
    if (upErr) throw upErr;

    return NextResponse.json({ ok: true }, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500, headers: noStore });
  }
}

export async function DELETE(req: Request, ctx: any) {
  const code = String(ctx.params.code || "").toUpperCase().trim();
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: notConfiguredMessage() }, { status: 500, headers: noStore });
  }
  try {
    const supabase = getSupabase();
    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq("tracking_code", code)
      .maybeSingle();
    if (!student) {
      return NextResponse.json({ error: "Matrícula não encontrada" }, { status: 404, headers: noStore });
    }
    await supabase
      .from("students")
      .update({ appointment_date: null, appointment_phase: null, appointment_time: null })
      .eq("id", student.id);
    return NextResponse.json({ ok: true }, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500, headers: noStore });
  }
}
