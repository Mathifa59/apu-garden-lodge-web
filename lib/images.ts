// Fotografías reales de Unsplash, verificadas una por una antes de usarse.
function unsplash(id: string, params = "w=1920&q=80") {
  return `https://images.unsplash.com/photo-${id}?${params}`;
}

export const IMAGES = {
  heroMountains: unsplash("1469474968028-56623f02e42e"),
  observatory: unsplash("1634153851709-3be5a0c0f001"),
  starryMountains: unsplash("1419242902214-272b3f66ee7a"),
  cozyRoom: unsplash("1754597302822-4b96f3442d3f"),
  gardenPath: unsplash("1750762286053-28632f48e717"),
  snowCabin: unsplash("1716847214602-d6a7c4cebc85"),
};
