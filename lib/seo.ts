import { routing } from "@/i18n/routing";

// Dominio real de producción — si se despliega bajo otro dominio (staging,
// preview), sobreescribir con NEXT_PUBLIC_SITE_URL en ese entorno.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://apu-garden-lodge.com";

export function buildLanguageAlternates(pathname: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    languages[locale] = `${SITE_URL}${prefix}${pathname}`;
  }
  languages["x-default"] = `${SITE_URL}${pathname}`;
  return languages;
}

// URL canónica de una página para el locale actual — evita que Google indexe
// la misma página dos veces (con y sin prefijo /en) como contenido duplicado.
export function buildCanonical(locale: string, pathname: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${pathname}`;
}
