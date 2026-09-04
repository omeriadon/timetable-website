import styles from "./Sidebar.module.css";
import { Link } from "@tanstack/react-router";

import { useLocation, useRouteContext } from "@tanstack/react-router";
import { useEffect, useState, CSSProperties } from "react";
import { apiRequest } from "@/lib/api/client";
import type { Friend } from "@/features/timetable/types";
import { useCompactLayout } from "@/lib/ui/useCompactLayout";
import Symbol from "@/components/controls/Symbol/Symbol";

type SidebarItem = {
	label: string;
	href: string;
	icon: string;
	badge?: boolean;
};

const topGroups: SidebarItem[] = [
	{ label: "Today", href: "/today", icon: "calendar.day.timeline.left" },
	{ label: "Week", href: "/week", icon: "calendar.badge.clock" },
	{ label: "Planner", href: "/planner", icon: "pencil.and.list.clipboard" },
	{ label: "Friends", href: "/friends", icon: "person.2", badge: true },
	{ label: "Grades", href: "/grades", icon: "chart.bar.xaxis" },
];

const bottomItems: SidebarItem[] = [
	{ label: "Settings", href: "/settings", icon: "gear" },
	{
		label: "Administration",
		href: "/administration",
		icon: "calendar.badge.lock",
	},
	{ label: "Testing", href: "/testing", icon: "testtube.2" },
];

export default function Sidebar() {
	const isCompact = useCompactLayout();
	const pathname = useLocation({ select: (location) => location.pathname });
	const account = useRouteContext({
		from: "/_authenticated",
		select: (context) => context.account,
	});
	const isAdministrator =
		account.authority.toLowerCase().includes("admin") ||
		account.authority.toLowerCase().includes("owner");
	const [incomingFriendRequestCount, setIncomingFriendRequestCount] =
		useState(0);

	// State or ref to hold dynamic hover values for the brand icon
	const [iconTransformProps, setIconTransformProps] = useState<CSSProperties>(
		{},
	);

	useEffect(() => {
		apiRequest<Friend[]>("v1/friends/requests")
			.then((incomingRequests) =>
				setIncomingFriendRequestCount(incomingRequests.length),
			)
			.catch(() => setIncomingFriendRequestCount(0));
	}, []);

	const handleIconHover = () => {
		const randomDeg = Math.random() * 20 - 10; // -10 to 10
		const randomScale = Math.random() * 0.2 + 0.9; // 0.9 to 1.1

		setIconTransformProps({
			["--random-deg" as string]: `${randomDeg}deg`,
			["--random-scale" as string]: `${randomScale}`,
		} as CSSProperties);
	};

	const handleIconLeave = () => {
		setIconTransformProps({
			["--random-deg" as string]: `0deg`,
			["--random-scale" as string]: `1`,
		} as CSSProperties);
	};

	if (isCompact) {
		return null;
	}

	function isActive(href: string) {
		return pathname === href || pathname.startsWith(`${href}/`);
	}

	function renderItem(item: SidebarItem) {
		return (
			<Link
				key={item.href}
				to={item.href}
				className={
					isActive(item.href)
						? `${styles.sidebarLink} ${styles.active}`
						: styles.sidebarLink
				}
				aria-current={isActive(item.href) ? "page" : undefined}
			>
				<Symbol name={item.icon} className={styles.navIcon} />
				<span>{item.label}</span>
				{item.badge && incomingFriendRequestCount > 0 ? (
					<span
						className={styles.navBadge}
						aria-label={`${incomingFriendRequestCount} pending`}
					>
						{incomingFriendRequestCount}
					</span>
				) : null}
			</Link>
		);
	}

	return (
		<aside className={styles.sidebar} aria-label="Sidebar navigation">
			<div className={styles.saturationOutline} aria-hidden="true" />

			<div className={styles.sidebarHeader}>
				<Link
					to="/"
					className={styles.brandLink}
					aria-label="Home"
					onMouseEnter={handleIconHover}
					onMouseLeave={handleIconLeave}
				>
					<img
						src="/icon-512.webp"
						width={80}
						height={44}
						className={styles.brandIcon}
						style={{
							...iconTransformProps,
							marginRight: "auto",
						}}
						alt=""
						aria-hidden="true"
					/>
				</Link>
			</div>

			<nav className={styles.sidebarNav} aria-label="Main navigation">
				{topGroups.map((item) => renderItem(item))}
			</nav>
			<nav className={styles.sidebarBottom} aria-label="Account navigation">
				{bottomItems
					.filter((item) => item.label !== "Administration" || isAdministrator)
					.map(renderItem)}
			</nav>
		</aside>
	);
}
