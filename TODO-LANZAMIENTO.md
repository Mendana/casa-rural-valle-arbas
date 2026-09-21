# TODO antes de lanzar Casa Rural Valle de Arbas

## 1. Legal / cumplimiento (verificar con un gestor o abogado, esto no es asesoría legal)

- [ ] **Número de registro de turismo rural** (Junta de Castilla y León): las casas rurales suelen estar obligadas a mostrar su número de registro turístico en cualquier publicidad/web. Revisa si la vuestra ya está registrada y añade el número en el footer o en el Aviso Legal.

## 2. Contenido con datos reales (ahora mismo son placeholders)

- [ ] Aviso Legal (`legal.owner`, `legal.nif`, `legal.touristRegistry` en `src/i18n/es.json`/`en.json`): sustituir los placeholders entre corchetes por los datos reales del titular.
- [ ] Condiciones de reserva (`bookingTerms.section.5.body` y `bookingTerms.section.7.body` en `src/i18n/es.json`/`en.json`): confirmar la forma de pago (¿señal/pago por adelantado?) y añadir cualquier norma adicional de la casa (fumar, ruido, nº máximo de vehículos...), ahora mismo entre corchetes.

## 3. Configuración técnica antes de publicar

- [ ] Confirmar que el dominio final es `https://mendana.github.io/casa-rural-valle-arbas/` o, si vais a usar un dominio propio, actualizar `site`/`base` en `astro.config.mjs` y el `Sitemap` en `robots.txt`.

## 4. Después de publicar

- [ ] Dar de alta el sitio en Google Search Console y enviar el sitemap (`/sitemap-index.xml`).
- [ ] Probar cómo se ve el enlace al compartirlo en WhatsApp/Facebook/Twitter (que salga bien la imagen y el título).
- [ ] Probar el flujo completo en móvil real: cambio de idioma, calendario, precios, todos los enlaces.