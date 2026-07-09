import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingWidget } from "@/components/BookingWidget";
import { Reveal } from "@/components/Reveal";
import { RevealCard } from "@/components/RevealCard";
import { RevealMask } from "@/components/RevealMask";
import { roomPhotos } from "@/lib/roomPhotos";
import { buildCanonical, buildLanguageAlternates } from "@/lib/seo";

// Pin exacto del lodge (confirmado por el dueño vía Google Maps) — se usa
// tanto para el mapa embebido como para el geo del JSON-LD en el layout.
const LODGE_LAT = -13.2897078;
const LODGE_LNG = -72.112883;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.contacto" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: buildCanonical(locale, "/contacto"), languages: buildLanguageAlternates("/contacto") },
  };
}

export default async function ContactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacto");

  const contactItems = [
    { label: t("phoneLabel"), value: "+51 937 454 282", href: "https://wa.me/51937454282" },
    {
      label: t("locationLabel"),
      value: t("locationValue"),
      href: `https://www.google.com/maps/search/?api=1&query=${LODGE_LAT},${LODGE_LNG}`,
    },
    { label: t("socialLabel"), value: "Facebook", href: "https://www.facebook.com/profile.php?id=61590296495164" },
  ];

  return (
    <>
      <header className="relative overflow-hidden px-5 pt-32 pb-20 text-center sm:px-8 sm:pt-40 sm:pb-28">
        <Image src={roomPhotos("individual")[1]} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/45" />
        <div className="relative">
          <span className="pill pill-dark">{t("eyebrow")}</span>
          <h1 className="mt-3 font-display text-5xl text-cream sm:text-6xl">{t("title")}</h1>
          <p className="mx-auto mt-5 max-w-xl text-cream/85">{t("subtitle")}</p>
        </div>
      </header>

      <section className="relative overflow-hidden bg-fade-clay px-5 py-16 sm:px-8">
        <div className="relative mx-auto grid max-w-6xl gap-5 sm:grid-cols-3">
          {contactItems.map((item, i) => (
            <RevealCard key={item.label} delay={i * 0.08}>
              <div className="rounded-2xl border border-sage-pale bg-cream-soft p-6 text-center">
                <p className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-sage-deep">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="mt-2 block text-ink transition-colors hover:text-terracotta"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-ink">{item.value}</p>
                )}
              </div>
            </RevealCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <RevealCard>
          <div className="overflow-hidden rounded-[2rem] border border-sage-pale">
            <iframe
              title={t("mapTitle")}
              src={`https://maps.google.com/maps?q=${LODGE_LAT},${LODGE_LNG}&z=16&output=embed`}
              className="h-72 w-full sm:h-96"
              loading="lazy"
            />
          </div>
          <p className="mt-2 text-center text-xs text-ink-soft">{t("mapCaption")}</p>
        </RevealCard>
      </section>

      <section className="relative overflow-hidden bg-sage-pale/40 bg-fade-sage px-5 py-20 sm:px-8 sm:py-28">
        <div className="relative mx-auto max-w-5xl">
          <RevealMask className="text-center">
            <h2 className="font-display text-4xl text-ink sm:text-5xl">{t("availabilityTitle")}</h2>
          </RevealMask>
          <Reveal delay={0.1} className="mt-10">
            <BookingWidget />
          </Reveal>
        </div>
      </section>
    </>
  );
}
