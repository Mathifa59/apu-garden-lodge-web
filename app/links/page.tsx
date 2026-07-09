import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import {
  BookingIcon,
  CalendarIcon,
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  MapPinIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/SocialIcons";

export const metadata: Metadata = {
  title: "Apu Garden Lodge — Links",
  description: "Reserva, escríbenos o síguenos — todo en un solo lugar.",
};

// Pin exacto del lodge (confirmado por el dueño vía Google Maps) — más
// preciso que buscar por la dirección en texto.
const LODGE_LAT = -13.2897078;
const LODGE_LNG = -72.112883;

const LINKS = [
  { label: "Reservar", sub: "Disponibilidad y precios", href: "https://apu-garden-lodge.com/reservas", icon: CalendarIcon },
  { label: "Booking.com", sub: "Reserva y opiniones", href: "https://www.booking.com/hotel/pe/apu-garden-lodge-yanaconas.es.html", icon: BookingIcon },
  { label: "WhatsApp", sub: "+51 937 454 282", href: "https://wa.me/51937454282", icon: WhatsAppIcon },
  { label: "Instagram", sub: "@apugardenlodge", href: "https://www.instagram.com/apugardenlodge/", icon: InstagramIcon },
  { label: "TikTok", sub: "@apu.garden.hotel", href: "https://www.tiktok.com/@apu.garden.hotel", icon: TikTokIcon },
  { label: "Facebook", sub: "Síguenos", href: "https://www.facebook.com/profile.php?id=61590296495164", icon: FacebookIcon },
  {
    label: "Ubicación",
    sub: "Urubamba, Valle Sagrado",
    href: `https://www.google.com/maps/search/?api=1&query=${LODGE_LAT},${LODGE_LNG}`,
    icon: MapPinIcon,
  },
  { label: "Sitio web", sub: "apu-garden-lodge.com", href: "https://apu-garden-lodge.com", icon: GlobeIcon },
] as const;

export default function LinksPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-fade-clay px-5 py-16">
      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.25em] text-terracotta">
            Urubamba · Valle Sagrado · Cusco
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {LINKS.map(({ label, sub, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-sage-pale bg-cream-soft px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta/40 hover:shadow-md active:scale-[0.98]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-pale/60 text-sage-deep">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-ui text-sm font-semibold text-ink">{label}</span>
                <span className="block truncate text-xs text-ink-soft">{sub}</span>
              </span>
            </a>
          ))}
        </div>

        <p className="mt-10 text-center text-[11px] text-ink-soft/70">
          © {new Date().getFullYear()} Apu Garden Lodge
        </p>
      </div>
    </div>
  );
}
