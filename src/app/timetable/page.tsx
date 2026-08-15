"use client";

import styles from "./page.module.css";
import Toolbar from "@/components/Toolbar";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function Timetable() {
	const [selectedDay, setSelectedDay] = useState("Today");

	return (
		<main className={styles.contentPanel}>
			<Toolbar
				title="Schedule"
				subtitle="Keep your week moving."
				onAdd={() => setSelectedDay("New class")}
			/>
			<section className={styles.panel}>
				<div className={styles.dayPicker}>
					{["Today", "Tomorrow", "Friday"].map((day) => (
						<button
							key={day}
							type="button"
							className={selectedDay === day ? styles.selected : ""}
							onClick={() => setSelectedDay(day)}
						>
							{day}
						</button>
					))}
				</div>
				<div className={styles.scheduleList}>
					{["Mathematics", "Design Studio", "Computer Science"].map((item, index) => (
						<div key={item} className={styles.scheduleItem}>
							<span>{`${9 + index * 2}:00`}</span>
							<strong>{item}</strong>
							<small>Room {index + 12}</small>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
