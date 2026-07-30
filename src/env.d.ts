/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_CALENDAR_KEY?: string;
  readonly PUBLIC_GOOGLE_CALENDAR_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
