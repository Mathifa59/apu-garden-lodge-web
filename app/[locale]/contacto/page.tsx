import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingWidget } from "@/components/BookingWidget";
import { Reveal } from "@/components/Reveal";
import { buildLanguageAlternates } from "@/lib/seo";

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
    alternates: { languages: buildLanguageAlternates("/contacto") },
  };
}

export default async function ContactoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacto");

  const contactItems = [
    { label: t("emailLabel"), value: "reservas@apugardenlodge.com", href: "mailto:reservas@apugardenlodge.com" },
    { label: t("phoneLabel"), value: "+51 984 000 000", href: "https://wa.me/51984000000" },
    { label: t("locationLabel"), value: t("locationValue"), href: undefined },
  ];

  return (
    <>
      <header className="bg-sage-pale/40 px-5 pt-32 pb-16 text-center sm:px-8 sm:pt-40">
        <Reveal>
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">{t("eyebrow")}</p>
          <h1 className="mt-3 font-display text-5xl italic text-ink sm:text-6xl">{t("title")}</h1>
          <p className="mx-auto mt-5 max-w-xl text-ink-soft">{t("subtitle")}</p>
        </Reveal>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {contactItems.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
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
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-sage-pale">
            <iframe
              title={t("mapTitle")}
              src="https://www.openstreetmap.org/export/embed.html?bbox=-72.2200%2C-13.3400%2C-71.9800%2C-13.1800&layer=mapnik"
              className="h-72 w-full sm:h-96"
              loading="lazy"
            />
          </div>
          <p className="mt-2 text-center text-xs text-ink-soft">{t("mapCaption")}</p>
        </Reveal>
      </section>

      <section className="bg-sage-pale/40 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <h2 className="font-display text-4xl italic text-ink sm:text-5xl">{t("availabilityTitle")}</h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <BookingWidget />
          </Reveal>
        </div>
      </section>
    </>
  );
}
