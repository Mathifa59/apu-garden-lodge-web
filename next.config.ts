import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  // Ya no se usan imágenes externas: todas las fotos son locales (public/).
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
