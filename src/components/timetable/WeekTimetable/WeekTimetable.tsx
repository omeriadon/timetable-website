import type { TimetableSubject } from "@/features/timetable/types";
import Symbol from "@/components/controls/Symbol/Symbol";
import {
	TIMETABLE_DAYS,
	TIMETABLE_SESSIONS,
} from "@/features/timetable/layout";
import weekStyles from "@/app/page.module.css";

export default function WeekTimetable({
	subjects,
}: {
	subjects: TimetableSubject[];
}) {
	return (
		<section className={weekStyles.week} aria-label="Weekly timetable">
			<div className={weekStyles.weekSurface}>
				<div className={weekStyles.weekHeader}>
					<span aria-hidden="true"> </span>
					{TIMETABLE_DAYS.map((day) => (
						<span key={day}>{day}</span>
					))}
				</div>
				<div className={weekStyles.weekGrid}>
					{TIMETABLE_SESSIONS.map((session) => (
						<div key={session.value} className={weekStyles.weekRow}>
							<small>{session.label}</small>
							{TIMETABLE_DAYS.map((day, dayIndex) => {
								const subject = subjects.find((item) =>
									item.slots.some(
										(slot) =>
											slot.day === dayIndex && slot.session === session.value,
									),
								);
								return subject ? (
									<article
										key={day}
										className={weekStyles.lesson}
										style={{
											background: `rgb(${Math.round(subject.colour.r * 255)} ${Math.round(subject.colour.g * 255)} ${Math.round(subject.colour.b * 255)})`,
										}}
									>
										<Symbol
											name={subject.symbol}
											className={weekStyles.lessonSymbol}
										/>
										<strong>{subject.id}</strong>
									</article>
								) : (
									<div key={day} />
								);
							})}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
