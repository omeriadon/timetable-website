import type { TimetableSubject } from "@/features/timetable/types";
import { periodLabel } from "@/features/timetable/layout";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "../Drawer/Drawer.module.css";

export default function LessonDetailDrawer({
	subject,
	day,
	session,
}: {
	subject: TimetableSubject;
	day: string;
	session: number;
}) {
	return (
		<div class={styles.detailDrawer}>
			<header class={styles.detailHeader}>
				<div class={styles.detailSubjectSymbol}>
					<Symbol
						name={subject.symbol}
						class={styles.detailSubjectSymbolIcon}
					/>
				</div>
				<div>
					<h2>{subject.id}</h2>
					<p>
						{day}, period {periodLabel(session)}
					</p>
				</div>
			</header>
			<section class={styles.detailCard}>
				<div class={styles.detailRow}>
					<span>Classroom</span>
					<strong>Not provided</strong>
				</div>
				<div class={styles.detailRow}>
					<span>Teacher</span>
					<strong>Not provided</strong>
				</div>
			</section>
		</div>
	);
}
