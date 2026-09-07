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
		<div class={styles.detailDrawer}>
			<header class={styles.detailHeader}>
				<div class={styles.detailSubjectSymbol}>
					<Symbol name="calendar.badge.clock" fallback="[]" />
				</div>
				<div>
					<h2>{label}</h2>
					<p>School term dates</p>
				</div>
			</header>
			<section class={styles.detailCard}>
				<div class={styles.detailRow}>
					<span>Starts</span>
					<strong>{formatDate(start)}</strong>
				</div>
				<div class={styles.detailRow}>
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
