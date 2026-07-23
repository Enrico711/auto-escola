import FadeIn from "./FadeIn";
import WhatsAppButton from "./WhatsAppButton";
import { categories } from "@/lib/data";

export default function Categories() {
  return (
    <section id="servicos" className="bg-mist py-24 md:py-32">
      <div className="container-page">
        <FadeIn>
          <p className="section-eyebrow mb-4">Serviços</p>
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Qual é a sua próxima etapa na CNH?
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal/65 md:text-lg">
            Do primeiro passo até a mudança de categoria, cuidamos de cada etapa
            do seu processo com o mesmo padrão de atenção.
          </p>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <FadeIn key={cat.code} delay={i * 0.05}>
              <div className="group flex h-full flex-col rounded-xl3 border border-charcoal/10 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-signal/60 hover:shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-signal/15 px-3 py-1 font-display text-xs font-bold text-signal-deep">
                    {cat.code}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">
                  {cat.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
                  {cat.description}
                </p>
                <ul className="mt-5 flex-1 space-y-2">
                  {cat.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-charcoal/70">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal-deep" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <WhatsAppButton
                    label="Quero começar"
                    message={`Olá! Tenho interesse na ${cat.title} da Sul da Ilha.`}
                    className="w-full py-3 text-sm"
                  />
                  <p className="mt-3 text-center text-xs text-charcoal/45">
                    Parcelamento em até 6x
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
