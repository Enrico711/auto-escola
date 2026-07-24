import { NextResponse } from "next/server";
import { getSupabase, PHASES } from "@/lib/server";

export async function GET(req: Request, ctx: any) {
  const code = (ctx.params.code || "").toUpperCase().trim();
  if (!code) return NextResponse.json({ error: "Código inválido" }, { status: 400 });
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("students")
    .select("name, current_phase, category, created_at")
    .eq("tracking_code", code)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Matrícula não encontrada" }, { status: 404 });
  const firstName = (data.name || "").split(" ")[0];
  return NextResponse.json({
    firstName,
    category: data.category,
    currentPhase: data.current_phase,
    phases: PHASES,
    since: data.created_at,
  });
}
