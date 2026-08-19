"use client";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useState } from "react";
import type { CalendarEvent } from "@/features/timetable/types";
import { apiRequest } from "@/lib/api/client";
import { useSheet } from "../Sheet/Sheet";
import styles from "../Sheet/Sheet.module.css";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";

export default function CalendarEventSheet({
	event,
	onChanged,
}: {
	event: CalendarEvent;
	onChanged: (event: CalendarEvent | null) => void;
}) {
	const { closeSheet } = useSheet();
	const [title, setTitle] = useState(event.title);
	const [notes, setNotes] = useState(event.notes ?? "");
	const [saving, setSaving] = useState(false);
	const [status, setStatus] = useState<string | null>(null);

	const save = async () => {
		setSaving(true);
		setStatus(null);
		try {
			const endpoint = `v1/events/${event.isGlobal ? "global" : "private"}/${event.id}`;
			const updated = await apiRequest<{
				privateEvents?: CalendarEvent[];
				globalEvents?: CalendarEvent[];
			}>(endpoint, {
				method: "PUT",
				body: JSON.stringify({
					id: event.id,
					title: title.trim(),
					notes: notes.trim() || null,
					symbol: event.symbol,
					date: event.date,
					tagIDs: event.tagIDs ?? [],
					baseRevision: event.revision,
					showsWeather: event.showsWeather,
				}),
			});
			const replacement = [
				...(updated.globalEvents ?? []),
				...(updated.privateEvents ?? []),
			].find((candidate) => candidate.id === event.id) ?? {
				...event,
				title: title.trim(),
				notes: notes.trim() || undefined,
			};
			onChanged(replacement);
			closeSheet();
		} catch (error) {
			setStatus((error as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const remove = async () => {
		setSaving(true);
		try {
			await apiRequest(
				`v1/events/${event.isGlobal ? "global" : "private"}/${event.id}?baseRevision=${event.revision}`,
				{ method: "DELETE" },
			);
			onChanged(null);
			closeSheet();
		} catch (error) {
			setStatus((error as Error).message);
			setSaving(false);
		}
	};

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<div>
					<h2>{event.title}</h2>
					<p>
						{new Date(
							event.date.year,
							event.date.month - 1,
							event.date.day,
						).toLocaleDateString("en-AU", { dateStyle: "long" })}
					</p>
				</div>
			</header>
			<section className={styles.formCard}>
				<label>
					Title
					<Input
						value={title}
						onChange={(input) => setTitle(input.target.value)}
						maxLength={120}
					/>
				</label>
				<label>
					Notes
					<Textarea
						value={notes}
						onChange={(input) => setNotes(input.target.value)}
						rows={3}
						maxLength={2000}
					/>
				</label>
				<div className={styles.sheetActions}>
					<SheetActionButton
						label="Delete event"
						tone="destructive"
						onClick={() => void remove()}
						disabled={saving}
					>
						Delete
					</SheetActionButton>
					<SheetActionButton
						label="Save event"
						onClick={() => void save()}
						disabled={saving || !title.trim()}
					>
						{saving ? "Saving…" : "Save"}
					</SheetActionButton>
				</div>
			</section>
			{status ? (
				<p className={styles.detailMuted} role="alert">
					{status}
				</p>
			) : null}
		</div>
	);
}
