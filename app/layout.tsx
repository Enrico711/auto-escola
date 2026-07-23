import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://www.autoescolasuldailha.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Auto Escola Sul da Ilha | CNH em Florianópolis",
  description:
    "Tire sua CNH categoria A, B ou A+B, renove ou faça a reciclagem com instrutores pacientes e veículos modernos em Florianópolis. Parcelamento em até 6x. Agende pelo WhatsApp.",
  keywords: [
    "auto escola Florianópolis",
    "CNH Florianópolis",
    "tirar carteira de motorista",
    "renovação CNH",
    "auto escola Campeche",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Auto Escola Sul da Ilha",
    title: "Auto Escola Sul da Ilha | CNH em Florianópolis",
    description:
      "Instrutores pacientes, veículos modernos e atendimento humanizado. Sua CNH começa aqui.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "DrivingSchool",
  name: "Auto Escola Sul da Ilha",
  url: siteUrl,
  telephone: "+55 48 3238-6576",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "SC-405, 3963",
    addressLocality: "Florianópolis",
    addressRegion: "SC",
    postalCode: "88065-000",
    addressCountry: "BR",
  },
  areaServed: "Florianópolis, SC",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body">
        {children}
        <StickyMobileCTA />
      </body>
    </html>
  );
}
