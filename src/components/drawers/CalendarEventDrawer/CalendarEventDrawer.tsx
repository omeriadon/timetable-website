"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { CalendarEvent } from "@/features/timetable/types";
import { apiRequest } from "@/lib/api/client";
import { useDrawer } from "../Drawer/Drawer";
import styles from "../Drawer/Drawer.module.css";
import { Button } from "@/components/ui/button";
import SettingToggle from "@/components/controls/SettingToggle/SettingToggle";
import Symbol from "@/components/controls/Symbol/Symbol";

export default function CalendarEventDrawer({
	event,
	onChanged,
	onClose,
	showHeader = true,
	readOnly = false,
}: {
	event: CalendarEvent;
	onChanged: (event: CalendarEvent | null) => void;
	onClose?: () => void;
	showHeader?: boolean;
	readOnly?: boolean;
}) {
	const { closeDrawer } = useDrawer();
	const dismiss = onClose ?? closeDrawer;
	const [title, setTitle] = useState(event.title);
	const [notes, setNotes] = useState(event.notes ?? "");
	const [symbol, setSymbol] = useState(event.symbol);
	const [date, setDate] = useState(() => dateValue(event));
	const [showsWeather, setShowsWeather] = useState(event.showsWeather);
	const [saving, setSaving] = useState(false);
	const [status, setStatus] = useState<string | null>(null);

	const save = async () => {
		const [year, month, day] = date.split("-").map(Number);
		if (!year || !month || !day) {
			setStatus("Choose a valid event date.");
			return;
		}
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
					symbol: symbol.trim() || "calendar",
					date: { year, month, day },
					tagIDs: event.tagIDs ?? [],
					baseRevision: event.revision,
					showsWeather: event.isGlobal && showsWeather,
				}),
			});
			const replacement = [
				...(updated.globalEvents ?? []),
				...(updated.privateEvents ?? []),
			].find((candidate) => candidate.id === event.id) ?? {
				...event,
				title: title.trim(),
				notes: notes.trim() || undefined,
				symbol: symbol.trim() || "calendar",
				date: { year, month, day },
				showsWeather: event.isGlobal && showsWeather,
			};
			onChanged(replacement);
			dismiss();
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
			dismiss();
		} catch (error) {
			setStatus((error as Error).message);
			setSaving(false);
		}
	};

	return (
		<div className={styles.detailDrawer}>
			{showHeader ? (
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
			) : null}
			<section className={styles.formCard}>
				<label>
					Title
					<Input
						value={title}
						onChange={(input) => setTitle(input.target.value)}
						maxLength={120}
						disabled={readOnly || saving}
					/>
				</label>
				<label>
					Notes
					<Textarea
						value={notes}
						onChange={(input) => setNotes(input.target.value)}
						rows={3}
						maxLength={2000}
						disabled={readOnly || saving}
					/>
				</label>
				<label>
					Symbol
					<Input
						value={symbol}
						onChange={(input) => setSymbol(input.target.value)}
						maxLength={120}
						disabled={readOnly || saving}
					/>
				</label>
				<label>
					Date
					<Input
						type="date"
						value={date}
						onChange={(input) => setDate(input.target.value)}
						disabled={readOnly || saving}
					/>
				</label>
				{event.isGlobal ? (
					<SettingToggle
						label="Show Weather"
						enabled={showsWeather}
						onClick={() => setShowsWeather((current) => !current)}
						disabled={readOnly || saving}
					/>
				) : null}
				{!readOnly ? (
					<div className={styles.drawerActions}>
						<Button
							aria-label="Delete event"
							onClick={() => void remove()}
							disabled={saving}
						>
							<Symbol name="trash" />
							Delete
						</Button>
						<Button
							aria-label="Save event"
							onClick={() => void save()}
							disabled={saving || !title.trim()}
						>
							<Symbol name="checkmark" />
							{saving ? "Saving…" : "Save"}
						</Button>
					</div>
				) : null}
			</section>
			{status ? (
				<p className={styles.detailMuted} role="alert">
					{status}
				</p>
			) : null}
		</div>
	);
}

function dateValue(event: CalendarEvent) {
	return `${event.date.year}-${String(event.date.month).padStart(2, "0")}-${String(event.date.day).padStart(2, "0")}`;
}
