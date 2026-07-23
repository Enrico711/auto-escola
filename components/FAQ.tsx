"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "./FadeIn";
import WhatsAppButton from "./WhatsAppButton";
import { faqs } from "@/lib/data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="bg-white py-24 md:py-32">
      <div className="container-page max-w-3xl">
        <FadeIn>
          <p className="section-eyebrow mb-4">Dúvidas frequentes</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Tudo o que você precisa saber antes de começar.
          </h2>
        </FadeIn>

        <div className="mt-14 divide-y divide-charcoal/10 border-y border-charcoal/10">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question}>
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="font-display text-base font-semibold text-ink md:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-charcoal/50 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm leading-relaxed text-charcoal/65 md:text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <FadeIn className="mt-10 rounded-xl2 bg-mist p-6 text-center md:p-8">
          <p className="font-display text-base font-semibold text-ink">
            Ficou com alguma dúvida específica?
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/60">
            Manda uma mensagem — a equipe responde no mesmo dia, sem compromisso.
          </p>
          <div className="mt-5 flex justify-center">
            <WhatsAppButton label="Tirar minha dúvida" className="py-3 text-sm" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
