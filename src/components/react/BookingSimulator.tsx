import { useMemo, useState } from "react";
import AvailabilityCalendar, { type DateRange } from "./AvailabilityCalendar";
import { useTranslations, type Lang } from "../../i18n/utils";

interface Props {
  lang: Lang;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

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
      <span className="w-8 text-center font-serif text-lg text-ink">
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

export default function BookingSimulator({ lang }: Props) {
  const t = useTranslations(lang);

  const pricePerNight = Number(import.meta.env.PUBLIC_PRICE_PER_NIGHT);
  const cleaningFee = Number(import.meta.env.PUBLIC_CLEANING_FEE);
  const woodPricePerKg = Number(import.meta.env.PUBLIC_WOOD_PRICE_PER_KG);
  const hasPrice = Number.isFinite(pricePerNight) && pricePerNight > 0;
  const hasCleaningFee = Number.isFinite(cleaningFee) && cleaningFee > 0;
  const hasWoodPrice = Number.isFinite(woodPricePerKg) && woodPricePerKg > 0;

  const [range, setRange] = useState<DateRange | null>(null);
  const [guests, setGuests] = useState(2);
  const [woodKg, setWoodKg] = useState(0);

  const nights = useMemo(() => {
    if (!range?.end) return 0;
    const start = new Date(range.start);
    const end = new Date(range.end);
    return Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
  }, [range]);

  const total =
    nights * pricePerNight +
    (hasCleaningFee && nights > 0 ? cleaningFee : 0) +
    (hasWoodPrice ? woodKg * woodPricePerKg : 0);

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
        <AvailabilityCalendar
          lang={lang}
          selectable
          selectedRange={range}
          onSelectedRangeChange={setRange}
        />
      </div>

      <div className="border border-line bg-bg2 px-6 py-8 md:px-10 md:py-12 lg:w-96 lg:shrink-0 xl:w-md 2xl:w-lg">
        <p className="text-xs uppercase tracking-widest text-muted md:text-sm">
          {t("book.simulator.eyebrow")}
        </p>
        <h2 className="mt-2 font-serif text-2xl font-light text-ink md:text-3xl">
          {t("book.simulator.chooseDates")}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {t("book.simulator.disclaimer")}
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-sm md:text-base">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-muted md:text-sm">
              {t("book.simulator.guests")}
            </span>
            <NumberStepper
              value={guests}
              onChange={setGuests}
              min={1}
              max={10}
              decreaseLabel={t("book.simulator.decreaseGuests")}
              increaseLabel={t("book.simulator.increaseGuests")}
            />
          </div>

          {hasPrice && (
            <div className="flex items-center justify-between text-ink">
              <span>{t("book.simulator.lineHouse")}</span>
              <span>
                {formatPrice(pricePerNight)} / {t("book.simulator.night")}
              </span>
            </div>
          )}

          {hasCleaningFee && (
            <div className="flex items-center justify-between text-ink">
              <span>{t("book.simulator.lineCleaning")}</span>
              <span>{formatPrice(cleaningFee)}</span>
            </div>
          )}

          {hasWoodPrice && (
            <div className="flex items-center justify-between text-ink">
              <span>{t("book.simulator.lineWood")}</span>
              <div className="flex items-center gap-4">
                <span>{formatPrice(woodPricePerKg)} / kg</span>
                <NumberStepper
                  value={woodKg}
                  onChange={setWoodKg}
                  min={0}
                  max={50}
                  step={1}
                  decreaseLabel={t("book.simulator.decreaseWood")}
                  increaseLabel={t("book.simulator.increaseWood")}
                />
              </div>
            </div>
          )}
        </div>

        {hasPrice && (
          <div className="mt-6 border-t border-line pt-6">
            {nights > 0 && (
              <p className="text-sm text-muted">
                {nights}{" "}
                {nights === 1
                  ? t("book.simulator.night")
                  : t("book.simulator.nights")}
              </p>
            )}
            <div className="mt-1 flex items-center justify-between font-serif text-2xl text-ink md:text-3xl">
              <span>{t("book.simulator.total")}</span>
              <span>{nights > 0 ? formatPrice(total) : "—"}</span>
            </div>
            {nights === 0 && (
              <p className="mt-2 text-sm text-muted">
                {t("book.simulator.selectDates")}
              </p>
            )}
          </div>
        )}

        <a
          href="#contacto"
          className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest text-wood transition-colors hover:text-wood/80 focus-visible:text-wood/80 md:text-base"
        >
          {t("book.simulator.goToContact")}
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
