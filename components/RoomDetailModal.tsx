"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import type { RoomType } from "@/lib/api";

export function RoomDetailModal({
  type,
  photos,
  priceLabel,
  onClose,
}: {
  type: RoomType;
  photos: string[];
  priceLabel?: string;
  onClose: () => void;
}) {
  const t = useTranslations("rooms");
  const [index, setIndex] = useState(0);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab") return;
      const buttons = panelRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
      if (!buttons?.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose]);

  const label = t(`${type}.label`);
  const description = t(`${type}.description`);
  const size = t.raw(`${type}.size`) as number;
  const bed = t(`${type}.bed`);
  const view = t.raw(`${type}.view`) as string[];
  const bathroom = t.raw(`${type}.bathroom`) as string[];
  const equipment = t.raw(`${type}.equipment`) as string[];
  const smokingPolicy = t(`${type}.smokingPolicy`);

  function step(delta: number) {
    setIndex((i) => (i + delta + photos.length) % photos.length);
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.18 }}
        onClick={onClose}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 p-4 sm:p-8"
      >
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.18 }}
          onClick={(e) => e.stopPropagation()}
          className="relative grid max-h-[calc(100svh-2rem)] w-full max-w-4xl overflow-y-auto rounded-2xl bg-cream-soft md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:overflow-hidden"
        >
          <button ref={closeRef} type="button" onClick={onClose} aria-label={t("closeGallery")}
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cream-soft text-xl text-ink shadow-sm hover:bg-cream-deep">×</button>
          <div className="relative flex min-w-0 flex-col bg-ink">
            <div className="relative aspect-[4/3]">
              <Image
                key={index}
                src={photos[index]}
                alt={label}
                fill
                sizes="(min-width: 640px) 60vw, 100vw"
                className="animate-gallery-fade-in object-cover"
              />
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => step(-1)}
                    aria-label={t("previousPhoto")}
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-lg text-cream transition hover:bg-ink/70"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => step(1)}
                    aria-label={t("nextPhoto")}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-lg text-cream transition hover:bg-ink/70"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {photos.map((p, i) => (
                  <button
                    key={p}
                    onClick={() => setIndex(i)}
                    aria-label={t("photoNumber", { number: i + 1 })}
                    aria-pressed={i === index}
                    className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg transition ${
                      i === index ? "ring-2 ring-honey" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={p} alt="" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col p-6 md:max-h-[80svh] md:overflow-y-auto md:p-8 md:pt-16">
            <h2 id={titleId} className="font-display text-2xl text-ink">{label}</h2>

            <div className="mt-3 flex flex-wrap gap-1.5">
              <Tag>{t("sizeLabel", { size })}</Tag>
              <Tag>{bed}</Tag>
              {view.map((v) => (
                <Tag key={v}>{v}</Tag>
              ))}
            </div>

            <p className="mt-4 text-sm text-ink-soft">{description}</p>
            {priceLabel && <p className="mt-4 font-display text-lg text-sage-deep">{priceLabel}</p>}

            <DetailSection heading={t("bathroomHeading")} items={bathroom} />
            <DetailSection heading={t("equipmentHeading")} items={equipment} />

            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-ink-soft/70">{smokingPolicy}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-sage-pale bg-sage-pale/40 px-2.5 py-1 text-[11px] font-medium text-sage-deep">
      {children}
    </span>
  );
}

function DetailSection({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="mt-6">
      <p className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft/70">{heading}</p>
      <ul className="mt-2.5 grid grid-cols-2 gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-1.5 text-sm text-ink-soft">
            <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sage" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
