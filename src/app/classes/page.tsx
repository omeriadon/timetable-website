"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar";
import styles from "../page.module.css";

const classes = ["Mathematics", "Design Studio", "Computer Science", "History"];

export default function ClassesPage() {
	const [query, setQuery] = useState("");
	const setToolbar = useToolbar();
	const visibleClasses = classes.filter((item) =>
		item.toLowerCase().includes(query.toLowerCase()),
	);

	useEffect(() => {
		setToolbar({
			title: "Classes",
			searchPlaceholder: "Search classes",
			searchValue: query,
			onSearchChange: setQuery,
		});
	}, [query, setToolbar]);

	return (
		<main className={styles.contentPanel}>
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
