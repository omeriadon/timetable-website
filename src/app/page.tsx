"use client";

import { Button } from "@/components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useDashboard } from "@/features/timetable/useDashboard";
import type { CalendarEvent } from "@/features/timetable/types";
import { useCompactLayout } from "@/lib/ui/useCompactLayout";
import TodayView from "@/components/timetable/TodayView/TodayView";
import WeekView from "@/components/timetable/WeekView/WeekView";
import PlannerView from "@/components/timetable/PlannerView/PlannerView";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "./page.module.css";

type TimetableMode = "today" | "week" | "planner";

const modes: Array<{ id: TimetableMode; label: string; symbol: string }> = [
	{ id: "today", label: "Today", symbol: "calendar.day.timeline.left" },
	{ id: "week", label: "Week", symbol: "7.calendar" },
	{ id: "planner", label: "Planner", symbol: "pencil.and.list.clipboard" },
];

export default function Home() {
	const [mode, setMode] = useState<TimetableMode>("today");
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data, error, isLoading } = useDashboard();
	const setToolbar = useToolbar();
	const isCompact = useCompactLayout();

	useEffect(() => {
		setToolbar({ title: "Timetable" });
	}, [setToolbar]);

	useEffect(() => {
		const requestedMode = searchParams.get("mode");
		if (
			requestedMode === "today" ||
			requestedMode === "week" ||
			requestedMode === "planner"
		) {
			setMode(requestedMode);
		}
	}, [searchParams]);

	const events = useMemo(() => {
		if (!data) return [];
		const today = new Date();
		const start = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
		);
		const end = new Date(start);
		end.setMonth(end.getMonth() + 2);
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
	}, [data]);

	return (
		<main className={styles.page}>
			{isCompact ? (
				<div className={styles.modePicker} aria-label="Timetable section">
					{modes.map((item) => (
						<Button
							unstyled
							key={item.id}
							type="button"
							className={mode === item.id ? styles.activeMode : ""}
							onClick={() => {
								setMode(item.id);
								router.replace(`/?mode=${item.id}`, { scroll: false });
							}}
						>
							<Symbol name={item.symbol} className={styles.modeIcon} />
							{item.label}
						</Button>
					))}
				</div>
			) : null}
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
				/>
			) : null}
			{data && mode === "week" ? (
				<WeekView subjects={data.timetable.subjects} friends={data.friends} />
			) : null}
			{data && mode === "planner" ? (
				<PlannerView events={events} schoolCalendar={data.schoolCalendar} />
			) : null}
		</main>
	);
}

function eventDate(event: CalendarEvent) {
	return new Date(
		event.date.year,
		event.date.month - 1,
		event.date.day,
	).getTime();
}
