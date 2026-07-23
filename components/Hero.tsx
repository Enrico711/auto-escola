"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden bg-charcoal">
      <div className="absolute inset-0">
        <Image
          src="/hero-car.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover object-center blur-[3px] opacity-45"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/85 to-charcoal/55" />
      <div className="absolute inset-0 bg-charcoal/25" />
      <div className="hero-grid opacity-40" />
      <div className="hero-glow left-[55%] top-[10%]" />

      <div className="container-page relative z-10 w-full pb-24 pt-36 md:pb-28 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm"
        >
          <Star className="h-3.5 w-3.5 fill-signal text-signal" />
          <span className="text-xs font-medium text-white/80">
            Auto escola de referência no Sul da Ilha — Florianópolis
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl font-display text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl md:text-8xl"
        >
          Sua CNH
          <br />
          começa aqui.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "0% 50%" }}
          className="road-line mt-7 w-40 md:w-56"
        />

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-white/75 md:text-xl"
        >
          Instrutores pacientes, veículos modernos e um processo sem burocracia.
          A liberdade de dirigir mais perto do que você imagina.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <WhatsAppButton className="py-4 text-base shadow-[0_8px_32px_-8px_rgba(245,213,71,0.5)]" />
          <a
            href="#servicos"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-4 font-display text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Conheça nossos serviços
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-5 text-sm text-white/50"
        >
          Atendimento rápido — resposta no mesmo dia pelo WhatsApp
        </motion.p>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6"
        >
          {["Parcelamento em até 6x", "Instrutores pacientes", "Veículos modernos", "Processo simplificado"].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
