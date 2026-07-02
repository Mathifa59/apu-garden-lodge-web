import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { buildLanguageAlternates, SITE_URL } from "@/lib/seo";

type PathConfig = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const PATHS: PathConfig[] = [
  { path: "/",          changeFrequency: "weekly",  priority: 1.0 },
  { path: "/reservas",  changeFrequency: "weekly",  priority: 0.9 },
  { path: "/servicios", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contacto",  changeFrequency: "monthly", priority: 0.7 },
  { path: "/novedad",   changeFrequency: "monthly", priority: 0.7 },
  { path: "/nosotros",  changeFrequency: "monthly", priority: 0.6 },
];

const LAST_MODIFIED = new Date("2026-07-01");

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap(({ path, changeFrequency, priority }) =>
    routing.locales.map((locale) => {
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      return {
        url: `${SITE_URL}${prefix}${path}`,
        lastModified: LAST_MODIFIED,
        changeFrequency,
        priority,
        alternates: { languages: buildLanguageAlternates(path) },
      };
    })
  );
}
