"use client";

import { useState } from "react";
import { Search, Check, Loader2, ArrowLeft } from "lucide-react";

export default function AcompanharPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  async function submit(e: any) {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) return;
    setLoading(true);
    setError("");
    setResult(null);
    const res = await fetch(`/api/tracking/${encodeURIComponent(clean)}`);
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(
        res.status === 404
          ? "Não encontramos nenhuma matrícula com esse código. Confira se digitou certinho (ex: SDI-A1B2C3)."
          : data.error || "Erro ao consultar. Tente novamente."
      );
      return;
    }
    setResult(data);
  }

  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-charcoal/10 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <a href="/" className="font-display text-base font-bold text-ink">
            Sul da Ilha<span className="text-signal-deep">.</span>
          </a>
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm text-charcoal/60 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <p className="section-eyebrow mb-4">Acompanhamento</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
          Acompanhe sua matrícula.
        </h1>
        <p className="mt-4 max-w-lg text-base text-charcoal/65">
          Digite o código que você recebeu na matrícula para ver em qual etapa
          o seu processo está.
        </p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: SDI-A1B2C3"
              className="w-full rounded-full border border-charcoal/15 bg-white py-4 pl-11 pr-4 text-sm uppercase tracking-wide outline-none focus:border-charcoal/40"
            />
          </div>
          <button
            disabled={loading}
            className="rounded-full bg-signal px-8 py-4 font-display text-sm font-bold text-charcoal transition hover:bg-signal-dark disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            ) : (
              "Consultar"
            )}
          </button>
        </form>

        {error && (
          <p className="mt-6 rounded-xl2 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-10 rounded-xl3 border border-charcoal/10 bg-white p-7 shadow-card md:p-9">
            <p className="text-sm text-charcoal/55">
              Olá, <span className="font-semibold text-ink">{result.firstName}</span>!
              {result.category ? ` Processo: Categoria ${result.category}.` : ""}
            </p>
            <h2 className="mt-2 font-display text-xl font-bold text-ink md:text-2xl">
              {result.currentPhase >= result.phases.length - 1
                ? "Parabéns! Sua CNH está em fase de emissão. 🎉"
                : `Etapa atual: ${result.phases[result.currentPhase]}`}
            </h2>

            <ol className="mt-8 space-y-0">
              {result.phases.map((phase: string, i: number) => {
                const done = i < result.currentPhase;
                const current = i === result.currentPhase;
                const last = i === result.phases.length - 1;
                return (
                  <li key={phase} className="relative flex gap-4 pb-6">
                    {!last && (
                      <span
                        className={`absolute left-[13px] top-8 h-full w-0.5 ${
                          done ? "bg-signal" : "bg-charcoal/10"
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        done
                          ? "bg-signal text-charcoal"
                          : current
                          ? "border-2 border-signal bg-white text-ink"
                          : "border border-charcoal/15 bg-white text-charcoal/40"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <div className="pt-0.5">
                      <p
                        className={`text-sm ${
                          current
                            ? "font-semibold text-ink"
                            : done
                            ? "text-charcoal/60"
                            : "text-charcoal/40"
                        }`}
                      >
                        {phase}
                      </p>
                      {current && (
                        <p className="mt-1 text-xs text-charcoal/50">
                          Você está aqui. Qualquer novidade, a equipe entra em contato.
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <p className="mt-4 rounded-xl2 bg-mist p-4 text-xs text-charcoal/55">
              Dúvidas sobre sua matrícula? Fale com a gente pelo WhatsApp
              (48) 3238-6576 informando seu código.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
