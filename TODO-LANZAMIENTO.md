# TODO antes de lanzar Casa Rural Valle de Arbas

## 1. Legal / cumplimiento (verificar con un gestor o abogado, esto no es asesoría legal)

- [ ] **Aviso Legal**: página obligatoria (LSSICE) con nombre/razón social, NIF/CIF, domicilio, email y teléfono de contacto. Ahora mismo la web no tiene ninguna.
- [ ] **Política de Privacidad**: obligatoria si se trata cualquier dato personal (aunque solo sea por email/teléfono de contacto, o por las llamadas a la API de Google Calendar).
- [ ] **Política de Cookies**: hoy la web solo usa `localStorage` para recordar el idioma (no son cookies de terceros ni de tracking, así que probablemente no necesite banner de consentimiento). Si en algún momento añades Google Analytics, píxel de Meta, etc., **sí** necesitarás banner de consentimiento antes de cargarlos.
- [ ] **Número de registro de turismo rural** (Junta de Castilla y León): las casas rurales suelen estar obligadas a mostrar su número de registro turístico en cualquier publicidad/web. Revisa si la vuestra ya está registrada y añade el número en el footer o en el Aviso Legal.
- [ ] **Condiciones de reserva y cancelación**: ya tenéis un resumen en "Cómo funciona" (devolución completa hasta 15 días antes, luego la mitad) — plantéate si conviene una página de condiciones más formal.

## 2. Contenido con datos reales (ahora mismo son placeholders)

- [ ] Teléfono: `+34 600 000 000` → número real.
- [ ] Email: `info@valledearbas.com` → confirmar si es el real.
- [ ] Dirección: `Calle Real, 12 · 24916 Valle de Arbas, León` → confirmar/corregir.
- [ ] Precios del simulador de reserva (`PUBLIC_PRICE_PER_NIGHT`, `PUBLIC_CLEANING_FEE`, `PUBLIC_WOOD_PRICE_PER_KG`) → variables de entorno reales.
- [ ] Calendario de disponibilidad: configurar `PUBLIC_GOOGLE_CALENDAR_KEY` y `PUBLIC_GOOGLE_CALENDAR_ID` en el entorno de producción, y comprobar que:
  - la API key tiene restricción de referrer al **origen** del sitio (sin ruta, ver nota más abajo);
  - cada evento del calendario tiene visibilidad **Público**, no la de por defecto (si no, no aparece).
- [ ] Revisar que las distancias/duraciones/desniveles de las rutas de montaña sean correctas (son datos reales del terreno, no se pueden inventar).

## 3. Imágenes

- [ ] **Ahora mismo toda la web usa la misma foto** (`casa-rural.jpg`) repetida en la galería del hero, la ficha principal, los "highlights", la galería de interior, las rutas/actividades y la imagen de compartir en redes. Hacen falta fotos reales y distintas para:
  - Exterior de la casa (varios ángulos).
  - Interior: salón, cocina, dormitorios, baño, chimenea.
  - Cada una de las fotos de "La casa por dentro" (galería horizontal).
  - Cada ruta/actividad de la sección de rutas.
  - Idealmente, una foto "hero" pensada para compartir en redes (1200×630).
- [ ] Generar un set de iconos completo (favicon PNG en varios tamaños, apple-touch-icon, iconos Android) a partir del logo — ahora mismo solo existen `favicon.ico` y `favicon.svg`. Herramientas como [realfavicongenerator.net](https://realfavicongenerator.net) hacen esto a partir de tu logo en segundos.
- [ ] Sustituir `mapa-valle.svg` por un mapa real de la zona si el actual es un placeholder.

## 4. Configuración técnica antes de publicar

- [ ] Variables de entorno en producción (GitHub Actions / secrets del repo): `PUBLIC_GOOGLE_CALENDAR_KEY`, `PUBLIC_GOOGLE_CALENDAR_ID`, `PUBLIC_PRICE_PER_NIGHT`, `PUBLIC_CLEANING_FEE`, `PUBLIC_WOOD_PRICE_PER_KG`.
- [ ] Confirmar que el dominio final es `https://mendana.github.io/casa-rural-valle-arbas/` o, si vais a usar un dominio propio, actualizar `site`/`base` en `astro.config.mjs` y el `Sitemap` en `robots.txt`.

## 5. Después de publicar

- [ ] Dar de alta el sitio en Google Search Console y enviar el sitemap (`/sitemap-index.xml`).
- [ ] Probar cómo se ve el enlace al compartirlo en WhatsApp/Facebook/Twitter (que salga bien la imagen y el título).
- [ ] Probar el flujo completo en móvil real: cambio de idioma, calendario, simulador de precio, todos los enlaces.
- [ ] Si más adelante queréis medir visitas, mirar una opción respetuosa con la privacidad (Plausible, Fathom) para evitar tener que montar un banner de cookies solo por eso.

## 6. Opcional / posibles mejoras futuras

- [ ] Galería horizontal "fijada" (scroll-jacking) para la sección de interior — la comentamos y de momento se quedó fuera, decide si la quieres.
- [ ] Declaración de accesibilidad (no es obligatoria para un negocio privado, pero ya se ha hecho bastante trabajo de accesibilidad y podría ser un plus).
