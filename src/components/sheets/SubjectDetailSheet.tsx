import type { TimetableSubject } from "@/features/timetable/types";
import styles from "./Sheet.module.css";

export default function SubjectDetailSheet({ subject }: { subject: TimetableSubject }) {
	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<div className={styles.detailSubjectSymbol}>{subject.symbol}</div>
				<div>
					<h2>{subject.id}</h2>
					<p>{subject.slots.length} classes each week</p>
				</div>
			</header>
			<section className={styles.detailCard}>
				{subject.slots.length ? subject.slots.map((slot) => (
					<div key={`${slot.day}-${slot.session}`} className={styles.detailRow}>
						<span>{dayName(slot.day)}</span>
						<strong>Period {slot.session}</strong>
					</div>
				)) : <p className={styles.detailMuted}>No scheduled classes.</p>}
			</section>
		</div>
	);
}

function dayName(day: number) {
	return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][day - 1] ?? `Day ${day}`;
}
