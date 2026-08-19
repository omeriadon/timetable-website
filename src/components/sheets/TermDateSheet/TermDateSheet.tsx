"use client";

import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import styles from "@/components/sheets/Sheet/Sheet.module.css";

type TermDateSheetProps = {
	label: string;
	start: { year: number; month: number; day: number };
	end: { year: number; month: number; day: number };
};

export default function TermDateSheet({
	label,
	start,
	end,
}: TermDateSheetProps) {
	const { closeSheet } = useSheet();

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<div className={styles.detailSubjectSymbol}>
					<Symbol name="calendar.badge.clock" fallback="[]" />
				</div>
				<div>
					<h2>{label}</h2>
					<p>School term dates</p>
				</div>
			</header>
			<section className={styles.detailCard}>
				<div className={styles.detailRow}>
					<span>Starts</span>
					<strong>{formatDate(start)}</strong>
				</div>
				<div className={styles.detailRow}>
					<span>Ends</span>
					<strong>{formatDate(end)}</strong>
				</div>
			</section>
			<SheetActionButton label="Close term dates" onClick={closeSheet}>
				<Symbol name="xmark" fallback="x" />
				Close
			</SheetActionButton>
		</div>
	);
}

function formatDate(date: { year: number; month: number; day: number }) {
	return new Date(date.year, date.month - 1, date.day).toLocaleDateString(
		"en-AU",
		{
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	);
}
