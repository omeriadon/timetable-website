"use client";

import Symbol from "@/components/controls/Symbol/Symbol";
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
		</div>
	);
}
