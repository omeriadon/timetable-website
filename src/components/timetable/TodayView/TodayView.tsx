"use client";

import { Button } from "@/components/ui/Button";
import type { DashboardData } from "@/features/timetable/useDashboard";
import type {
	CalendarEvent,
	TimetableSubject,
} from "@/features/timetable/types";
import EventRow from "@/components/timetable/EventRow/EventRow";
import SubjectDetailSheet from "@/components/sheets/SubjectDetailSheet/SubjectDetailSheet";
import GradeSubjectSheet from "@/components/grades/GradeSubjectSheet/GradeSubjectSheet";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import styles from "@/app/page.module.css";

const schoolPeriods = [
	{ label: "1", start: "8:50 am", end: "9:48 am", session: 0 },
	{ label: "2", start: "9:48 am", end: "10:46 am", session: 1 },
	{ label: "3", start: "11:08 am", end: "12:06 pm", session: 3 },
	{ label: "4", start: "12:06 pm", end: "1:04 pm", session: 4 },
	{ label: "5", start: "1:34 pm", end: "2:32 pm", session: 6 },
	{ label: "6", start: "2:32 pm", end: "3:30 pm", session: 7 },
] as const;

export default function TodayView({
	events,
	subjects,
	grades,
	schoolCalendar,
	schoolWeather,
}: {
	events: CalendarEvent[];
	subjects: TimetableSubject[];
	grades: DashboardData["grades"];
	schoolCalendar: DashboardData["schoolCalendar"];
	schoolWeather: DashboardData["schoolWeather"];
}) {
	const { openSheet } = useSheet();
	const today = new Date();
	const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
	const dayIndex = todayDayIndex();
	const noSchool = schoolCalendar.skippedDates.find((item) => {
		const date = item.date;
		return `${date.year}-${date.month}-${date.day}` === todayKey;
	});

	return (
		<>
			<header className={styles.todayHeader}>
				<p>
					{schoolWeather
						? `${Math.round(schoolWeather.temperatureCelsius)}°C　${weatherLabel(schoolWeather.conditionCode)}　${Math.round(schoolWeather.precipitationChance * 100)}%　UV ${schoolWeather.uvIndex}`
						: "Weather unavailable"}
				</p>
				<h1>
					{new Intl.DateTimeFormat("en-AU", {
						weekday: "long",
						day: "numeric",
						month: "long",
					}).format(today)}
				</h1>
				<span>{termWeekLabel(schoolCalendar) ?? "Outside school term"}</span>
			</header>
			<section className={styles.paperCard}>
				<h2>Events</h2>
				<h3>Upcoming</h3>
				{events.length ? (
					events
						.slice(0, 2)
						.map((event) => <EventRow key={event.id} event={event} />)
				) : (
					<p className={styles.empty}>No upcoming events.</p>
				)}
			</section>
			{noSchool ? (
				<section className={styles.paperCard}>
					<h2>No School Today</h2>
					<p>{noSchool.label}</p>
				</section>
			) : null}
			<section
				className={styles.timelineCard}
				aria-label="Today's school timeline"
			>
				<div className={styles.timelineHeader}>
					<h2>School Day</h2>
					<span>
						{dayIndex >= 0 && dayIndex < 5
							? "8:50 am – 3:30 pm"
							: "No classes today"}
					</span>
				</div>
				{dayIndex >= 0 && dayIndex < 5 ? (
					<div className={styles.timelineList}>
						{schoolPeriods.map((period) => {
							const subject = subjects.find((item) =>
								item.slots.some(
									(slot) =>
										slot.day === dayIndex && slot.session === period.session,
								),
							);
							const active = isCurrentPeriod(period.start, period.end);
							return (
								<article
									key={period.label}
									className={
										active ? styles.timelineRowActive : styles.timelineRow
									}
								>
									<time>{period.start}</time>
									<div className={styles.timelineLine} aria-hidden="true">
										<span />
									</div>
									<div className={styles.timelineContent}>
										<strong>
											{period.label}
											{subject ? `  ${subject.id}` : "  Free period"}
										</strong>
										<span>
											{subject?.symbol ?? "—"} {period.end}
										</span>
									</div>
								</article>
							);
						})}
					</div>
				) : (
					<p className={styles.empty}>
						The school day timeline is only available on weekdays.
					</p>
				)}
			</section>
			{grades.document.assessments.length ? (
				<section className={styles.paperCard}>
					<h2>Assessments</h2>
					{grades.document.assessments
						.slice()
						.sort((left, right) => compareDate(left.date, right.date))
						.slice(0, 3)
						.map((assessment) => (
							<Button
								unstyled
								key={assessment.id}
								type="button"
								className={styles.assessmentRow}
								onClick={() => {
									const subject = subjects.find(
										(item) => item.id === assessment.subjectID,
									);
									if (!subject) {
										return;
									}
									openSheet(
										<GradeSubjectSheet
											subjectID={subject.id}
											symbol={subject.symbol}
											colour={colour(subject)}
											average={assessment.score}
											assessments={[assessment]}
										/>,
									);
								}}
								aria-label={`Open ${assessment.name}`}
							>
								<Symbol name="plus" className={styles.eventSymbol} />
								<div>
									<strong>{assessment.name}</strong>
									<span>
										{assessment.subjectID} ·{" "}
										{displayAssessmentDate(assessment.date)}
									</span>
								</div>
								<b>{assessment.score.toFixed(1)}%</b>
							</Button>
						))}
				</section>
			) : null}
			<section className={styles.paperCard}>
				<h2>Classes</h2>
				<div className={styles.subjectList}>
					{subjects.map((subject, index) => (
						<Button
							unstyled
							key={subject.id}
							type="button"
							className={styles.subjectRow}
							onClick={() =>
								openSheet(<SubjectDetailSheet subject={subject} />)
							}
							aria-label={`Open ${subject.id} details`}
						>
							<span>{index + 1}</span>
							<strong>{subject.id}</strong>
							<em style={{ color: colour(subject) }}>{subject.symbol}</em>
						</Button>
					))}
				</div>
			</section>
		</>
	);
}

