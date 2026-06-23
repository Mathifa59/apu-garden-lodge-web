import { routing } from "@/i18n/routing";

// ponytail: dominio placeholder hasta que el cliente confirme el dominio real
// de producción — cambiar esta única constante actualiza metadata, sitemap,
// robots.txt y JSON-LD a la vez.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://apugardenlodge.com";

export function buildLanguageAlternates(pathname: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    languages[locale] = `${SITE_URL}${prefix}${pathname}`;
  }
  languages["x-default"] = `${SITE_URL}${pathname}`;
  return languages;
}
