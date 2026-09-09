import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";

// global-not-found.tsx bypasses el árbol de layouts normal (por eso trae su
// propio <html>/<body>, fuentes y estilos — ver node_modules/next/dist/docs
// .../not-found.md, sección "global-not-found.js"). Es la única forma de
// tener un 404 con marca para rutas que no matchean ningún segmento (ej.
// /lo-que-sea): este proyecto no tiene un app/layout.tsx único (hay dos root
// layouts, [locale]/ y links/), así que no hay un app/[locale]/not-found.tsx
// al que Next pueda "caer" para esos casos — ver next.config.ts.
//
// Al no pasar por next-intl (sin locale de request), el copy va fijo en
// español — coherente con la política de "el sitio arranca en español"
// (ver i18n/routing.ts, localeDetection: false): quien cae en un 404 nunca
// eligió inglés explícitamente.
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
  metadataBase: new URL(SITE_URL),
  title: "Página no encontrada | Apu Garden Lodge",
  description: "La página que buscas no existe o fue movida.",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${bricolage.variable} ${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-sand font-ui text-ink">
        <div className="flex flex-1 items-center px-5 py-32 sm:px-8">
          <div className="mx-auto max-w-lg text-center">
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
              Error 404
            </p>
            <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">
              Esta página se perdió en el camino
            </h1>
            <p className="mt-4 text-ink-soft">
              No encontramos lo que buscabas. Puede que el enlace esté roto o que la página haya
              cambiado de dirección.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/"
                className="rounded-full bg-terracotta px-5 py-2.5 font-ui text-sm font-semibold text-cream transition-all hover:bg-terracotta-bright hover:shadow-lg active:scale-95"
              >
                Volver al inicio
              </a>
              <a
                href="/servicios"
                className="rounded-full border border-ink/15 px-5 py-2.5 font-ui text-sm font-semibold text-ink-soft transition-colors hover:border-terracotta/40 hover:text-terracotta"
              >
                Ver habitaciones
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
