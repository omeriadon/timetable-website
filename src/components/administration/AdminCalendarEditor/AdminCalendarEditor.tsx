import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/administration/Administration.module.css";
import AdminCalendarEntryDrawer from "../AdminCalendarEntryDrawer/AdminCalendarEntryDrawer";
import { List, ListRow } from "@/components/ui/list";

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
	const { openDrawer } = useDrawer();
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
			<List rowHover>
				{entries?.map((entry) => (
					<Button
						key={entry.id}
						type="button"
						className={styles.listButton}
						onClick={() =>
							openDrawer(
								<AdminCalendarEntryDrawer
									entry={entry}
									kind={kind}
									onSaved={() => {
										void load();
									}}
								/>,
							)
						}
					>
						<ListRow>
							<Symbol name="calendar.badge.clock" />
							<span>
								<b className={styles.label}>{entry.label}</b>
								<small className={styles.detail}>
									{formatDate(entry.startDate)}
									{entry.endDate ? ` – ${formatDate(entry.endDate)}` : ""}
								</small>
							</span>
							<Symbol name="chevron.right" />
						</ListRow>
					</Button>
				))}
				<Button
					type="button"
					className={styles.listButton}
					onClick={() =>
						openDrawer(
							<AdminCalendarEntryDrawer
								entry={null}
								kind={kind}
								onSaved={() => {
									void load();
								}}
							/>,
						)
					}
				>
					<ListRow>
						<Symbol name="plus" />
						<span className={styles.label}>Add {title.replace(/s$/, "")}</span>
					</ListRow>
				</Button>
			</List>
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
