import type { TimetableSubject } from "@/features/timetable/types";
import { periodLabel } from "@/features/timetable/layout";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "../Drawer/Drawer.module.css";

export default function SubjectDetailDrawer({
	subject,
}: {
	subject: TimetableSubject;
}) {
	return (
		<div className={styles.detailDrawer}>
			<header className={styles.detailHeader}>
				<div className={styles.detailSubjectSymbol}>
					<Symbol
						name={subject.symbol}
						className={styles.detailSubjectSymbolIcon}
					/>
				</div>
				<div>
					<h2>{subject.id}</h2>
					<p>{subject.slots.length} classes each week</p>
				</div>
			</header>
			<section className={styles.detailCard}>
				<div className={styles.detailRow}>
					<span className={styles.detailRowLabel}>
						<Symbol name="door.left.hand.open" />
						Classroom
					</span>
					<strong>{classroomName(subject.classroom)}</strong>
				</div>
				<div className={styles.detailRow}>
					<span className={styles.detailRowLabel}>
						<Symbol name="person.fill" />
						Teacher
					</span>
					<strong>{teacherName(subject.teacher)}</strong>
				</div>
				{subject.slots.length ? (
					subject.slots.map((slot) => (
						<div
							key={`${slot.day}-${slot.session}`}
							className={styles.detailRow}
						>
							<span className={styles.detailRowLabel}>
								<Symbol name="calendar" />
								{dayName(slot.day)}
							</span>
							<strong>Period {periodLabel(slot.session)}</strong>
						</div>
					))
				) : (
					<p className={styles.detailMuted}>No scheduled classes.</p>
				)}
			</section>
		</div>
	);
}

function teacherName(teacher: TimetableSubject["teacher"]) {
	if (!teacher) return "Not provided";
	if (typeof teacher === "string") return teacher;
	if (teacher.displayName) return teacher.displayName;
	if (teacher.named) return `Teacher: ${teacher.named.lastName}`;
	return teacher.unknown?.rawNotes ?? "Not provided";
}

function classroomName(classroom: TimetableSubject["classroom"]) {
	if (!classroom) return "Not provided";
	if (typeof classroom === "string") return classroom;
	if (classroom.unknown) return classroom.unknown.rawLocation;
	if (classroom.room)
		return `${classroom.room.building} ${classroom.room.number}`;
	return "Not provided";
}

function dayName(day: number) {
	return (
		["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][day] ??
		`Day ${day}`
	);
}
