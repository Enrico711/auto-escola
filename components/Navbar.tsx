"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-[0_1px_0_rgba(17,17,17,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-[76px] items-center justify-between">
        <a href="#top" className="font-display text-lg font-bold text-ink">
          Sul da Ilha<span className="text-signal-deep">.</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: "#servicos", label: "Categorias" },
            { href: "#como-funciona", label: "Como funciona" },
            { href: "#depoimentos", label: "Alunos" },
            { href: "#faq", label: "Dúvidas" },
            { href: "#contato", label: "Contato" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-charcoal/70 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppButton label="WhatsApp" className="px-5 py-3 text-xs" />
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-charcoal/10 bg-white/95 md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {[
              { href: "#servicos", label: "Categorias" },
              { href: "#como-funciona", label: "Como funciona" },
              { href: "#depoimentos", label: "Alunos" },
              { href: "#faq", label: "Dúvidas" },
              { href: "#contato", label: "Contato" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 font-body text-base font-medium text-charcoal/80 hover:bg-mist"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 px-2">
              <WhatsAppButton className="w-full py-4" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
