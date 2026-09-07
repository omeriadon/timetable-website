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
		<section class={weekStyles.week} aria-label="Weekly timetable">
			<div class={weekStyles.weekSurface}>
				<div class={weekStyles.weekHeader}>
					<span aria-hidden="true"> </span>
					{TIMETABLE_DAYS.map((day, dayIndex) => (
						<span
							class={
								currentDayIndex === dayIndex
									? weekStyles.currentDayHeader
									: undefined
							}
						>
							{day}
						</span>
					))}
				</div>
				<div class={weekStyles.weekGrid}>
					{TIMETABLE_SESSIONS.map((session) => (
						<div class={weekStyles.weekRow}>
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
										class={`${weekStyles.lesson} ${currentDayClass ?? ""}`}
									>
										<Symbol
											name={subject.symbol}
											class={weekStyles.lessonSymbol}
										/>
										<strong>{subject.id}</strong>
									</article>
								) : (
									<div class={currentDayClass} />
								);
							})}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
