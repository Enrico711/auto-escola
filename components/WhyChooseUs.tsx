import { Clock, HeartHandshake, Car, CreditCard, ListChecks, Users } from "lucide-react";
import FadeIn from "./FadeIn";
import { differentials } from "@/lib/data";

const icons = [Clock, HeartHandshake, Car, CreditCard, ListChecks, Users];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-page">
        <FadeIn>
          <p className="section-eyebrow mb-4">Por que a Sul da Ilha</p>
          <h2 className="max-w-2xl font-display text-4xl font-bold text-ink md:text-5xl">
            Uma auto escola pensada para quem vive no Sul da Ilha.
          </h2>
        </FadeIn>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <FadeIn key={item.title} delay={i * 0.06}>
                <div className="rounded-xl2 border border-charcoal/10 bg-white p-7 shadow-card hover:shadow-soft">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-signal/20 text-signal-deep">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-charcoal/65">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
