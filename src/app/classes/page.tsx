"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import styles from "@/components/IOSScreen/IOSScreen.module.css";
import { apiRequest } from "@/lib/api/client";
import type { OwnerTimetable } from "@/features/timetable/types";
import SheetTrigger from "@/components/sheets/SheetTrigger/SheetTrigger";
import SubjectDetailSheet from "@/components/sheets/SubjectDetailSheet/SubjectDetailSheet";
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
						<SheetTrigger
							key={subject.id}
							className={styles.rowButton}
							ariaLabel={`Open ${subject.id}`}
							content={<SubjectDetailSheet subject={subject} />}
						>
							<article className={styles.row}>
								<span
									className={styles.symbol}
									style={{
										color: `rgb(${Math.round(subject.colour.r * 255)} ${Math.round(subject.colour.g * 255)} ${Math.round(subject.colour.b * 255)})`,
									}}
								>
									<Symbol name={subject.symbol} className={styles.symbolIcon} />
								</span>
								<span>
									<b className={styles.label}>{subject.id}</b>
									<small
										style={{
											display: "block",
											color: "var(--theme-text-secondary)",
											marginTop: 4,
										}}
									>
										{subject.slots.length} class
										{subject.slots.length === 1 ? "" : "es"} each week
									</small>
								</span>
								<Symbol name="chevron.right" className={styles.chevronIcon} />
							</article>
						</SheetTrigger>
					))}
				</section>
			)}
		</main>
	);
}
