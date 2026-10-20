"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function RoomGallery({ photos, alt, rounded = true, priority = false, onExpand }: {
  photos: string[]; alt: string; rounded?: boolean; priority?: boolean; onExpand?: () => void;
}) {
  const t = useTranslations("rooms");
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;

  const photo = <Image key={index} src={photos[index]} alt={alt} fill priority={priority}
    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="animate-gallery-fade-in object-cover" />;

  return (
    <div className={`group relative aspect-[4/3] overflow-hidden ${rounded ? "rounded-2xl" : ""}`}>
      {onExpand ? (
        <button type="button" onClick={onExpand} aria-label={t("openGallery", { room: alt })}
          aria-haspopup="dialog" className="absolute inset-0 h-full w-full">{photo}</button>
      ) : photo}
      {photos.length > 1 && (
        <>
          <button type="button" onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)} aria-label={t("previousPhoto")}
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-xl text-cream transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">‹</button>
          <button type="button" onClick={() => setIndex((i) => (i + 1) % photos.length)} aria-label={t("nextPhoto")}
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-xl text-cream transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">›</button>
          <div className="absolute inset-x-0 bottom-2 flex justify-center">
            {photos.map((p, i) => (
              <button type="button" key={p} onClick={() => setIndex(i)} aria-label={t("photoNumber", { number: i + 1 })}
                aria-pressed={i === index} className="flex h-6 w-6 items-center justify-center">
                <span className={`h-1.5 rounded-full ${i === index ? "w-4 bg-cream" : "w-1.5 bg-cream/65"}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