function colour(subject: TimetableSubject) {
	const { r, g, b, a } = subject.colour;
	return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
}

function todayDayIndex() {
	return new Date().getDay() - 1;
}

function isCurrentPeriod(start: string, end: string) {
	const now = new Date();
	const minutes = now.getHours() * 60 + now.getMinutes();
	const parse = (value: string) => {
		const [time, meridiem] = value.split(" ");
		const [hours, minute] = time.split(":").map(Number);
		let hour = hours;
		if (meridiem === "pm" && hour !== 12) hour += 12;
		if (meridiem === "am" && hour === 12) hour = 0;
		return hour * 60 + minute;
	};
	return minutes >= parse(start) && minutes < parse(end);
}

function weatherLabel(conditionCode: string) {
	return conditionCode
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/^./, (character) => character.toUpperCase());
}

function termWeekLabel(calendar: DashboardData["schoolCalendar"]) {
	const now = new Date();
	const today = {
		year: now.getFullYear(),
		month: now.getMonth() + 1,
		day: now.getDate(),
	};
	const term = calendar.termRanges.find(
		(range) =>
			compareDate(today, range.start) >= 0 &&
			compareDate(today, range.end) <= 0,
	);
	if (!term) return null;
	const monday = new Date(
		term.start.year,
		term.start.month - 1,
		term.start.day,
	);
	const day = monday.getDay() || 7;
	monday.setDate(monday.getDate() - day + 1);
	const currentMonday = new Date(now);
	const currentDay = currentMonday.getDay() || 7;
	currentMonday.setDate(currentMonday.getDate() - currentDay + 1);
	const weeks = Math.max(
		0,
		Math.floor((currentMonday.getTime() - monday.getTime()) / 604800000),
	);
	return `${term.label}, Week ${weeks + 1}`;
}

function compareDate(
	left: { year: number; month: number; day: number },
	right: { year: number; month: number; day: number },
) {
	return (
		new Date(left.year, left.month - 1, left.day).getTime() -
		new Date(right.year, right.month - 1, right.day).getTime()
	);
}

function displayAssessmentDate(date: {
	year: number;
	month: number;
	day: number;
}) {
	return new Date(date.year, date.month - 1, date.day).toLocaleDateString(
		"en-AU",
		{ day: "numeric", month: "short" },
	);
}
