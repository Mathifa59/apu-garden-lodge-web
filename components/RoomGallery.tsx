"use client";

import { useState } from "react";
import Image from "next/image";

export function RoomGallery({
  photos,
  alt,
  rounded = true,
  priority = false,
  onExpand,
}: {
  photos: string[];
  alt: string;
  rounded?: boolean;
  priority?: boolean;
  onExpand?: () => void;
}) {
  const [index, setIndex] = useState(0);

  if (photos.length === 0) return null;

  function step(delta: number, e: React.MouseEvent) {
    e.stopPropagation();
    setIndex((i) => (i + delta + photos.length) % photos.length);
  }

  return (
    <div>
      <div
        onClick={onExpand}
        className={`group relative aspect-[4/3] overflow-hidden ${rounded ? "rounded-[1.75rem]" : ""} ${
          onExpand ? "cursor-pointer" : ""
        }`}
      >
        <Image
          src={photos[index]}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-opacity"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => step(-1, e)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-ink/40 text-cream opacity-0 transition-opacity group-hover:opacity-100"
            >
              ‹
            </button>
            <button
              onClick={(e) => step(1, e)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-ink/40 text-cream opacity-0 transition-opacity group-hover:opacity-100"
            >
              ›
            </button>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {photos.map((p, i) => (
                <button
                  key={p}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  aria-label={`Photo ${i + 1}`}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    i === index ? "w-4 bg-cream" : "bg-cream/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
