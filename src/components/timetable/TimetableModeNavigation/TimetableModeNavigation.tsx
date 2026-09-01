"use client";

import { Link } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useCompactLayout } from "@/lib/ui/useCompactLayout";
import styles from "@/components/timetable/timetable.module.css";

const modes = [
	{ href: "/today", label: "Today", icon: "calendar.day.timeline.left" },
	{ href: "/week", label: "Week", icon: "7.calendar" },
	{ href: "/planner", label: "Planner", icon: "pencil.and.list.clipboard" },
] as const;

export default function TimetableModeNavigation() {
	const isCompact = useCompactLayout();
	const pathname = useLocation({ select: (location) => location.pathname });

	if (!isCompact) {
		return null;
	}

	return (
		<nav className={styles.modePicker} aria-label="Timetable section">
			{modes.map((mode) => (
				<Link
					key={mode.href}
					to={mode.href}
					className={pathname === mode.href ? styles.activeMode : undefined}
					aria-current={pathname === mode.href ? "page" : undefined}
				>
					<Symbol name={mode.icon} className={styles.modeIcon} />
					{mode.label}
				</Link>
			))}
		</nav>
	);
}
