"use client";

import { Input } from "@/components/ui/Input";
import { useState } from "react";
import type {
	OwnerTimetable,
	TimetableSlot,
	TimetableSubject,
} from "@/features/timetable/types";
import { apiRequest } from "@/lib/api/client";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import styles from "../Sheet/Sheet.module.css";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";
import ConfirmationSheet from "../ConfirmationSheet/ConfirmationSheet";

type CalendarImportSheetProps = {
	timetable: OwnerTimetable | null;
	onImported: (timetable: OwnerTimetable) => void;
};

type ParsedEvent = {
	title: string;
	day: number;
	startMinutes: number;
	location: string | null;
};

const periods = [
	{ session: 0, minutes: 8 * 60 + 50 },
	{ session: 1, minutes: 9 * 60 + 48 },
	{ session: 3, minutes: 11 * 60 + 8 },
	{ session: 4, minutes: 12 * 60 + 6 },
	{ session: 6, minutes: 13 * 60 + 34 },
	{ session: 7, minutes: 14 * 60 + 32 },
];

const colours = [
	{ r: 0.8, g: 0.05, b: 0.08, a: 1 },
	{ r: 0.3, g: 0.05, b: 0.65, a: 1 },
	{ r: 0.05, g: 0.55, b: 0.65, a: 1 },
	{ r: 0.45, g: 0.7, b: 0.05, a: 1 },
	{ r: 0.7, g: 0.25, b: 0.05, a: 1 },
];

export default function CalendarImportSheet({
	timetable,
	onImported,
}: CalendarImportSheetProps) {
	const { closeSheet, openSheet } = useSheet();
	const [fileName, setFileName] = useState<string | null>(null);
	const [events, setEvents] = useState<ParsedEvent[]>([]);
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
			const subjects = buildSubjects(events, timetable?.subjects ?? []);
			const updated = await apiRequest<OwnerTimetable>("v1/timetables/owner", {
				method: "PUT",
				body: JSON.stringify({
					subjects,
					expectedRevision: timetable?.revision ?? null,
					isSearchable: timetable?.isSearchable ?? true,
				}),
			});
			onImported(updated);
			closeSheet();
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
			openSheet(
				<ConfirmationSheet
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
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<SymbolIcon name="calendar" fallback="▦" />
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
						<SymbolIcon name="doc" fallback="＋" />
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
							{events.length} class events ready to import.
						</p>
					) : null}
				</div>
			</section>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<div className={styles.sheetActions}>
				<SheetActionButton
					label="Import timetable"
					onClick={() => void importCalendar()}
					disabled={!events.length || saving}
				>
					<SymbolIcon name="arrow.down.app" fallback="↓" />
					{saving ? "Importing…" : "Import timetable"}
				</SheetActionButton>
			</div>
		</div>
	);
}

function parseCalendar(text: string): ParsedEvent[] {
	const lines = text.replace(/\r\n[ \t]/g, "").split(/\r?\n/);
	const parsed: ParsedEvent[] = [];
	let current: Record<string, string> | null = null;
	for (const line of lines) {
		if (line === "BEGIN:VEVENT") {
			current = {};
			continue;
		}
		if (line === "END:VEVENT") {
			if (current) {
				const date = parseDate(current.DTSTART ?? "");
				const title = decodeText(current.SUMMARY ?? "").trim();
				if (date && title && date.day >= 0 && date.day < 5) {
					parsed.push({
						title,
						day: date.day,
						startMinutes: date.startMinutes,
						location: current.LOCATION ? decodeText(current.LOCATION) : null,
					});
				}
			}
			current = null;
			continue;
		}
		if (!current) continue;
		const separator = line.indexOf(":");
		if (separator < 1) continue;
		const key = line.slice(0, separator).split(";")[0];
		current[key] = line.slice(separator + 1);
	}
	return parsed;
}

function parseDate(value: string) {
	const raw = value.replace(/^.*:/, "");
	const match = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/.exec(raw);
	if (!match) return null;
	const [, year, month, day, hours = "00", minutes = "00"] = match;
	const date = new Date(
		Number(year),
		Number(month) - 1,
		Number(day),
		Number(hours),
		Number(minutes),
	);
	const weekday = date.getDay();
	return {
		day: weekday - 1,
		startMinutes: date.getHours() * 60 + date.getMinutes(),
	};
}

function decodeText(value: string) {
	return value
		.replace(/\\n/gi, " ")
		.replace(/\\,/g, ",")
		.replace(/\\;/g, ";")
		.replace(/\\\\/g, "\\");
}

function buildSubjects(events: ParsedEvent[], existing: TimetableSubject[]) {
	const subjects = new Map(
		existing.map((subject) => [
			subject.id.toLowerCase(),
			{ ...subject, slots: [] as TimetableSlot[] },
		]),
	);
	for (const event of events) {
		const session = periods.reduce((closest, period) =>
			Math.abs(period.minutes - event.startMinutes) <
			Math.abs(closest.minutes - event.startMinutes)
				? period
				: closest,
		).session;
		const key = event.title.toLowerCase();
		const subject = subjects.get(key) ?? {
			id: event.title,
			symbol: "character",
			colour: colours[subjects.size % colours.length],
			slots: [],
			classroom: { unknown: { rawLocation: event.location ?? "Not provided" } },
			teacher: { unknown: { rawNotes: "Teacher: Unknown" } },
		};
		if (
			!subject.slots.some(
				(slot) => slot.day === event.day && slot.session === session,
			)
		) {
			subject.slots.push({ day: event.day, session });
		}
		subjects.set(key, subject);
	}
	return [...subjects.values()].filter((subject) => subject.slots.length);
}
