import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { buildCanonical, buildLanguageAlternates, SITE_URL } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

// Bricolage Grotesque — grotesca contemporánea con carácter (ink traps,
// terminales suaves). Reemplaza a Fraunces: los títulos pasan de serif
// itálico "editorial" a sans-serif bold "moderno cálido", más cercano a la
// referencia que pidió el dueño manteniendo la paleta tierra.
const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f1e4",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s — Apu Garden Lodge` },
    description: t("description"),
    alternates: { canonical: buildCanonical(locale, "/"), languages: buildLanguageAlternates("/") },
    openGraph: {
      siteName: "Apu Garden Lodge",
      locale: locale === "es" ? "es_PE" : "en_US",
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: "Apu Garden Lodge",
    description:
      "Hotel boutique en Urubamba, Valle Sagrado, Cusco. Cuartos con baño privado desde S/77 por noche, jardines exuberantes, telescopio astronómico, piscina, spa natural y desayuno botánico.",
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    telephone: "+51937454282",
    priceRange: "$$",
    currenciesAccepted: "PEN, USD",
    paymentAccepted: "Cash",
    numberOfRooms: 42,
    petsAllowed: true,
    hasMap: `https://www.google.com/maps/search/?api=1&query=-13.2897078,-72.112883`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Cidruchayoc, lote 178, sector Yanaconas",
      addressLocality: "Urubamba",
      addressRegion: "Cusco",
      postalCode: "08660",
      addressCountry: "PE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -13.2897078,
      longitude: -72.112883,
    },
    sameAs: ["https://www.facebook.com/profile.php?id=61590296495164"],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free WiFi",               value: true },
      { "@type": "LocationFeatureSpecification", name: "Swimming Pool",            value: true },
      { "@type": "LocationFeatureSpecification", name: "Garden",                   value: true },
      { "@type": "LocationFeatureSpecification", name: "Spa",                      value: true },
      { "@type": "LocationFeatureSpecification", name: "Restaurant",               value: true },
      { "@type": "LocationFeatureSpecification", name: "Bar",                      value: true },
      { "@type": "LocationFeatureSpecification", name: "24-hour Front Desk",       value: true },
      { "@type": "LocationFeatureSpecification", name: "Astronomical Telescope",   value: true },
      { "@type": "LocationFeatureSpecification", name: "Botanical Breakfast",      value: true },
      { "@type": "LocationFeatureSpecification", name: "Airport Transfer",         value: true },
      { "@type": "LocationFeatureSpecification", name: "Luggage Storage",          value: true },
      { "@type": "LocationFeatureSpecification", name: "Non-smoking Rooms",        value: true },
      { "@type": "LocationFeatureSpecification", name: "Pets Allowed",             value: true },
      { "@type": "LocationFeatureSpecification", name: "Concierge Service",        value: true },
      { "@type": "LocationFeatureSpecification", name: "Currency Exchange",        value: true },
    ],
  };

  return (
    <html lang={locale} className={`${bricolage.variable} ${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-sand font-ui text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <NextIntlClientProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
