"use client";

import styles from "./Sidebar.module.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	CalendarDays,
	ChartNoAxesColumn,
	LayoutDashboard,
	Settings,
} from "lucide-react";

const navItems = [
	{ label: "Overview", href: "/", icon: LayoutDashboard },
	{ label: "Schedule", href: "/timetable", icon: CalendarDays },
	{ label: "Classes", href: "/classes", icon: ChartNoAxesColumn },
	{ label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className={styles.sidebar} aria-label="Sidebar navigation">
			<Image src="/icon.png" alt="Photo" width={100} height={100} />

			<nav className={styles.sidebarNav} aria-label="Main navigation">
				{navItems.map((item) => {
					const Icon = item.icon;

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
							<Icon size={18} aria-hidden="true" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
