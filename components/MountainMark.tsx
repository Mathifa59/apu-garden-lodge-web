// Glifo de marca (montaña + sol) que aparece en el isotipo de Apu Garden
// Lodge, redibujado como trazo simple para usarlo como marca de agua
// decorativa detrás de títulos — a diferencia de <Logo>, que es el lockup
// completo (ícono + wordmark) tomado de los PNG en /public para navbar y
// footer, este es solo el ícono, vectorial y tintable con currentColor.
export function MountainMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 62" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 52c8 0 12-2 17-9l13-24c2-3 4-3 6 0l4 6"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M45 33l4-6c2-3 4-3 6 0l10 15c5 7 9 9 17 9"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="70" cy="10" r="7.5" stroke="currentColor" strokeWidth="4.5" />
    </svg>
  );
}
