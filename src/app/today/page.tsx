"use client";

import { useEffect, useMemo } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useDashboard } from "@/features/timetable/useDashboard";
import { futureEventEndDate } from "@/features/timetable/eventRange";
import type { CalendarEvent } from "@/features/timetable/types";
import TodayView from "@/components/timetable/TodayView/TodayView";
import TimetableModeNavigation from "@/components/timetable/TimetableModeNavigation/TimetableModeNavigation";
import styles from "@/components/timetable/timetable.module.css";

export default function TodayPage() {
	const setToolbar = useToolbar();
	const { data, error, isLoading } = useDashboard();

	useEffect(() => {
		setToolbar({ title: "Today" });
	}, [setToolbar]);

	const events = useMemo(
		() => visibleEvents(data?.events, data?.settings.futureEventRange),
		[data],
	);

	return (
		<main className={styles.page}>
			<TimetableModeNavigation />
			{isLoading ? (
				<p className={styles.message}>Loading your timetable…</p>
			) : null}
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			{data ? (
				<TodayView
					events={events}
					subjects={data.timetable.subjects}
					grades={data.grades}
					schoolCalendar={data.schoolCalendar}
					schoolWeather={data.schoolWeather}
					canManageGlobalEvents={data.events.canManageGlobalEvents}
				/>
			) : null}
		</main>
	);
}

function visibleEvents(
	events:
		| {
				globalEvents: CalendarEvent[];
				privateEvents: CalendarEvent[];
			}
		| undefined,
	range: string | undefined,
) {
	if (!events) {
		return [];
	}

	const today = new Date();
	const start = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
	);
	const end = futureEventEndDate(range, start);

	return [...events.globalEvents, ...events.privateEvents]
		.filter((event) => {
			const date = new Date(
				event.date.year,
				event.date.month - 1,
				event.date.day,
			);
			return date >= start && date <= end;
		})
		.sort((left, right) => eventDate(left) - eventDate(right));
}

function eventDate(event: CalendarEvent) {
	return new Date(
		event.date.year,
		event.date.month - 1,
		event.date.day,
	).getTime();
}
