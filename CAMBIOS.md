# Cambios — sitio público (mejoras de UI/UX)

> Registro de la tanda de cambios pedida a partir de una lista de 9 puntos
> (con capturas) identificados por el dueño. Cubre commits `improve project
> v.16` y `v.17`, ya en `main` y desplegados.
>
> Última actualización: 2026-07-30.

---

## 1. Foto de la sección "Welcome" (Home) — muy grande y sin color de fondo

**Problema:** la foto se veía enorme y el fondo de la sección era casi plano.

**Causa:** el contenedor de la foto ocupaba el 50% de la columna del grid
(~500-550px de ancho en desktop) con `aspect-[4/5]`, lo que la llevaba a
**667px de alto** — más que el bloque de texto de al lado (280px) y casi
toda la sección quedaba ocupada por esa sola imagen.

**Solución:**
- `max-w-sm` (384px) en el contenedor de la foto: pone un techo al ancho
  real sin importar qué tan ancha sea la columna del grid. Alto resultante:
  **353×441px**.
- Nueva clase `.bg-fade-welcome` en `app/globals.css` — tres degradados
  radiales (tostado arriba-izq., salvia abajo-der., miel arriba-der.), más
  intensos que el `.bg-fade-clay` que se usaba antes.

**Archivos:** `app/[locale]/page.tsx`, `app/globals.css`.

**Verificación:** medido con `getBoundingClientRect()` antes/después (667px
→ 441px de alto); sección completa pasó de 885px a 640px en una pantalla de
900px de alto.

---

## 2. Link "What's New" / "Novedad" del nav — sin indicar que es contenido nuevo

**Solución:** punto pulsante (`animate-ping`, color `--color-honey`) junto
al texto del link, en el nav de escritorio y en el menú móvil.

**Archivos:** `components/Navbar.tsx`.

---

## 3. Hero de la página Novedad — no ocupaba toda la pantalla

**Causa:** `min-h-[95vh]` dejaba ver el borde de la siguiente sección antes
de hacer scroll (mismo patrón que ya se había corregido antes en el hero de
Home).

**Solución:** `min-h-screen`.

**Archivos:** `app/[locale]/novedad/page.tsx`.

**Verificación:** en 1365×625, alto del hero = 625px exactos, siguiente
sección arranca en `top: 625` (cero de por medio).

---

## 4. Hero de Contacto (y Servicios/Nosotros/Reservas) — cards pegadas al borde

**Causa:** las 4 páginas comparten el mismo `<header>` con
`pt-32 pb-20 sm:pt-40 sm:pb-28` — 400px fijos de alto **sin importar el alto
de la ventana**. En una ventana de 560px de alto eso dejaba solo 160px de
la siguiente sección visibles antes del scroll.

**Solución:** mismo padding reducido en las 4 páginas —
`pt-24 pb-14 sm:pt-28 sm:pb-16`.

**Archivos:** `app/[locale]/contacto/page.tsx`, `servicios/page.tsx`,
`nosotros/page.tsx`, `reservas/page.tsx`.

**Verificación:** header bajó de 400px a 304px (Contacto/Servicios/Reservas)
o 236px (Nosotros, que no tiene subtítulo); en ventana de 560px, la
siguiente sección pasó de 160px a 256px visibles.

---

## 5. Carrusel de fotos de cuartos — cambio de imagen abrupto

**Causa:** el `<Image src={photos[index]}>` cambiaba de `src` sin ninguna
transición (la clase `transition-opacity` estaba puesta pero nunca se
activaba, porque la opacidad nunca cambiaba de valor).

**Solución:** `key={index}` en el `<Image>` — fuerza a React a **remontar**
el elemento en cada cambio de foto, y un nuevo keyframe
`.animate-gallery-fade-in` (fade-in de 0.4s) se dispara desde cero en cada
remount.

**Archivos:** `app/globals.css`, `components/RoomGallery.tsx` (cards de
Servicios), `components/RoomDetailModal.tsx` (modal de detalle — mismo
patrón duplicado ahí, se corrigió también para que ambos se vean iguales).

---

## 6. Formulario de reservas — sin nombre, sin flujo claro, calendario nativo feo

Tres pedidos en uno, todos sobre `components/BookingWidget.tsx`:

### 6a. Campo de nombre
Se agregó un campo "Nombre completo" **arriba** de la fila de
fechas/huéspedes. No condiciona la búsqueda (los resultados siguen
apareciendo solo tras fechas + huéspedes + "Consultar", sin tocar esa
lógica) — se precarga en el formulario de solicitud de más abajo
(`RequestForm`, vía prop `initialName`) para no pedirlo dos veces.

### 6b. Flujo de resultados
Confirmado: ya se comportaba así (`search()` solo corre al presionar
"Consultar"); no hizo falta cambiar nada, solo verificar que el campo de
nombre nuevo no lo rompiera.

