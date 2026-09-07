import { Button } from "@/components/ui/button";
import styles from "./page.module.css";
import { createEffect, createSignal } from "solid-js";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import TimetableEditorDrawer from "@/components/drawers/TimetableEditorDrawer/TimetableEditorDrawer";
import type { OwnerTimetable } from "@/features/timetable/types";
import WeekTimetable from "@/components/timetable/WeekTimetable/WeekTimetable";
import Symbol from "@/components/controls/Symbol/Symbol";
import type { DashboardData } from "@/lib/server/dashboard.functions";

export default function Timetable({ dashboard }: { dashboard: DashboardData }) {
	const [timetable, setTimetable] = createSignal<OwnerTimetable | null>(
		dashboard.timetable,
	);
	const [error, setError] = createSignal<string | null>(null);
	const setToolbar = useToolbar();
	const { openDrawer } = useDrawer();

	createEffect(() => {
		setToolbar({ title: "Timetable" });
	});

	return (
		<main>
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
										onSaved={setTimetable}
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
			) : (
				<p class={styles.message}>Loading timetable…</p>
			)}
		</main>
	);
}
