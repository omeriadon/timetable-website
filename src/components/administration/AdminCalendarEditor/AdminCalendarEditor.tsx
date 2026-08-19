"use client";

import { useEffect, useState } from "react";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/IOSScreen/IOSScreen.module.css";
import AdminCalendarEntrySheet from "../AdminCalendarEntrySheet/AdminCalendarEntrySheet";

export type AdminCalendarEntry = {
	id: string;
	kind: string;
	label: string;
	startDate: { year: number; month: number; day: number };
	endDate?: { year: number; month: number; day: number } | null;
};

export default function AdminCalendarEditor({
	kind,
	title,
}: {
	kind: string;
	title: string;
}) {
	const { openSheet } = useSheet();
	const [entries, setEntries] = useState<AdminCalendarEntry[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const load = () =>
		apiRequest<AdminCalendarEntry[]>("v1/administration/calendar")
			.then((values) =>
				setEntries(values.filter((entry) => entry.kind === kind)),
			)
			.catch((requestError: Error) => setError(requestError.message));
	useEffect(() => {
		void load();
	}, [kind]);
	return (
		<main className={styles.page}>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			<section className={styles.card}>
				{entries?.map((entry) => (
					<button
						key={entry.id}
						type="button"
						className={styles.rowButton}
						onClick={() =>
							openSheet(
								<AdminCalendarEntrySheet
									entry={entry}
									kind={kind}
									onSaved={() => {
										void load();
									}}
								/>,
							)
						}
					>
						<div className={styles.row}>
							<SymbolIcon name="calendar.badge.clock" />
							<span>
								<b className={styles.label}>{entry.label}</b>
								<small className={styles.rowMeta}>
									{formatDate(entry.startDate)}
									{entry.endDate ? ` – ${formatDate(entry.endDate)}` : ""}
								</small>
							</span>
							<span className={styles.chevron}>›</span>
						</div>
					</button>
				))}
				<button
					type="button"
					className={styles.rowButton}
					onClick={() =>
						openSheet(
							<AdminCalendarEntrySheet
								entry={null}
								kind={kind}
								onSaved={() => {
									void load();
								}}
							/>,
						)
					}
				>
					<div className={styles.row}>
						<span className={styles.symbol}>＋</span>
						<span className={styles.label}>Add {title.replace(/s$/, "")}</span>
					</div>
				</button>
			</section>
			{!entries && !error ? (
				<p className={styles.loading}>Loading {title.toLowerCase()}…</p>
			) : null}
		</main>
	);
}

function formatDate(date: { year: number; month: number; day: number }) {
	return new Date(date.year, date.month - 1, date.day).toLocaleDateString(
		"en-AU",
		{ day: "numeric", month: "short", year: "numeric" },
	);
}
