"use client";

import { NativeSelect as Select } from "@/components/ui/NativeSelect";
import { useMemo, useState } from "react";
import { useDrawer } from "../Drawer/Drawer";
import styles from "../Drawer/Drawer.module.css";
import { Button } from "@base-ui/react/button";

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
	const [timeMinutes, setTimeMinutes] = useState(8 * 60);
	const [dayOffset, setDayOffset] = useState(0);
	const times = useMemo(
		() =>
			Array.from(
				{ length: ((22 - 5) * 60) / 15 + 1 },
				(_, index) => 5 * 60 + index * 15,
			),
		[],
	);

	const add = () => {
		onSave({
			hour: Math.floor(timeMinutes / 60),
			minute: timeMinutes % 60,
			dayOffset,
		});
		closeDrawer();
	};

	return (
		<div className={styles.detailDrawer}>
			<header className={styles.detailHeader}>
				<div>
					<h2>Event Notification</h2>
					<p>Choose when school events should be announced.</p>
				</div>
			</header>
			<section className={styles.formCard}>
				<label>
					Send notification
					<Select
						value={dayOffset}
						onChange={(event) => setDayOffset(Number(event.target.value))}
					>
						{offsets.map((offset) => (
							<option key={offset.value} value={offset.value}>
								{offset.label}
							</option>
						))}
					</Select>
				</label>
				<label>
					Time
					<Select
						value={timeMinutes}
						onChange={(event) => setTimeMinutes(Number(event.target.value))}
					>
						{times.map((minutes) => (
							<option key={minutes} value={minutes}>
								{formatTime(minutes)}
							</option>
						))}
					</Select>
				</label>
				<div className={styles.drawerActions}>
					<Button aria-label="Add event notification schedule" onClick={add}>
						Add schedule
					</Button>
				</div>
			</section>
		</div>
	);
}
