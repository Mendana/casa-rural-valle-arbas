# TODO antes de lanzar Casa Rural Valle de Arbas

## 1. Legal / cumplimiento (verificar con un gestor o abogado, esto no es asesoría legal)

- [x] **Aviso Legal**: página creada (`/aviso-legal`, `/en/legal-notice`), enlazada desde el footer. Sigue pendiente rellenar los datos reales entre corchetes (titular, NIF/CIF, nº de registro turístico) — ver el aviso al final de la propia página.
- [x] **Política de Privacidad**: página creada (`/politica-privacidad`, `/en/privacy-policy`), enlazada desde el footer junto al Aviso Legal. Explica qué datos se tratan (solo los que el usuario da por email/teléfono/WhatsApp, más el idioma en `localStorage`), la llamada a la API de Google Calendar y el hosting en GitHub Pages. Como el Aviso Legal, sigue pendiente revisarla con un profesional antes de publicar.
- [ ] **Política de Cookies**: hoy la web solo usa `localStorage` para recordar el idioma (no son cookies de terceros ni de tracking, así que probablemente no necesite banner de consentimiento). Si en algún momento añades Google Analytics, píxel de Meta, etc., **sí** necesitarás banner de consentimiento antes de cargarlos.
- [ ] **Número de registro de turismo rural** (Junta de Castilla y León): las casas rurales suelen estar obligadas a mostrar su número de registro turístico en cualquier publicidad/web. Revisa si la vuestra ya está registrada y añade el número en el footer o en el Aviso Legal.
- [x] **Condiciones de reserva y cancelación**: página creada (`/condiciones-reserva`, `/en/booking-terms`), enlazada desde el footer y desde el paso "Cancelación" de "Cómo funciona" en la página de reserva. Todo el contenido está basado en datos ya existentes en la web, salvo la forma de pago y las normas adicionales de la casa (fumar, ruido, vehículos...), que quedan como placeholders entre corchetes por confirmar.

## 2. Contenido con datos reales (ahora mismo son placeholders)

- [ ] Teléfono: `+34 600 000 000` → número real (también alimenta el botón de WhatsApp del footer/contacto, que se genera a partir del mismo valor).
- [ ] Email: `info@valledearbas.com` → confirmar si es el real.
- [ ] Dirección: `Calle Real, 12 · 24916 Valle de Arbas, León` → confirmar/corregir.
- [ ] Precios de la página de reserva (`book.info.*` en `src/i18n/es.json`/`en.json`): confirmar que las tarifas de fin de semana/semana/quincena y el extra de carga eléctrica siguen vigentes.
- [ ] Calendario de disponibilidad: configurar `PUBLIC_GOOGLE_CALENDAR_KEY` y `PUBLIC_GOOGLE_CALENDAR_ID` en el entorno de producción, y comprobar que:
  - la API key tiene restricción de referrer al **origen** del sitio (sin ruta, ver nota más abajo);
  - cada evento del calendario tiene visibilidad **Público**, no la de por defecto (si no, no aparece).
- [ ] Revisar que las distancias/duraciones/desniveles de las rutas de montaña sean correctas (son datos reales del terreno, no se pueden inventar).
- [ ] Aviso Legal (`legal.owner`, `legal.nif`, `legal.touristRegistry` en `src/i18n/es.json`/`en.json`): sustituir los placeholders entre corchetes por los datos reales del titular.
- [ ] Reseñas del home (`src/content/reviews/es/*.md`): ahora mismo hay 3 fichas de ejemplo con datos entre corchetes (autor, origen, texto) — sustitúyelas por reseñas reales de huéspedes antes de publicar, no dejar las de ejemplo.
- [ ] Condiciones de reserva (`bookingTerms.section.5.body` y `bookingTerms.section.7.body` en `src/i18n/es.json`/`en.json`): confirmar la forma de pago (¿señal/pago por adelantado?) y añadir cualquier norma adicional de la casa (fumar, ruido, nº máximo de vehículos...), ahora mismo entre corchetes.

## 3. Imágenes

- [ ] **Ahora mismo toda la web usa la misma foto** (`casa-rural.jpg`) repetida en la galería del hero, la ficha principal, los "highlights", la galería de interior, las rutas/actividades y la imagen de compartir en redes. Hacen falta fotos reales y distintas para:
  - Exterior de la casa (varios ángulos).
  - Interior: salón, cocina, dormitorios, baño, chimenea.
  - Cada una de las fotos de "La casa por dentro" (galería horizontal).
  - Cada ruta/actividad de la sección de rutas.
  - Idealmente, una foto "hero" pensada para compartir en redes (1200×630).
- [ ] Generar un set de iconos completo (favicon PNG en varios tamaños, apple-touch-icon, iconos Android) a partir del logo — ahora mismo solo existen `favicon.ico` y `favicon.svg`. Herramientas como [realfavicongenerator.net](https://realfavicongenerator.net) hacen esto a partir de tu logo en segundos.
- [x] ~~Sustituir `mapa-valle.svg` por un mapa real de la zona~~ — la sección de mapa (página de rutas) ahora usa un mapa interactivo real (OpenStreetMap embebido) más un botón "Cómo llegar" con indicaciones a Google Maps, en vez de la imagen estática. El SVG (`src/assets/images/mapa-valle.svg`) ya no se usa y se puede borrar cuando quieras.

## 4. Configuración técnica antes de publicar

- [ ] Variables de entorno en producción (GitHub Actions / secrets del repo): `PUBLIC_GOOGLE_CALENDAR_KEY`, `PUBLIC_GOOGLE_CALENDAR_ID`.
- [ ] Confirmar que el dominio final es `https://mendana.github.io/casa-rural-valle-arbas/` o, si vais a usar un dominio propio, actualizar `site`/`base` en `astro.config.mjs` y el `Sitemap` en `robots.txt`.

## 5. Después de publicar

- [ ] Dar de alta el sitio en Google Search Console y enviar el sitemap (`/sitemap-index.xml`).
- [ ] Probar cómo se ve el enlace al compartirlo en WhatsApp/Facebook/Twitter (que salga bien la imagen y el título).
- [ ] Probar el flujo completo en móvil real: cambio de idioma, calendario, precios, todos los enlaces.
- [ ] Si más adelante queréis medir visitas, mirar una opción respetuosa con la privacidad (Plausible, Fathom) para evitar tener que montar un banner de cookies solo por eso.

## 6. Opcional / posibles mejoras futuras

- [ ] Galería horizontal "fijada" (scroll-jacking) para la sección de interior — la comentamos y de momento se quedó fuera, decide si la quieres.
- [ ] Declaración de accesibilidad (no es obligatoria para un negocio privado, pero ya se ha hecho bastante trabajo de accesibilidad — foco visible consistente, `aria-current` en el menú, etiquetas en el selector de idioma, calendario con `aria-label`/`aria-live` — y podría ser un plus).
