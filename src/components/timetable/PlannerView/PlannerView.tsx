import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import { Link } from "@tanstack/react-router";
import type { DashboardData } from "@/features/timetable/useDashboard";
import type { CalendarEvent, GradeTracker } from "@/features/timetable/types";
import { futureEventEndDate } from "@/features/timetable/eventRange";
import Symbol from "@/components/controls/Symbol/Symbol";
import SettingToggle from "@/components/controls/SettingToggle/SettingToggle";
import EventRow from "@/components/timetable/EventRow/EventRow";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { SectionCard } from "@/components/ui/sectioncard";
import { cn } from "@/lib/utils";
import { useTimetableNow } from "@/features/timetable/clock";
import styles from "@/components/timetable/timetable.module.css";
import drawerStyles from "@/components/drawers/Drawer/Drawer.module.css";
import { DrawerFooter } from "@/components/ui/drawer";

export default function PlannerView({
	events,
	schoolCalendar,
	grades,
	canManageGlobalEvents,
	futureEventRange,
}: {
	events: CalendarEvent[];
	schoolCalendar: DashboardData["schoolCalendar"];
	grades: GradeTracker;
	canManageGlobalEvents: boolean;
	futureEventRange: string;
}) {
	const { openDrawer } = useDrawer();
	const now = useTimetableNow();
	const [localEvents, setLocalEvents] = useState(events);
	useEffect(() => setLocalEvents(events), [events]);
	const today = startOfToday(now);
	const todayTimestamp = today.getTime();
	const futureEventEndTimestamp = futureEventEndDate(
		futureEventRange,
		today,
	).getTime();
	const todayEvents = localEvents.filter(
		(event) => eventDate(event) === todayTimestamp,
	);
	const upcomingEvents = localEvents.filter(
		(event) => eventDate(event) > todayTimestamp,
	);
	const upcomingAssessments = grades.document.assessments.filter(
		(assessment) =>
			assessmentDate(assessment) >= todayTimestamp &&
			assessmentDate(assessment) <= futureEventEndTimestamp,
	);
	const upcomingNoSchoolDays = schoolCalendar.skippedDates.filter(
		(item) =>
			skippedDate(item) >= todayTimestamp &&
			skippedDate(item) <= futureEventEndTimestamp,
	);
	const visibleTermRanges = schoolCalendar.termRanges.filter(
		(term) =>
			calendarDateTimestamp(term.end) >= todayTimestamp &&
			calendarDateTimestamp(term.start) <= futureEventEndTimestamp,
	);
	const updateEvent = (updated: CalendarEvent | null, originalID: string) => {
		setLocalEvents((current) =>
			updated
				? current.map((event) => (event.id === originalID ? updated : event))
				: current.filter((event) => event.id !== originalID),
		);
	};

	return (
		<section className={styles.planner}>
			<div className={styles.plannerActions}>
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
				{canManageGlobalEvents ? (
					<Button
						type="button"
						aria-label="Add global event"
						onClick={() =>
							openDrawer(
								<CreatePrivateEventDrawer
									globally
									onCreated={(event) =>
										setLocalEvents((current) => [...current, event])
									}
								/>,
							)
						}
					>
						<Symbol name="megaphone" />
						Add Global Event
					</Button>
				) : null}
			</div>
			{todayEvents.length ? (
				<SectionCard
					background="paper"
					title="Today"
					symbolName="calendar.day.timeline.left"
				>
					{todayEvents.map((event) => (
						<EventRow
							key={event.id}
							event={event}
							prominent
							showDate={false}
							onChanged={(updated) => updateEvent(updated, event.id)}
							readOnly={event.isGlobal && !canManageGlobalEvents}
						/>
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
						<EventRow
							key={event.id}
							event={event}
							prominent
							onChanged={(updated) => updateEvent(updated, event.id)}
							readOnly={event.isGlobal && !canManageGlobalEvents}
						/>
					))
				) : (
					<p className={styles.empty}>No upcoming events.</p>
				)}
			</SectionCard>
			{upcomingAssessments.length ? (
				<SectionCard
					background="paper"
					title="Assessments"
					symbolName="doc.text"
				>
					{upcomingAssessments.map((assessment) => (
						<Link
							key={assessment.id}
							to="/grades/$subject"
							params={{ subject: assessment.subjectID }}
							className={cn(styles.cardRow, styles.plannerEvent)}
							aria-label={`Open ${assessment.name}`}
						>
							<span className={styles.eventSymbol} aria-hidden="true">
								<Symbol name="doc.text" className={styles.eventSymbolIcon} />
							</span>
							<div>
								<strong>{assessment.name}</strong>
								<span>{assessment.subjectID}</span>
							</div>
							<time>{formatAssessmentDate(assessment)}</time>
						</Link>
					))}
				</SectionCard>
			) : null}
			{upcomingNoSchoolDays.length ? (
				<SectionCard
					background="paper"
					title="Pupil Free Days"
					symbolName="calendar.badge.exclamationmark"
				>
					{upcomingNoSchoolDays.map((item) => (
						<div
							key={`${item.date.year}-${item.date.month}-${item.date.day}`}
							className={styles.cardRow}
						>
							<span className={styles.eventSymbol} aria-hidden="true">
								<Symbol name="figure.wave" className={styles.eventSymbolIcon} />
							</span>
							<div>
								<strong>{item.label}</strong>
							</div>
							<time>{formatSkippedDate(item)}</time>
						</div>
					))}
				</SectionCard>
			) : null}
			<SectionCard background="paper" title="Term Dates" symbolName="calendar">
				{visibleTermRanges.map((term) => (
					<div
						key={term.label}
						className={cn(styles.cardRow, styles.plannerEvent)}
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
					</div>
				))}
			</SectionCard>
		</section>
	);
}

function CreatePrivateEventDrawer({
	onCreated,
	globally = false,
}: {
	onCreated: (event: CalendarEvent) => void;
	globally?: boolean;
}) {
	const { closeDrawer } = useDrawer();
	const [title, setTitle] = useState("");
	const [notes, setNotes] = useState("");
	const [symbol, setSymbol] = useState("calendar");
	const [date, setDate] = useState(() => dateValue(new Date()));
	const [showsWeather, setShowsWeather] = useState(false);
	const [tagSections, setTagSections] = useState<EventTagSection[]>([]);
	const [selectedTagIDs, setSelectedTagIDs] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!globally) {
			return;
		}

		apiRequest<{ sections: EventTagSection[] }>("v1/tags")
			.then((response) => setTagSections(response.sections))
			.catch(() => setTagSections([]));
	}, [globally]);

	const save = async () => {
		if (!title.trim() || saving) return;
		setSaving(true);
		setError(null);
		const [year, month, day] = date.split("-").map(Number);
		try {
			const response = await apiRequest<{
				privateEvents?: CalendarEvent[];
				globalEvents?: CalendarEvent[];
			}>(`v1/events/${globally ? "global" : "private"}`, {
				method: "POST",
				body: JSON.stringify({
					title: title.trim(),
					notes: notes.trim() || null,
					symbol: symbol.trim() || "calendar",
					date: { year, month, day },
					tagIDs: selectedTagIDs,
					showsWeather: globally && showsWeather,
				}),
			});
			const created = [
				...(response.privateEvents ?? []),
				...(response.globalEvents ?? []),
			].find(
				(candidate) =>
					candidate.title === title.trim() &&
					candidate.date.year === year &&
					candidate.date.month === month &&
					candidate.date.day === day,
			);
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
		<section
			className={drawerStyles.detailDrawer}
			aria-labelledby="create-event-title"
		>
			<h2 id="create-event-title">
				{globally ? "Add Global Event" : "Add Personal Event"}
			</h2>
			<label>
				Title
				<Input
					value={title}
					onChange={(event) => setTitle(event.target.value)}
				/>
			</label>
			{globally ? (
				<SettingToggle
					label="Show Weather"
					enabled={showsWeather}
					onClick={() => setShowsWeather((current) => !current)}
					disabled={saving}
				/>
			) : null}
			<label>
				Symbol
				<Input
					value={symbol}
					onChange={(event) => setSymbol(event.target.value)}
					maxLength={120}
					disabled={saving}
				/>
			</label>
			{globally ? (
				<section
					className={styles.formCard}
					aria-labelledby="new-event-tags-title"
				>
					<h3 id="new-event-tags-title">Tags</h3>
					{tagSections.length ? (
						tagSections
							.flatMap((section) => section.tags)
							.map((tag) => {
								const selected = selectedTagIDs.includes(tag.id);
								return (
									<Button
										key={tag.id}
										type="button"
										aria-pressed={selected}
										aria-label={`${tag.displayName}${selected ? ", selected" : ""}`}
										onClick={() => setSelectedTagIDs(selected ? [] : [tag.id])}
									>
										<Symbol name={tag.symbol ?? "tag"} />
										{tag.displayName}
										{selected ? <Symbol name="checkmark" /> : null}
									</Button>
								);
							})
					) : (
						<p className={styles.empty}>Loading event tags…</p>
					)}
				</section>
			) : null}
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
			{error ? <p role="alert">{error}</p> : null}
			<DrawerFooter>
				<Button
					fullWidth
					type="button"
					disabled={saving || !title.trim()}
					onClick={() => void save()}
					aria-label="Save personal event"
				>
					<Symbol name="checkmark" />
					{saving ? "Saving…" : "Save Event"}
				</Button>
			</DrawerFooter>
		</section>
	);
}

type EventTagSection = {
	displayName: string;
	tags: EventTag[];
};

type EventTag = {
	id: string;
	displayName: string;
	symbol?: string | null;
};

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

function startOfToday(now: Date) {
	return new Date(now.getFullYear(), now.getMonth(), now.getDate());
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

function assessmentDate(
	assessment: GradeTracker["document"]["assessments"][number],
) {
	return new Date(
		assessment.date.year,
		assessment.date.month - 1,
		assessment.date.day,
	).getTime();
}

function skippedDate(
	item: DashboardData["schoolCalendar"]["skippedDates"][number],
) {
	return new Date(item.date.year, item.date.month - 1, item.date.day).getTime();
}

function calendarDateTimestamp(date: {
	year: number;
	month: number;
	day: number;
}) {
	return new Date(date.year, date.month - 1, date.day).getTime();
}

function formatAssessmentDate(
	assessment: GradeTracker["document"]["assessments"][number],
) {
	return new Date(
		assessment.date.year,
		assessment.date.month - 1,
		assessment.date.day,
	).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

function formatSkippedDate(
	item: DashboardData["schoolCalendar"]["skippedDates"][number],
) {
	return new Date(
		item.date.year,
		item.date.month - 1,
		item.date.day,
	).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
