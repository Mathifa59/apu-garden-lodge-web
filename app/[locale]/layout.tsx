import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Outfit } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { buildCanonical, buildLanguageAlternates, SITE_URL } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Fraunces — serif con mucho carácter y peso real en los trazos (a diferencia
// de Cormorant, que se leía "fina" incluso en negrita). Su cursiva tiene
// personalidad propia, así que se mantiene el uso de italic en los títulos.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
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
    "@type": "LodgingBusiness",
    name: "Apu Garden Lodge",
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    telephone: "+51937454282",
    priceRange: "$$",
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
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Telescope / stargazing" },
      { "@type": "LocationFeatureSpecification", name: "Garden" },
      { "@type": "LocationFeatureSpecification", name: "Wifi" },
    ],
  };

  return (
    <html lang={locale} className={`${fraunces.variable} ${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-cream font-ui text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <NextIntlClientProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
