import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ComplaintsBookForm } from "@/components/ComplaintsBookForm";
import { MapPinIcon } from "@/components/SocialIcons";
import { MountainMark } from "@/components/MountainMark";
import { Reveal } from "@/components/Reveal";
import { RevealMask } from "@/components/RevealMask";
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
    <div className="bg-sand">
      <div className="relative overflow-hidden bg-fade-clay px-5 pb-14 pt-32 sm:px-8 sm:pb-16 sm:pt-40">
        <MountainMark className="pointer-events-none absolute -right-8 -top-4 h-56 w-56 text-sage/[0.09] sm:-right-4 sm:top-2 sm:h-72 sm:w-72" />
        <div className="relative mx-auto max-w-2xl">
          <Reveal>
            <span className="pill">{t("eyebrow")}</span>
            <RevealMask delay={0.05}>
              <h1 className="mt-5 font-display text-4xl text-ink sm:text-5xl">{t("title")}</h1>
            </RevealMask>
            <p className="mt-4 text-ink-soft">{t("subtitle")}</p>
            <p className="mt-3 text-sm text-ink-soft/80">{t("note")}</p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 pb-20 sm:px-8">
        <Reveal delay={0.05} className="-mt-8 sm:-mt-10">
          <div className="rounded-[1.75rem] border border-sage-pale bg-cream-soft p-6 shadow-xl shadow-ink/5">
            <p className="font-display text-lg text-sage-deep">{t("businessTitle")}</p>
            <dl className="mt-4 space-y-3 text-sm text-ink-soft">
              <div className="flex gap-2">
                <dt className="font-medium text-ink">{t("businessName")}:</dt>
                <dd>{BUSINESS.razonSocial}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-ink">{t("businessRuc")}:</dt>
                <dd>{BUSINESS.ruc}</dd>
              </div>
              <div className="flex gap-2">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
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
