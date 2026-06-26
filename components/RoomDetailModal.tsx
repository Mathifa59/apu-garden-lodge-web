"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 sm:p-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="grid max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[1.75rem] bg-cream sm:grid-cols-[1.3fr_1fr]"
        >
          <div className="relative flex flex-col bg-ink">
            <div className="relative aspect-[4/3]">
              <Image
                src={photos[index]}
                alt={label}
                fill
                sizes="(min-width: 640px) 60vw, 100vw"
                className="object-cover"
              />
              {photos.length > 1 && (
                <>
                  <button
                    onClick={() => step(-1)}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-lg text-cream transition hover:bg-ink/70"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => step(1)}
                    aria-label="Next photo"
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

          <div className="flex flex-col overflow-y-auto p-6 sm:p-8">
            <button
              onClick={onClose}
              aria-label="Close"
              className="ml-auto text-ink-soft transition hover:text-terracotta"
            >
              ✕
            </button>
            <p className="font-display text-2xl italic text-ink">{label}</p>

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
    </AnimatePresence>
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
