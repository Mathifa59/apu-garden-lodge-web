import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingWidget } from "@/components/BookingWidget";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/Reveal";
import { RevealMask } from "@/components/RevealMask";
import { roomPhotos } from "@/lib/roomPhotos";
import { buildCanonical, buildLanguageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.reservas" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: buildCanonical(locale, "/reservas"), languages: buildLanguageAlternates("/reservas") },
  };
}

export default async function ReservasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reservas");

  const faqItems = t.raw("faq") as Array<{ q: string; a: string }>;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="relative overflow-hidden px-5 pt-32 pb-20 text-center sm:px-8 sm:pt-40 sm:pb-28">
        <Image src={roomPhotos("deluxe_extragrande")[1]} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/45" />
        <div className="relative">
          <span className="pill pill-dark">{t("eyebrow")}</span>
          <h1 className="mt-3 font-display text-5xl text-cream sm:text-6xl">{t("title")}</h1>
          <p className="mx-auto mt-5 max-w-xl text-cream/85">{t("subtitle")}</p>
        </div>
      </header>

      <section className="relative overflow-hidden bg-fade-sage px-5 py-16 sm:px-8 sm:py-24">
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <BookingWidget />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-fade-clay px-5 py-16 sm:px-8 sm:py-24">
        <RevealMask className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">{t("faqHeading")}</h2>
          <p className="mt-3 text-ink-soft">{t("faqSubtitle")}</p>
          <div className="mt-8">
            <FaqAccordion items={t.raw("faq")} />
          </div>
        </RevealMask>
      </section>
    </>
  );
}
