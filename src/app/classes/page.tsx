"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import styles from "./page.module.css";
import { apiRequest } from "@/lib/api/client";
import type { OwnerTimetable } from "@/features/timetable/types";
import DrawerTrigger from "@/components/drawers/DrawerTrigger/DrawerTrigger";
import SubjectDetailDrawer from "@/components/drawers/SubjectDetailDrawer/SubjectDetailDrawer";
import Symbol from "@/components/controls/Symbol/Symbol";

export default function ClassesPage() {
	const [timetable, setTimetable] = useState<OwnerTimetable | null>(null);
	const [error, setError] = useState<string | null>(null);
	const setToolbar = useToolbar();

	useEffect(() => {
		setToolbar({ title: "Classes" });
		apiRequest<OwnerTimetable>("v1/timetables/owner")
			.then(setTimetable)
			.catch((requestError: Error) => setError(requestError.message));
	}, [setToolbar]);

	return (
		<main className={styles.page}>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			{!timetable ? (
				<p className={styles.loading}>Loading classes…</p>
			) : (
				<section className={styles.card}>
					{timetable.subjects.map((subject) => (
						<DrawerTrigger
							key={subject.id}
							className={styles.rowButton}
							ariaLabel={`Open ${subject.id}`}
							content={<SubjectDetailDrawer subject={subject} />}
						>
							<article className={styles.row}>
								<span className={styles.symbol}>
									<Symbol name={subject.symbol} className={styles.symbolIcon} />
								</span>
								<span>
									<b className={styles.label}>{subject.id}</b>
									<small>
										{subject.slots.length} class
										{subject.slots.length === 1 ? "" : "es"} each week
									</small>
								</span>
								<Symbol name="chevron.right" className={styles.chevronIcon} />
							</article>
						</DrawerTrigger>
					))}
				</section>
			)}
		</main>
	);
}
