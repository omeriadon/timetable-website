"use client";

import { Button } from "@/components/ui/button";
import CalendarEventDrawer from "@/components/drawers/CalendarEventDrawer/CalendarEventDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import type { CalendarEvent } from "@/features/timetable/types";
import Symbol from "@/components/controls/Symbol/Symbol";
import { cn } from "@/lib/utils";
import styles from "@/components/timetable/timetable.module.css";

export default function EventRow({
	event,
	prominent = false,
	showDate = true,
	onChanged,
	readOnly = false,
}: {
	event: CalendarEvent;
	prominent?: boolean;
	showDate?: boolean;
	onChanged?: (event: CalendarEvent | null) => void;
	readOnly?: boolean;
}) {
	const { openDrawer } = useDrawer();
	const eventRowContent = (
		<>
			<span className={styles.eventSymbol} aria-hidden="true">
				<Symbol name={event.symbol} className={styles.eventSymbolIcon} />
			</span>
			<div>
				<strong>{event.title}</strong>
				{event.notes ? <span>{event.notes}</span> : null}
				{event.weather ? <span>{weatherSummary(event.weather)}</span> : null}
			</div>
			{showDate ? <time>{displayDate(event)}</time> : null}
		</>
	);

	return (
		<Button
			type="button"
			className={cn(
				styles.cardRow,
				prominent ? styles.plannerEvent : styles.eventRow,
			)}
			onClick={() =>
				openDrawer(
					<CalendarEventDrawer
						event={event}
						onChanged={onChanged ?? (() => undefined)}
						readOnly={readOnly}
					/>,
				)
			}
			aria-label={`Open ${event.title}`}
		>
			{eventRowContent}
		</Button>
	);
}

function weatherSummary(weather: NonNullable<CalendarEvent["weather"]>) {
	const condition = weather.conditionCode
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/^./, (character) => character.toUpperCase());

	return `${Math.round(weather.temperatureCelsius)}°C ${condition} · ${Math.round(weather.precipitationChance * 100)}% rain · UV ${weather.uvIndex}`;
}

function displayDate(event: CalendarEvent) {
	return new Date(
		event.date.year,
		event.date.month - 1,
		event.date.day,
	).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
