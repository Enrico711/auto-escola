"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "6x", label: "Parcelamento sem complicação" },
  { value: "A, B, A+B", label: "Todas as categorias principais" },
  { value: "100%", label: "Acompanhamento em cada etapa" },
  { value: "Sul da Ilha", label: "Atendimento local e humano" },
];

export default function Stats() {
  return (
    <section className="border-b border-charcoal/5 bg-white">
      <div className="container-page grid grid-cols-2 gap-y-10 py-14 md:grid-cols-4 md:py-16">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="pr-6"
          >
            <p className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {s.value}
            </p>
            <p className="mt-2 text-sm leading-snug text-charcoal/60">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
