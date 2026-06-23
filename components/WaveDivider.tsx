type Props = {
  flip?: boolean;
  color?: string;
  className?: string;
};

// ponytail: una sola curva orgánica reutilizada en todo el sitio en vez de
// generar una distinta por sección — es el detalle de marca (el marco
// ondulado del logo), no necesita variar.
export function WaveDivider({ flip = false, color = "var(--color-cream)", className = "" }: Props) {
  return (
    <div className={`pointer-events-none w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}>
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="h-16 w-full sm:h-24">
        <path
          d="M0,40 C150,90 350,0 600,40 C850,80 1050,0 1200,40 L1200,80 L0,80 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
