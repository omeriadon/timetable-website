import type { TimetableSubject } from "@/features/timetable/types";
import Symbol from "@/components/controls/Symbol/Symbol";
import {
	TIMETABLE_DAYS,
	TIMETABLE_SESSIONS,
	currentTimetableDayIndex,
} from "@/features/timetable/layout";
import weekStyles from "@/components/timetable/timetable.module.css";

export default function WeekTimetable({
	subjects,
}: {
	subjects: TimetableSubject[];
}) {
	const currentDayIndex = currentTimetableDayIndex();

	return (
		<section className={weekStyles.week} aria-label="Weekly timetable">
			<div className={weekStyles.weekSurface}>
				<div className={weekStyles.weekHeader}>
					<span aria-hidden="true"> </span>
					{TIMETABLE_DAYS.map((day, dayIndex) => (
						<span
							key={day}
							className={
								currentDayIndex === dayIndex
									? weekStyles.currentDayHeader
									: undefined
							}
						>
							{day}
						</span>
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
								const currentDayClass =
									currentDayIndex === dayIndex
										? weekStyles.currentDayCell
										: undefined;
								return subject ? (
									<article
										key={day}
										className={`${weekStyles.lesson} ${currentDayClass ?? ""}`}
									>
										<Symbol
											name={subject.symbol}
											className={weekStyles.lessonSymbol}
										/>
										<strong>{subject.id}</strong>
									</article>
								) : (
									<div key={day} className={currentDayClass} />
								);
							})}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
