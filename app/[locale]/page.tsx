import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookingWidget } from "@/components/BookingWidget";
import { Reveal } from "@/components/Reveal";
import { WaveDivider } from "@/components/WaveDivider";
import { IMAGES } from "@/lib/images";
import { buildLanguageAlternates } from "@/lib/seo";

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
    alternates: { languages: buildLanguageAlternates("/") },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const cards = [
    { href: "/servicios" as const, title: t("cardServiciosTitle"), desc: t("cardServiciosDesc"), img: IMAGES.gardenPath },
    { href: "/novedad" as const, title: t("cardNovedadTitle"), desc: t("cardNovedadDesc"), img: IMAGES.observatory },
    { href: "/nosotros" as const, title: t("cardNosotrosTitle"), desc: t("cardNosotrosDesc"), img: IMAGES.snowCabin },
  ];

  return (
    <>
      <section className="relative flex min-h-[92vh] items-center overflow-hidden">
        <Image
          src={IMAGES.heroMountains}
          alt={t("heroImageAlt")}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/55 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-24 text-center sm:px-8">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.4em] text-honey">{t("badge")}</p>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl italic leading-[1.05] text-cream sm:text-7xl">
            Apu Garden Lodge
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm font-medium uppercase tracking-[0.3em] text-cream/80">
            {t("tagline")}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base text-cream/85 sm:text-lg">{t("heroText")}</p>
          <Link
            href="/#reservar"
            className="mt-9 inline-block rounded-full bg-terracotta px-8 py-3.5 font-ui text-sm font-semibold text-cream shadow-lg shadow-ink/30 transition-all hover:bg-terracotta-bright hover:shadow-xl active:scale-95"
          >
            {t("heroCta")}
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid items-center gap-10 sm:grid-cols-2 sm:gap-16">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
              <Image
                src={IMAGES.cozyRoom}
                alt={t("welcomeImageAlt")}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
              {t("welcomeEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-4xl italic text-ink sm:text-5xl">{t("welcomeTitle")}</h2>
            <p className="mt-5 text-ink-soft">{t("welcomeText")}</p>
            <Link
              href="/nosotros"
              className="mt-6 inline-flex items-center gap-2 font-ui text-sm font-semibold text-sage-deep transition-colors hover:text-terracotta"
            >
              {t("welcomeCta")}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-sage-pale/40 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-sage-deep">
              {t("bookEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-4xl italic text-ink sm:text-5xl">{t("bookTitle")}</h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <BookingWidget />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="text-center">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
            {t("exploreEyebrow")}
          </p>
          <h2 className="mt-3 font-display text-4xl italic text-ink sm:text-5xl">{t("exploreTitle")}</h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {cards.map((card, i) => (
            <Reveal key={card.href} delay={i * 0.1}>
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
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="font-display text-2xl italic text-cream">{card.title}</p>
                    <p className="mt-1 text-sm text-cream/80">{card.desc}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
