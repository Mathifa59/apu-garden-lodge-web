import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { buildLanguageAlternates, SITE_URL } from "@/lib/seo";

const PATHS = ["/", "/servicios", "/novedad", "/nosotros", "/contacto"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => {
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      return {
        url: `${SITE_URL}${prefix}${path}`,
        alternates: { languages: buildLanguageAlternates(path) },
      };
    })
  );
}
