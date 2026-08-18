"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useDashboard, type DashboardData } from "@/features/timetable/useDashboard";
import SheetTrigger from "@/components/sheets/SheetTrigger/SheetTrigger";
import LessonDetailSheet from "@/components/sheets/LessonDetailSheet/LessonDetailSheet";
import CalendarEventSheet from "@/components/sheets/CalendarEventSheet/CalendarEventSheet";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import type {
  CalendarEvent,
  TimetableSubject,
} from "@/features/timetable/types";
import { TIMETABLE_DAYS, TIMETABLE_SESSIONS } from "@/features/timetable/layout";
import styles from "./page.module.css";

type TimetableMode = "today" | "week" | "planner";

const modes: Array<{ id: TimetableMode; label: string; symbol: string }> = [
  { id: "today", label: "Today", symbol: "▤" },
  { id: "week", label: "Week", symbol: "▦" },
  { id: "planner", label: "Planner", symbol: "☷" },
];

function colour(subject: TimetableSubject) {
  const { r, g, b, a } = subject.colour;
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
}

function displayDate(event: CalendarEvent) {
  return new Date(
    event.date.year,
    event.date.month - 1,
    event.date.day,
  ).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

export default function Home() {
  const [mode, setMode] = useState<TimetableMode>("today");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, error, isLoading } = useDashboard();
  const setToolbar = useToolbar();

  useEffect(() => {
    setToolbar({ title: "Timetable" });
  }, [setToolbar]);

  useEffect(() => {
    const requestedMode = searchParams.get("mode");
    if (
      requestedMode === "today" ||
      requestedMode === "week" ||
      requestedMode === "planner"
    ) {
      setMode(requestedMode);
    }
  }, [searchParams]);

  const events = useMemo(() => {
    if (!data) {
      return [];
    }

    return [...data.events.globalEvents, ...data.events.privateEvents]
      .sort((left, right) =>
        `${left.date.year}${left.date.month}${left.date.day}`.localeCompare(
          `${right.date.year}${right.date.month}${right.date.day}`,
        ),
      )
      .slice(0, 5);
  }, [data]);

  return (
    <main className={styles.page}>
      <div className={styles.modePicker} aria-label="Timetable section">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            className={mode === item.id ? styles.activeMode : ""}
            onClick={() => {
              setMode(item.id);
              router.replace(`/?mode=${item.id}`, { scroll: false });
            }}
          >
            <span aria-hidden="true">{item.symbol}</span>
            {item.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className={styles.message}>Loading your timetable…</p>
      ) : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {data && mode === "today" ? (
        <TodayView
          events={events}
          subjects={data.timetable.subjects}
          grades={data.grades}
          schoolCalendar={data.schoolCalendar}
          schoolWeather={data.schoolWeather}
        />
      ) : null}
      {data && mode === "week" ? (
        <WeekView subjects={data.timetable.subjects} />
      ) : null}
      {data && mode === "planner" ? (
        <PlannerView events={events} schoolCalendar={data.schoolCalendar} />
      ) : null}
    </main>
  );
}

