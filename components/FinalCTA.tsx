import FadeIn from "./FadeIn";
import WhatsAppButton from "./WhatsAppButton";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-24 md:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,213,71,0.16),transparent_55%)]" />
      <div className="hero-grid" />
      <div className="container-page relative text-center">
        <FadeIn>
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Pronto para começar sua CNH?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Cada mês esperando é um mês a mais dependendo de carona.
            Fale agora com a Sul da Ilha e receba atendimento rápido pelo WhatsApp.
          </p>
        </FadeIn>
        <FadeIn delay={0.1} className="mt-10 flex flex-col items-center gap-4">
          <WhatsAppButton className="px-10 py-5 text-base shadow-[0_8px_32px_-8px_rgba(245,213,71,0.5)]" />
          <p className="text-sm text-white/50">
            Sem compromisso — resposta no mesmo dia
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
