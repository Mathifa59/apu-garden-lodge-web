import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { RevealCard } from "@/components/RevealCard";
import { RevealMask } from "@/components/RevealMask";
import { Starfield } from "@/components/Starfield";
import { IMAGES } from "@/lib/images";
import { buildCanonical, buildLanguageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.novedad" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: buildCanonical(locale, "/novedad"), languages: buildLanguageAlternates("/novedad") },
  };
}

export default async function NovedadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("novedad");

  return (
    <div className="bg-night text-star">
      <section className="relative flex min-h-[95vh] items-center overflow-hidden">
        <Image
          src={IMAGES.observatory}
          alt={t("heroImageAlt")}
          fill
          sizes="100vw"
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/30" />
        <Starfield />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pt-24 text-center sm:px-8">
          <Reveal>
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.4em] text-celestial">{t("eyebrow")}</p>
            <h1 className="mx-auto mt-5 max-w-2xl font-display text-5xl italic leading-[1.05] text-star sm:text-7xl">
              {t("title")}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-star/80 sm:text-lg">{t("subtitle")}</p>
            <Link
              href="/reservas"
              className="mt-9 inline-block rounded-full bg-terracotta px-8 py-3.5 font-ui text-sm font-semibold text-cream shadow-lg shadow-night/50 transition-all hover:bg-terracotta-bright active:scale-95"
            >
              {t("cta")}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-fade-celestial px-5 py-20 sm:px-8 sm:py-28">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 sm:grid-cols-2 sm:gap-16">
          <RevealMask>
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-celestial">
              {t("experienceEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-4xl italic text-star">{t("experienceTitle")}</h2>
            <p className="mt-5 text-star/75">{t("experienceText1")}</p>
            <p className="mt-4 text-star/75">{t("experienceText2")}</p>
          </RevealMask>
          <RevealCard delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem]">
              <Image
                src={IMAGES.starryMountains}
                alt={t("secondaryImageAlt")}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </RevealCard>
        </div>
      </section>

      <section className="border-t border-star/10 px-5 py-16 text-center sm:px-8">
        <RevealMask>
          <p className="font-display text-2xl italic text-star sm:text-3xl">{t("quote")}</p>
          <p className="mt-3 text-sm text-star/60">{t("quoteAuthor")}</p>
        </RevealMask>
      </section>
    </div>
  );
}
