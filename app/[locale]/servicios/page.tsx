import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { IMAGES } from "@/lib/images";
import type { RoomType } from "@/lib/api";
import { buildLanguageAlternates } from "@/lib/seo";

const ROOM_TYPES: RoomType[] = ["single", "double", "suite"];
const AMENITY_KEYS = ["breakfast", "garden", "stars", "wifi", "transport", "spa"] as const;
const AMENITY_ICONS = {
  breakfast: CoffeeIcon,
  garden: LeafIcon,
  stars: StarIcon,
  wifi: WifiIcon,
  transport: CarIcon,
  spa: DropIcon,
};

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
    alternates: { languages: buildLanguageAlternates("/servicios") },
  };
}

export default async function ServiciosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("servicios");
  const tr = await getTranslations("rooms");

  return (
    <>
      <header className="bg-sage-pale/40 px-5 pt-32 pb-16 text-center sm:px-8 sm:pt-40">
        <Reveal>
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">{t("eyebrow")}</p>
          <h1 className="mt-3 font-display text-5xl italic text-ink sm:text-6xl">{t("title")}</h1>
          <p className="mx-auto mt-5 max-w-xl text-ink-soft">{t("subtitle")}</p>
        </Reveal>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <h2 className="font-display text-3xl italic text-ink sm:text-4xl">{t("roomsHeading")}</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {ROOM_TYPES.map((type, i) => (
            <Reveal key={type} delay={i * 0.08}>
              <div className="rounded-[1.75rem] border border-sage-pale bg-cream-soft p-7 transition-shadow hover:shadow-lg hover:shadow-sage/10">
                <p className="font-display text-2xl italic text-sage-deep">{tr(`${type}.label`)}</p>
                <p className="mt-2 text-sm text-ink-soft">{tr(`${type}.description`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-3xl italic text-cream sm:text-4xl">{t("amenitiesHeading")}</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AMENITY_KEYS.map((key, i) => {
              const Icon = AMENITY_ICONS[key];
              return (
                <Reveal key={key} delay={i * 0.06}>
                  <div className="rounded-2xl border border-cream/10 bg-cream/5 p-6 transition-colors hover:bg-cream/10">
                    <Icon className="h-7 w-7 text-honey" />
                    <p className="mt-4 font-display text-xl italic text-cream">{t(`amenities.${key}.title`)}</p>
                    <p className="mt-1.5 text-sm text-cream/70">{t(`amenities.${key}.desc`)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid items-center gap-10 sm:grid-cols-2 sm:gap-16">
          <Reveal>
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">{t("natureEyebrow")}</p>
            <h2 className="mt-3 font-display text-4xl italic text-ink">{t("gardenHeading")}</h2>
            <p className="mt-5 text-ink-soft">{t("gardenText")}</p>
            <Link
              href="/novedad"
              className="mt-6 inline-flex items-center gap-2 font-ui text-sm font-semibold text-sage-deep hover:text-terracotta"
            >
              {t("discoverNew")} →
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem]">
              <Image
                src={IMAGES.gardenPath}
                alt={t("gardenImageAlt")}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
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
