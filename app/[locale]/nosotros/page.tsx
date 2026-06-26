import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { RevealCard } from "@/components/RevealCard";
import { RevealMask } from "@/components/RevealMask";
import { roomPhotos } from "@/lib/roomPhotos";
import { buildCanonical, buildLanguageAlternates } from "@/lib/seo";

const VALUE_KEYS = ["nature", "rest", "honest"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.nosotros" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: buildCanonical(locale, "/nosotros"), languages: buildLanguageAlternates("/nosotros") },
  };
}

export default async function NosotrosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nosotros");

  return (
    <>
      <header className="relative overflow-hidden bg-sage-pale/40 bg-fade-honey px-5 pt-32 pb-16 text-center sm:px-8 sm:pt-40">
        <RevealMask className="relative">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">{t("eyebrow")}</p>
          <h1 className="mt-3 font-display text-5xl italic text-ink sm:text-6xl">{t("title")}</h1>
        </RevealMask>
      </header>

      <section className="relative overflow-hidden bg-fade-clay px-5 py-20 sm:px-8">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 sm:grid-cols-2 sm:gap-16">
          <RevealCard>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem]">
              <Image
                src={roomPhotos("doble_deluxe")[0]}
                alt={t("cabinImageAlt")}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </RevealCard>
          <RevealMask delay={0.1}>
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
              {t("originEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-4xl italic text-ink">{t("originTitle")}</h2>
            <p className="mt-5 text-ink-soft">{t("originText1")}</p>
            <p className="mt-4 text-ink-soft">{t("originText2")}</p>
          </RevealMask>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink px-5 py-20 text-cream sm:px-8 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-fade-sage opacity-40" />
        <div className="relative mx-auto max-w-6xl">
          <RevealMask className="text-center">
            <h2 className="font-display text-3xl italic sm:text-4xl">{t("valuesHeading")}</h2>
          </RevealMask>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {VALUE_KEYS.map((key, i) => (
              <RevealCard key={key} delay={i * 0.1}>
                <div className="rounded-2xl border border-cream/10 bg-cream/5 p-7 text-center">
                  <p className="font-display text-xl italic text-honey">{t(`values.${key}.title`)}</p>
                  <p className="mt-2 text-sm text-cream/70">{t(`values.${key}.desc`)}</p>
                </div>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-fade-sage px-5 py-20 text-center sm:px-8 sm:py-28">
        <RevealMask className="relative">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
            {t("locationEyebrow")}
          </p>
          <h2 className="mt-3 font-display text-4xl italic text-ink">{t("locationTitle")}</h2>
          <p className="mx-auto mt-5 max-w-xl text-ink-soft">{t("locationText")}</p>
          <Link
            href="/contacto"
            className="mt-7 inline-block rounded-full bg-sage px-7 py-3 font-ui text-sm font-semibold text-cream transition-all hover:bg-sage-deep active:scale-95"
          >
            {t("locationCta")}
          </Link>
        </RevealMask>
      </section>
    </>
  );
}
