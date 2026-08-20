"use client";

import { Button } from "@base-ui/react/button";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { apiRequest } from "@/lib/api/client";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import TimetableEditorDrawer from "@/components/drawers/TimetableEditorDrawer/TimetableEditorDrawer";
import type { OwnerTimetable } from "@/features/timetable/types";
import WeekTimetable from "@/components/timetable/WeekTimetable/WeekTimetable";
import Symbol from "@/components/controls/Symbol/Symbol";

export const dynamic = "force-dynamic";

export default function Timetable() {
	const [timetable, setTimetable] = useState<OwnerTimetable | null>(null);
	const [error, setError] = useState<string | null>(null);
	const setToolbar = useToolbar();
	const { openDrawer } = useDrawer();

	useEffect(() => {
		setToolbar({ title: "Timetable" });
		apiRequest<OwnerTimetable>("v1/timetables/owner")
			.then(setTimetable)
			.catch((requestError: Error) => setError(requestError.message));
	}, [setToolbar]);

	return (
		<main>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			{timetable ? (
				<>
					<div className={styles.actions}>
						<Button
							type="button"
							onClick={() =>
								openDrawer(
									<TimetableEditorDrawer
										timetable={timetable}
										onSaved={setTimetable}
									/>,
								)
							}
						>
							<Symbol name="pencil.and.list.clipboard" />
							Edit Timetable
						</Button>
					</div>
					<WeekTimetable subjects={timetable.subjects} />
				</>
			) : (
				<p className={styles.message}>Loading timetable…</p>
			)}
		</main>
	);
}
