import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  // Ya no se usan imágenes externas: todas las fotos son locales (public/).
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // Sin un único app/layout.tsx (hay dos root layouts: [locale]/ y
    // links/, ver app/links/layout.tsx), Next no puede componer un 404 para
    // rutas que no matchean NINGÚN segmento (ej. /lo-que-sea) a través de
    // app/[locale]/not-found.tsx — cae directo al 404 genérico interno de
    // Next. global-not-found.tsx es la vía documentada para ese caso.
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
