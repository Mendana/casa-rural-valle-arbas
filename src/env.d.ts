/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_CALENDAR_KEY?: string;
  readonly PUBLIC_GOOGLE_CALENDAR_ID?: string;
  readonly PUBLIC_PRICE_PER_NIGHT?: string;
  readonly PUBLIC_CLEANING_FEE?: string;
  readonly PUBLIC_WOOD_PRICE_PER_KG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
