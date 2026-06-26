// Fotografías reales de Unsplash, verificadas una por una antes de usarse.
function unsplash(id: string, params = "w=1920&q=80") {
  return `https://images.unsplash.com/photo-${id}?${params}`;
}

// Solo se mantienen las fotos de cielo nocturno/observatorio — no son del
// hotel, pero ilustran la experiencia de astronomía sin pretender ser una
// foto real del lugar. Todo lo demás (jardín, cuartos, fachada) debe usar
// fotos reales de Apu Garden Lodge (ver lib/roomPhotos.ts) o no mostrar nada.
export const IMAGES = {
  observatory: unsplash("1634153851709-3be5a0c0f001"),
  starryMountains: unsplash("1419242902214-272b3f66ee7a"),
};
