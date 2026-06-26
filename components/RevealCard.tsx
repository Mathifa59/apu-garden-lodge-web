"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Reveal para tarjetas/imágenes en grilla: entra con escala + fade en vez del
// slide-up genérico, con un ease con leve rebote — se siente más "objeto que
// se asienta" que "texto que sube".
export function RevealCard({
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
      initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {children}
    </motion.div>
  );
}
