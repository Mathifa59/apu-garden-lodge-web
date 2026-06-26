import type { RoomType } from "./api";

const COUNTS: Record<RoomType, number> = {
  individual: 2,
  doble: 8,
  doble_deluxe: 5,
  doble_deluxe_twin: 7,
  deluxe_extragrande: 5,
};

export function roomPhotos(type: RoomType): string[] {
  return Array.from({ length: COUNTS[type] }, (_, i) => `/rooms/${type}/${i + 1}.jpg`);
}
