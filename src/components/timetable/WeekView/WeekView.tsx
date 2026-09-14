import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@/components/ui/popover";
import { createMemo, createSignal } from "solid-js";
import SubjectContextDrawer from "@/components/drawers/SubjectContextDrawer/SubjectContextDrawer";
import TimetableComparison from "@/components/timetable/TimetableComparison/TimetableComparison";
import { useTimetableNow } from "@/features/timetable/clock";
import Symbol from "@/components/controls/Symbol/Symbol";
import type { DashboardData } from "@/features/timetable/useDashboard";
import type { TimetableSubject } from "@/features/timetable/types";
import {
	TIMETABLE_DAYS,
	TIMETABLE_SESSIONS,
	currentTimetableDayIndex,
	periodLabel,
} from "@/features/timetable/layout";
import styles from "./WeekView.module.css";

export default function WeekView({
	subjects,
	friends,
}: {
	subjects: TimetableSubject[];
	friends: DashboardData["friends"];
}) {
	const [selectedSlot, setSelectedSlot] = createSignal<{
		day: number;
		session: number;
	} | null>(null);
	const currentDayIndex = currentTimetableDayIndex(useTimetableNow()());
	const selectedSubject = createMemo(() => {
		const selected = selectedSlot();
		return selected
			? subjects.find((subject) =>
					subject.slots.some(
						(candidate) =>
							candidate.day === selected.day &&
							candidate.session === selected.session,
					),
				)
			: null;
	});

	return (
		<section class={styles.week} aria-label="Weekly timetable">
			<div class={styles.weekSurface}>
				<div class={styles.weekHeader}>
					<span aria-hidden="true"> </span>
					{TIMETABLE_DAYS.map((day, dayIndex) => (
						<span
							class={
								currentDayIndex === dayIndex
									? styles.currentDayHeader
									: undefined
							}
						>
							{day}
						</span>
					))}
				</div>
				<div class={styles.weekGrid}>
					{TIMETABLE_SESSIONS.map((session) => (
						<div class={styles.weekRow}>
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
									return <div class={currentDayClass} />;
								}
								const isSelected =
									selectedSlot()?.day === dayIndex &&
									selectedSlot()!.session === session.value;
								return (
									<Popover>
										<PopoverTrigger
											as={Button}
											type="button"
											class={`${styles.lessonButton} ${currentDayClass ?? ""}`}
											aria-label={`Open ${subject.id} on ${day}`}
											onClick={() =>
												setSelectedSlot({
													day: dayIndex,
													session: session.value,
												})
											}
										>
											<article
												class={
													isSelected
														? `${styles.lesson} ${styles.lessonSelected}`
														: styles.lesson
												}
												style={{
													"background-color": subjectColour(subject),
													color: subjectTextColour(subject),
												}}
											>
												<Symbol
													name={subject.symbol}
													class={styles.lessonSymbol}
												/>
												<strong>{subject.id}</strong>
											</article>
										</PopoverTrigger>
										<PopoverContent>
											<PopoverHeader>
												<PopoverTitle>{subject.id}</PopoverTitle>
											</PopoverHeader>
											<SubjectContextDrawer subject={subject} day={day} />
										</PopoverContent>
									</Popover>
								);
							})}
						</div>
					))}
				</div>
			</div>
			{selectedSlot() && selectedSubject() ? (
				<section class={styles.selectedLesson}>
					<div>
						<span class={styles.selectedEyebrow}>YOU</span>
						<strong>
							<Symbol
								name={selectedSubject()!.symbol}
								class={styles.selectedLessonSymbol}
							/>{" "}
							{selectedSubject()!.id}
						</strong>
					</div>
					<span>
						{TIMETABLE_DAYS[selectedSlot()!.day]} · period{" "}
						{periodLabel(selectedSlot()!.session)}
					</span>
				</section>
			) : null}
			<TimetableComparison selectedSlot={selectedSlot()!} friends={friends} />
		</section>
	);
}

function subjectColour(subject: TimetableSubject) {
	const { r, g, b, a } = subject.colour;
	return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
}

function subjectTextColour(subject: TimetableSubject) {
	const { r, g, b } = subject.colour;
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
	return brightness > 0.55 ? "#111111" : "#ffffff";
}
