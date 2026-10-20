"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0, className, y = 8 }: {
  children: ReactNode; delay?: number; className?: string; y?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: Math.min(y, 8) }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px" }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.4, delay: Math.min(delay, 0.12), ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
