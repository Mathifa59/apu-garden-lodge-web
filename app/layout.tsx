import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import "./globals.css";

// Layout raíz mínimo — solo para rutas que viven FUERA del sistema de
// idiomas (ej. /links), que se excluyen a propósito en proxy.ts para que no
// lleven el Navbar/Footer completo del sitio. El resto de la app usa
// app/[locale]/layout.tsx.
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Apu Garden Lodge",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bricolage.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full bg-sand font-ui text-ink">{children}</body>
    </html>
  );
}
