"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useDashboard } from "@/features/timetable/useDashboard";
import type { CalendarEvent } from "@/features/timetable/types";
import TodayView from "@/components/timetable/TodayView/TodayView";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/timetable/timetable.module.css";

export default function TodayPage() {
	const pathname = usePathname();
	const setToolbar = useToolbar();
	const { data, error, isLoading } = useDashboard();

	useEffect(() => {
		setToolbar({ title: "Today" });
	}, [setToolbar]);

	const events = useMemo(() => visibleEvents(data?.events), [data]);

	return (
		<main className={styles.page}>
			<TimetableModePicker pathname={pathname} />
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
				/>
			) : null}
		</main>
	);
}

function TimetableModePicker({ pathname }: { pathname: string }) {
	return (
		<nav className={styles.modePicker} aria-label="Timetable section">
			<Link
				href="/today"
				className={pathname === "/today" ? styles.activeMode : undefined}
				aria-current={pathname === "/today" ? "page" : undefined}
			>
				<Symbol name="calendar.day.timeline.left" className={styles.modeIcon} />
				Today
			</Link>
			<Link
				href="/week"
				className={pathname === "/week" ? styles.activeMode : undefined}
				aria-current={pathname === "/week" ? "page" : undefined}
			>
				<Symbol name="7.calendar" className={styles.modeIcon} />
				Week
			</Link>
			<Link
				href="/planner"
				className={pathname === "/planner" ? styles.activeMode : undefined}
				aria-current={pathname === "/planner" ? "page" : undefined}
			>
				<Symbol name="pencil.and.list.clipboard" className={styles.modeIcon} />
				Planner
			</Link>
		</nav>
	);
}

function visibleEvents(
	events:
		| {
				globalEvents: CalendarEvent[];
				privateEvents: CalendarEvent[];
		  }
		| undefined,
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
	const end = new Date(start);
	end.setMonth(end.getMonth() + 2);

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