function TodayView({
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
	const today = new Date();
	const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
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
          }).format(new Date())}
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
		<section className={styles.timelineCard} aria-label="Today's school timeline">
			<div className={styles.timelineHeader}><h2>School Day</h2><span>{todayDayIndex() >= 0 && todayDayIndex() < 5 ? "8:50 am – 3:30 pm" : "No classes today"}</span></div>
			{todayDayIndex() >= 0 && todayDayIndex() < 5 ? (
				<div className={styles.timelineList}>
					{schoolPeriods.map((period) => {
						const subject = subjects.find((item) => item.slots.some((slot) => slot.day === todayDayIndex() && slot.session === period.session));
						const active = isCurrentPeriod(period.start, period.end);
						return <article key={period.label} className={active ? styles.timelineRowActive : styles.timelineRow}>
							<time>{period.start}</time>
							<div className={styles.timelineLine} aria-hidden="true"><span /></div>
							<div className={styles.timelineContent}><strong>{period.label}{subject ? `  ${subject.id}` : "  Free period"}</strong><span>{subject?.symbol ?? "—"} {period.end}</span></div>
						</article>;
					})}
				</div>
			) : <p className={styles.empty}>The school day timeline is only available on weekdays.</p>}
		</section>
		{grades.document.assessments.length ? (
			<section className={styles.paperCard}>
				<h2>Assessments</h2>
				{grades.document.assessments.slice().sort((left, right) => compareDate(left.date, right.date)).slice(0, 3).map((assessment) => <article key={assessment.id} className={styles.assessmentRow}><span className={styles.eventSymbol}>＋</span><div><strong>{assessment.name}</strong><span>{assessment.subjectID} · {displayAssessmentDate(assessment.date)}</span></div><b>{assessment.score.toFixed(1)}%</b></article>)}
			</section>
		) : null}
      <section className={styles.paperCard}>
        <h2>Classes</h2>
        <div className={styles.subjectList}>
          {subjects.map((subject, index) => (
            <article key={subject.id} className={styles.subjectRow}>
              <span>{index + 1}</span>
              <strong>{subject.id}</strong>
              <em style={{ color: colour(subject) }}>{subject.symbol}</em>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

const schoolPeriods = [
	{ label: "1", start: "8:50 am", end: "9:48 am", session: 0 },
	{ label: "2", start: "9:48 am", end: "10:46 am", session: 1 },
	{ label: "3", start: "11:08 am", end: "12:06 pm", session: 3 },
	{ label: "4", start: "12:06 pm", end: "1:04 pm", session: 4 },
	{ label: "5", start: "1:34 pm", end: "2:32 pm", session: 6 },
	{ label: "6", start: "2:32 pm", end: "3:30 pm", session: 7 },
] as const;

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
	const today = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
	const term = calendar.termRanges.find((range) => compareDate(today, range.start) >= 0 && compareDate(today, range.end) <= 0);
	if (!term) return null;
	const start = new Date(term.start.year, term.start.month - 1, term.start.day);
	const monday = new Date(start);
	const day = monday.getDay() || 7;
	monday.setDate(monday.getDate() - day + 1);
	const currentMonday = new Date(now);
	const currentDay = currentMonday.getDay() || 7;
	currentMonday.setDate(currentMonday.getDate() - currentDay + 1);
	const weeks = Math.max(0, Math.floor((currentMonday.getTime() - monday.getTime()) / 604800000));
	return `${term.label}, Week ${weeks + 1}`;
}

function compareDate(left: { year: number; month: number; day: number }, right: { year: number; month: number; day: number }) {
	return new Date(left.year, left.month - 1, left.day).getTime() - new Date(right.year, right.month - 1, right.day).getTime();
}

function WeekView({ subjects }: { subjects: TimetableSubject[] }) {
  const days = TIMETABLE_DAYS;

  return (
    <section className={styles.week} aria-label="Weekly timetable">
      <div className={styles.weekHeader}>
        {days.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className={styles.weekGrid}>
        {TIMETABLE_SESSIONS.map((session) => (
          <div key={session.value} className={styles.weekRow}>
            <small>{session.label}</small>
            {days.map((day, dayIndex) => {
              const subject = subjects.find((item) =>
                item.slots.some(
                  (slot) =>
						slot.day === dayIndex && slot.session === session.value,
                ),
              );
              return subject ? (
						<SheetTrigger
							key={day}
							className={styles.lessonButton}
							ariaLabel={`Open ${subject.id} on ${day}`}
							content={<LessonDetailSheet subject={subject} day={day} session={session.value} />}
						>
							<article className={styles.lesson} style={{ background: colour(subject) }}>
								<span>{subject.symbol}</span>
								<strong>{subject.id}</strong>
							</article>
						</SheetTrigger>
              ) : (
                <div key={day} />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function PlannerView({
	events,
	schoolCalendar,
}: {
	events: CalendarEvent[];
	schoolCalendar: DashboardData["schoolCalendar"];
}) {
  return (
    <section className={styles.planner}>
      <h1>Upcoming</h1>
      {events.map((event) => (
        <EventRow key={event.id} event={event} prominent />
      ))}
      <h2>Term Dates</h2>
      {schoolCalendar.termRanges.map((term) => (
			<article key={term.label} className={styles.plannerEvent}>
				<span className={styles.eventSymbol}>▣</span>
				<div>
					<strong>{term.label}</strong>
					<span>{formatDateRange(term.start, term.end)}</span>
				</div>
				<time>{term.start.day} {monthName(term.start.month)}</time>
			</article>
		))}
    </section>
  );
}

function formatDateRange(
	start: DashboardData["schoolCalendar"]["termRanges"][number]["start"],
	end: DashboardData["schoolCalendar"]["termRanges"][number]["end"],
) {
	return `${start.day} ${monthName(start.month)} – ${end.day} ${monthName(end.month)} ${end.year}`;
}

function monthName(month: number) {
	return new Intl.DateTimeFormat("en-AU", { month: "short" }).format(
		new Date(2026, month - 1, 1),
	);
}

function displayAssessmentDate(date: { year: number; month: number; day: number }) {
	return new Date(date.year, date.month - 1, date.day).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

function EventRow({
  event,
  prominent = false,
}: {
  event: CalendarEvent;
  prominent?: boolean;
}) {
  const { openSheet } = useSheet();
  return (
    <button type="button" className={prominent ? styles.plannerEvent : styles.eventRow} onClick={() => openSheet(<CalendarEventSheet event={event} onChanged={() => undefined} />)}>
      <span className={styles.eventSymbol}>{event.symbol}</span>
      <div>
        <strong>{event.title}</strong>
        {event.notes ? <span>{event.notes}</span> : null}
      </div>
      <time>{displayDate(event)}</time>
    </button>
  );
}
