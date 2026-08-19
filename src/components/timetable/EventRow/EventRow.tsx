"use client";

import CalendarEventSheet from "@/components/sheets/CalendarEventSheet/CalendarEventSheet";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import type { CalendarEvent } from "@/features/timetable/types";
import styles from "@/app/page.module.css";

export default function EventRow({
  event,
  prominent = false,
}: {
  event: CalendarEvent;
  prominent?: boolean;
}) {
  const { openSheet } = useSheet();
  return (
    <button
      type="button"
      className={prominent ? styles.plannerEvent : styles.eventRow}
      onClick={() =>
        openSheet(
          <CalendarEventSheet event={event} onChanged={() => undefined} />,
        )
      }
    >
      <span className={styles.eventSymbol} aria-hidden="true">
        {event.symbol}
      </span>
      <div>
        <strong>{event.title}</strong>
        {event.notes ? <span>{event.notes}</span> : null}
      </div>
      <time>{displayDate(event)}</time>
    </button>
  );
}

function displayDate(event: CalendarEvent) {
  return new Date(
    event.date.year,
    event.date.month - 1,
    event.date.day,
  ).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
