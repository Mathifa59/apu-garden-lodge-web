import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingWidget } from "@/components/BookingWidget";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Reveal } from "@/components/Reveal";
import { buildLanguageAlternates } from "@/lib/seo";

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
    alternates: { languages: buildLanguageAlternates("/reservas") },
  };
}

export default async function ReservasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reservas");

  return (
    <>
      <header className="bg-sage-pale/40 px-5 pt-32 pb-16 text-center sm:px-8 sm:pt-40">
        <Reveal>
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">{t("eyebrow")}</p>
          <h1 className="mt-3 font-display text-5xl italic text-ink sm:text-6xl">{t("title")}</h1>
          <p className="mx-auto mt-5 max-w-xl text-ink-soft">{t("subtitle")}</p>
        </Reveal>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <BookingWidget />
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <h2 className="font-display text-3xl italic text-ink sm:text-4xl">{t("faqHeading")}</h2>
          <p className="mt-3 text-ink-soft">{t("faqSubtitle")}</p>
          <div className="mt-8">
            <FaqAccordion items={t.raw("faq")} />
          </div>
        </Reveal>
      </section>
    </>
  );
}
