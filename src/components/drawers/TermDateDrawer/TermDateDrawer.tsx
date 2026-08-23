"use client";

import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/drawers/Drawer/Drawer.module.css";

type TermDateDrawerProps = {
	label: string;
	start: { year: number; month: number; day: number };
	end: { year: number; month: number; day: number };
};

export default function TermDateDrawer({
	label,
	start,
	end,
}: TermDateDrawerProps) {
	return (
		<div className={styles.detailDrawer}>
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
