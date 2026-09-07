import { Button } from "@/components/ui/button";
import { createMemo, createSignal, onMount } from "solid-js";
import Symbol from "@/components/controls/Symbol/Symbol";
import CalendarEventDrawer from "@/components/drawers/CalendarEventDrawer/CalendarEventDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import type { CalendarEvent, CalendarEvents } from "@/features/timetable/types";
import { apiRequest } from "@/lib/api/client";
import { useTimetableNow } from "@/features/timetable/clock";
import { List, ListRow } from "@/components/ui/list";
import styles from "@/components/settings/Settings.module.css";

export default function ArchivedEventsEditor() {
	const { openDrawer } = useDrawer();
	const [events, setEvents] = createSignal<CalendarEvents | null>(null);
	const [error, setError] = createSignal<string | null>(null);
	const now = useTimetableNow();

	onMount(() => {
		apiRequest<CalendarEvents>("v1/events")
			.then(setEvents)
			.catch((requestError: Error) => setError(requestError.message));
	});

	const archived = createMemo(() => {
		const today = new Date(now());
		const todayStart = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
		);
		return [
			...(events()?.globalEvents ?? []),
			...(events()?.privateEvents ?? []),
		]
			.filter((event) => eventDate(event) < todayStart)
			.sort(
				(left, right) => eventDate(right).getTime() - eventDate(left).getTime(),
			);
	});

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
			{error() ? (
				<p class={styles.error} role="alert">
					{error()}
				</p>
			) : null}
			<List rowHover>
				{archived().length ? (
					archived().map((event) => (
						<Button
							type="button"
							class={styles.listButton}
							onClick={() =>
								openDrawer(() => (
									<CalendarEventDrawer
										event={event}
										onChanged={(updated) => update(updated, event.id)}
										readOnly={
											event.isGlobal && !events()?.canManageGlobalEvents
										}
										allowsTagEditing={false}
									/>
								))
							}
						>
							<ListRow>
								<Symbol name="archivebox" />
								<span class={styles.label}>
									<strong>{event.title}</strong>
									<small class={styles.detail}>
										{eventDate(event).toLocaleDateString("en-AU", {
											dateStyle: "long",
										})}
									</small>
								</span>
								<Symbol name="chevron.right" />
							</ListRow>
						</Button>
					))
				) : (
					<p class={styles.loading}>
						{events() ? "No archived events." : "Loading archived events…"}
					</p>
				)}
			</List>
		</>
	);
}

function eventDate(event: CalendarEvent) {
	return new Date(event.date.year, event.date.month - 1, event.date.day);
}
