import { NextResponse } from "next/server";
import {
  getSupabase, PHASES, supabaseConfigured,
  friendlyError, notConfiguredMessage, noStore
} from "@/lib/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: any) {
  const code = String(ctx.params.code || "").toUpperCase().trim();
  if (!code) {
    return NextResponse.json({ error: "Código inválido" }, { status: 400, headers: noStore });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: notConfiguredMessage() }, { status: 500, headers: noStore });
  }
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("students")
      .select("name, current_phase, category, created_at, appointment_date, appointment_phase, appointment_time")
      .eq("tracking_code", code)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Matrícula não encontrada" }, { status: 404, headers: noStore });
    }

    const firstName = String(data.name || "").split(" ")[0];
    const phase = Math.min(Math.max(Number(data.current_phase) || 0, 0), PHASES.length - 1);
    const today = new Date().toISOString().slice(0, 10);

    const { data: slots } = await supabase
      .from("phase_availability")
      .select("date, slot_time")
      .eq("phase", phase)
      .gte("date", today)
      .order("date", { ascending: true })
      .limit(60);

    const { data: setting } = await supabase
      .from("phase_settings")
      .select("address, instructions, link")
      .eq("phase", phase)
      .maybeSingle();

    const { data: items } = await supabase
      .from("phase_items")
      .select("label, address, price")
      .eq("phase", phase)
      .order("created_at", { ascending: true });

    const appointment =
      data.appointment_date && data.appointment_phase === phase
        ? { date: data.appointment_date, time: data.appointment_time || "" }
        : null;

    const available = (slots || []).map((s: any) => ({
      date: s.date,
      time: s.slot_time || "",
    }));
    available.sort((a: any, b: any) =>
      a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)
    );

    return NextResponse.json({
      firstName,
      category: data.category,
      currentPhase: phase,
      phases: PHASES,
      since: data.created_at,
      availableSlots: available,
      appointment,
      info: setting || null,
      items: items || [],
    }, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500, headers: noStore });
  }
}
