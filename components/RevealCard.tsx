import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// The same restrained entrance for cards; no scale or bounce.
export function RevealCard({ children, delay = 0, className }: {
  children: ReactNode; delay?: number; className?: string;
}) {
  return <Reveal delay={delay} className={className}>{children}</Reveal>;
}
