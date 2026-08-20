"use client";

import Symbol from "@/components/controls/Symbol/Symbol";
import { Button } from "@/components/ui/button";
import { useDrawer } from "../Drawer/Drawer";
import styles from "../Drawer/Drawer.module.css";

type MessageDrawerProps = {
	title: string;
	message: string;
	tone?: "info" | "error";
};

export default function MessageDrawer({
	title,
	message,
	tone = "error",
}: MessageDrawerProps) {
	const { closeDrawer } = useDrawer();

	return (
		<div className={styles.detailDrawer}>
			<header className={styles.detailHeader}>
				<Symbol
					name={tone === "error" ? "exclamationmark.triangle" : "info.circle"}
					fallback={tone === "error" ? "!" : "i"}
				/>
				<div>
					<h2>{title}</h2>
					<p>{message}</p>
				</div>
			</header>
			<div className={styles.drawerActions}>
				<Button aria-label="Close" onClick={closeDrawer}>
					<Symbol name="checkmark" fallback="✓" />
					Close
				</Button>
			</div>
		</div>
	);
}
