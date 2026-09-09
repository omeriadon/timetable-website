import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSignal, onMount } from "solid-js";
import type { CalendarEvent } from "@/features/timetable/types";
import { apiRequest } from "@/lib/api/client";
import { useDrawer } from "../Drawer/Drawer";
import styles from "../Drawer/Drawer.module.css";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ListRow } from "@/components/ui/list";
import { DrawerFooter } from "@/components/ui/drawer";
import Symbol from "@/components/controls/Symbol/Symbol";

export default function CalendarEventDrawer({
	event,
	onChanged,
	onClose,
	showHeader = true,
	readOnly = false,
	allowsTagEditing = true,
}: {
	event: CalendarEvent;
	onChanged: (event: CalendarEvent | null) => void;
	onClose?: () => void;
	showHeader?: boolean;
	readOnly?: boolean;
	allowsTagEditing?: boolean;
}) {
	const { closeDrawer } = useDrawer();
	const dismiss = onClose ?? closeDrawer;
	const [title, setTitle] = createSignal(event.title);
	const [notes, setNotes] = createSignal(event.notes ?? "");
	const [symbol, setSymbol] = createSignal(event.symbol);
	const [date, setDate] = createSignal(dateValue(event));
	const [showsWeather, setShowsWeather] = createSignal(event.showsWeather);
	const [tagSections, setTagSections] = createSignal<EventTagSection[]>([]);
	const [selectedTagIDs, setSelectedTagIDs] = createSignal<string[]>(
		event.tagIDs ?? [],
	);
	const [saving, setSaving] = createSignal(false);
	const [status, setStatus] = createSignal<string | null>(null);

	onMount(() => {
		if (!event.isGlobal) {
			return;
		}

		apiRequest<{ sections: EventTagSection[] }>("v1/tags")
			.then((response) => setTagSections(response.sections))
			.catch(() => setTagSections([]));
	});

	const save = async () => {
		const [year, month, day] = date().split("-").map(Number);
		if (!year || !month || !day) {
			setStatus("Choose a valid event date.");
			return;
		}
		setSaving(true);
		setStatus(null);
		try {
			const endpoint = `v1/events/${event.isGlobal ? "global" : "private"}/${event.id}`;
			const updated = await apiRequest<{
				privateEvents?: CalendarEvent[];
				globalEvents?: CalendarEvent[];
			}>(endpoint, {
				method: "PUT",
				body: JSON.stringify({
					id: event.id,
					title: title().trim(),
					notes: notes().trim() || null,
					symbol: symbol().trim() || "calendar",
					date: { year, month, day },
					tagIDs: selectedTagIDs(),
					baseRevision: event.revision,
					showsWeather: event.isGlobal && showsWeather(),
				}),
			});
			const replacement = [
				...(updated.globalEvents ?? []),
				...(updated.privateEvents ?? []),
			].find((candidate) => candidate.id === event.id) ?? {
				...event,
				title: title().trim(),
				notes: notes().trim() || undefined,
				symbol: symbol().trim() || "calendar",
				date: { year, month, day },
				tagIDs: selectedTagIDs(),
				showsWeather: event.isGlobal && showsWeather(),
			};
			onChanged(replacement);
			dismiss();
		} catch (error) {
			setStatus((error as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const remove = async () => {
		setSaving(true);
		try {
			await apiRequest(
				`v1/events/${event.isGlobal ? "global" : "private"}/${event.id}?baseRevision=${event.revision}`,
				{ method: "DELETE" },
			);
			onChanged(null);
			dismiss();
		} catch (error) {
			setStatus((error as Error).message);
			setSaving(false);
		}
	};

	return (
		<div class={styles.detailDrawer}>
			{showHeader ? (
				<header class={styles.detailHeader}>
					<div>
						<h2>{event.title}</h2>
						<p>
							{new Date(
								event.date.year,
								event.date.month - 1,
								event.date.day,
							).toLocaleDateString("en-AU", { dateStyle: "long" })}
						</p>
					</div>
				</header>
			) : null}
			<section class={styles.formCard}>
				<label>
					Title
					<Input
						value={title()}
						onChange={(input) => setTitle(input.target.value)}
						maxLength={120}
						disabled={readOnly || saving()}
					/>
				</label>
				<label>
					Notes
					<Textarea
						value={notes()}
						onChange={(input) => setNotes(input.target.value)}
						rows={3}
						maxLength={2000}
						disabled={readOnly || saving()}
					/>
				</label>
				<label>
					Symbol
					<Input
						value={symbol()}
						onChange={(input) => setSymbol(input.target.value)}
						maxLength={120}
						disabled={readOnly || saving()}
					/>
				</label>
				<label>
					Date
					<Input
						type="date"
						value={date()}
						onChange={(input) => setDate(input.target.value)}
						disabled={readOnly || saving()}
					/>
				</label>
				{event.isGlobal ? (
					<section class={styles.formCard} aria-labelledby="event-tags-title">
						<h3 id="event-tags-title">Tags</h3>
						{tagSections().length ? (
							tagSections()
								.flatMap((section) => section.tags)
								.map((tag) => {
									const selected = selectedTagIDs().includes(tag.id);
									return (
										<Button
											type="button"
											class={styles.tagOption}
											aria-pressed={selected}
											aria-label={`${tag.displayName}${selected ? ", selected" : ""}`}
											disabled={readOnly || saving() || !allowsTagEditing}
											onClick={() =>
												setSelectedTagIDs(selected ? [] : [tag.id])
											}
										>
											{tag.displayName}
											<span class={styles.tagSymbols} aria-hidden="true">
												<Symbol name={tag.symbol ?? "tag"} />
												{selected ? <Symbol name="checkmark" /> : null}
											</span>
										</Button>
									);
								})
						) : (
							<p class={styles.detailMuted}>Loading event tags…</p>
						)}
					</section>
				) : null}
				{event.isGlobal ? (
					<ListRow class={styles.toggleRow}>
						<span>Show Weather</span>
						<Toggle
							checked={showsWeather}
							onCheckedChange={setShowsWeather}
							disabled={readOnly || saving()}
							aria-label="Show Weather"
						/>
					</ListRow>
				) : null}
			</section>
			{status() ? (
				<p class={styles.detailMuted} role="alert">
					{status()}
				</p>
			) : null}
			{!readOnly ? (
				<DrawerFooter class={styles.actionFooter}>
					<Button
						variant="destructive"
						flexible
						aria-label="Delete event"
						onClick={() => void remove()}
						disabled={saving()}
					>
						<Symbol name="trash" />
						Delete
					</Button>
					<Button
						flexible
						aria-label="Save event"
						onClick={() => void save()}
						disabled={saving() || !title().trim()}
					>
						<Symbol name="checkmark" />
						{saving() ? "Saving…" : "Save"}
					</Button>
				</DrawerFooter>
			) : null}
		</div>
	);
}

function dateValue(event: CalendarEvent) {
	return `${event.date.year}-${String(event.date.month).padStart(2, "0")}-${String(event.date.day).padStart(2, "0")}`;
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
