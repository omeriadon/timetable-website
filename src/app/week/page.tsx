"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useDashboard } from "@/features/timetable/useDashboard";
import WeekView from "@/components/timetable/WeekView/WeekView";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/timetable/timetable.module.css";

export default function WeekPage() {
	const pathname = usePathname();
	const setToolbar = useToolbar();
	const { data, error, isLoading } = useDashboard();

	useEffect(() => {
		setToolbar({ title: "Week" });
	}, [setToolbar]);

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
				<WeekView subjects={data.timetable.subjects} friends={data.friends} />
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
