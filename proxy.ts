import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // "links" excluido a propósito — es la página para el QR de la tarjeta de
  // presentación, vive fuera del sistema de idiomas (ver app/layout.tsx).
  matcher: ["/((?!api|_next|_vercel|icon|apple-icon|opengraph-image|twitter-image|links|.*\\..*).*)"],
};
