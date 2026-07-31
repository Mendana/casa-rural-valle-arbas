import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useTranslations, type Lang } from "../../i18n/utils";

export interface DateRange {
  start: string;
  end: string | null;
}

interface Props {
  lang: Lang;
  selectable?: boolean;
  selectedRange?: DateRange | null;
  onSelectedRangeChange?: (range: DateRange | null) => void;
}

type Status = "idle" | "loading" | "ready" | "error";

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function buildWeekdayLabels(lang: Lang): string[] {
  const formatter = new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", {
    weekday: "short",
  });
  // El 5 de junio de 2023 fue lunes; usamos esa semana solo para leer las iniciales en orden.
  const monday = new Date(2023, 5, 5);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return formatter.format(day).replace(".", "");
  });
}

function buildMonthGrid(monthStart: Date): (Date | null)[] {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay() usa domingo=0; lo convertimos para que la semana empiece en lunes.
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function AvailabilityCalendar({
  lang,
  selectable = false,
  selectedRange = null,
  onSelectedRangeChange,
}: Props) {
  const t = useTranslations(lang);
  const apiKey = import.meta.env.PUBLIC_GOOGLE_CALENDAR_KEY;
  const calendarId = import.meta.env.PUBLIC_GOOGLE_CALENDAR_ID;
  const isConfigured = Boolean(apiKey && calendarId);

  const [status, setStatus] = useState<Status>(isConfigured ? "loading" : "idle");
  const [bookedDays, setBookedDays] = useState<Set<string>>(new Set());
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const gridRef = useRef<HTMLDivElement>(null);
  const isFirstMonthRender = useRef(true);

  useEffect(() => {
    if (isFirstMonthRender.current) {
      isFirstMonthRender.current = false;
      return;
    }
    if (!gridRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      gridRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
    );
  }, [visibleMonth]);

  useEffect(() => {
    if (!isConfigured) return;
    let cancelled = false;

    const timeMin = new Date();
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 180);

    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId!)}/events`,
    );
    url.searchParams.set("key", apiKey!);
    url.searchParams.set("timeMin", timeMin.toISOString());
    url.searchParams.set("timeMax", timeMax.toISOString());
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");
    url.searchParams.set("maxResults", "2500");

    fetch(url.toString())
      .then((res) => {
        if (!res.ok) throw new Error(`Google Calendar API error: ${res.status}`);
        return res.json();
      })
      .then((data: { items?: Array<{ start?: { date?: string; dateTime?: string }; end?: { date?: string; dateTime?: string } }> }) => {
        if (cancelled) return;
        const days = new Set<string>();
        for (const event of data.items ?? []) {
          const startStr = event.start?.date ?? event.start?.dateTime;
          const endStr = event.end?.date ?? event.end?.dateTime;
          if (!startStr || !endStr) continue;
          const cursor = new Date(startStr);
          const end = new Date(endStr);
          if (cursor.getTime() === end.getTime()) {
            days.add(toDateKey(cursor));
            continue;
          }
          // Los eventos de día completo de Google usan fecha de fin exclusiva.
          while (cursor < end) {
            days.add(toDateKey(cursor));
            cursor.setDate(cursor.getDate() + 1);
          }
        }
        setBookedDays(days);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [isConfigured, apiKey, calendarId]);

  const cells = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const weekdayLabels = useMemo(() => buildWeekdayLabels(lang), [lang]);
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", {
        month: "long",
        year: "numeric",
      }).format(visibleMonth),
    [visibleMonth, lang],
  );
  const dayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [lang],
  );

  const isCurrentMonth =
    visibleMonth.getFullYear() === today.getFullYear() &&
    visibleMonth.getMonth() === today.getMonth();

  function goToMonth(offset: number) {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  }

  function hasBookedDayBetween(startKey: string, endKey: string): boolean {
    const cursor = new Date(startKey);
    const end = new Date(endKey);
    while (cursor <= end) {
      if (bookedDays.has(toDateKey(cursor))) return true;
      cursor.setDate(cursor.getDate() + 1);
    }
    return false;
  }

  function handleDayClick(day: Date) {
    if (!selectable || !onSelectedRangeChange) return;
    const key = toDateKey(day);
    if (day < today || bookedDays.has(key)) return;

    // Sin selección: este clic es la entrada.
    if (!selectedRange) {
      onSelectedRangeChange({ start: key, end: null });
      return;
    }

    // Hay entrada pero falta la salida (patrón "entrada y luego salida").
    if (!selectedRange.end) {
      if (key === selectedRange.start) {
        onSelectedRangeChange(null);
        return;
      }
      const [rangeStart, rangeEnd] =
        key < selectedRange.start ? [key, selectedRange.start] : [selectedRange.start, key];
      if (hasBookedDayBetween(rangeStart, rangeEnd)) {
        onSelectedRangeChange({ start: key, end: null });
        return;
      }
      onSelectedRangeChange({ start: rangeStart, end: rangeEnd });
      return;
    }

    // Ya hay un rango completo.
    if (key === selectedRange.start || key === selectedRange.end) {
      onSelectedRangeChange(null);
      return;
    }

    const isInsideRange = key > selectedRange.start && key < selectedRange.end;
    if (isInsideRange) {
      // Clic dentro del rango actual: empieza una selección nueva desde ahí.
      onSelectedRangeChange({ start: key, end: null });
      return;
    }

    // Clic fuera del rango actual: lo extiende (soporta ir pulsando día a día).
    const rangeStart = key < selectedRange.start ? key : selectedRange.start;
    const rangeEnd = key > selectedRange.end ? key : selectedRange.end;
    if (hasBookedDayBetween(rangeStart, rangeEnd)) {
      onSelectedRangeChange({ start: key, end: null });
      return;
    }
    onSelectedRangeChange({ start: rangeStart, end: rangeEnd });
  }

  if (!isConfigured) {
    return (
      <div className="border border-line bg-bg2 px-6 py-16 text-center">
        <p className="text-sm uppercase tracking-widest text-muted md:text-base">
          {t("calendar.notConfigured")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          aria-label={t("calendar.prev.alt")}
          disabled={isCurrentMonth}
          onClick={() => goToMonth(-1)}
          className="flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-wood hover:text-wood focus-visible:border-wood focus-visible:text-wood disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink"
        >
          ‹
        </button>
        <span
          aria-live="polite"
          className="font-serif text-2xl font-light capitalize text-ink md:text-3xl xl:text-4xl"
        >
          {monthLabel}
        </span>
        <button
          type="button"
          aria-label={t("calendar.next.alt")}
          onClick={() => goToMonth(1)}
          className="flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-wood hover:text-wood focus-visible:border-wood focus-visible:text-wood"
        >
          ›
        </button>
      </div>

      {status === "error" ? (
        <p className="mt-8 text-center text-sm text-muted">{t("calendar.error")}</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-widest text-muted md:text-sm xl:text-base">
            {weekdayLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div ref={gridRef} className="mt-2 grid grid-cols-7 gap-1 xl:gap-2">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const key = toDateKey(day);
              const isPast = day < today;
              const isBooked = bookedDays.has(key);
              const isToday = key === toDateKey(today);
              const isEndpoint =
                Boolean(selectedRange) &&
                (key === selectedRange!.start || key === selectedRange!.end);
              const isInRange =
                Boolean(selectedRange?.end) &&
                key > selectedRange!.start &&
                key < (selectedRange!.end as string);

              const dayLabel = [
                dayFormatter.format(day),
                isBooked && t("calendar.legend.booked"),
                !isBooked && isEndpoint && selectedRange!.end
                  ? key === selectedRange!.start
                    ? t("calendar.selected.start")
                    : t("calendar.selected.end")
                  : !isBooked && isEndpoint
                    ? t("calendar.selected.start")
                    : null,
                isToday && t("calendar.today"),
              ]
                .filter(Boolean)
                .join(", ");

              const dayClass = [
                "flex h-10 items-center justify-center border text-sm md:h-12 md:text-base xl:h-16 xl:text-lg 2xl:h-20 2xl:text-xl",
                isPast
                  ? "border-transparent text-muted/40"
                  : isEndpoint
                    ? "border-wood bg-wood text-onwood"
                    : isInRange
                      ? "border-ink/20 bg-ink/8 text-ink"
                      : isBooked
                        ? "border-line bg-wood/10 text-muted line-through"
                        : "border-line text-ink",
                isToday && !isEndpoint ? "border-wood" : "",
                selectable && !isPast && !isBooked
                  ? "cursor-pointer transition-colors hover:border-wood focus-visible:border-wood"
                  : "",
              ].join(" ");

              if (selectable) {
                return (
                  <button
                    key={key}
                    type="button"
                    aria-label={dayLabel}
                    aria-pressed={isEndpoint}
                    disabled={isPast || isBooked}
                    onClick={() => handleDayClick(day!)}
                    className={dayClass}
                  >
                    {day.getDate()}
                  </button>
                );
              }

              return (
                <div key={key} className={dayClass}>
                  {day.getDate()}
                </div>
              );
            })}
          </div>
          <p aria-live="polite" className="mt-6 text-center text-sm text-muted">
            {status === "loading" ? t("calendar.loading") : " "}
          </p>
          <div className="flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-muted md:text-sm">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 border border-line" />
              {t("calendar.legend.available")}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 border border-line bg-wood/10" />
              {t("calendar.legend.booked")}
            </span>
            {selectable && (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 border border-wood bg-wood" />
                {t("calendar.legend.selected")}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
