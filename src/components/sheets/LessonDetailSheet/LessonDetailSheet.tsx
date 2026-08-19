import type { TimetableSubject } from "@/features/timetable/types";
import { periodLabel } from "@/features/timetable/layout";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "../Sheet/Sheet.module.css";

export default function LessonDetailSheet({
	subject,
	day,
	session,
}: {
	subject: TimetableSubject;
	day: string;
	session: number;
}) {
	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<div className={styles.detailSubjectSymbol}>
					<Symbol
						name={subject.symbol}
						className={styles.detailSubjectSymbolIcon}
					/>
				</div>
				<div>
					<h2>{subject.id}</h2>
					<p>
						{day}, period {periodLabel(session)}
					</p>
				</div>
			</header>
			<section className={styles.detailCard}>
				<div className={styles.detailRow}>
					<span>Classroom</span>
					<strong>Not provided</strong>
				</div>
				<div className={styles.detailRow}>
					<span>Teacher</span>
					<strong>Not provided</strong>
				</div>
			</section>
		</div>
	);
}
