import { createEffect } from "solid-js";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useDashboard } from "@/features/timetable/useDashboard";
import WeekView from "@/components/timetable/WeekView/WeekView";
import TimetableModeNavigation from "@/components/timetable/TimetableModeNavigation/TimetableModeNavigation";
import styles from "@/components/timetable/timetable.module.css";
import type { DashboardData } from "@/lib/server/dashboard.functions";

export default function WeekPage({ dashboard }: { dashboard: DashboardData }) {
	const setToolbar = useToolbar();
	const { data, error, isLoading } = useDashboard(dashboard);

	createEffect(() => {
		setToolbar({ title: "Week" });
	});

	return (
		<main class={styles.page}>
			<TimetableModeNavigation />
			{isLoading() ? (
				<p class={styles.message}>Loading your timetable…</p>
			) : null}
			{error() ? (
				<p class={styles.error} role="alert">
					{error()}
				</p>
			) : null}
			{data() ? (
				<WeekView
					subjects={data()!.timetable.subjects}
					friends={data()!.friends}
				/>
			) : null}
		</main>
	);
}
