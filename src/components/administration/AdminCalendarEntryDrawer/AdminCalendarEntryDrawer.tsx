"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { AdminCalendarEntry } from "../AdminCalendarEditor/AdminCalendarEditor";
import { apiRequest } from "@/lib/api/client";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import styles from "@/components/drawers/Drawer/Drawer.module.css";
import { Button } from "@/components/ui/button";

export default function AdminCalendarEntryDrawer({
	entry,
	kind,
	onSaved,
}: {
	entry: AdminCalendarEntry | null;
	kind: string;
	onSaved: () => void;
}) {
	const { closeDrawer } = useDrawer();
	const [label, setLabel] = useState(entry?.label ?? "");
	const [startDate, setStartDate] = useState(toInput(entry?.startDate));
	const [endDate, setEndDate] = useState(toInput(entry?.endDate));
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const save = async () => {
		setSaving(true);
		setError(null);
		try {
			await apiRequest(
				`v1/administration/calendar${entry ? `/${entry.id}` : ""}`,
				{
					method: entry ? "PUT" : "POST",
					body: JSON.stringify({
						kind,
						label: label.trim(),
						startDate: fromInput(startDate),
						endDate: endDate ? fromInput(endDate) : null,
					}),
				},
			);
			onSaved();
			closeDrawer();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};
	const remove = async () => {
		if (!entry) return;
		setSaving(true);
		try {
			await apiRequest(`v1/administration/calendar/${entry.id}`, {
				method: "DELETE",
			});
			onSaved();
			closeDrawer();
		} catch (requestError) {
			setError((requestError as Error).message);
			setSaving(false);
		}
	};
	return (
		<div className={styles.detailDrawer}>
			<header className={styles.detailHeader}>
				<div>
					<h2>{entry ? "Edit Entry" : "Add Entry"}</h2>
					<p>{kind}</p>
				</div>
			</header>
			<section className={styles.formCard}>
				<label>
					Label
					<Input
						value={label}
						onChange={(event) => setLabel(event.target.value)}
					/>
				</label>
				<label>
					Start date
					<Input
						type="date"
						value={startDate}
						onChange={(event) => setStartDate(event.target.value)}
					/>
				</label>
				<label>
					End date
					<Input
						type="date"
						value={endDate}
						onChange={(event) => setEndDate(event.target.value)}
					/>
				</label>
				<div className={styles.drawerActions}>
					{entry ? (
						<Button
							aria-label="Delete calendar entry"
							onClick={() => void remove()}
							disabled={saving}
						>
							Delete
						</Button>
					) : null}
					<Button
						aria-label="Save calendar entry"
						onClick={() => void save()}
						disabled={saving || !label.trim() || !startDate}
					>
						{saving ? "Saving…" : "Save"}
					</Button>
				</div>
			</section>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}

function toInput(date?: { year: number; month: number; day: number } | null) {
	return date
		? `${date.year.toString().padStart(4, "0")}-${date.month.toString().padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`
		: "";
}

function fromInput(value: string) {
	const [year, month, day] = value.split("-").map(Number);
	return { year, month, day };
}
