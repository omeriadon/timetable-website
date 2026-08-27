"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { OwnerTimetable } from "@/features/timetable/types";
import {
	buildImportedSubjects,
	parseCalendar,
	type ParsedCalendarEvent,
} from "@/features/timetable/calendarImport";
import { apiRequest } from "@/lib/api/client";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "../Drawer/Drawer.module.css";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import ConfirmationDrawer from "../ConfirmationDrawer/ConfirmationDrawer";

type CalendarImportDrawerProps = {
	timetable: OwnerTimetable | null;
	onImported: (timetable: OwnerTimetable) => void;
};

export default function CalendarImportDrawer({
	timetable,
	onImported,
}: CalendarImportDrawerProps) {
	const { closeDrawer, openDrawer } = useDrawer();
	const [fileName, setFileName] = useState<string | null>(null);
	const [events, setEvents] = useState<ParsedCalendarEvent[]>([]);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const readFile = async (file: File) => {
		setFileName(file.name);
		setError(null);
		const parsed = parseCalendar(await file.text());
		setEvents(parsed);
		if (!parsed.length) {
			setError(
				"No Compass-style class events were found in that calendar file.",
			);
		}
	};

	const performImport = async (throwOnError = false) => {
		if (!events.length || saving) return;
		setSaving(true);
		setError(null);
		try {
			const subjects = buildImportedSubjects(events);
			const updated = await apiRequest<OwnerTimetable>("v1/timetables/owner", {
				method: "PUT",
				body: JSON.stringify({
					subjects,
					expectedRevision: timetable?.revision ?? null,
					isSearchable: timetable?.isSearchable ?? true,
				}),
			});
			onImported(updated);
			closeDrawer();
		} catch (requestError) {
			setError((requestError as Error).message);
			if (throwOnError) throw requestError;
		} finally {
			setSaving(false);
		}
	};

	const importCalendar = () => {
		if (!events.length || saving) return;
		if (timetable?.subjects.length) {
			openDrawer(
				<ConfirmationDrawer
					title="Import timetable again"
					message="This replaces your current timetable with the classes in the calendar file."
					confirmLabel="Replace timetable"
					onConfirm={() => performImport(true)}
				/>,
			);
			return;
		}
		void performImport();
	};

	return (
		<div className={styles.detailDrawer}>
			<header className={styles.detailHeader}>
				<Symbol name="calendar" fallback="▦" />
				<div>
					<h2>Re-import from Calendar</h2>
					<p>Choose an exported Compass Schedule .ics file.</p>
				</div>
			</header>
			<section className={styles.detailCard}>
				<div className={styles.importInstructions}>
					<p>
						Export the subscribed Compass calendar from Apple Calendar or
						another calendar app, then choose it here. Class times are matched
						to the six school periods from the SwiftUI client.
					</p>
					<label className={styles.filePicker}>
						<Symbol name="doc" fallback="＋" />
						<span>{fileName ?? "Choose calendar file"}</span>
						<Input
							type="file"
							accept=".ics,text/calendar"
							onChange={(event) => {
								const file = event.target.files?.[0];
								if (file) void readFile(file);
							}}
						/>
					</label>
					{events.length ? (
						<p className={styles.detailMuted}>
							{events.length} events from the next six weeks ready to import.
						</p>
					) : null}
				</div>
			</section>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<DrawerFooter>
				<Button
					aria-label="Import timetable"
					onClick={() => void importCalendar()}
					disabled={!events.length || saving}
				>
					<Symbol name="arrow.down.app" fallback="↓" />
					{saving ? "Importing…" : "Import timetable"}
				</Button>
			</DrawerFooter>
		</div>
	);
}
