"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import FadeIn from "./FadeIn";

const photos = [
  { src: "/gallery/aluno-1.jpg", alt: "Aluna aprovada mostrando a CNH na mão" },
  { src: "/gallery/aluno-2.jpg", alt: "Turma de alunos aprovados na Sul da Ilha" },
  { src: "/gallery/aluno-3.jpg", alt: "Instrutor e aluno aprovado com a CNH na mão" },
  { src: "/gallery/aluno-4.jpg", alt: "Aluno aprovado mostrando a CNH na mão" },
  { src: "/gallery/aluno-5.jpg", alt: "Grupo de alunos aprovados ao lado do carro da autoescola" },
];

export default function Fleet() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-page">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow mb-4">Resultados reais</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Quem já saiu daqui com a CNH na mão.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal/65 md:text-lg">
            Cada foto aqui é um aluno de verdade, aprovado de verdade.
            Pode ser a sua em breve.
          </p>
        </FadeIn>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-square overflow-hidden rounded-xl2 bg-mist"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-charcoal/10 transition-colors duration-300 group-hover:ring-signal/50" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
