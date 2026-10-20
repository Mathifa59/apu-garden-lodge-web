import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// Headings stay readable without clip-path curtains or delayed visibility fallbacks.
export function RevealMask({ children, delay = 0, className }: {
  children: ReactNode; delay?: number; className?: string;
}) {
  return <Reveal delay={delay} className={className} y={6}>{children}</Reveal>;
}
