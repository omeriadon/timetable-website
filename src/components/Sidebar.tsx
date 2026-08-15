"use client";

import styles from "./Sidebar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{ label: "Overview", href: "/", icon: "chart.bar.xaxis.svg" },
	{ label: "Schedule", href: "/timetable", icon: "calendar.day.timeline.left.svg" },
	{ label: "Classes", href: "/classes", icon: "person.2.svg" },
	{ label: "Settings", href: "/settings", icon: "gear.svg" },
];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className={styles.sidebar} aria-label="Sidebar navigation">
			<Image src="/icon.png" alt="Photo" width={100} height={100} />

			<nav className={styles.sidebarNav} aria-label="Main navigation">
				{navItems.map((item) => {
					return (
						<Link
							key={item.href}
							href={item.href}
							className={
								pathname === item.href
									? `${styles.sidebarLink} ${styles.active}`
									: styles.sidebarLink
							}
							aria-current={pathname === item.href ? "page" : undefined}
						>
							<img
								className={styles.navIcon}
								src={`/icons/${item.icon}`}
								alt=""
								aria-hidden="true"
							/>
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
