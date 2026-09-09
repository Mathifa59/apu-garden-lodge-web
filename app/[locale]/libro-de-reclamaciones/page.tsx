import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ComplaintsBookForm } from "@/components/ComplaintsBookForm";
import { Reveal } from "@/components/Reveal";
import { buildCanonical, buildLanguageAlternates } from "@/lib/seo";

const BUSINESS = {
  razonSocial: "CATNET PERU SAC",
  ruc: "20608166204",
  direccion: "Cidruchayoc, lote 178, sector Yanaconas, Urubamba, Cusco, Perú",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.libro" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: buildCanonical(locale, "/libro-de-reclamaciones"),
      languages: buildLanguageAlternates("/libro-de-reclamaciones"),
    },
  };
}

export default async function LibroDeReclamacionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("libro");

  return (
    <div className="bg-sand px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-ink-soft">{t("subtitle")}</p>
          <p className="mt-3 text-sm text-ink-soft/80">{t("note")}</p>
        </Reveal>

        <Reveal delay={0.05} className="mt-8">
          <div className="rounded-2xl border border-sage-pale/60 bg-cream p-5 text-sm">
            <p className="font-display text-base text-sage-deep">{t("businessTitle")}</p>
            <dl className="mt-3 space-y-1.5 text-ink-soft">
              <div className="flex gap-2">
                <dt className="font-medium text-ink">{t("businessName")}:</dt>
                <dd>{BUSINESS.razonSocial}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-ink">{t("businessRuc")}:</dt>
                <dd>{BUSINESS.ruc}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-ink">{t("businessAddress")}:</dt>
                <dd>{BUSINESS.direccion}</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <ComplaintsBookForm />
        </Reveal>
      </div>
    </div>
  );
}
