"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Reveal tipo "cortina": el texto entra recortado por un clip-path que se
// abre de izquierda a derecha, en vez del fade + slide-up genérico. Pensado
// para encabezados de sección (eyebrow + título), no para bloques de texto.
//
// A diferencia de Reveal/RevealCard (que solo animan opacidad/posición), este
// componente anima clip-path — y en producción se vio que el trigger de
// whileInView puede no disparar para esta combinación específica (causa no
// confirmada). Por eso acá no se usa whileInView directo: se calcula
// "visible" a mano (useInView + un timeout de respaldo) para que el
// contenido NUNCA quede invisible para siempre, aunque a veces se pierda la
// animación de entrada.
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setForceVisible(true), 600);
    return () => clearTimeout(timeout);
  }, []);

  const visible = Boolean(reduceMotion) || inView || forceVisible;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : { clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
      animate={visible ? { clipPath: "inset(0 0% 0 0)", opacity: 1 } : undefined}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
