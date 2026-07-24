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

export function adminPassword() {
  return (process.env.ADMIN_PASSWORD || "").trim();
}

export function sessionToken() {
  return createHash("sha256").update(adminPassword() + "|sdi-admin").digest("hex");
}

export function isAuthed(cookieValue: string | undefined) {
  if (!adminPassword()) return false;
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

export function supabaseConfigured() {
  return Boolean(
    (process.env.SUPABASE_URL || "").trim() &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()
  );
}

export function getSupabase() {
  const url = (process.env.SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Traduz erros técnicos do Supabase em mensagens que o gestor entende. */
export function friendlyError(err: any): string {
  const msg = String(err?.message || err || "Erro desconhecido");
  if (/relation .* does not exist/i.test(msg) || /Could not find the table/i.test(msg)) {
    return "As tabelas do banco não foram criadas. Rode o arquivo supabase-setup.sql no SQL Editor do Supabase.";
  }
  if (/Bucket not found/i.test(msg)) {
    return "O armazenamento de documentos não foi criado. Rode o supabase-setup.sql no Supabase.";
  }
  if (/Invalid API key/i.test(msg) || /JWT/i.test(msg)) {
    return "A chave do Supabase está incorreta. Confira SUPABASE_SERVICE_ROLE_KEY nas variáveis do Vercel.";
  }
  if (/fetch failed/i.test(msg) || /ENOTFOUND/i.test(msg)) {
    return "Não foi possível conectar ao banco. Confira se SUPABASE_URL está correta nas variáveis do Vercel.";
  }
  return msg;
}

/** Resposta padrão quando o banco ainda não foi configurado. */
export function notConfiguredMessage() {
  return "Banco de dados não configurado. Adicione SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente do Vercel e faça um Redeploy.";
}

/** Cabeçalhos que impedem qualquer cache das respostas da API. */
export const noStore = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
};
