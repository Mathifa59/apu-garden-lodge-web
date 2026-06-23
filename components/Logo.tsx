// ponytail: wordmark provisional con el mismo motivo del "apu" (pico + sol)
// del logo real que el cliente todavía no comparte. Cuando llegue el archivo
// final, este componente se reemplaza por un <Image> sin tocar quién lo usa.
export function Logo({ light = false }: { light?: boolean }) {
  const tone = light ? "text-cream" : "text-ink";
  const accent = light ? "text-cream" : "text-sage";

  return (
    <div className="flex items-center gap-2.5">
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className={accent}>
        <path
          d="M4 30 L15 11 L20 19 L25 9 L36 30 Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="25" cy="7" r="2.6" fill="currentColor" />
      </svg>
      <span className={`flex flex-col leading-none ${tone}`}>
        <span className="font-display text-xl italic tracking-tight">Apu Garden</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-terracotta">Lodge</span>
      </span>
    </div>
  );
}
