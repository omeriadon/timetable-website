import { Select, SelectItem } from "@/components/ui/select";
import { createMemo, createSignal } from "solid-js";
import { useDrawer } from "../Drawer/Drawer";
import styles from "../Drawer/Drawer.module.css";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";

export type EventNotificationSchedule = {
	hour: number;
	minute: number;
	dayOffset: number;
};

const offsets = [
	{ value: 0, label: "On the day" },
	{ value: 1, label: "1 day before" },
	{ value: 2, label: "2 days before" },
	{ value: 3, label: "3 days before" },
	{ value: 7, label: "1 week before" },
];

function formatTime(minutes: number) {
	const date = new Date();
	date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
	return date.toLocaleTimeString("en-AU", {
		hour: "numeric",
		minute: "2-digit",
	});
}

export default function EventNotificationScheduleDrawer({
	onSave,
}: {
	onSave: (schedule: EventNotificationSchedule) => void;
}) {
	const { closeDrawer } = useDrawer();
	const [timeMinutes, setTimeMinutes] = createSignal(8 * 60);
	const [dayOffset, setDayOffset] = createSignal(0);
	const times = createMemo(() =>
		Array.from(
			{ length: ((22 - 5) * 60) / 15 + 1 },
			(_, index) => 5 * 60 + index * 15,
		),
	);

	const add = () => {
		onSave({
			hour: Math.floor(timeMinutes() / 60),
			minute: timeMinutes() % 60,
			dayOffset: dayOffset(),
		});
		closeDrawer();
	};

	return (
		<div class={styles.detailDrawer}>
			<header class={styles.detailHeader}>
				<div>
					<h2>Event Notification</h2>
					<p>Choose when school events should be announced.</p>
				</div>
			</header>
			<section class={styles.formCard}>
				<label>
					Send notification
					<Select
						value={dayOffset()}
						onValueChange={(value) => {
							if (value !== null) {
								setDayOffset(Number(value));
							}
						}}
					>
						{offsets.map((offset) => (
							<SelectItem value={String(offset.value)}>
								{offset.label}
							</SelectItem>
						))}
					</Select>
				</label>
				<label>
					Time
					<Select
						value={timeMinutes()}
						onValueChange={(value) => {
							if (value !== null) {
								setTimeMinutes(Number(value));
							}
						}}
					>
						{times().map((minutes) => (
							<SelectItem value={String(minutes)}>
								{formatTime(minutes)}
							</SelectItem>
						))}
					</Select>
				</label>
				<DrawerFooter>
					<Button aria-label="Add event notification schedule" onClick={add}>
						Add schedule
					</Button>
				</DrawerFooter>
			</section>
		</div>
	);
}
