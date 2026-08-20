"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useDashboard } from "@/features/timetable/useDashboard";
import type { CalendarEvent } from "@/features/timetable/types";
import TodayView from "@/components/timetable/TodayView/TodayView";
import Symbol from "@/components/controls/Symbol/Symbol";
import { Button } from "@base-ui/react/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import styles from "@/components/timetable/timetable.module.css";

const MODES = [
	{ href: "/today", label: "Today", icon: "calendar.day.timeline.left" },
	{ href: "/week", label: "Week", icon: "7.calendar" },
	{ href: "/planner", label: "Planner", icon: "pencil.and.list.clipboard" },
] as const;

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
	const current = MODES.find((mode) => mode.href === pathname);

	return (
		<Drawer>
			<DrawerTrigger
				render={
					<Button
						type="button"
						className={styles.modePickerTrigger}
						aria-label="Open timetable section picker"
					/>
				}
			>
				<Symbol
					name={current?.icon ?? "line.3.horizontal"}
					className={styles.modeIcon}
				/>
				{current?.label ?? "Timetable"}
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Timetable section</DrawerTitle>
				</DrawerHeader>
				<nav className={styles.modePicker} aria-label="Timetable section">
					{MODES.map((mode) => (
						<DrawerClose
							key={mode.href}
							nativeButton={false}
							render={
								<Link
									href={mode.href}
									className={
										pathname === mode.href ? styles.activeMode : undefined
									}
									aria-current={pathname === mode.href ? "page" : undefined}
								/>
							}
						>
							<Symbol name={mode.icon} className={styles.modeIcon} />
							{mode.label}
						</DrawerClose>
					))}
				</nav>
			</DrawerContent>
		</Drawer>
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
