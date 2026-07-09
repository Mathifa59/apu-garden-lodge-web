"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RoomGallery } from "./RoomGallery";
import { RoomDetailModal } from "./RoomDetailModal";
import type { RoomType } from "@/lib/api";
import { roomPhotos } from "@/lib/roomPhotos";

export function RoomShowcaseCard({
  type,
  priority = false,
}: {
  type: RoomType;
  priority?: boolean;
}) {
  const t = useTranslations("rooms");
  const [open, setOpen] = useState(false);
  const photos = roomPhotos(type);
  const label = t(`${type}.label`);
  const description = t(`${type}.description`);

  return (
    <>
      <div className="overflow-hidden rounded-[1.75rem] border border-sage-pale bg-cream-soft transition-shadow hover:shadow-lg hover:shadow-sage/10">
        <RoomGallery photos={photos} alt={label} rounded={false} priority={priority} onExpand={() => setOpen(true)} />
        <div className="p-7">
          <p className="font-display text-2xl text-sage-deep">{label}</p>
          <p className="mt-2 text-sm text-ink-soft">{description}</p>
        </div>
      </div>

      {open && <RoomDetailModal type={type} photos={photos} onClose={() => setOpen(false)} />}
    </>
  );
}
