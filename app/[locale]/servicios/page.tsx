import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { RevealCard } from "@/components/RevealCard";
import { RevealMask } from "@/components/RevealMask";
import { RoomShowcaseCard } from "@/components/RoomShowcaseCard";
import type { RoomType } from "@/lib/api";
import { roomPhotos } from "@/lib/roomPhotos";
import { buildCanonical, buildLanguageAlternates } from "@/lib/seo";

const ROOM_TYPES: RoomType[] = ["individual", "doble", "doble_deluxe", "doble_deluxe_twin", "deluxe_extragrande"];
const AMENITY_KEYS = ["breakfast", "garden", "stars", "wifi", "transport", "spa"] as const;
const AMENITY_ICONS = {
  breakfast: CoffeeIcon,
  garden: LeafIcon,
  stars: StarIcon,
  wifi: WifiIcon,
  transport: CarIcon,
  spa: DropIcon,
};
const FULL_AMENITY_KEYS = [
  "room",
  "bathroom",
  "food",
  "wellness",
  "activities",
  "reception",
  "security",
  "policies",
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.servicios" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: buildCanonical(locale, "/servicios"), languages: buildLanguageAlternates("/servicios") },
  };
}

export default async function ServiciosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("servicios");

  return (
    <>
      <header className="relative overflow-hidden px-5 pt-32 pb-20 text-center sm:px-8 sm:pt-40 sm:pb-28">
        <Image src={roomPhotos("doble_deluxe_twin")[1]} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/45" />
        <div className="relative">
          <span className="pill pill-dark">{t("eyebrow")}</span>
          <h1 className="mt-3 font-display text-5xl text-cream sm:text-6xl">{t("title")}</h1>
          <p className="mx-auto mt-5 max-w-xl text-cream/85">{t("subtitle")}</p>
        </div>
      </header>

      <section className="relative overflow-hidden bg-fade-clay px-5 py-20 sm:px-8">
        <div className="relative mx-auto max-w-6xl">
          <RevealMask>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">{t("roomsHeading")}</h2>
          </RevealMask>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ROOM_TYPES.map((type, i) => (
              <RevealCard key={type} delay={i * 0.08}>
                <RoomShowcaseCard type={type} priority={i === 0} />
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink px-5 py-14 sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-fade-honey opacity-60" />
        <div className="relative mx-auto max-w-6xl">
          <RevealMask>
            <h2 className="font-display text-3xl text-cream sm:text-4xl">{t("amenitiesHeading")}</h2>
          </RevealMask>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AMENITY_KEYS.map((key, i) => {
              const Icon = AMENITY_ICONS[key];
              return (
                <RevealCard key={key} delay={i * 0.06}>
                  <div className="rounded-2xl border border-cream/10 bg-cream/5 p-6 transition-colors hover:bg-cream/10">
                    <Icon className="h-7 w-7 text-honey" />
                    <p className="mt-4 font-display text-xl text-cream">{t(`amenities.${key}.title`)}</p>
                    <p className="mt-1.5 text-sm text-cream/70">{t(`amenities.${key}.desc`)}</p>
                  </div>
                </RevealCard>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-fade-sage px-5 py-20 sm:px-8">
        <div className="relative mx-auto max-w-6xl">
          <RevealMask>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">{t("fullAmenitiesHeading")}</h2>
            <p className="mt-3 max-w-2xl text-ink-soft">{t("fullAmenitiesSubtitle")}</p>
          </RevealMask>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FULL_AMENITY_KEYS.map((key, i) => (
              <RevealCard key={key} delay={i * 0.05}>
                <div>
                  <p className="font-display text-xl text-sage-deep">{t(`fullAmenities.${key}.title`)}</p>
                  <ul className="mt-3 space-y-1.5">
                    {t.raw(`fullAmenities.${key}.items`).map((item: string) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-fade-clay px-5 py-20 text-center sm:px-8 sm:py-28">
        <RevealMask className="relative mx-auto max-w-2xl">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">{t("natureEyebrow")}</p>
          <h2 className="mt-3 font-display text-4xl text-ink">{t("gardenHeading")}</h2>
          <p className="mt-5 text-ink-soft">{t("gardenText")}</p>
          <Link
            href="/novedad"
            className="mt-6 inline-flex items-center gap-2 font-ui text-sm font-semibold text-sage-deep hover:text-terracotta"
          >
            {t("discoverNew")} →
          </Link>
        </RevealMask>
      </section>
    </>
  );
}

function CoffeeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M4 9h13a3 3 0 0 1 0 6h-1" strokeLinecap="round" />
      <path d="M4 9v6a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V9" strokeLinecap="round" />
      <path d="M7 5c0 1-1 1-1 2M11 5c0 1-1 1-1 2" strokeLinecap="round" />
    </svg>
  );
}
function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z" strokeLinejoin="round" />
      <path d="M5 19c0-5 3-8 8-9" strokeLinecap="round" />
    </svg>
  );
}
function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M12 3l2.2 5.4L20 10l-4.6 3.6L17 19l-5-3.2L7 19l1.6-5.4L4 10l5.8-1.6Z" strokeLinejoin="round" />
    </svg>
  );
}
function WifiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M4 9c4.5-4 11.5-4 16 0M7 12.5c2.8-2.4 7.2-2.4 10 0M10 16c1.2-1 2.8-1 4 0" strokeLinecap="round" />
      <circle cx="12" cy="19" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function CarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M4 16V12l2-5h12l2 5v4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 16h18" strokeLinecap="round" />
      <circle cx="7.5" cy="16.5" r="1.5" />
      <circle cx="16.5" cy="16.5" r="1.5" />
    </svg>
  );
}
function DropIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M12 3c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11Z" strokeLinejoin="round" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
