import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { whatsappHref } from "@/lib/whatsapp";
import { Logo } from "./Logo";
import {
  BookingIcon,
  FacebookIcon,
  InstagramIcon,
  MapPinIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "./SocialIcons";

const ROUTES = ["/", "/servicios", "/novedad", "/nosotros", "/reservas", "/contacto"] as const;

const ROUTE_KEYS: Record<(typeof ROUTES)[number], string> = {
  "/": "home",
  "/servicios": "services",
  "/novedad": "whatsNew",
  "/nosotros": "about",
  "/reservas": "booking",
  "/contacto": "contact",
};

// Pin exacto del lodge — mismo usado en contacto/page.tsx y app/links.
const LODGE_LAT = -13.2897078;
const LODGE_LNG = -72.112883;

// Rotación de acentos de marca para los badges de ícono — evita que la
// columna de contacto se lea como un solo bloque monocromo de texto.
const ACCENTS = ["bg-terracotta/25 text-terracotta-bright", "bg-sage/25 text-sage-pale", "bg-honey/25 text-honey"];

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const tw = useTranslations("whatsapp");

  const contactItems = [
    { label: "+51 937 454 282", href: whatsappHref(tw("defaultMessage")), icon: WhatsAppIcon },
    {
      label: tf("address"),
      href: `https://www.google.com/maps/search/?api=1&query=${LODGE_LAT},${LODGE_LNG}`,
      icon: MapPinIcon,
    },
    { label: "Booking.com", href: "https://www.booking.com/hotel/pe/apu-garden-lodge-yanaconas.es.html", icon: BookingIcon },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61590296495164", icon: FacebookIcon },
    { label: "Instagram", href: "https://www.instagram.com/apugardenlodge/", icon: InstagramIcon },
    { label: "TikTok", href: "https://www.tiktok.com/@apu.garden.hotel", icon: TikTokIcon },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink px-5 py-14 text-cream sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-fade-footer" />
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />

      <div className="relative mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-cream/70">{tf("tagline")}</p>
        </div>

        <div>
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-honey/80">
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
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.25em] text-honey/80">
            {tf("contact")}
          </p>
          <ul className="mt-4 space-y-2.5">
            {contactItems.map(({ label, href, icon: Icon }, i) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-sm text-cream/80 transition-colors hover:text-cream"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${ACCENTS[i % ACCENTS.length]}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mx-auto mt-12 max-w-6xl border-t border-cream/10 pt-6 text-xs text-cream/40">
        © {new Date().getFullYear()} Apu Garden Lodge. {tf("rights")}
      </div>
    </footer>
  );
}
