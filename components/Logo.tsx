import Image from "next/image";

// Proporción intrínseca del archivo de marca (1779x1031 ≈ 1.73:1).
const ASPECT_WIDTH = 178;
const ASPECT_HEIGHT = 103;

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Image
      src={light ? "/logo-white.png" : "/logo.png"}
      alt="Apu Garden Lodge"
      width={ASPECT_WIDTH}
      height={ASPECT_HEIGHT}
      priority
      className="h-12 w-auto sm:h-14"
    />
  );
}
