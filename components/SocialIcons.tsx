// Íconos compartidos entre Footer y /links — antes vivían duplicados como
// funciones locales dentro de app/links/page.tsx.
export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.6.1-1.4-.7-2.4-1.4-3.3-2.9-.2-.3-.1-.5.1-.7.2-.2.5-.6.7-.8.2-.2.2-.4.1-.6-.1-.2-.7-1.7-1-2.3-.2-.5-.5-.4-.7-.4-.2 0-.5 0-.7.2-.7.7-1 1.5-1 2.5.1 1.7 1 3.4 2.4 4.8 1.7 1.7 3.2 2.4 5 2.5.9 0 1.6-.2 2.2-.8.4-.4.7-1 .8-1.6.1-.3 0-.5-.3-.7z" />
      <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z" strokeWidth="0" />
    </svg>
  );
}
export function BookingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8.5 8v8h3.2a2 2 0 0 0 0-4 2 2 0 0 0 0-4H8.5Z" strokeLinejoin="round" />
      <path d="M15.5 11v5" strokeLinecap="round" />
    </svg>
  );
}
export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14 9h2.5V6H14c-2 0-3.5 1.6-3.5 3.5V11H8.5v3H10.5v6h3v-6h2l.5-3h-2.5v-1.5c0-.5.4-.5.5-.5Z" />
    </svg>
  );
}
export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.5 3c.4 2.2 1.8 3.6 4 3.9v2.6c-1.4 0-2.7-.4-3.9-1.2v6.4c0 3.1-2.5 5.3-5.4 5.3A5.2 5.2 0 0 1 6 14.7c0-2.9 2.3-5.3 5.2-5.3.3 0 .6 0 .9.1v2.7a2.6 2.6 0 0 0-.9-.2 2.6 2.6 0 1 0 0 5.2c1.4 0 2.7-1 2.7-2.7V3h2.6Z" />
    </svg>
  );
}
export function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}
export function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.2 3.3 5.3 3.3 8.5s-1.1 6.3-3.3 8.5c-2.2-2.2-3.3-5.3-3.3-8.5S9.8 5.7 12 3.5Z" />
    </svg>
  );
}
