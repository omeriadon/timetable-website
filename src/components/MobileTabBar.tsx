"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileTabBar.module.css";

const tabs = [
	{ href: "/", label: "Timetable", symbol: "▤" },
	{ href: "/friends", label: "Friends", symbol: "♧" },
	{ href: "/grades", label: "Grades", symbol: "▥" },
	{ href: "/settings", label: "Settings", symbol: "◉" },
	{ href: "/administration", label: "Admin", symbol: "▣" },
];

export default function MobileTabBar() {
	const pathname = usePathname();

	return (
		<nav className={styles.tabBar} aria-label="Primary navigation">
			{tabs.map((tab) => {
				const active = pathname === tab.href;

				return (
					<Link
						key={tab.href}
						href={tab.href}
						className={active ? `${styles.tab} ${styles.active}` : styles.tab}
						aria-current={active ? "page" : undefined}
					>
						<span className={styles.symbol} aria-hidden="true">{tab.symbol}</span>
						<span>{tab.label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
