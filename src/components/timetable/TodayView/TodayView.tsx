"use client";

import { useState } from "react";
import { Button } from "@base-ui/react/button";
import type { DashboardData } from "@/features/timetable/useDashboard";
import type {
	CalendarEvent,
	GradeAssessment,
	TimetableSubject,
} from "@/features/timetable/types";
import EventRow from "@/components/timetable/EventRow/EventRow";
import GradeSubjectDrawer from "@/components/grades/GradeSubjectDrawer/GradeSubjectDrawer";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { SectionCard } from "@/components/ui/sectioncard";
import { cn } from "@/lib/utils";
import styles from "@/components/timetable/timetable.module.css";

type TodayEntry =
	| {
			kind: "event";
			id: string;
			date: CalendarEvent["date"];
			event: CalendarEvent;
	  }
	| {
			kind: "assessment";
			id: string;
			date: GradeAssessment["date"];
			assessment: GradeAssessment;
			subject?: TimetableSubject;
	  };

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
	const [expandedSubjectID, setExpandedSubjectID] = useState<string | null>(
		null,
	);
	const today = new Date();
	const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
	const todayTimestamp = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
	).getTime();
	const dayIndex = todayDayIndex();
	const entries = [
		...events.map<TodayEntry>((event) => ({
			kind: "event",
			id: `event-${event.id}`,
			date: event.date,
			event,
		})),
		...grades.document.assessments.map<TodayEntry>((assessment) => ({
			kind: "assessment",
			id: `assessment-${assessment.id}`,
			date: assessment.date,
			assessment,
			subject: subjects.find((subject) => subject.id === assessment.subjectID),
		})),
	].sort((left, right) => {
		const dateOrder = compareDate(left.date, right.date);
		if (dateOrder !== 0) {
			return dateOrder;
		}
		return entryTitle(left).localeCompare(entryTitle(right));
	});
	const todayEntries = entries.filter(
		(entry) => entryDate(entry) === todayTimestamp,
	);
	const upcomingEntries = entries.filter(
		(entry) => entryDate(entry) > todayTimestamp,
	);
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
			{entries.length ? (
				<SectionCard
					background="paper"
					title="Events"
					symbolName="calendar.badge.clock"
				>
					{todayEntries.length ? (
						<>
							<h3>Today</h3>
							{todayEntries.map((entry) => (
								<TodayEntryRow key={entry.id} entry={entry} showDate={false} />
							))}
						</>
					) : null}
					{upcomingEntries.length ? (
						<>
							<h3>Upcoming</h3>
							{upcomingEntries.map((entry) => (
								<TodayEntryRow key={entry.id} entry={entry} showDate />
							))}
						</>
					) : null}
				</SectionCard>
			) : null}
			{noSchool ? (
				<SectionCard
					background="paper"
					title="No School Today"
					symbolName="building.2"
				>
					<p>{noSchool.label}</p>
				</SectionCard>
			) : null}
			<SectionCard
				background="paper"
				title="Classes"
				symbolName="books.vertical"
			>
				<div className={styles.subjectList}>
					{subjects.map((subject, index) => (
						<Button
							key={subject.id}
							type="button"
							className={cn(
								styles.cardRow,
								styles.subjectRow,
								expandedSubjectID === subject.id && styles.subjectRowExpanded,
							)}
							onClick={() =>
								setExpandedSubjectID((current) =>
									current === subject.id ? null : subject.id,
								)
							}
							aria-label={`Open ${subject.id} details`}
							aria-expanded={expandedSubjectID === subject.id}
						>
							<span className={styles.subjectNumber}>{index + 1}</span>
							<div className={styles.subjectDetails}>
								<strong>{subject.id}</strong>
								<div
									className={styles.subjectMeta}
									aria-hidden={expandedSubjectID !== subject.id}
								>
									<div className={styles.subjectMetaContent}>
										<span>
											<Symbol
												name="person.fill"
												className={styles.subjectMetaIcon}
											/>
											{teacherName(subject.teacher)}
										</span>
										<span>
											<Symbol
												name="door.left.hand.open"
												className={styles.subjectMetaIcon}
											/>
											{classroomName(subject.classroom)}
										</span>
									</div>
								</div>
							</div>
							<em>
								<Symbol
									name={subject.symbol}
									className={styles.eventSymbolIcon}
								/>
							</em>
						</Button>
					))}
				</div>
			</SectionCard>
		</>
	);
}

function TodayEntryRow({
	entry,
	showDate,
}: {
	entry: TodayEntry;
	showDate: boolean;
}) {
	if (entry.kind === "event") {
		return <EventRow event={entry.event} showDate={showDate} />;
	}

	return <AssessmentEntryRow entry={entry} showDate={showDate} />;
}

function AssessmentEntryRow({
	entry,
	showDate,
}: {
	entry: Extract<TodayEntry, { kind: "assessment" }>;
	showDate: boolean;
}) {
	const { openDrawer } = useDrawer();

	return (
		<Button
			type="button"
			className={cn(styles.cardRow, styles.eventRow)}
			onClick={() => {
				if (!entry.subject) {
					return;
				}
				openDrawer(
					<GradeSubjectDrawer
						subjectID={entry.subject.id}
						symbol={entry.subject.symbol}
						colour={colour(entry.subject)}
						average={entry.assessment.score}
						assessments={[entry.assessment]}
					/>,
				);
			}}
			aria-label={`Open ${entry.assessment.name}`}
		>
			<span className={styles.eventSymbol} aria-hidden="true">
				<Symbol
					name={entry.subject?.symbol ?? "doc.text"}
					className={styles.eventSymbolIcon}
				/>
			</span>
			<div>
				<strong>{entry.assessment.name}</strong>
			</div>
			{showDate ? <time>{displayAssessmentDate(entry.date)}</time> : null}
		</Button>
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

function eventDate(event: CalendarEvent) {
	return new Date(
		event.date.year,
		event.date.month - 1,
		event.date.day,
	).getTime();
}

function entryDate(entry: TodayEntry) {
	return new Date(
		entry.date.year,
		entry.date.month - 1,
		entry.date.day,
	).getTime();
}

function entryTitle(entry: TodayEntry) {
	return entry.kind === "event" ? entry.event.title : entry.assessment.name;
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
	if (classroom.room) {
		return `${classroom.room.building} ${classroom.room.number}`;
	}
	return "Not provided";
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
