import { MapPin, Phone, Clock } from "lucide-react";
import FadeIn from "./FadeIn";
import WhatsAppButton from "./WhatsAppButton";

export default function Location() {
  return (
    <section id="contato" className="bg-mist py-24 md:py-32">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <FadeIn>
            <p className="section-eyebrow mb-4">Onde estamos</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Presença local, no Sul da Ilha.
            </h2>
          </FadeIn>

          <div className="mt-10 space-y-6">
            <FadeIn delay={0.05} className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-signal-deep" />
              <div>
                <p className="font-display text-sm font-semibold text-ink">Endereço</p>
                <p className="text-sm text-charcoal/65">
                  SC-405, 3963 — Campeche, Florianópolis, SC 88065-000
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1} className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-signal-deep" />
              <div>
                <p className="font-display text-sm font-semibold text-ink">Telefone e WhatsApp</p>
                <p className="text-sm text-charcoal/65">(48) 3238-6576</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.15} className="flex items-start gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-signal-deep" />
              <div>
                <p className="font-display text-sm font-semibold text-ink">Horário de atendimento</p>
                <p className="text-sm text-charcoal/65">
                  Segunda a sexta, 8h às 18h
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="mt-10">
            <WhatsAppButton className="py-4" />
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <div className="h-full min-h-[380px] overflow-hidden rounded-xl3 shadow-card">
            <iframe
              title="Localização da Auto Escola Sul da Ilha em Florianópolis"
              src="https://www.google.com/maps?q=SC-405+3963+Campeche+Florian%C3%B3polis+SC&output=embed"
              className="h-full w-full min-h-[380px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
