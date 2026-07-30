import es from "./es.json";
import en from "./en.json";

export const defaultLang = "es";

export const ui = { es, en } as const;

export type Lang = keyof typeof ui;
type Key = keyof typeof es;

/** Astro.currentLocale ya tiene en cuenta `base`; esto solo aplica el fallback. */
export function getLang(currentLocale: string | undefined): Lang {
  return currentLocale && currentLocale in ui ? (currentLocale as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t<K extends Key>(key: K): (typeof es)[K] {
    return (ui[lang] as typeof es)[key] ?? es[key];
  };
}

function normalizePath(path: string): string {
  const trimmed = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  return trimmed === "" ? "/" : trimmed;
}

/** Dado el pathname actual (con `base` y prefijo de idioma incluidos), calcula la
 * ruta localizada equivalente en `toLang` para el mismo "sitio" lógico (home/rutas/reserva). */
export function getAlternatePath(
  fromLang: Lang,
  toLang: Lang,
  pathname: string,
  base: string,
): string {
  const tFrom = useTranslations(fromLang);
  const tTo = useTranslations(toLang);

  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  let path = pathname.startsWith(cleanBase) ? pathname.slice(cleanBase.length) : pathname;
  path = path === "" ? "/" : path;

  if (fromLang !== defaultLang) {
    const localePrefix = `/${fromLang}`;
    if (path === localePrefix) path = "/";
    else if (path.startsWith(`${localePrefix}/`)) path = path.slice(localePrefix.length);
  }

  const stripped = normalizePath(path);

  const routeMap: [string, string][] = [
    [tFrom("path.home"), tTo("path.home")],
    [tFrom("path.routes"), tTo("path.routes")],
    [tFrom("path.book"), tTo("path.book")],
  ];

  const match = routeMap.find(([from]) => normalizePath(from) === stripped);
  return match ? match[1] : tTo("path.home");
}
