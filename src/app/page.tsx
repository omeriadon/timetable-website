"use client";

import { useEffect, useMemo, useState } from "react";
import { useToolbar } from "@/components/Toolbar";
import { useDashboard } from "@/features/timetable/useDashboard";
import type {
	CalendarEvent,
	TimetableSubject,
} from "@/features/timetable/types";
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
	const { data, error, isLoading } = useDashboard();
	const setToolbar = useToolbar();

	useEffect(() => {
		setToolbar({ title: "Timetable" });
	}, [setToolbar]);

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
						onClick={() => setMode(item.id)}
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
				<TodayView events={events} subjects={data.timetable.subjects} />
			) : null}
			{data && mode === "week" ? (
				<WeekView subjects={data.timetable.subjects} />
			) : null}
			{data && mode === "planner" ? <PlannerView events={events} /> : null}
		</main>
	);
}

function TodayView({
	events,
	subjects,
}: {
	events: CalendarEvent[];
	subjects: TimetableSubject[];
}) {
	return (
		<>
			<header className={styles.todayHeader}>
				<p>15°C　Mostly Cloudy　0%　UV 0</p>
				<h1>
					{new Intl.DateTimeFormat("en-AU", {
						weekday: "long",
						day: "numeric",
						month: "long",
					}).format(new Date())}
				</h1>
				<span>Term 3, Week 5</span>
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

function WeekView({ subjects }: { subjects: TimetableSubject[] }) {
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

	return (
		<section className={styles.week} aria-label="Weekly timetable">
			<div className={styles.weekHeader}>
				{days.map((day) => (
					<span key={day}>{day}</span>
				))}
			</div>
			<div className={styles.weekGrid}>
				{Array.from({ length: 6 }, (_, session) => (
					<div key={session} className={styles.weekRow}>
						<small>{session + 1}</small>
						{days.map((day, dayIndex) => {
							const subject = subjects.find((item) =>
								item.slots.some(
									(slot) =>
										slot.day === dayIndex + 1 && slot.session === session + 1,
								),
							);
							return subject ? (
								<article
									key={day}
									className={styles.lesson}
									style={{ background: colour(subject) }}
								>
									<span>{subject.symbol}</span>
									<strong>{subject.id}</strong>
								</article>
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

function PlannerView({ events }: { events: CalendarEvent[] }) {
	return (
		<section className={styles.planner}>
			<h1>Upcoming</h1>
			{events.map((event) => (
				<EventRow key={event.id} event={event} prominent />
			))}
			<h2>Term Dates</h2>
			<p className={styles.empty}>Your school calendar will appear here.</p>
		</section>
	);
}

function EventRow({
	event,
	prominent = false,
}: {
	event: CalendarEvent;
	prominent?: boolean;
}) {
	return (
		<article className={prominent ? styles.plannerEvent : styles.eventRow}>
			<span className={styles.eventSymbol}>{event.symbol}</span>
			<div>
				<strong>{event.title}</strong>
				{event.notes ? <span>{event.notes}</span> : null}
			</div>
			<time>{displayDate(event)}</time>
		</article>
	);
}
