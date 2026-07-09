import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";

const ROUTES = ["/", "/servicios", "/novedad", "/nosotros", "/reservas", "/contacto"] as const;

const ROUTE_KEYS: Record<(typeof ROUTES)[number], string> = {
  "/": "home",
  "/servicios": "services",
  "/novedad": "whatsNew",
  "/nosotros": "about",
  "/reservas": "booking",
  "/contacto": "contact",
};

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");

  return (
    <footer className="relative overflow-hidden bg-ink px-5 py-14 text-cream sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-fade-footer" />
      <div className="relative mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-cream/70">{tf("tagline")}</p>
        </div>

        <div>
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-cream/50">
            {tf("explore")}
          </p>
          <ul className="mt-4 space-y-2">
            {ROUTES.map((href) => (
              <li key={href}>
                <Link href={href} className="text-sm text-cream/80 transition-colors hover:text-honey">
                  {t(ROUTE_KEYS[href])}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-cream/50">
            {tf("contact")}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>
              <a href="https://wa.me/51937454282" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-honey">
                +51 937 454 282
              </a>
            </li>
            <li>{tf("address")}</li>
            <li>
              <a
                href="https://www.booking.com/hotel/pe/apu-garden-lodge-yanaconas.es.html"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-honey"
              >
                Booking.com
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=61590296495164"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-honey"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/apugardenlodge/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-honey"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@apu.garden.hotel"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-honey"
              >
                TikTok
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative mx-auto mt-12 max-w-6xl border-t border-cream/10 pt-6 text-xs text-cream/40">
        © {new Date().getFullYear()} Apu Garden Lodge. {tf("rights")}
      </div>
    </footer>
  );
}