### 6c. Calendario propio
**Nuevo componente `components/DateField.tsx`** — reemplaza
`<input type="date">` (que abría el panel azul nativo del sistema
operativo) por un calendario propio con los colores de la marca. Mismo
contrato (`value`/`onChange` en formato `"YYYY-MM-DD"`) para no tocar la
lógica del widget. Usa `Intl.DateTimeFormat` para nombres de mes/día — el
sitio es bilingüe (es/en) y así el calendario respeta el idioma activo sin
duplicar texto en dos arreglos.

**Bug encontrado y corregido después del primer despliegue (commit
`v.17`):** el calendario se recortaba a la mitad — solo se veía una fila de
días en vez de las 6. Causa: `BookingWidget` vive dentro de secciones con
`overflow-hidden` (necesario para recortar el degradado de fondo de esas
secciones — ver `.bg-fade-sage`/`.bg-fade-honey` etc.), y el popover del
calendario, al ser hijo posicionado `absolute` dentro de esa sección,
quedaba cortado justo donde terminaba. Solución: el popover ahora se
renderiza vía **`createPortal` directo en `<body>`**, con su posición
calculada a mano (`getBoundingClientRect()` del botón + `scrollX`/`scrollY`)
en vez de depender del flujo normal del DOM — así ningún `overflow-hidden`
ancestro puede recortarlo. La detección de "clic afuera" se actualizó para
reconocer clics tanto en el botón como en el popover portado (antes ambos
eran el mismo árbol DOM; con el portal ya no).

**Verificación:** probado en las 3 páginas que usan `BookingWidget` (Home,
Reservas, Contacto) — las 42 celdas del calendario (6 filas) presentes y
visibles, selección de día funciona, cierre al hacer clic afuera funciona,
sin overflow horizontal en móvil (375px).

---

## 7. Badge repetido en cada hero de sección

**Causa:** Servicios, Nosotros, Reservas y Contacto repetían el nombre de
la página como un `<span className="pill pill-dark">` arriba del título
(y Novedad lo hacía como texto plano) — redundante, ya que el nav resaltado
y el `<h1>` ya lo dicen.

**Solución:** quitado de las 5 páginas.

---

## 8. Botón de WhatsApp — sin invitación a escribir

**Solución:** burbuja de texto ("¿Quieres pasarla increíble con nosotros?
Escríbenos" / "Want to have an amazing time with us? Message us") a la
izquierda del botón, con una animación de entrada retrasada (`1.1s`) para no
competir con la carga inicial de la página. Queda visible de forma
permanente (no depende de hover — la mayoría del tráfico es móvil).

**Bug propio encontrado al implementarlo:** al envolver el botón y la
burbuja en un nuevo `<div>` `fixed`, el `<a>` del botón perdió la clase
`relative` que necesitaba el anillo de pulso (`absolute inset-0`) para
quedar contenido dentro del círculo — sin eso, el anillo se habría estirado
sobre toda la fila (burbuja + botón). Corregido antes de dar el punto por
cerrado.

**Archivos:** `components/WhatsAppButton.tsx`, `app/globals.css` (keyframe
`whatsapp-greet-in`), `messages/es.json`, `messages/en.json` (nueva clave
`whatsapp.greeting`).

---

## 9. Scrollbar por defecto del sistema operativo

**Pregunta del dueño:** si era posible tener un scrollbar propio.

**Respuesta:** sí — `scrollbar-width: thin` + `scrollbar-color` (estándar,
Firefox y Chromium recientes) más el set clásico `::-webkit-scrollbar-*`
(Chrome/Safari más viejos), con el tostado de marca (`--color-tan`) como
pulgar. Aplicado globalmente en `app/globals.css` dentro de `@layer base`.

---

## Notas técnicas transversales

- **Bug de caché de Turbopack** encontrado dos veces en esta tanda: clases
  CSS nuevas (`.bg-fade-welcome`, y antes en la sesión del sistema de
  gestión) a veces no se recogen con el dev server ya corriendo — hay que
  borrar `.next/` y reiniciar. No es un problema del código, solo de
  desarrollo local.
- **`Intl.DateTimeFormat` + `capitalize` de Tailwind no combinan bien**: la
  clase `capitalize` pone mayúscula en cada palabra ("Julio De 2026"), no
  solo la primera. `DateField.tsx` capitaliza manualmente solo el primer
  carácter del string ya formateado.
- Todos los cambios se probaron con `npx tsc --noEmit` + `npm run build`
  limpios, y a mano en el navegador (desktop 1365×625/1440×900, móvil
  375×812) antes de darse por terminados.

## Estado

Todo en `main`, pusheado (`improve project v.16`, `v.17`). Sin pendientes
de esta tanda.
