"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useDashboard } from "@/features/timetable/useDashboard";
import { futureEventEndDate } from "@/features/timetable/eventRange";
import type { CalendarEvent } from "@/features/timetable/types";
import TodayView from "@/components/timetable/TodayView/TodayView";
import WeekView from "@/components/timetable/WeekView/WeekView";
import PlannerView from "@/components/timetable/PlannerView/PlannerView";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useTimetableNow } from "@/features/timetable/clock";
import styles from "./TimetableRoute.module.css";

export type TimetableMode = "today" | "week" | "planner";

const modes: Array<{
	id: TimetableMode;
	label: string;
	symbol: string;
	href: string;
}> = [
	{
		id: "today",
		label: "Today",
		symbol: "calendar.day.timeline.left",
		href: "/today",
	},
	{
		id: "week",
		label: "Week",
		symbol: "7.calendar",
		href: "/week",
	},
	{
		id: "planner",
		label: "Planner",
		symbol: "pencil.and.list.clipboard",
		href: "/planner",
	},
];

export default function TimetableRoute({ mode }: { mode: TimetableMode }) {
	const pathname = usePathname();
	const setToolbar = useToolbar();
	const { data, error, isLoading } = useDashboard();
	const now = useTimetableNow();

	useEffect(() => {
		setToolbar({ title: modeLabel(mode) });
	}, [mode, setToolbar]);

	const events = useMemo(() => {
		if (!data) {
			return [];
		}

		const start = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
		);
		const end = futureEventEndDate(data.settings.futureEventRange, start);

		return [...data.events.globalEvents, ...data.events.privateEvents]
			.filter((event) => {
				const date = new Date(
					event.date.year,
					event.date.month - 1,
					event.date.day,
				);
				return date >= start && date <= end;
			})
			.sort((left, right) => eventDate(left) - eventDate(right));
	}, [data, now]);

	return (
		<main className={styles.page}>
			<nav className={styles.modePicker} aria-label="Timetable section">
				{modes.map((item) => (
					<Link
						key={item.id}
						href={item.href}
						className={pathname === item.href ? styles.activeMode : undefined}
						aria-current={pathname === item.href ? "page" : undefined}
					>
						<Symbol name={item.symbol} className={styles.modeIcon} />
						{item.label}
					</Link>
				))}
			</nav>
			{isLoading ? (
				<p className={styles.message}>Loading your timetable…</p>
			) : null}
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			{data && mode === "today" ? (
				<TodayView
					events={events}
					subjects={data.timetable.subjects}
					grades={data.grades}
					schoolCalendar={data.schoolCalendar}
					schoolWeather={data.schoolWeather}
					canManageGlobalEvents={data.events.canManageGlobalEvents}
				/>
			) : null}
			{data && mode === "week" ? (
				<WeekView subjects={data.timetable.subjects} friends={data.friends} />
			) : null}
			{data && mode === "planner" ? (
				<PlannerView
					events={events}
					schoolCalendar={data.schoolCalendar}
					grades={data.grades}
					canManageGlobalEvents={data.events.canManageGlobalEvents}
					futureEventRange={data.settings.futureEventRange}
				/>
			) : null}
		</main>
	);
}

function modeLabel(mode: TimetableMode) {
	return mode.charAt(0).toUpperCase() + mode.slice(1);
}

function eventDate(event: CalendarEvent) {
	return new Date(
		event.date.year,
		event.date.month - 1,
		event.date.day,
	).getTime();
}
