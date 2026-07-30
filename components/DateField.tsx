"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

// Reemplaza <input type="date"> — su selector nativo (el panel azul de dos
// columnas del sistema operativo) no se puede re-pintar con los colores de
// la marca. Mismo contrato externo (value/onChange con "YYYY-MM-DD") para no
// tocar la lógica de BookingWidget, solo el input cambia por este componente.
// A diferencia del DateTimeField del sistema de gestión, acá no hace falta
// hora — el sitio público solo pide fechas de llegada/salida.

function parseDate(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function stripTime(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function DateField({
  value,
  onChange,
  min,
  placeholder = "dd/mm/aaaa",
}: {
  value: string;
  onChange: (value: string) => void;
  // Fechas antes de este día quedan deshabilitadas en el calendario — mismo
  // uso que el atributo `min` del input nativo que reemplaza.
  min?: string;
  placeholder?: string;
}) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = parseDate(value);
  const minDate = min ? parseDate(min) : null;
  const [viewMonth, setViewMonth] = useState(() => selected ?? minDate ?? new Date());

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pickDay(date: Date) {
    onChange(formatValue(date));
    setOpen(false);
  }

  function isDisabled(date: Date): boolean {
    if (!minDate) return false;
    return stripTime(date) < stripTime(minDate);
  }

  // Intl en vez de un arreglo de nombres hardcodeado: el sitio es bilingüe
  // (es/en) y así el calendario respeta el idioma activo sin duplicar texto.
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  // 7 de enero de 2024 fue domingo — punto de partida para nombrar Do..Sa
  // (getDay() también usa 0 = domingo, misma convención).
  const weekdayLabels = Array.from({ length: 7 }, (_, i) => weekdayFormatter.format(new Date(2024, 0, 7 + i)));

  const startWeekday = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i - startWeekday + 1);
    return { date, inMonth: date.getMonth() === viewMonth.getMonth() };
  });
  const today = stripTime(new Date());

  const display = selected
    ? new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(selected)
    : placeholder;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between rounded-xl border border-sage-pale bg-cream px-3.5 py-2.5 text-left text-sm outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/25 ${
          selected ? "text-ink" : "text-ink-soft/60"
        }`}
      >
        <span>{display}</span>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-ink-soft"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
          <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-72 rounded-xl border border-sage-pale bg-cream-soft p-4 shadow-xl shadow-ink/10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              className="rounded-md p-1 text-ink-soft transition hover:bg-sage-pale/50 hover:text-sage-deep"
              aria-label="Mes anterior"
            >
              ‹
            </button>
            {/* Mayúscula solo en la primera letra (no la clase `capitalize`
                de Tailwind, que pondría mayúscula en CADA palabra — "Julio
                De 2026" en vez de "Julio de 2026"). */}
            <span className="font-display text-sm text-ink">{capitalizeFirst(monthFormatter.format(viewMonth))}</span>
            <button
              type="button"
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              className="rounded-md p-1 text-ink-soft transition hover:bg-sage-pale/50 hover:text-sage-deep"
              aria-label="Mes siguiente"
            >
              ›
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-wide text-ink-soft">
            {weekdayLabels.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map(({ date, inMonth }, i) => {
              const isSelected = selected !== null && isSameDay(date, selected);
              const isToday = isSameDay(date, today);
              const disabled = isDisabled(date);
              return (
                <button
                  type="button"
                  key={i}
                  disabled={disabled}
                  onClick={() => pickDay(date)}
                  className={`rounded-md py-1 text-xs transition ${
                    disabled
                      ? "cursor-not-allowed text-ink-soft/25"
                      : !inMonth
                        ? "text-ink-soft/30 hover:text-ink-soft/60"
                        : isSelected
                          ? "bg-terracotta font-semibold text-cream"
                          : isToday
                            ? "border border-terracotta/50 text-ink"
                            : "text-ink hover:bg-sage-pale/50"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
