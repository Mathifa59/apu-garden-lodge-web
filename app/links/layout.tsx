import { Bricolage_Grotesque, Outfit } from "next/font/google";
import "../globals.css";

// Root layout propio de /links (sin layout.js por encima, ver
// node_modules/next/dist/docs/.../layout.md → "Root Layout": omitir
// app/layout.js hace que cada subárbol tenga su propio root layout). Antes
// existía un app/layout.tsx que envolvía TODA la app — incluido
// app/[locale]/layout.tsx, que también define <html>/<body> — resultando en
// html/body anidados (HTML inválido) y el hydration mismatch reportado por
// React. /links vive fuera del sistema de idiomas a propósito (ver
// proxy.ts), así que necesita su propio root layout independiente.
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

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bricolage.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full bg-sand font-ui text-ink">{children}</body>
    </html>
  );
}
