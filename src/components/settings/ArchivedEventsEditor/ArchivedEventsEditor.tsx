"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import CalendarEventDrawer from "@/components/drawers/CalendarEventDrawer/CalendarEventDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import type { CalendarEvent, CalendarEvents } from "@/features/timetable/types";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/settings/Settings.module.css";

export default function ArchivedEventsEditor() {
	const { openDrawer } = useDrawer();
	const [events, setEvents] = useState<CalendarEvents | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiRequest<CalendarEvents>("v1/events")
			.then(setEvents)
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	const archived = useMemo(() => {
		const today = new Date();
		const todayStart = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
		);
		return [...(events?.globalEvents ?? []), ...(events?.privateEvents ?? [])]
			.filter((event) => eventDate(event) < todayStart)
			.sort(
				(left, right) => eventDate(right).getTime() - eventDate(left).getTime(),
			);
	}, [events]);

	const update = (event: CalendarEvent | null, removedID?: string) => {
		setEvents((current) => {
			if (!current) {
				return current;
			}
			return {
				...current,
				globalEvents: event
					? current.globalEvents.map((item) =>
							item.id === event.id ? event : item,
						)
					: current.globalEvents.filter((item) => item.id !== removedID),
				privateEvents: event
					? current.privateEvents.map((item) =>
							item.id === event.id ? event : item,
						)
					: current.privateEvents.filter((item) => item.id !== removedID),
			};
		});
	};

	return (
		<>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			<section className={styles.card}>
				{archived.length ? (
					archived.map((event) => (
						<Button
							key={event.id}
							type="button"
							className={styles.rowButton}
							onClick={() =>
								openDrawer(
									<CalendarEventDrawer
										event={event}
										onChanged={(updated) => update(updated, event.id)}
										readOnly={event.isGlobal && !events?.canManageGlobalEvents}
									/>,
								)
							}
						>
							<div className={styles.row}>
								<Symbol name="archivebox" />
								<span>
									<b className={styles.label}>{event.title}</b>
									<small className={styles.rowMeta}>
										{eventDate(event).toLocaleDateString("en-AU", {
											dateStyle: "long",
										})}
									</small>
								</span>
								<Symbol name="chevron.right" className={styles.chevronIcon} />
							</div>
						</Button>
					))
				) : (
					<p className={styles.loading}>
						{events ? "No archived events." : "Loading archived events…"}
					</p>
				)}
			</section>
		</>
	);
}

function eventDate(event: CalendarEvent) {
	return new Date(event.date.year, event.date.month - 1, event.date.day);
}
