import { Button } from "@/components/ui/button";
import styles from "./page.module.css";
import { createEffect, createSignal } from "solid-js";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import TimetableEditorDrawer from "@/components/drawers/TimetableEditorDrawer/TimetableEditorDrawer";
import type { OwnerTimetable } from "@/features/timetable/types";
import { useDashboard } from "@/features/timetable/useDashboard";
import WeekTimetable from "@/components/timetable/WeekTimetable/WeekTimetable";
import Symbol from "@/components/controls/Symbol/Symbol";
import StaleIndicator from "@/components/controls/StaleIndicator/StaleIndicator";
import type { DashboardData } from "@/lib/server/dashboard.functions";
import { CACHE_KEYS } from "@/lib/cache/keys";
import { writeCacheEntry } from "@/lib/cache/storage";

export default function Timetable({ dashboard }: { dashboard: DashboardData }) {
	const { data, error, isLoading, isRevalidating, refresh } =
		useDashboard(dashboard);
	const [timetableOverride, setTimetableOverride] =
		createSignal<OwnerTimetable | null>(null);
	const timetable = () => timetableOverride() ?? data()?.timetable ?? null;
	const setToolbar = useToolbar();
	const { openDrawer } = useDrawer();

	createEffect(() => {
		setToolbar({});
	});

	const handleSaved = (updated: OwnerTimetable) => {
		setTimetableOverride(updated);
		// Write through to the shared dashboard cache so today/week/planner
		// show the edit instantly without waiting for a refetch.
		const current = data();
		if (current) {
			writeCacheEntry(
				CACHE_KEYS.dashboard,
				{ ...current, timetable: updated },
				current.account?.id ?? null,
			);
		}
		void refresh(true);
	};

	return (
		<main>
			<StaleIndicator active={!!timetable() && isRevalidating()} />
			{error() ? (
				<p class={styles.error} role="alert">
					{error()}
				</p>
			) : null}
			{timetable() ? (
				<>
					<div class={styles.actions}>
						<Button
							type="button"
							onClick={() =>
								openDrawer(() => (
									<TimetableEditorDrawer
										timetable={timetable()!}
										onSaved={handleSaved}
									/>
								))
							}
						>
							<Symbol name="pencil.and.list.clipboard" />
							Edit Timetable
						</Button>
					</div>
					<WeekTimetable subjects={timetable()!.subjects} />
				</>
			) : isLoading() ? (
				<p class={styles.message}>Loading timetable…</p>
			) : null}
		</main>
	);
}
