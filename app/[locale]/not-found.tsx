import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";

// Sin locale/params disponibles aquí (not-found.js no recibe props), así que
// las traducciones dependen de que el layout padre ([locale]/layout.tsx) ya
// haya llamado a setRequestLocale para esta misma request — next-intl lee
// ese contexto en vez de necesitar el locale explícito de nuevo.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.notFound");
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex min-h-[70vh] items-center bg-sand px-5 py-32 sm:px-8">
      <div className="mx-auto max-w-lg text-center">
        <Reveal>
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-ink-soft">{t("description")}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-terracotta px-5 py-2.5 font-ui text-sm font-semibold text-cream transition-all hover:bg-terracotta-bright hover:shadow-lg active:scale-95"
            >
              {t("backHome")}
            </Link>
            <Link
              href="/servicios"
              className="rounded-full border border-ink/15 px-5 py-2.5 font-ui text-sm font-semibold text-ink-soft transition-colors hover:border-terracotta/40 hover:text-terracotta"
            >
              {t("seeRooms")}
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
