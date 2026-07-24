import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getSupabase, isAuthed, supabaseConfigured,
  friendlyError, notConfiguredMessage, PHASES, noStore
} from "@/lib/server";

export const dynamic = "force-dynamic";

function guard() {
  const c = cookies().get("sdi_admin")?.value;
  if (!isAuthed(c)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401, headers: noStore });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: notConfiguredMessage() }, { status: 500, headers: noStore });
  }
  return null;
}

export async function GET() {
  const g = guard();
  if (g) return g;
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("phase_settings").select("*");
    if (error) throw error;
    return NextResponse.json({ settings: data || [] }, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500, headers: noStore });
  }
}

export async function POST(req: Request) {
  const g = guard();
  if (g) return g;
  try {
    const body = await req.json().catch(() => ({}));
    const phase = Number(body.phase);
    if (isNaN(phase) || phase < 0 || phase >= PHASES.length) {
      return NextResponse.json({ error: "Etapa inválida" }, { status: 400, headers: noStore });
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("phase_settings")
      .upsert(
        {
          phase,
          address: body.address ?? null,
          instructions: body.instructions ?? null,
          link: body.link ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "phase" }
      )
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ setting: data }, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: friendlyError(err) }, { status: 500, headers: noStore });
  }
}
