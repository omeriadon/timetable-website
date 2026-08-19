"use client";

import Link from "next/link";
import { useDrawer } from "../Drawer/Drawer";
import { List } from "@/components/ui/List";
import styles from "../Drawer/Drawer.module.css";

const links = [
	{ label: "Settings", href: "/settings" },
	{ label: "Appearance", href: "/settings/appearance" },
	{ label: "Updates & Notifications", href: "/settings/notifications" },
];

export default function QuickSettingsDrawer() {
	const { closeDrawer } = useDrawer();

	return (
		<nav className={styles.drawerLinkList} aria-label="Quick settings">
			<List>
				{links.map((link) => (
					<Link
						key={link.href}
						className={styles.drawerLink}
						href={link.href}
						onClick={closeDrawer}
					>
						{link.label}
					</Link>
				))}
			</List>
		</nav>
	);
}
