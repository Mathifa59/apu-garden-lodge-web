// Pin exacto del lodge en Google Maps (confirmado por el dueño) — más preciso
// que buscar por la dirección en texto. Fuente única: lo consumen el JSON-LD
// del layout, el footer, la página de contacto (enlace + mapa embebido) y
// /links.
export const LODGE_LAT = -13.2897078;
export const LODGE_LNG = -72.112883;

export const LODGE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${LODGE_LAT},${LODGE_LNG}`;
