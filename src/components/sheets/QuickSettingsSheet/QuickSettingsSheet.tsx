"use client";

import Link from "next/link";
import { useSheet } from "../Sheet/Sheet";
import styles from "../Sheet/Sheet.module.css";

const links = [
	{ label: "Settings", href: "/settings" },
	{ label: "Appearance", href: "/settings/appearance" },
	{ label: "Updates & Notifications", href: "/settings/notifications" },
];

export default function QuickSettingsSheet() {
	const { closeSheet } = useSheet();

	return (
		<nav className={styles.sheetLinkList} aria-label="Quick settings">
			{links.map((link) => (
				<Link
					key={link.href}
					className={styles.sheetLink}
					href={link.href}
					onClick={closeSheet}
				>
					{link.label}
				</Link>
			))}
		</nav>
	);
}
