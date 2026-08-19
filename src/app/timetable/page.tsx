"use client";

import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { apiRequest } from "@/lib/api/client";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import TimetableEditorSheet from "@/components/sheets/TimetableEditorSheet/TimetableEditorSheet";
import type { OwnerTimetable } from "@/features/timetable/types";
import WeekTimetable from "@/components/timetable/WeekTimetable/WeekTimetable";

export const dynamic = "force-dynamic";

export default function Timetable() {
	const [timetable, setTimetable] = useState<OwnerTimetable | null>(null);
	const [error, setError] = useState<string | null>(null);
	const setToolbar = useToolbar();
	const { openSheet } = useSheet();

	useEffect(() => {
		setToolbar({ title: "Timetable" });
		apiRequest<OwnerTimetable>("v1/timetables/owner")
			.then(setTimetable)
			.catch((requestError: Error) => setError(requestError.message));
	}, [setToolbar]);

	return (
		<main className={styles.contentPanel}>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			{timetable ? (
				<>
					<div className={styles.actions}>
						<button
							type="button"
							onClick={() =>
								openSheet(
									<TimetableEditorSheet
										timetable={timetable}
										onSaved={setTimetable}
									/>,
								)
							}
						>
							Edit Timetable
						</button>
					</div>
					<WeekTimetable subjects={timetable.subjects} />
				</>
			) : (
				<p className={styles.message}>Loading timetable…</p>
			)}
		</main>
	);
}
