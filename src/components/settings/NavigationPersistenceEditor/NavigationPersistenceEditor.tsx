"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { useEffect, useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/settings/Settings.module.css";

const storageKey = "timetable.persist-navigation";

export default function NavigationPersistenceEditor() {
	const [isEnabled, setIsEnabled] = useState(true);

	useEffect(() => {
		const stored = window.localStorage.getItem(storageKey);
		if (stored !== null) {
			setIsEnabled(stored === "true");
		}
	}, []);

	const update = (value: boolean) => {
		setIsEnabled(value);
		window.localStorage.setItem(storageKey, String(value));
	};

	return (
		<section className={styles.card}>
			<div className={styles.row}>
				<Symbol name="arrow.counterclockwise.circle" fallback="↻" />
				<label className={styles.label} htmlFor="restore-navigation">
					Restore Navigation
				</label>
				<Checkbox
					label="Restore Navigation"
					id="restore-navigation"
					checked={isEnabled}
					onCheckedChange={update}
				/>
			</div>
			<p className={styles.detailNote}>
				Restore the selected tab, sidebar, and navigation path when reopening
				Timetable.
			</p>
		</section>
	);
}
