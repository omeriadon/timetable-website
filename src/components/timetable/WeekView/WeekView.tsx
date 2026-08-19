"use client";

import { Button } from "@/components/ui/Button";
import { useState } from "react";
import SubjectContextSheet from "@/components/sheets/SubjectContextSheet/SubjectContextSheet";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import TimetableComparison from "@/components/timetable/TimetableComparison/TimetableComparison";
import Symbol from "@/components/controls/Symbol/Symbol";
import type { DashboardData } from "@/features/timetable/useDashboard";
import type { TimetableSubject } from "@/features/timetable/types";
import {
	TIMETABLE_DAYS,
	TIMETABLE_SESSIONS,
	periodLabel,
} from "@/features/timetable/layout";
import styles from "@/app/page.module.css";

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
	const { openSheet } = useSheet();
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
			<div className={styles.weekHeader}>
				{TIMETABLE_DAYS.map((day) => (
					<span key={day}>{day}</span>
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
							if (!subject) return <div key={day} />;
							const isSelected =
								selectedSlot?.day === dayIndex &&
								selectedSlot.session === session.value;
							return (
								<Button
									unstyled
									key={day}
									type="button"
									className={styles.lessonButton}
									aria-label={`Open ${subject.id} on ${day}`}
									onClick={() => {
										const slot = { day: dayIndex, session: session.value };
										setSelectedSlot(slot);
										openSheet(
											<SubjectContextSheet
												owner="You"
												subject={subject}
												day={day}
												session={session.value}
											/>,
										);
									}}
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
								</Button>
							);
						})}
					</div>
				))}
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
