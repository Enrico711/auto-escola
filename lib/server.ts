import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

export const PHASES = [
  "Requerimento",
  "Curso teórico",
  "Coleta da foto e digitais",
  "Exames médico e psicológico",
  "Exame teórico",
  "Curso prático",
  "Exame prático",
  "Emissão da CNH",
];

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configurados");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export function sessionToken() {
  const pass = process.env.ADMIN_PASSWORD || "";
  return createHash("sha256").update(pass + "|sdi-admin").digest("hex");
}

export function isAuthed(cookieValue: string | undefined) {
  if (!process.env.ADMIN_PASSWORD) return false;
  return cookieValue === sessionToken();
}

export function generateTrackingCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return "SDI-" + code;
}
