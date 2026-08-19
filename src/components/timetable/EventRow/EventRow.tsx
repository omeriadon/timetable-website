"use client";

import { Button } from "@/components/ui/Button";
import CalendarEventSheet from "@/components/sheets/CalendarEventSheet/CalendarEventSheet";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import type { CalendarEvent } from "@/features/timetable/types";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/app/page.module.css";

export default function EventRow({
	event,
	prominent = false,
	showDate = true,
}: {
	event: CalendarEvent;
	prominent?: boolean;
	showDate?: boolean;
}) {
	const { openSheet } = useSheet();
	return (
		<Button
			unstyled
			type="button"
			className={prominent ? styles.plannerEvent : styles.eventRow}
			onClick={() =>
				openSheet(
					<CalendarEventSheet event={event} onChanged={() => undefined} />,
				)
			}
		>
			<span className={styles.eventSymbol} aria-hidden="true">
				<Symbol name={event.symbol} className={styles.eventSymbolIcon} />
			</span>
			<div>
				<strong>{event.title}</strong>
				{event.notes ? <span>{event.notes}</span> : null}
			</div>
			{showDate ? <time>{displayDate(event)}</time> : null}
		</Button>
	);
}

function displayDate(event: CalendarEvent) {
	return new Date(
		event.date.year,
		event.date.month - 1,
		event.date.day,
	).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
