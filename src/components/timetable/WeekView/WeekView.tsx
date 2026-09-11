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
import sharedStyles from "@/components/timetable/timetable.module.css";

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
		<section class={sharedStyles.week} aria-label="Weekly timetable">
			<div class={sharedStyles.weekSurface}>
				<div class={sharedStyles.weekHeader}>
					<span aria-hidden="true"> </span>
					{TIMETABLE_DAYS.map((day, dayIndex) => (
						<span
							class={
								currentDayIndex === dayIndex
									? sharedStyles.currentDayHeader
									: undefined
							}
						>
							{day}
						</span>
					))}
				</div>
				<div class={sharedStyles.weekGrid}>
					{TIMETABLE_SESSIONS.map((session) => (
						<div class={sharedStyles.weekRow}>
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
										? sharedStyles.currentDayCell
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
														? `${sharedStyles.lesson} ${styles.lessonSelected}`
														: sharedStyles.lesson
												}
											>
												<Symbol
													name={subject.symbol}
													class={sharedStyles.lessonSymbol}
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
