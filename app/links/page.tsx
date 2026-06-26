import type { Metadata } from "next";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Apu Garden Lodge — Links",
  description: "Reserva, escríbenos o síguenos — todo en un solo lugar.",
};

const ADDRESS = "Cidruchayoc, lote 178, sector Yanaconas, Urubamba, Cusco, Perú";

const LINKS = [
  { label: "Reservar", sub: "Disponibilidad y precios", href: "https://apu-garden-lodge.com/reservas", icon: CalendarIcon },
  { label: "WhatsApp", sub: "+51 937 454 282", href: "https://wa.me/51937454282", icon: WhatsAppIcon },
  { label: "Facebook", sub: "Síguenos", href: "https://www.facebook.com/profile.php?id=61590296495164", icon: FacebookIcon },
  {
    label: "Ubicación",
    sub: "Urubamba, Valle Sagrado",
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`,
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

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.6.1-1.4-.7-2.4-1.4-3.3-2.9-.2-.3-.1-.5.1-.7.2-.2.5-.6.7-.8.2-.2.2-.4.1-.6-.1-.2-.7-1.7-1-2.3-.2-.5-.5-.4-.7-.4-.2 0-.5 0-.7.2-.7.7-1 1.5-1 2.5.1 1.7 1 3.4 2.4 4.8 1.7 1.7 3.2 2.4 5 2.5.9 0 1.6-.2 2.2-.8.4-.4.7-1 .8-1.6.1-.3 0-.5-.3-.7z" />
      <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z" strokeWidth="0" />
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14 9h2.5V6H14c-2 0-3.5 1.6-3.5 3.5V11H8.5v3H10.5v6h3v-6h2l.5-3h-2.5v-1.5c0-.5.4-.5.5-.5Z" />
    </svg>
  );
}
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.2 3.3 5.3 3.3 8.5s-1.1 6.3-3.3 8.5c-2.2-2.2-3.3-5.3-3.3-8.5S9.8 5.7 12 3.5Z" />
    </svg>
  );
}
