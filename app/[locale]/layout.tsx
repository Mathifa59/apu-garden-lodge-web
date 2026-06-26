import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { buildLanguageAlternates, SITE_URL } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
    alternates: { languages: buildLanguageAlternates("/") },
    openGraph: {
      siteName: "Apu Garden Lodge",
      locale: locale === "es" ? "es_PE" : "en_US",
      type: "website",
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
    telephone: "+51984000000",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valle Sagrado",
      addressRegion: "Cusco",
      addressCountry: "PE",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Telescope / stargazing" },
      { "@type": "LocationFeatureSpecification", name: "Garden" },
      { "@type": "LocationFeatureSpecification", name: "Wifi" },
    ],
  };

  return (
    <html lang={locale} className={`${cormorant.variable} ${outfit.variable} h-full antialiased`}>
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
