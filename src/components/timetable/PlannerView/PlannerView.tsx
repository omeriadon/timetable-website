"use client";

import { Button } from "@/components/ui/Button";
import type { DashboardData } from "@/features/timetable/useDashboard";
import type { CalendarEvent } from "@/features/timetable/types";
import EventRow from "@/components/timetable/EventRow/EventRow";
import TermDateSheet from "@/components/sheets/TermDateSheet/TermDateSheet";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/app/page.module.css";

export default function PlannerView({
	events,
	schoolCalendar,
}: {
	events: CalendarEvent[];
	schoolCalendar: DashboardData["schoolCalendar"];
}) {
	const { openSheet } = useSheet();

	return (
		<section className={styles.planner}>
			<section className={styles.plannerSection}>
				<div className={styles.sectionHeader}>
					<div className={styles.sectionHeading}>
						<Symbol
							name="calendar.badge.clock"
							className={styles.sectionHeadingIcon}
						/>
						<h1>Upcoming</h1>
					</div>
					<span>{events.length} events</span>
				</div>
				{events.length ? (
					events.map((event) => (
						<EventRow key={event.id} event={event} prominent />
					))
				) : (
					<p className={styles.empty}>No upcoming events.</p>
				)}
			</section>
			<section className={styles.plannerSection}>
				<div className={styles.sectionHeader}>
					<div className={styles.sectionHeading}>
						<Symbol name="calendar" className={styles.sectionHeadingIcon} />
						<h2>Term Dates</h2>
					</div>
					<span>{schoolCalendar.termRanges.length} terms</span>
				</div>
				{schoolCalendar.termRanges.map((term) => (
					<Button
						unstyled
						key={term.label}
						type="button"
						className={styles.plannerEvent}
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
			</section>
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
