export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-charcoal/10 bg-white py-14">
      <div className="container-page flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg font-bold text-ink">
            Sul da Ilha<span className="text-signal-deep">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-charcoal/60">
            Auto escola em Florianópolis para quem quer tirar, renovar ou reciclar a CNH.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40">
              Serviços
            </p>
            <ul className="mt-3 space-y-2 text-sm text-charcoal/70">
              <li>Categoria A</li>
              <li>Categoria B</li>
              <li>Categoria A+B</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40">
              Processos
            </p>
            <ul className="mt-3 space-y-2 text-sm text-charcoal/70">
              <li>Renovação da CNH</li>
              <li>Reciclagem</li>
              <li>Mudança de categoria</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40">
              Contato
            </p>
            <ul className="mt-3 space-y-2 text-sm text-charcoal/70">
              <li>Campeche, Florianópolis, SC</li>
              <li>(48) 3238-6576</li>
              <li><a href="/acompanhar" className="underline underline-offset-2 hover:text-ink">Acompanhar matrícula</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-page mt-10 border-t border-charcoal/10 pt-6">
        <p className="text-xs text-charcoal/45">
          © {year} Auto Escola Sul da Ilha. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
