import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  // Sin esto, next-intl detecta el idioma del navegador (Accept-Language) y
  // puede mandar a un visitante en inglés directo a /en, aunque haya
  // entrado por la raíz — el pedido es que el sitio arranque SIEMPRE en
  // español y el cambio a inglés sea una elección explícita del visitante
  // (el toggle del nav), no algo automático.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
