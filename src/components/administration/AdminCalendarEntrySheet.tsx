"use client";

import { useState } from "react";
import type { AdminCalendarEntry } from "./AdminCalendarEditor";
import { apiRequest } from "@/lib/api/client";
import { useSheet } from "@/components/sheets/Sheet";
import styles from "@/components/sheets/Sheet.module.css";

export default function AdminCalendarEntrySheet({ entry, kind, onSaved }: { entry: AdminCalendarEntry | null; kind: string; onSaved: () => void }) {
	const { closeSheet } = useSheet();
	const [label, setLabel] = useState(entry?.label ?? "");
	const [startDate, setStartDate] = useState(toInput(entry?.startDate));
	const [endDate, setEndDate] = useState(toInput(entry?.endDate));
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const save = async () => {
		setSaving(true);
		setError(null);
		try {
			await apiRequest(`v1/administration/calendar${entry ? `/${entry.id}` : ""}`, { method: entry ? "PUT" : "POST", body: JSON.stringify({ kind, label: label.trim(), startDate: fromInput(startDate), endDate: endDate ? fromInput(endDate) : null }) });
			onSaved();
			closeSheet();
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
			await apiRequest(`v1/administration/calendar/${entry.id}`, { method: "DELETE" });
			onSaved();
			closeSheet();
		} catch (requestError) {
			setError((requestError as Error).message);
			setSaving(false);
		}
	};
	return <div className={styles.detailSheet}><header className={styles.detailHeader}><div><h2>{entry ? "Edit Entry" : "Add Entry"}</h2><p>{kind}</p></div></header><section className={styles.formCard}><label>Label<input value={label} onChange={(event) => setLabel(event.target.value)} /></label><label>Start date<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label><label>End date<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label><div className={styles.sheetActions}>{entry ? <button type="button" className={styles.destructiveButton} onClick={() => void remove()} disabled={saving}>Delete</button> : null}<button type="button" className={styles.primaryButton} onClick={() => void save()} disabled={saving || !label.trim() || !startDate}>{saving ? "Saving…" : "Save"}</button></div></section>{error ? <p className={styles.detailMuted} role="alert">{error}</p> : null}</div>;
}

function toInput(date?: { year: number; month: number; day: number } | null) {
	return date ? `${date.year.toString().padStart(4, "0")}-${date.month.toString().padStart(2, "0")}-${date.day.toString().padStart(2, "0")}` : "";
}

function fromInput(value: string) {
	const [year, month, day] = value.split("-").map(Number);
	return { year, month, day };
}
