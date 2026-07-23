import FadeIn from "./FadeIn";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section id="depoimentos" className="bg-charcoal py-24 md:py-32">
      <div className="container-page">
        <FadeIn>
          <p className="section-eyebrow mb-4 text-white/50">Quem já passou pela Sul da Ilha</p>
          <h2 className="max-w-2xl font-display text-4xl font-bold text-white md:text-5xl">
            Resultados reais de alunos reais.
          </h2>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-xl2 border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm">
                <p className="text-[0.95rem] text-white/80">
                  "{t.quote}"
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-signal font-display text-xs font-bold text-charcoal">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-white/50">{t.service}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
