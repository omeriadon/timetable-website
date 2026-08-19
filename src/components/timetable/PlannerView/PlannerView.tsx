"use client";

import { Button } from "@/components/ui/Button";
import type { DashboardData } from "@/features/timetable/useDashboard";
import type { CalendarEvent } from "@/features/timetable/types";
import EventRow from "@/components/timetable/EventRow/EventRow";
import TermDateSheet from "@/components/sheets/TermDateSheet/TermDateSheet";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import Symbol from "@/components/controls/Symbol/Symbol";
import { SectionCard } from "@/components/ui/SectionCard";
import { cn } from "@/lib/utils";
import styles from "@/app/page.module.css";

export default function PlannerView({
	events,
	schoolCalendar,
}: {
	events: CalendarEvent[];
	schoolCalendar: DashboardData["schoolCalendar"];
}) {
	const { openSheet } = useSheet();
	const todayTimestamp = startOfToday().getTime();
	const todayEvents = events.filter(
		(event) => eventDate(event) === todayTimestamp,
	);
	const upcomingEvents = events.filter(
		(event) => eventDate(event) > todayTimestamp,
	);

	return (
		<section className={styles.planner}>
			{todayEvents.length ? (
				<SectionCard
					background="paper"
					title="Today"
					symbolName="calendar.day.timeline.left"
					headingLevel="h1"
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
				headingLevel="h1"
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
						unstyled
						key={term.label}
						type="button"
						className={cn(styles.cardRow, styles.plannerEvent)}
						onClick={() =>
							openSheet(
								<TermDateSheet
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

function eventDate(event: CalendarEvent) {
	return new Date(
		event.date.year,
		event.date.month - 1,
		event.date.day,
	).getTime();
}
