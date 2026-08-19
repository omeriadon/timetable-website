"use client";

import { Button } from "@base-ui/react/button";
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import SubjectContextDrawer from "@/components/drawers/SubjectContextDrawer/SubjectContextDrawer";
import TimetableComparison from "@/components/timetable/TimetableComparison/TimetableComparison";
import Symbol from "@/components/controls/Symbol/Symbol";
import type { DashboardData } from "@/features/timetable/useDashboard";
import type { TimetableSubject } from "@/features/timetable/types";
import {
	TIMETABLE_DAYS,
	TIMETABLE_SESSIONS,
	currentTimetableDayIndex,
	periodLabel,
} from "@/features/timetable/layout";
import styles from "@/components/timetable/timetable.module.css";

export default function WeekView({
	subjects,
	friends,
}: {
	subjects: TimetableSubject[];
	friends: DashboardData["friends"];
}) {
	const [selectedSlot, setSelectedSlot] = useState<{
		day: number;
		session: number;
	} | null>(null);
	const currentDayIndex = currentTimetableDayIndex();
	const selectedSubject = selectedSlot
		? subjects.find((subject) =>
				subject.slots.some(
					(slot) =>
						slot.day === selectedSlot.day &&
						slot.session === selectedSlot.session,
				),
			)
		: null;

	return (
		<section className={styles.week} aria-label="Weekly timetable">
			<div className={styles.weekSurface}>
				<div className={styles.weekHeader}>
					<span aria-hidden="true"> </span>
					{TIMETABLE_DAYS.map((day, dayIndex) => (
						<span
							key={day}
							className={
								currentDayIndex === dayIndex
									? styles.currentDayHeader
									: undefined
							}
						>
							{day}
						</span>
					))}
				</div>
				<div className={styles.weekGrid}>
					{TIMETABLE_SESSIONS.map((session) => (
						<div key={session.value} className={styles.weekRow}>
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
										? styles.currentDayCell
										: undefined;
								if (!subject) {
									return <div key={day} className={currentDayClass} />;
								}
								const isSelected =
									selectedSlot?.day === dayIndex &&
									selectedSlot.session === session.value;
								return (
									<Popover key={day}>
										<PopoverTrigger
											render={
												<Button
													type="button"
													className={`${styles.lessonButton} ${currentDayClass ?? ""}`}
													aria-label={`Open ${subject.id} on ${day}`}
													onClick={() =>
														setSelectedSlot({
															day: dayIndex,
															session: session.value,
														})
													}
												/>
											}
										>
											<article
												className={
													isSelected
														? `${styles.lesson} ${styles.lessonSelected}`
														: styles.lesson
												}
												style={{ background: colour(subject) }}
											>
												<Symbol
													name={subject.symbol}
													className={styles.lessonSymbol}
												/>
												<strong>{subject.id}</strong>
											</article>
										</PopoverTrigger>
										<PopoverContent>
											<PopoverHeader>
												<PopoverTitle>{subject.id}</PopoverTitle>
											</PopoverHeader>
											<SubjectContextDrawer
												owner="You"
												subject={subject}
												day={day}
												session={session.value}
											/>
										</PopoverContent>
									</Popover>
								);
							})}
						</div>
					))}
				</div>
			</div>
			{selectedSlot && selectedSubject ? (
				<section className={styles.selectedLesson}>
					<div>
						<span className={styles.selectedEyebrow}>YOU</span>
						<strong>
							<Symbol
								name={selectedSubject.symbol}
								className={styles.selectedLessonSymbol}
							/>{" "}
							{selectedSubject.id}
						</strong>
					</div>
					<span>
						{TIMETABLE_DAYS[selectedSlot.day]} · period{" "}
						{periodLabel(selectedSlot.session)}
					</span>
				</section>
			) : null}
			<TimetableComparison selectedSlot={selectedSlot} friends={friends} />
		</section>
	);
}

function colour(subject: TimetableSubject) {
	const { r, g, b, a } = subject.colour;
	return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
}
