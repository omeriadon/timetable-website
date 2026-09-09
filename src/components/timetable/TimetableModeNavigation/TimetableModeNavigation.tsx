import { Link } from "@tanstack/solid-router";
import { useLocation } from "@tanstack/solid-router";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/timetable/timetable.module.css";

const modes = [
	{ href: "/today", label: "Today", icon: "calendar.day.timeline.left" },
	{ href: "/week", label: "Week", icon: "7.calendar" },
	{ href: "/planner", label: "Planner", icon: "pencil.and.list.clipboard" },
] as const;

export default function TimetableModeNavigation() {
	const pathname = useLocation({ select: (location) => location.pathname });

	return (
		<nav class={styles.modePicker} aria-label="Timetable section">
			{modes.map((mode) => (
				<Link
					to={mode.href}
					class={pathname() === mode.href ? styles.activeMode : undefined}
					aria-current={pathname() === mode.href ? "page" : undefined}
				>
					<Symbol name={mode.icon} class={styles.modeIcon} />
					{mode.label}
				</Link>
			))}
		</nav>
	);
}
