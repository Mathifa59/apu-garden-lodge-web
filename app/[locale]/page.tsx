import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookingWidget } from "@/components/BookingWidget";
import { Counter } from "@/components/Counter";
import { Reveal } from "@/components/Reveal";
import { RevealCard } from "@/components/RevealCard";
import { RevealMask } from "@/components/RevealMask";
import { WaveDivider } from "@/components/WaveDivider";
import { IMAGES } from "@/lib/images";
import { roomPhotos } from "@/lib/roomPhotos";
import { buildCanonical, buildLanguageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
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

  // Resalta una keyword del título — el texto trae <kw>…</kw> en las
  // traducciones y acá se convierte en el span con subrayado tostado.
  const kw = (chunks: React.ReactNode) => <span className="kw">{chunks}</span>;

  const cards = [
    {
      href: "/servicios" as const,
      title: t("cardServiciosTitle"),
      desc: t("cardServiciosDesc"),
      img: roomPhotos("doble_deluxe_twin")[0],
    },
    { href: "/novedad" as const, title: t("cardNovedadTitle"), desc: t("cardNovedadDesc"), img: IMAGES.observatory },
    {
      href: "/nosotros" as const,
      title: t("cardNosotrosTitle"),
      desc: t("cardNosotrosDesc"),
      img: roomPhotos("individual")[0],
    },
  ];

  const stats = [
    { value: 14, decimals: 0, suffix: "", label: t("statsRooms") },
    { value: 5, decimals: 0, suffix: "", label: t("statsTypes") },
    { value: 2, decimals: 0, suffix: "", label: t("statsDistance") },
    { value: 5.0, decimals: 1, suffix: "★", label: t("statsRating") },
  ];

  return (
    <>
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <Image
          src={roomPhotos("doble")[0]}
          alt={t("heroImageAlt")}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/55 to-transparent" />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pt-24 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="text-center lg:text-left">
            <Reveal y={12}>
              <span className="pill pill-dark">{t("badge")}</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-5 font-display text-6xl leading-[0.95] text-cream sm:text-7xl lg:text-8xl">
                Apu Garden Lodge
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-5 max-w-md text-sm font-medium uppercase tracking-[0.3em] text-cream/80 lg:mx-0">
                {t("tagline")}
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="mx-auto mt-6 max-w-xl text-base text-cream/85 sm:text-lg lg:mx-0">{t("heroText")}</p>
            </Reveal>
            <Reveal delay={0.32}>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/#reservar"
                  className="inline-block rounded-full bg-terracotta px-8 py-3.5 font-ui text-sm font-semibold text-cream shadow-lg shadow-ink/30 transition-all hover:bg-terracotta-bright hover:shadow-xl active:scale-95"
                >
                  {t("heroCta")}
                </Link>
                <Link
                  href="/servicios"
                  className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 font-ui text-sm font-semibold text-cream backdrop-blur-sm transition-all hover:border-cream/60 hover:bg-cream/10 active:scale-95"
                >
                  {t("heroCtaSecondary")}
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Tarjetas flotantes de stat sobre el hero — solo desktop */}
          <div className="relative hidden h-full min-h-80 lg:block">
            <Reveal delay={0.4} className="absolute right-0 top-6">
              <div className="stat-float animate-float-soft w-44">
                <p className="font-display text-3xl text-honey">
                  <Counter to={14} />
                </p>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-cream/70">
                  {t("statsRooms")}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.55} className="absolute right-24 top-44">
              <div className="stat-float animate-float-soft-delayed w-40">
                <p className="font-display text-3xl text-honey">
                  <Counter to={5} decimals={1} suffix="★" />
                </p>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-cream/70">
                  {t("statsRating")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider />
        </div>
      </section>

      {/* Banda de estadísticas con contadores animados */}
      <section className="border-b border-tan/25 bg-fade-honey px-5 py-12 sm:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-display text-4xl text-sage sm:text-5xl">
                <Counter to={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-ink-soft">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-fade-clay px-5 py-14 sm:px-8 sm:py-20">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 sm:grid-cols-2 sm:gap-16">
          <RevealCard>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
              <Image
                src={roomPhotos("deluxe_extragrande")[0]}
                alt={t("welcomeImageAlt")}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </RevealCard>
          <RevealMask delay={0.1}>
            <span className="pill">{t("welcomeEyebrow")}</span>
            <h2 className="mt-4 font-display text-4xl text-ink sm:text-5xl">{t.rich("welcomeTitle", { kw })}</h2>
            <p className="mt-5 text-ink-soft">{t("welcomeText")}</p>
            <Link
              href="/nosotros"
              className="mt-6 inline-flex items-center gap-2 font-ui text-sm font-semibold text-sage-deep transition-colors hover:text-terracotta"
            >
              {t("welcomeCta")}
            </Link>
          </RevealMask>
        </div>
      </section>

      <section
        id="reservar"
        className="relative scroll-mt-24 overflow-hidden bg-sage-pale/40 bg-fade-honey px-5 py-14 sm:px-8 sm:py-20"
      >
        <div className="relative mx-auto max-w-5xl">
          <RevealMask className="text-center">
            <span className="pill">{t("bookEyebrow")}</span>
            <h2 className="mt-4 font-display text-4xl text-ink sm:text-5xl">{t.rich("bookTitle", { kw })}</h2>
          </RevealMask>
          <Reveal delay={0.1} className="mt-10">
            <BookingWidget />
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-fade-sage px-5 py-14 sm:px-8 sm:py-20">
        <div className="relative mx-auto max-w-6xl">
          <RevealMask className="text-center">
            <span className="pill">{t("exploreEyebrow")}</span>
            <h2 className="mt-4 font-display text-4xl text-ink sm:text-5xl">{t.rich("exploreTitle", { kw })}</h2>
          </RevealMask>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {cards.map((card, i) => (
              <RevealCard key={card.href} delay={i * 0.12}>
                <Link href={card.href} className="group block overflow-hidden rounded-[2rem]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                    <span className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-cream/40 bg-ink/30 font-display text-sm text-cream backdrop-blur-sm">
                      0{i + 1}
                    </span>
                    <div className="absolute bottom-0 left-0 p-6">
                      <p className="font-display text-2xl text-cream">{card.title}</p>
                      <p className="mt-1 text-sm text-cream/80">{card.desc}</p>
                    </div>
                  </div>
                </Link>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
