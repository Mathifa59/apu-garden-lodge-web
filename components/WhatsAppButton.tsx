"use client";

import { motion, useReducedMotion } from "motion/react";

// Botón flotante fijo en todas las páginas — anillo de pulso continuo estilo
// "disponible ahora" para que destaque sobre el fondo arena sin depender de
// hover (la mayoría del tráfico es móvil). Respeta prefers-reduced-motion
// quitando el pulso pero deja el botón intacto.
export function WhatsAppButton() {
  const reduceMotion = useReducedMotion();

  return (
    <a
      href="https://wa.me/51937454282"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center sm:bottom-7 sm:right-7"
    >
      {!reduceMotion && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full bg-[#25d366]"
            animate={{ scale: [1, 1.8, 1.8], opacity: [0.55, 0, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-[#25d366]"
            animate={{ scale: [1, 1.8, 1.8], opacity: [0.55, 0, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 1.1 }}
          />
        </>
      )}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-cream shadow-lg shadow-ink/30 transition-transform group-hover:scale-105 group-active:scale-95">
        <WhatsAppIcon className="h-7 w-7" />
      </span>
    </a>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.6.1-1.4-.7-2.4-1.4-3.3-2.9-.2-.3-.1-.5.1-.7.2-.2.5-.6.7-.8.2-.2.2-.4.1-.6-.1-.2-.7-1.7-1-2.3-.2-.5-.5-.4-.7-.4-.2 0-.5 0-.7.2-.7.7-1 1.5-1 2.5.1 1.7 1 3.4 2.4 4.8 1.7 1.7 3.2 2.4 5 2.5.9 0 1.6-.2 2.2-.8.4-.4.7-1 .8-1.6.1-.3 0-.5-.3-.7z" />
      <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Z" strokeWidth="0" />
    </svg>
  );
}
