"use client";

import { useEffect, useMemo, useState } from "react";

type DeliveryDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  countsByDate?: Record<string, number>;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseDate(value: string) {
  const parts = value.split("-");
  if (parts.length !== 3) {
    return null;
  }
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }
  return { year, month, day };
}

export function DeliveryDatePicker({
  value,
  onChange,
  countsByDate = {},
}: DeliveryDatePickerProps) {
  const [open, setOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const initial = parseDate(value) ?? {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);

  useEffect(() => {
    if (!open) {
      return;
    }
    const parsed = parseDate(value);
    if (parsed) {
      setMonth(parsed.month);
      setYear(parsed.year);
    }
  }, [open, value]);

  const { daysInMonth, startOffset, days } = useMemo(() => {
    const first = new Date(year, month - 1, 1);
    const totalDays = new Date(year, month, 0).getDate();
    const offset = first.getDay();
    const list = Array.from({ length: totalDays }, (_, index) => index + 1);
    return { daysInMonth: totalDays, startOffset: offset, days: list };
  }, [month, year]);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-11 w-full items-center justify-between rounded-2xl border border-[var(--stroke)] bg-[var(--panel-muted)] px-4 text-sm text-[var(--foreground)] transition focus:border-[var(--accent)]"
        onClick={() => setOpen(true)}
        disabled={open}
        aria-expanded={open}
      >
        <span>{value || "Select date"}</span>
        <span className="text-xs text-[var(--text-muted)]">
          {open ? "Close" : "Pick"}
        </span>
      </button>
      {open ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setOpen(false)}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="h-9 rounded-full border border-[var(--stroke)] px-3 text-xs text-[var(--text-muted)] transition hover:bg-[var(--panel-muted)]"
                onClick={() => {
                  if (month === 1) {
                    setMonth(12);
                    setYear((prev) => prev - 1);
                  } else {
                    setMonth((prev) => prev - 1);
                  }
                }}
              >
                Prev
              </button>
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {monthNames[month - 1]} {year}
              </div>
              <button
                type="button"
                className="h-9 rounded-full border border-[var(--stroke)] px-3 text-xs text-[var(--text-muted)] transition hover:bg-[var(--panel-muted)]"
                onClick={() => {
                  if (month === 12) {
                    setMonth(1);
                    setYear((prev) => prev + 1);
                  } else {
                    setMonth((prev) => prev + 1);
                  }
                }}
              >
                Next
              </button>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-2 text-xs text-[var(--text-muted)]">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center">
                  {day}
                </div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-2">
              {Array.from({ length: startOffset }).map((_, index) => (
                <div key={`spacer-${index}`} />
              ))}
              {days.map((day) => {
                const valueForDay = `${year}-${String(month).padStart(2, "0")}-${String(
                  day
                ).padStart(2, "0")}`;
                const count = countsByDate[valueForDay] ?? 0;
                const isSelected = value === valueForDay;
                return (
                  <button
                    key={day}
                    type="button"
                    className={`relative h-10 rounded-xl border text-sm transition ${
                      isSelected
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "border-[var(--stroke)] bg-[var(--panel-muted)] text-[var(--foreground)] hover:border-[var(--accent)]"
                    }`}
                    onClick={() => {
                      onChange(valueForDay);
                      setOpen(false);
                    }}
                  >
                    <span>{day}</span>
                    <span className="absolute right-1 top-1 rounded-full bg-[var(--accent)] px-1.5 text-[9px] font-semibold text-black">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Numbers show scheduled deliveries.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="h-9 rounded-full border border-[var(--stroke)] px-4 text-xs text-[var(--text-muted)] transition hover:bg-[var(--panel-muted)]"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setOpen(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
