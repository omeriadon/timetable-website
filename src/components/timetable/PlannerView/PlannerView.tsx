"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import type { DashboardData } from "@/features/timetable/useDashboard";
import type { CalendarEvent } from "@/features/timetable/types";
import Symbol from "@/components/controls/Symbol/Symbol";
import EventRow from "@/components/timetable/EventRow/EventRow";
import TermDateDrawer from "@/components/drawers/TermDateDrawer/TermDateDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { SectionCard } from "@/components/ui/sectioncard";
import { cn } from "@/lib/utils";
import styles from "@/components/timetable/timetable.module.css";

export default function PlannerView({
	events,
	schoolCalendar,
}: {
	events: CalendarEvent[];
	schoolCalendar: DashboardData["schoolCalendar"];
}) {
	const { openDrawer } = useDrawer();
	const [localEvents, setLocalEvents] = useState(events);
	useEffect(() => setLocalEvents(events), [events]);
	const todayTimestamp = startOfToday().getTime();
	const todayEvents = localEvents.filter(
		(event) => eventDate(event) === todayTimestamp,
	);
	const upcomingEvents = localEvents.filter(
		(event) => eventDate(event) > todayTimestamp,
	);

	return (
		<section className={styles.planner}>
			<Button
				type="button"
				aria-label="Add personal event"
				onClick={() =>
					openDrawer(
						<CreatePrivateEventDrawer
							onCreated={(event) =>
								setLocalEvents((current) => [...current, event])
							}
						/>,
					)
				}
			>
				<Symbol name="plus" />
				Add Personal Event
			</Button>
			{todayEvents.length ? (
				<SectionCard
					background="paper"
					title="Today"
					symbolName="calendar.day.timeline.left"
				>
					{todayEvents.map((event) => (
						<EventRow key={event.id} event={event} prominent showDate={false} />
					))}
				</SectionCard>
			) : null}
			<SectionCard
				background="paper"
				title="Upcoming"
				symbolName="calendar.badge.clock"
			>
				{upcomingEvents.length ? (
					upcomingEvents.map((event) => (
						<EventRow key={event.id} event={event} prominent />
					))
				) : (
					<p className={styles.empty}>No upcoming events.</p>
				)}
			</SectionCard>
			<SectionCard background="paper" title="Term Dates" symbolName="calendar">
				{schoolCalendar.termRanges.map((term) => (
					<Button
						key={term.label}
						type="button"
						className={cn(styles.cardRow, styles.plannerEvent)}
						onClick={() =>
							openDrawer(
								<TermDateDrawer
									label={term.label}
									start={term.start}
									end={term.end}
								/>,
							)
						}
						aria-label={`Open ${term.label} dates`}
					>
						<span className={styles.eventSymbol} aria-hidden="true">
							<Symbol name="calendar" className={styles.eventSymbolIcon} />
						</span>
						<div>
							<strong>{term.label}</strong>
							<span>{formatDateRange(term.start, term.end)}</span>
						</div>
						<time>
							{term.start.day} {monthName(term.start.month)}
						</time>
						<Symbol name="chevron.right" className={styles.rowDisclosureIcon} />
					</Button>
				))}
			</SectionCard>
		</section>
	);
}

function CreatePrivateEventDrawer({
	onCreated,
}: {
	onCreated: (event: CalendarEvent) => void;
}) {
	const { closeDrawer } = useDrawer();
	const [title, setTitle] = useState("");
	const [notes, setNotes] = useState("");
	const [date, setDate] = useState(() => dateValue(new Date()));
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const save = async () => {
		if (!title.trim() || saving) return;
		setSaving(true);
		setError(null);
		const [year, month, day] = date.split("-").map(Number);
		try {
			const response = await apiRequest<{
				privateEvents: CalendarEvent[];
			}>("v1/events/private", {
				method: "POST",
				body: JSON.stringify({
					title: title.trim(),
					notes: notes.trim() || null,
					symbol: "calendar",
					date: { year, month, day },
					tagIDs: [],
				}),
			});
			const created = response.privateEvents.at(-1);
			if (created) {
				onCreated(created);
			}
			closeDrawer();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<section aria-labelledby="create-event-title">
			<h2 id="create-event-title">Add Personal Event</h2>
			<label>
				Title
				<Input
					value={title}
					onChange={(event) => setTitle(event.target.value)}
				/>
			</label>
			<label>
				Date
				<Input
					type="date"
					value={date}
					onChange={(event) => setDate(event.target.value)}
				/>
			</label>
			<label>
				Notes
				<Textarea
					value={notes}
					onChange={(event) => setNotes(event.target.value)}
					rows={3}
				/>
			</label>
			<Button
				type="button"
				disabled={saving || !title.trim()}
				onClick={() => void save()}
				aria-label="Save personal event"
			>
				<Symbol name="checkmark" />
				{saving ? "Saving…" : "Save Event"}
			</Button>
			{error ? <p role="alert">{error}</p> : null}
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

function startOfToday() {
	const today = new Date();
	return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function dateValue(date: Date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function eventDate(event: CalendarEvent) {
	return new Date(
		event.date.year,
		event.date.month - 1,
		event.date.day,
	).getTime();
}
