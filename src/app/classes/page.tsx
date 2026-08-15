"use client";

import { useState } from "react";
import Toolbar from "@/components/Toolbar";
import styles from "../page.module.css";

const classes = ["Mathematics", "Design Studio", "Computer Science", "History"];

export default function ClassesPage() {
	const [query, setQuery] = useState("");
	const visibleClasses = classes.filter((item) =>
		item.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<main className={styles.contentPanel}>
			<Toolbar
				title="Classes"
				subtitle="Your current subjects."
				searchPlaceholder="Search classes"
				searchValue={query}
				onSearchChange={setQuery}
			/>
			<section className={styles.panel}>
				{visibleClasses.map((item) => (
					<div key={item} className={styles.scheduleItem}>
						<strong>{item}</strong>
						<span>Next session this week</span>
					</div>
				))}
			</section>
		</main>
	);
}
