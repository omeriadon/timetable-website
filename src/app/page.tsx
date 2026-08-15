"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar";

export const dynamic = "force-dynamic";

export default function Home() {
	const [notice, setNotice] = useState("Your week is ready to review.");
	const setToolbar = useToolbar();

	useEffect(() => {
		setToolbar({
			title: "Overview",
			subtitle: "A quick look at what is happening next.",
			onAdd: () => setNotice("New overview item created."),
		});
	}, [setToolbar]);

	return (
		<main className={styles.contentPanel}>
			<section className={styles.panel}>
				<div className={styles.panelHeader}>
					<div>
						<p className={styles.eyebrow}>Monday, 18 August</p>
						<h2>Today’s overview</h2>
					</div>
					<span className={styles.status}>On track</span>
				</div>

				<div className={styles.summaryGrid}>
					<div>
						<strong>4</strong>
						<span>Classes today</span>
					</div>
					<div>
						<strong>2</strong>
						<span>Tasks due</span>
					</div>
					<div>
						<strong>86%</strong>
						<span>Week complete</span>
					</div>
				</div>

				<p className={styles.notice}>{notice}</p>
			</section>
		</main>
	);
}
