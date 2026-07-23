"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/data";

export default function WhatsAppButton({
  floating = false,
  label = "Agendar pelo WhatsApp",
  message,
  className = "",
}: any) {
  if (floating) {
    return (
      <a
        href={whatsappLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-signal text-charcoal shadow-soft transition-transform duration-300 hover:scale-105 active:scale-95 md:hidden"
      >
        <MessageCircle className="h-6 w-6" strokeWidth={2.25} />
      </a>
    );
  }

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-4 font-display text-sm font-semibold text-charcoal transition-all duration-300 hover:bg-signal-dark hover:shadow-soft active:scale-[0.98] ${className}`}
    >
      <MessageCircle className="h-5 w-5" strokeWidth={2.25} />
      {label}
    </a>
  );
}
