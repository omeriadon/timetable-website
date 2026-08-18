import type { DashboardData } from "@/features/timetable/useDashboard";
import type { CalendarEvent } from "@/features/timetable/types";
import EventRow from "@/components/timetable/EventRow/EventRow";
import styles from "@/app/page.module.css";

export default function PlannerView({ events, schoolCalendar }: { events: CalendarEvent[]; schoolCalendar: DashboardData["schoolCalendar"] }) {
	return (
		<section className={styles.planner}>
			<h1>Upcoming</h1>
			{events.map((event) => <EventRow key={event.id} event={event} prominent />)}
			<h2>Term Dates</h2>
			{schoolCalendar.termRanges.map((term) => <article key={term.label} className={styles.plannerEvent}><span className={styles.eventSymbol} aria-hidden="true">▣</span><div><strong>{term.label}</strong><span>{formatDateRange(term.start, term.end)}</span></div><time>{term.start.day} {monthName(term.start.month)}</time></article>)}
		</section>
	);
}

function formatDateRange(start: DashboardData["schoolCalendar"]["termRanges"][number]["start"], end: DashboardData["schoolCalendar"]["termRanges"][number]["end"]) {
	return `${start.day} ${monthName(start.month)} – ${end.day} ${monthName(end.month)} ${end.year}`;
}

function monthName(month: number) {
	return new Intl.DateTimeFormat("en-AU", { month: "short" }).format(new Date(2026, month - 1, 1));
}
