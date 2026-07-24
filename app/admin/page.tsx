"use client";

import { useEffect, useState } from "react";
import {
  Users, Plus, LogOut, Search, ChevronRight, ChevronLeft,
  Upload, Trash2, FileText, X, Loader2, Copy, Check, CalendarDays,
  MessageCircle, AlertTriangle, Wallet, ArrowRight, ArrowLeft,
} from "lucide-react";

const PHASES = [
  "Requerimento",
  "Curso teórico",
  "Coleta da foto e digitais",
  "Exames médico e psicológico",
  "Exame teórico",
  "Curso prático",
  "Exame prático",
  "Emissão da CNH",
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [tab, setTab] = useState("alunos");
  const [phaseFilter, setPhaseFilter] = useState(-1);

  async function loadStudents() {
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/admin/students");
      if (res.status === 401) {
        setAuthed(false);
        setLoading(false);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAuthed(true);
        setServerError(data.error || "Erro ao carregar as matrículas.");
        setLoading(false);
        return;
      }
      setStudents(data.students || []);
      setAuthed(true);
    } catch {
      setServerError("Não foi possível conectar ao servidor. Tente recarregar a página.");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadStudents().finally(() => setChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoginError("");
    let res;
    try {
      res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
    } catch {
      setLoginError("Não foi possível conectar ao servidor.");
      return;
    }
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setLoginError(d.error || "Erro ao entrar");
      return;
    }
    setPassword("");
    loadStudents();
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
    setStudents([]);
    setSelected(null);
  }

  const filtered = students.filter((s) => {
    const q = query.toLowerCase();
    const matchesQuery =
      s.name?.toLowerCase().includes(q) ||
      s.cpf?.includes(q) ||
      s.tracking_code?.toLowerCase().includes(q);
    const matchesPhase =
      phaseFilter === -1 || Number(s.current_phase) === phaseFilter;
    return matchesQuery && matchesPhase;
  });

  const expiringSoon = students.filter((s) => {
    if (!s.cnh_expiry) return false;
    const days =
      (new Date(s.cnh_expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days <= 90;
  });

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist">
        <Loader2 className="h-6 w-6 animate-spin text-charcoal/40" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mist px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl3 border border-charcoal/10 bg-white p-8 shadow-card"
        >
          <p className="font-display text-lg font-bold text-ink">
            Sul da Ilha<span className="text-signal-deep">.</span>
          </p>
          <h1 className="mt-4 font-display text-xl font-bold text-ink">
            Painel de gestão
          </h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Acesso restrito aos gestores.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha de acesso"
            className="mt-6 w-full rounded-xl border border-charcoal/15 px-4 py-3 text-sm outline-none focus:border-charcoal/40"
          />
          {loginError && (
            <p className="mt-2 text-xs text-red-600">{loginError}</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-charcoal py-3 font-display text-sm font-semibold text-white transition hover:bg-charcoal/90"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-charcoal/10 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <p className="font-display text-base font-bold text-ink">
            Sul da Ilha<span className="text-signal-deep">.</span>{" "}
            <span className="ml-2 text-sm font-medium text-charcoal/50">
              Painel de gestão
            </span>
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-ink"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signal/20 text-signal-deep">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-ink">
                Matrículas
              </h1>
              <p className="text-sm text-charcoal/55">
                {students.length} aluno{students.length === 1 ? "" : "s"} cadastrado{students.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 font-display text-sm font-semibold text-charcoal transition hover:bg-signal-dark"
          >
            <Plus className="h-4 w-4" /> Nova matrícula
          </button>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setTab("alunos")}
            className={`rounded-full px-5 py-2.5 font-display text-sm font-semibold transition ${
              tab === "alunos"
                ? "bg-charcoal text-white"
                : "bg-white text-charcoal/60 border border-charcoal/10 hover:text-ink"
            }`}
          >
            Matrículas
          </button>
          <button
            onClick={() => setTab("agenda")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-semibold transition ${
              tab === "agenda"
                ? "bg-charcoal text-white"
                : "bg-white text-charcoal/60 border border-charcoal/10 hover:text-ink"
            }`}
          >
            <CalendarDays className="h-4 w-4" /> Etapas
          </button>
        </div>

        {tab === "agenda" && <AgendaView />}

        {tab === "alunos" && (
        <>
        {expiringSoon.length > 0 && (
          <div className="mt-6 rounded-xl2 border border-signal/50 bg-signal/10 p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-signal-deep" />
              <h3 className="font-display text-sm font-bold text-ink">
                {expiringSoon.length} CNH vencendo nos próximos 90 dias
              </h3>
            </div>
            <p className="mt-1 text-xs text-charcoal/60">
              Oportunidade de renovação — entre em contato antes do vencimento.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {expiringSoon.map((s: any) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="rounded-full border border-charcoal/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-signal"
                >
                  {s.name} · {formatBR(s.cnh_expiry)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setPhaseFilter(-1)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              phaseFilter === -1
                ? "bg-charcoal text-white"
                : "border border-charcoal/10 bg-white text-charcoal/60 hover:text-ink"
            }`}
          >
            Todos ({students.length})
          </button>
          {PHASES.map((p, i) => {
            const count = students.filter(
              (s: any) => Number(s.current_phase) === i
            ).length;
            if (count === 0) return null;
            return (
              <button
                key={p}
                onClick={() => setPhaseFilter(i)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  phaseFilter === i
                    ? "bg-charcoal text-white"
                    : "border border-charcoal/10 bg-white text-charcoal/60 hover:text-ink"
                }`}
              >
                {p} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, CPF ou código..."
            className="w-full rounded-full border border-charcoal/10 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-charcoal/30"
          />
        </div>

        {serverError && (
          <div className="mt-6 rounded-xl2 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {loading ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-charcoal/40" />
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {filtered.length === 0 && (
              <p className="py-12 text-center text-sm text-charcoal/50">
                {students.length === 0
                  ? "Nenhuma matrícula cadastrada ainda. Clique em Nova matrícula para começar."
                  : "Nenhum resultado para essa busca."}
              </p>
            )}
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className="flex w-full items-center justify-between rounded-xl2 border border-charcoal/10 bg-white p-5 text-left shadow-card transition hover:border-signal/60"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-semibold text-ink">
                    {s.name}
                  </p>
                  <p className="mt-0.5 text-xs text-charcoal/50">
                    {s.tracking_code} · CPF {s.cpf}
                    {s.category ? ` · Categoria ${s.category}` : ""}
                  </p>
                </div>
                <div className="ml-4 flex shrink-0 items-center gap-3">
                  <span className="hidden rounded-full bg-signal/15 px-3 py-1 text-xs font-semibold text-signal-deep sm:block">
                    {PHASES[s.current_phase] || PHASES[0]}
                  </span>
                  <ChevronRight className="h-4 w-4 text-charcoal/40" />
                </div>
              </button>
            ))}
          </div>
        )}
        </>
        )}
      </main>

      {showForm && (
        <NewStudentModal
          onClose={() => setShowForm(false)}
          onCreated={(st: any) => {
            setShowForm(false);
            setStudents((prev) => [st, ...prev]);
            setSelected(st);
          }}
        />
      )}

      {selected && (
        <StudentDrawer
          student={selected}
          onClose={() => setSelected(null)}
          onUpdated={(st: any) => {
            setStudents((prev) => prev.map((p) => (p.id === st.id ? st : p)));
            setSelected(st);
          }}
          onDeleted={(id: string) => {
            setStudents((prev) => prev.filter((p) => p.id !== id));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

function NewStudentModal({ onClose, onCreated }: any) {
  const [form, setForm] = useState({
    name: "", cpf: "", phone: "", address: "", category: "B", notes: "",
    total_value: "", installments_total: "6", cnh_expiry: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Erro ao salvar");
      return;
    }
    onCreated(data.student);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl3 bg-white p-7 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Nova matrícula</h2>
          <button type="button" onClick={onClose}>
            <X className="h-5 w-5 text-charcoal/50" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Nome completo *">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-base"
              placeholder="Maria da Silva"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="CPF *">
              <input
                required
                value={form.cpf}
                onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                className="input-base"
                placeholder="000.000.000-00"
              />
            </Field>
            <Field label="Telefone">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-base"
                placeholder="(48) 9...."
              />
            </Field>
          </div>
          <Field label="Endereço">
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input-base"
              placeholder="Rua, número, bairro, cidade"
            />
          </Field>
          <Field label="Categoria">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input-base"
            >
              {["A", "B", "A+B", "Renovação", "Reciclagem", "Mudança de categoria"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Valor total (R$)">
              <input
                type="number"
                value={form.total_value}
                onChange={(e) => setForm({ ...form, total_value: e.target.value })}
                className="input-base"
                placeholder="2400"
              />
            </Field>
            <Field label="Nº parcelas">
              <input
                type="number"
                value={form.installments_total}
                onChange={(e) =>
                  setForm({ ...form, installments_total: e.target.value })
                }
                className="input-base"
              />
            </Field>
            <Field label="CNH vence em">
              <input
                type="date"
                value={form.cnh_expiry}
                onChange={(e) => setForm({ ...form, cnh_expiry: e.target.value })}
                className="input-base"
              />
            </Field>
          </div>
          <Field label="Observações">
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input-base min-h-[70px]"
              placeholder="Anotações internas (opcional)"
            />
          </Field>
        </div>

        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

        <button
          disabled={saving}
          className="mt-6 w-full rounded-full bg-signal py-3.5 font-display text-sm font-bold text-charcoal transition hover:bg-signal-dark disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Cadastrar aluno"}
        </button>
        <style jsx global>{`
          .input-base {
            width: 100%;
            border-radius: 0.75rem;
            border: 1px solid rgba(31, 31, 31, 0.15);
            padding: 0.65rem 0.9rem;
            font-size: 0.875rem;
            outline: none;
          }
          .input-base:focus {
            border-color: rgba(31, 31, 31, 0.4);
          }
        `}</style>
      </form>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-charcoal/60">
        {label}
      </span>
      {children}
    </label>
  );
}

function StudentDrawer({ student, onClose, onUpdated, onDeleted }: any) {
  const [docs, setDocs] = useState<any[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [label, setLabel] = useState("Identidade");
  const [copied, setCopied] = useState(false);
  const [savingPhase, setSavingPhase] = useState(false);
  const [savingPay, setSavingPay] = useState(false);

  async function setPaid(n: number) {
    setSavingPay(true);
    const res = await fetch(`/api/admin/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ installments_paid: n }),
    });
    const data = await res.json().catch(() => ({}));
    setSavingPay(false);
    if (res.ok) onUpdated(data.student);
  }

  async function loadDocs() {
    setDocsLoading(true);
    const res = await fetch(`/api/admin/students/${student.id}/documents`);
    const data = await res.json();
    setDocs(data.documents || []);
    setDocsLoading(false);
  }

  useEffect(() => {
    loadDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student.id]);

  async function setPhase(phase: number) {
    setSavingPhase(true);
    const res = await fetch(`/api/admin/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_phase: phase }),
    });
    const data = await res.json();
    setSavingPhase(false);
    if (res.ok) onUpdated(data.student);
  }

  async function upload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("label", label);
    const res = await fetch(`/api/admin/students/${student.id}/documents`, {
      method: "POST",
      body: fd,
    });
    setUploading(false);
    e.target.value = "";
    if (res.ok) loadDocs();
    else {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Erro ao enviar arquivo");
    }
  }

  async function removeDoc(docId: string) {
    if (!confirm("Excluir este documento?")) return;
    await fetch(`/api/admin/students/${student.id}/documents?docId=${docId}`, {
      method: "DELETE",
    });
    loadDocs();
  }

  async function removeStudent() {
    if (!confirm(`Excluir a matrícula de ${student.name}? Essa ação não pode ser desfeita.`)) return;
    const res = await fetch(`/api/admin/students/${student.id}`, { method: "DELETE" });
    if (res.ok) onDeleted(student.id);
  }

  function copyCode() {
    navigator.clipboard.writeText(student.tracking_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-charcoal/50">
      <div className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-charcoal/10 p-6">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">{student.name}</h2>
            <button
              onClick={copyCode}
              className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-signal/15 px-3 py-1 text-xs font-bold text-signal-deep"
            >
              {student.tracking_code}
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-charcoal/50" />
          </button>
        </div>

        <div className="flex-1 space-y-8 p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="CPF" value={student.cpf} />
            <div>
              <p className="text-xs font-semibold text-charcoal/45">Telefone</p>
              {student.phone ? (
                <a
                  href={`https://wa.me/55${String(student.phone).replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Olá ${String(student.name).split(" ")[0]}! Aqui é da Auto Escola Sul da Ilha.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-signal-deep"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-signal-deep" />
                  {student.phone}
                </a>
              ) : (
                <p className="mt-0.5 text-sm text-ink">—</p>
              )}
            </div>
            <Info label="Categoria" value={student.category} />
            {student.cnh_expiry && (
              <Info label="CNH vence em" value={formatBR(student.cnh_expiry)} />
            )}
            <Info label="Endereço" value={student.address} spanFull />
            {student.notes && <Info label="Observações" value={student.notes} spanFull />}
            {student.appointment_date && (
              <Info
                label="Agendamento do aluno"
                value={`${formatBR(student.appointment_date)}${student.appointment_time ? " às " + student.appointment_time : ""} — ${PHASES[student.appointment_phase] || ""}`}
                spanFull
              />
            )}
          </div>

          <div>
            <h3 className="font-display text-sm font-bold text-ink">
              Fase atual do processo
            </h3>
            <p className="mt-1 text-xs text-charcoal/50">
              Use os botões ou clique direto na fase. O aluno vê isso ao consultar o código.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                disabled={savingPhase || student.current_phase <= 0}
                onClick={() => setPhase(student.current_phase - 1)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-charcoal/15 py-3 font-display text-xs font-semibold text-charcoal/70 transition hover:border-charcoal/35 hover:text-ink disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Etapa anterior
              </button>
              <button
                disabled={savingPhase || student.current_phase >= PHASES.length - 1}
                onClick={() => setPhase(student.current_phase + 1)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-signal py-3 font-display text-xs font-bold text-charcoal transition hover:bg-signal-dark disabled:opacity-40"
              >
                Próxima etapa <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {PHASES.map((phase, i) => {
                const done = i < student.current_phase;
                const current = i === student.current_phase;
                return (
                  <button
                    key={phase}
                    disabled={savingPhase}
                    onClick={() => setPhase(i)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                      current
                        ? "border-signal bg-signal/10 font-semibold text-ink"
                        : done
                        ? "border-charcoal/10 bg-mist text-charcoal/60"
                        : "border-charcoal/10 text-charcoal/60 hover:border-charcoal/25"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        current
                          ? "bg-signal text-charcoal"
                          : done
                          ? "bg-charcoal/80 text-white"
                          : "bg-charcoal/10 text-charcoal/50"
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    {phase}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-signal-deep" />
              <h3 className="font-display text-sm font-bold text-ink">
                Pagamento
              </h3>
            </div>
            {student.total_value ? (
              <>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="font-display text-lg font-bold text-ink">
                    {student.installments_paid || 0} de{" "}
                    {student.installments_total || 6} parcelas pagas
                  </p>
                  <p className="text-xs text-charcoal/55">
                    Total R$ {Number(student.total_value).toFixed(2)}
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-charcoal/10">
                  <div
                    className="h-full rounded-full bg-signal transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        ((student.installments_paid || 0) /
                          (student.installments_total || 6)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-charcoal/55">
                  Valor de cada parcela: R${" "}
                  {(
                    Number(student.total_value) /
                    (student.installments_total || 6)
                  ).toFixed(2)}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    disabled={savingPay || (student.installments_paid || 0) <= 0}
                    onClick={() => setPaid((student.installments_paid || 0) - 1)}
                    className="flex-1 rounded-full border border-charcoal/15 py-2.5 text-xs font-semibold text-charcoal/70 transition hover:border-charcoal/35 disabled:opacity-40"
                  >
                    Desfazer parcela
                  </button>
                  <button
                    disabled={
                      savingPay ||
                      (student.installments_paid || 0) >=
                        (student.installments_total || 6)
                    }
                    onClick={() => setPaid((student.installments_paid || 0) + 1)}
                    className="flex-1 rounded-full bg-charcoal py-2.5 text-xs font-bold text-white transition hover:bg-charcoal/90 disabled:opacity-40"
                  >
                    Registrar pagamento
                  </button>
                </div>
                {(student.installments_paid || 0) >=
                  (student.installments_total || 6) && (
                  <p className="mt-3 rounded-xl bg-green-50 p-3 text-xs font-semibold text-green-700">
                    Pagamento quitado.
                  </p>
                )}
              </>
            ) : (
              <p className="mt-3 rounded-xl bg-mist p-4 text-xs text-charcoal/50">
                Nenhum valor cadastrado para esta matrícula.
              </p>
            )}
          </div>

          <div>
            <h3 className="font-display text-sm font-bold text-ink">Documentos</h3>
            <p className="mt-1 text-xs text-charcoal/50">
              Fotos de identidade, comprovante de residência etc. Máx 4MB por arquivo.
            </p>
            <div className="mt-4 flex gap-2">
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="flex-1 rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm outline-none"
              >
                {["Identidade", "CPF", "Comprovante de residência", "Foto 3x4", "CNH anterior", "Outro"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 font-display text-xs font-semibold text-white transition hover:bg-charcoal/90">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Enviar
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={upload}
                  disabled={uploading}
                />
              </label>
            </div>

            {docsLoading ? (
              <div className="mt-4 flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-charcoal/40" />
              </div>
            ) : docs.length === 0 ? (
              <p className="mt-4 rounded-xl bg-mist p-4 text-center text-xs text-charcoal/50">
                Nenhum documento enviado ainda.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {docs.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between rounded-xl border border-charcoal/10 px-4 py-3"
                  >
                    <a
                      href={d.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 items-center gap-2 text-sm text-ink hover:underline"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-signal-deep" />
                      <span className="truncate">{d.label}</span>
                    </a>
                    <button onClick={() => removeDoc(d.id)}>
                      <Trash2 className="h-4 w-4 text-charcoal/40 hover:text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-charcoal/10 pt-6">
            <button
              onClick={removeStudent}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" /> Excluir matrícula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, spanFull }: any) {
  return (
    <div className={spanFull ? "col-span-2" : ""}>
      <p className="text-xs font-semibold text-charcoal/45">{label}</p>
      <p className="mt-0.5 text-sm text-ink">{value || "—"}</p>
    </div>
  );
}


function formatBR(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

function AgendaView() {
  const [phase, setPhase] = useState(0);
  const [date, setDate] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ address: "", instructions: "", link: "" });
  const [itemForm, setItemForm] = useState({ label: "", address: "", price: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [rs, rt, ri] = await Promise.all([
        fetch("/api/admin/availability"),
        fetch("/api/admin/phase-settings"),
        fetch("/api/admin/phase-items"),
      ]);
      const ds = await rs.json().catch(() => ({}));
      const dt = await rt.json().catch(() => ({}));
      const di = await ri.json().catch(() => ({}));
      if (!rs.ok || !rt.ok || !ri.ok) {
        setError(ds.error || dt.error || di.error || "Erro ao carregar.");
      } else {
        setSlots(ds.slots || []);
        setSettings(dt.settings || []);
        setItems(di.items || []);
      }
    } catch {
      setError("Não foi possível conectar ao servidor.");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const cur = settings.find((x: any) => x.phase === phase);
    setForm({
      address: cur?.address || "",
      instructions: cur?.instructions || "",
      link: cur?.link || "",
    });
    setSavedMsg("");
  }, [phase, settings]);

  async function saveSettings(e: any) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/phase-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase, ...form }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Erro ao salvar.");
      return;
    }
    setSettings((prev) => {
      const others = prev.filter((x: any) => x.phase !== phase);
      return [...others, data.setting];
    });
    setSavedMsg("Informações salvas!");
    setTimeout(() => setSavedMsg(""), 2500);
  }

  async function addItem(e: any) {
    e.preventDefault();
    if (!itemForm.label.trim()) return;
    const res = await fetch("/api/admin/phase-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase, ...itemForm }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Erro ao adicionar.");
      return;
    }
    setItems((prev) => [...prev, data.item]);
    setItemForm({ label: "", address: "", price: "" });
  }

  async function removeItem(id: string) {
    if (!confirm("Remover este item?")) return;
    await fetch(`/api/admin/phase-items?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i: any) => i.id !== id));
  }

  async function addDate(e: any) {
    e.preventDefault();
    if (!date) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase, date, slot_time: slotTime }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Erro ao salvar.");
      return;
    }
    setSlotTime("");
    load();
  }

  async function removeSlot(id: string) {
    if (!confirm("Remover essa data da agenda?")) return;
    await fetch(`/api/admin/availability?id=${id}`, { method: "DELETE" });
    load();
  }

  const phaseSlots = slots.filter((s: any) => s.phase === phase);
  const phaseItems = items.filter((i: any) => i.phase === phase);

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-xl3 border border-charcoal/10 bg-white p-6 shadow-card">
        <h2 className="font-display text-base font-bold text-ink">
          Configuração das etapas
        </h2>
        <p className="mt-1 text-sm text-charcoal/55">
          Escolha uma etapa e defina o que o aluno vê ao acompanhar a matrícula:
          instruções, endereço, valores e dias disponíveis.
        </p>

        <select
          value={phase}
          onChange={(e) => setPhase(Number(e.target.value))}
          className="mt-5 w-full rounded-xl border border-charcoal/15 px-3 py-3 text-sm font-semibold outline-none"
        >
          {PHASES.map((p, i) => (
            <option key={p} value={i}>
              {i + 1}. {p}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl2 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={saveSettings}
        className="rounded-xl3 border border-charcoal/10 bg-white p-6 shadow-card"
      >
        <h3 className="font-display text-sm font-bold text-ink">
          Informações para o aluno — {PHASES[phase]}
        </h3>

        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-charcoal/60">
              Instruções (o que o aluno precisa fazer)
            </span>
            <textarea
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              className="min-h-[80px] w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm outline-none"
              placeholder="Ex: O curso teórico é feito online, pela plataforma CNH do Brasil."
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-charcoal/60">
              Endereço (onde o aluno deve comparecer)
            </span>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm outline-none"
              placeholder="Ex: Rua Exemplo, 123 — Campeche, Florianópolis"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-charcoal/60">
              Link (opcional)
            </span>
            <input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm outline-none"
              placeholder="Ex: https://cnhdobrasil.com.br"
            />
          </label>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            disabled={saving}
            className="rounded-full bg-signal px-6 py-3 font-display text-sm font-bold text-charcoal transition hover:bg-signal-dark disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar informações"}
          </button>
          {savedMsg && (
            <span className="text-sm font-semibold text-green-600">{savedMsg}</span>
          )}
        </div>
      </form>

      <div className="rounded-xl3 border border-charcoal/10 bg-white p-6 shadow-card">
        <h3 className="font-display text-sm font-bold text-ink">
          Locais e valores (opcional)
        </h3>
        <p className="mt-1 text-xs text-charcoal/55">
          Use quando a etapa tem mais de um local ou valor. Ex: exame médico e
          exame psicológico, cada um com seu endereço e preço.
        </p>

        <form onSubmit={addItem} className="mt-4 grid gap-3 sm:grid-cols-4">
          <input
            value={itemForm.label}
            onChange={(e) => setItemForm({ ...itemForm, label: e.target.value })}
            className="rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm outline-none"
            placeholder="Nome (ex: Exame médico)"
          />
          <input
            value={itemForm.address}
            onChange={(e) => setItemForm({ ...itemForm, address: e.target.value })}
            className="rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm outline-none sm:col-span-2"
            placeholder="Endereço"
          />
          <div className="flex gap-2">
            <input
              value={itemForm.price}
              onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
              className="w-full rounded-xl border border-charcoal/15 px-3 py-2.5 text-sm outline-none"
              placeholder="R$ 000"
            />
            <button className="shrink-0 rounded-full bg-charcoal px-4 py-2.5 font-display text-xs font-semibold text-white">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </form>

        {phaseItems.length > 0 && (
          <ul className="mt-4 space-y-2">
            {phaseItems.map((it: any) => (
              <li
                key={it.id}
                className="flex items-center justify-between rounded-xl border border-charcoal/10 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {it.label}
                    {it.price ? (
                      <span className="ml-2 rounded-full bg-signal/15 px-2 py-0.5 text-xs font-bold text-signal-deep">
                        {it.price}
                      </span>
                    ) : null}
                  </p>
                  {it.address && (
                    <p className="mt-0.5 truncate text-xs text-charcoal/55">
                      {it.address}
                    </p>
                  )}
                </div>
                <button onClick={() => removeItem(it.id)}>
                  <Trash2 className="h-4 w-4 text-charcoal/40 hover:text-red-500" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl3 border border-charcoal/10 bg-white p-6 shadow-card">
        <h3 className="font-display text-sm font-bold text-ink">
          Dias disponíveis — {PHASES[phase]}
        </h3>
        <p className="mt-1 text-xs text-charcoal/55">
          O horário é opcional. Preencha quando a etapa tiver horários
          específicos (ex: aulas do curso prático).
        </p>

        <form onSubmit={addDate} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-charcoal/15 px-3 py-3 text-sm outline-none"
          />
          <input
            type="time"
            value={slotTime}
            onChange={(e) => setSlotTime(e.target.value)}
            className="rounded-xl border border-charcoal/15 px-3 py-3 text-sm outline-none"
          />
          <button
            disabled={saving || !date}
            className="rounded-full bg-signal px-6 py-3 font-display text-sm font-bold text-charcoal transition hover:bg-signal-dark disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Adicionar"}
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-charcoal/40" />
          </div>
        ) : phaseSlots.length === 0 ? (
          <p className="mt-4 rounded-xl bg-mist p-4 text-center text-xs text-charcoal/50">
            Nenhuma data cadastrada para essa etapa ainda.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {phaseSlots.map((s: any) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-charcoal/10 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {formatBR(s.date)}
                    {s.slot_time ? ` às ${s.slot_time}` : ""}
                  </p>
                  {s.bookings && s.bookings.length > 0 ? (
                    <p className="mt-0.5 text-xs text-charcoal/55">
                      Agendados: {s.bookings.join(", ")}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-xs text-charcoal/40">
                      Ninguém agendado ainda
                    </p>
                  )}
                </div>
                <button onClick={() => removeSlot(s.id)}>
                  <Trash2 className="h-4 w-4 text-charcoal/40 hover:text-red-500" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
