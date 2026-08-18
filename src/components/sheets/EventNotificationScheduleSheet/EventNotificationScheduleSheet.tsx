"use client";

import { useMemo, useState } from "react";
import { useSheet } from "../Sheet/Sheet";
import styles from "../Sheet/Sheet.module.css";

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

export default function EventNotificationScheduleSheet({
	onSave,
}: {
	onSave: (schedule: EventNotificationSchedule) => void;
}) {
	const { closeSheet } = useSheet();
	const [timeMinutes, setTimeMinutes] = useState(8 * 60);
	const [dayOffset, setDayOffset] = useState(0);
	const times = useMemo(
		() => Array.from({ length: ((22 - 5) * 60) / 15 + 1 }, (_, index) => 5 * 60 + index * 15),
		[],
	);

	const add = () => {
		onSave({
			hour: Math.floor(timeMinutes / 60),
			minute: timeMinutes % 60,
			dayOffset,
		});
		closeSheet();
	};

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<div>
					<h2>Event Notification</h2>
					<p>Choose when school events should be announced.</p>
				</div>
			</header>
			<section className={styles.formCard}>
				<label>
					Send notification
					<select value={dayOffset} onChange={(event) => setDayOffset(Number(event.target.value))}>
						{offsets.map((offset) => <option key={offset.value} value={offset.value}>{offset.label}</option>)}
					</select>
				</label>
				<label>
					Time
					<select value={timeMinutes} onChange={(event) => setTimeMinutes(Number(event.target.value))}>
						{times.map((minutes) => <option key={minutes} value={minutes}>{formatTime(minutes)}</option>)}
					</select>
					</label>
				<div className={styles.sheetActions}>
					<button type="button" className={styles.primaryButton} onClick={add}>Add schedule</button>
				</div>
			</section>
		</div>
	);
}
