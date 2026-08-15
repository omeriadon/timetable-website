"use client";

import styles from "../page.module.css";
import { useEffect } from "react";
import { useToolbar } from "@/components/Toolbar";

export default function Friends() {
	const setToolbar = useToolbar();

	useEffect(() => {
		setToolbar({
			title: "Settings",
		});
	}, [setToolbar]);

	return (
		<main className={styles.contentPanel}>
			<section className={styles.panel}>
				<div className={styles.scheduleItem}>
					<strong>Notifications</strong>
					<span>On</span>
				</div>
				<div className={styles.scheduleItem}>
					<strong>Appearance</strong>
					<span>Dark</span>
				</div>
			</section>
		</main>
	);
}
