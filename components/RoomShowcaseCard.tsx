"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RoomGallery } from "./RoomGallery";
import { RoomDetailModal } from "./RoomDetailModal";
import type { RoomType } from "@/lib/api";
import { roomPhotos } from "@/lib/roomPhotos";

export function RoomShowcaseCard({ type, priority = false }: { type: RoomType; priority?: boolean }) {
  const t = useTranslations("rooms");
  const [open, setOpen] = useState(false);
  const photos = roomPhotos(type);
  const label = t(type + ".label");

  return (
    <>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-tan/20 bg-cream-soft">
        <RoomGallery photos={photos} alt={label} rounded={false} priority={priority} onExpand={() => setOpen(true)} />
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="font-display text-xl leading-snug text-sage-deep">{label}</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{t(type + ".description")}</p>
          <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className="text-link mt-5 self-start">
            {t("viewRoom")} <span aria-hidden="true">↗</span>
          </button>
        </div>
      </article>
      {open && <RoomDetailModal type={type} photos={photos} onClose={() => setOpen(false)} />}
    </>
  );
}
