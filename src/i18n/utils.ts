import es from "./es.json";
import en from "./en.json";

export const defaultLang = "es";

export const ui = { es, en } as const;

export type Lang = keyof typeof ui;

/** Astro.currentLocale ya tiene en cuenta `base`; esto solo aplica el fallback. */
export function getLang(currentLocale: string | undefined): Lang {
  return currentLocale && currentLocale in ui ? (currentLocale as Lang) : defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof es) {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
