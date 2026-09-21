import { useState } from "react";
import AvailabilityCalendar from "./AvailabilityCalendar";
import { useTranslations, type Lang } from "../../i18n/utils";

interface Props {
  lang: Lang;
}

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  decreaseLabel: string;
  increaseLabel: string;
}

function NumberStepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  decreaseLabel,
  increaseLabel,
}: StepperProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label={decreaseLabel}
        onClick={() => onChange(Math.max(min, value - step))}
        className="flex h-8 w-8 items-center justify-center border border-line text-ink transition-colors hover:border-wood hover:text-wood focus-visible:border-wood focus-visible:text-wood"
      >
        −
      </button>
      <span
        aria-live="polite"
        className="w-8 text-center font-serif text-lg text-ink"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label={increaseLabel}
        onClick={() => onChange(Math.min(max, value + step))}
        className="flex h-8 w-8 items-center justify-center border border-line text-ink transition-colors hover:border-wood hover:text-wood focus-visible:border-wood focus-visible:text-wood"
      >
        +
      </button>
    </div>
  );
}

export default function BookingAvailability({ lang }: Props) {
  const t = useTranslations(lang);

  const pricePerNight = Number(import.meta.env.PUBLIC_PRICE_PER_NIGHT);
  const cleaningFee = Number(import.meta.env.PUBLIC_CLEANING_FEE);
  const woodPricePerKg = Number(import.meta.env.PUBLIC_WOOD_PRICE_PER_KG);
  const hasPrice = Number.isFinite(pricePerNight) && pricePerNight > 0;
  const hasCleaningFee = Number.isFinite(cleaningFee) && cleaningFee > 0;
  const hasWoodPrice = Number.isFinite(woodPricePerKg) && woodPricePerKg > 0;

  const [woodKg, setWoodKg] = useState(0);
  const woodTotal = hasWoodPrice ? woodKg * woodPricePerKg : 0;

  function formatPrice(value: number): string {
    return new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-US", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div className="flex flex-col gap-8 md:gap-12 lg:flex-row lg:items-start">
      <div className="lg:flex-1">
        <AvailabilityCalendar lang={lang} />
      </div>

      <div className="border border-line bg-bg2 px-6 py-8 md:px-10 md:py-12 lg:w-96 lg:shrink-0 xl:w-md 2xl:w-lg">
        <p className="text-xs uppercase tracking-widest text-muted md:text-sm">
          {t("book.info.eyebrow")}
        </p>
        <h2 className="mt-2 font-serif text-2xl font-light text-ink md:text-3xl">
          {t("book.info.title")}
        </h2>
        <p className="mt-1 text-sm text-muted">{t("book.info.disclaimer")}</p>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-sm md:text-base">
          {hasPrice && (
            <div className="flex items-center justify-between text-ink">
              <span>{t("book.info.lineHouse")}</span>
              <span>
                {formatPrice(pricePerNight)} / {t("book.info.night")}
              </span>
            </div>
          )}

          {hasCleaningFee && (
            <div className="flex items-center justify-between text-ink">
              <span>{t("book.info.lineCleaning")}</span>
              <span>{formatPrice(cleaningFee)}</span>
            </div>
          )}

          {hasWoodPrice && (
            <div className="flex items-center justify-between text-ink">
              <span>{t("book.info.lineWood")}</span>
              <div className="flex items-center gap-4">
                <span>{formatPrice(woodPricePerKg)} / kg</span>
                <NumberStepper
                  value={woodKg}
                  onChange={setWoodKg}
                  min={0}
                  max={50}
                  step={1}
                  decreaseLabel={t("book.info.decreaseWood")}
                  increaseLabel={t("book.info.increaseWood")}
                />
              </div>
            </div>
          )}

          {hasWoodPrice && woodKg > 0 && (
            <div className="flex items-center justify-between text-ink">
              <span>{t("book.info.woodTotal")}</span>
              <span>{formatPrice(woodTotal)}</span>
            </div>
          )}
        </div>

        <a
          href="#contacto"
          className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-wood transition-colors hover:text-wood/95 focus-visible:text-wood/95 md:text-base"
        >
          {t("book.info.goToContact")}
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
