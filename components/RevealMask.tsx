"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Reveal tipo "cortina": el texto entra recortado por un clip-path que se
// abre de izquierda a derecha, en vez del fade + slide-up genérico. Pensado
// para encabezados de sección (eyebrow + título), no para bloques de texto.
export function RevealMask({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
