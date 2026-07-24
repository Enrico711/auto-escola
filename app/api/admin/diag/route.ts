import { NextResponse } from "next/server";
import { adminPassword, getSupabase, supabaseConfigured, noStore
} from "@/lib/server";

export const dynamic = "force-dynamic";

// Rota de diagnóstico. NÃO revela senha nem chaves.
// Pode ser apagada depois que tudo estiver funcionando.
export async function GET() {
  const raw = process.env.ADMIN_PASSWORD;
  const clean = adminPassword();

  const result: any = {
    senhaConfigurada: Boolean(clean),
    senhaTamanhoBruto: raw ? raw.length : 0,
    senhaTamanhoSemEspacos: clean.length,
    senhaPrimeiraLetra: clean ? clean[0] : null,
    senhaUltimaLetra: clean ? clean[clean.length - 1] : null,
    supabaseUrlConfigurada: Boolean((process.env.SUPABASE_URL || "").trim()),
    supabaseKeyConfigurada: Boolean((process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()),
    bancoConectado: false,
    tabelaStudents: false,
    bucketDocumentos: false,
    detalhe: null,
  };

  if (!supabaseConfigured()) {
    result.detalhe = "Faltam as variáveis do Supabase no Vercel.";
    return NextResponse.json(result, { headers: noStore });
  }

  try {
    const supabase = getSupabase();
    const { error: tErr } = await supabase.from("students").select("id").limit(1);
    result.bancoConectado = true;
    result.tabelaStudents = !tErr;
    if (tErr) result.detalhe = "Tabela students não encontrada. Rode o supabase-setup.sql.";

    const { data: buckets } = await supabase.storage.listBuckets();
    result.bucketDocumentos = Boolean(
      buckets?.some((b: any) => b.name === "documentos")
    );
    if (!result.bucketDocumentos && !result.detalhe) {
      result.detalhe = "Bucket 'documentos' não encontrado. Rode o supabase-setup.sql.";
    }
    if (!result.detalhe) result.detalhe = "Tudo certo!";
  } catch (err: any) {
    result.detalhe = "Erro ao conectar: " + String(err?.message || err);
  }

  return NextResponse.json(result, { headers: noStore });
}
