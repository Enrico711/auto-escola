import FadeIn from "./FadeIn";
import WhatsAppButton from "./WhatsAppButton";

const steps = [
  {
    label: "Escolha sua categoria",
    description:
      "Converse com a nossa equipe pelo WhatsApp e defina o serviço certo para o seu momento: A, B, A+B, renovação, reciclagem ou mudança de categoria.",
  },
  {
    label: "Envie os documentos",
    description:
      "Te orientamos exatamente sobre o que é preciso, sem burocracia extra, para dar entrada no seu processo o quanto antes.",
  },
  {
    label: "Comece as aulas e conquiste sua CNH",
    description:
      "Aulas no seu ritmo, com instrutores pacientes e veículos modernos, até o dia da sua aprovação.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-white py-24 md:py-32">
      <div className="container-page">
        <FadeIn>
          <p className="section-eyebrow mb-4">Como funciona</p>
          <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Um caminho simples até a sua CNH.
          </h2>
        </FadeIn>

        <div className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-charcoal/10 md:block" />
          {steps.map((step, i) => (
            <FadeIn key={step.label} delay={i * 0.1} className="relative">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-charcoal font-display text-base font-bold text-signal">
                {i + 1}
              </div>
              <h3 className="mt-6 font-display text-lg font-semibold text-ink">
                {step.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
                {step.description}
              </p>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2} className="mt-14 flex flex-col items-center gap-3">
          <WhatsAppButton label="Dar o primeiro passo" className="py-4" />
          <p className="text-xs text-charcoal/45">Leva menos de 1 minuto para começar</p>
        </FadeIn>
      </div>
    </section>
  );
}
