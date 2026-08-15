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
			onAdd: () => setNotice("New overview item created."),
		});
	}, [setToolbar]);

	return (
		<main className={styles.contentPanel}>
			<section className={styles.panel}>
				<p>Today’s overview</p>

				<div>
					{Array.from({ length: 100 }, (_, index) => (
						<span key={index} className={styles.mockItem}>
							{index + 1}
						</span>
					))}
				</div>

				<p className={styles.notice}>{notice}</p>
			</section>
		</main>
	);
}
