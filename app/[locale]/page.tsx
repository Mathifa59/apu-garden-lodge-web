import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookingWidget } from "@/components/BookingWidget";
import { Reveal } from "@/components/Reveal";
import { RoomShowcaseCard } from "@/components/RoomShowcaseCard";
import { WaveDivider } from "@/components/WaveDivider";
import type { RoomType } from "@/lib/api";
import { IMAGES } from "@/lib/images";
import { roomPhotos } from "@/lib/roomPhotos";
import { buildCanonical, buildLanguageAlternates } from "@/lib/seo";

const FEATURED_ROOMS: RoomType[] = ["doble", "doble_deluxe_twin", "deluxe_extragrande"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: buildCanonical(locale, "/"), languages: buildLanguageAlternates("/") },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tn = await getTranslations("novedad");
  const tv = await getTranslations("nosotros.values");
  const kw = (chunks: React.ReactNode) => <span className="kw">{chunks}</span>;
  // Facts are immediately readable, including the rating, without duplicated counters.
  const stats = [
    { value: "14", label: t("statsRooms") },
    { value: "5", label: t("statsTypes") },
    { value: "2", label: t("statsDistance") },
    { value: "5.0 ★", label: t("statsRating") },
  ];

  return (
    <>
      <section className="relative flex min-h-svh items-center overflow-hidden bg-ink">
        <Image src={roomPhotos("doble")[0]} alt={t("heroImageAlt")} fill sizes="100vw" priority className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/35" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-28 pt-36 sm:px-8 sm:pb-32">
          <div className="max-w-2xl">
            <p className="eyebrow text-cream/85">{t("badge")}</p>
            <h1 className="hero-title mt-5 font-display text-[clamp(3rem,14vw,6.5rem)] text-cream sm:text-[clamp(3.5rem,8vw,6.5rem)]">
              Apu Garden <span className="block">Lodge</span>
            </h1>
            <p className="mt-6 text-xs font-medium uppercase leading-relaxed tracking-[0.22em] text-cream/80 sm:text-sm">{t("tagline")}</p>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-cream/90 sm:text-lg">{t("heroText")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/#reservar" className="btn-primary">{t("heroCta")} <span aria-hidden="true">↗</span></Link>
              <Link href="/servicios" className="inline-flex min-h-12 items-center rounded-full border border-cream/60 px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-cream/10">{t("heroCtaSecondary")}</Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0"><WaveDivider color="var(--color-cream-soft)" /></div>
      </section>

      <section id="reservar" aria-labelledby="booking-heading" className="scroll-mt-24 bg-cream-soft px-5 pb-8 pt-6 sm:px-8 sm:pb-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-terracotta">{t("bookEyebrow")}</p>
              <h2 id="booking-heading" className="section-title mt-2 text-3xl text-ink sm:text-4xl">{t.rich("bookTitle", { kw })}</h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft">{t("bookIntro")}</p>
          </div>
          <BookingWidget showHeading={false} anchorId={null} />
        </div>
      </section>

      <section aria-labelledby="rooms-heading" className="bg-cream-soft px-5 pb-12 pt-8 sm:px-8 sm:pb-20 sm:pt-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow text-terracotta">{t("roomsEyebrow")}</p>
                <h2 id="rooms-heading" className="section-title mt-3 text-4xl text-ink sm:text-5xl">{t("roomsTitle")}</h2>
                <p className="mt-4 leading-relaxed text-ink-soft">{t("roomsIntro")}</p>
              </div>
              <Link href="/servicios" className="text-link shrink-0">{t("allRooms")} <span aria-hidden="true">↗</span></Link>
            </div>
          </Reveal>
          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {FEATURED_ROOMS.map((type) => <RoomShowcaseCard key={type} type={type} />)}
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-tan/25 pt-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">{stat.label}</dt>
                <dd className="mt-2 font-display text-3xl text-sage-deep">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="welcome-heading" className="relative overflow-hidden bg-fade-welcome px-5 py-16 sm:px-8 sm:py-24">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-t-[8rem] rounded-b-2xl">
            <Image src={roomPhotos("deluxe_extragrande")[0]} alt={t("welcomeImageAlt")} fill sizes="(min-width: 768px) 384px, 100vw" className="object-cover" />
          </div>
          <Reveal>
            <p className="eyebrow text-terracotta">{t("welcomeEyebrow")}</p>
            <h2 id="welcome-heading" className="section-title mt-4 max-w-lg text-4xl text-ink sm:text-5xl">{t.rich("welcomeTitle", { kw })}</h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">{t("welcomeText")}</p>
            <div className="mt-8 grid grid-cols-1 gap-5 border-t border-tan/30 pt-6 sm:grid-cols-3">
              {(["nature", "rest", "honest"] as const).map((key) => (
                <div key={key}>
                  <h3 className="font-display text-base text-sage-deep">{tv(key + ".title")}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{tv(key + ".desc")}</p>
                </div>
              ))}
            </div>
            <Link href="/nosotros" className="text-link mt-8">{t("welcomeCta")}</Link>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="experience-heading" className="bg-night px-5 py-16 text-star sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={IMAGES.observatory} alt={tn("secondaryImageAlt")} fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
          </div>
          <Reveal>
            <p className="eyebrow text-celestial">{t("experienceEyebrow")}</p>
            <h2 id="experience-heading" className="section-title mt-4 text-4xl sm:text-5xl">{tn("title")}</h2>
            <p className="mt-6 leading-relaxed text-star/80">{t("experienceIntro")}</p>
            <p className="mt-4 text-sm text-star/65">{tn("experienceText2")}</p>
            <Link href="/novedad" className="mt-8 inline-flex min-h-11 items-center gap-3 border-b border-celestial/60 pb-1 text-sm font-medium text-celestial transition-colors hover:text-star">
              {t("experienceCta")} <span aria-hidden="true">↗</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-soft px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="section-title text-3xl text-ink sm:text-4xl">{t("closingTitle")}</h2>
            <p className="mt-3 text-ink-soft">{t("closingText")}</p>
          </div>
          <Link href="/reservas" className="btn-primary self-start sm:shrink-0">{t("heroCta")} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </>
  );
}
