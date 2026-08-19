"use client";

import styles from "./Sidebar.module.css";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import type { Account } from "@/lib/api/contracts";
import type { Friend } from "@/features/timetable/types";
import { useCompactLayout } from "@/lib/ui/useCompactLayout";
import Symbol from "@/components/controls/Symbol/Symbol";

type SidebarItem = {
	label: string;
	href: string;
	icon: string;
	badge?: boolean;
};

const topGroups: SidebarItem[][] = [
	[
		{
			label: "Today",
			href: "/?mode=today",
			icon: "calendar.day.timeline.left",
		},
		{ label: "Week", href: "/?mode=week", icon: "calendar.badge.clock" },
		{
			label: "Planner",
			href: "/?mode=planner",
			icon: "pencil.and.list.clipboard",
		},
	],
	[{ label: "Friends", href: "/friends", icon: "person.2", badge: true }],
	[{ label: "Grades", href: "/grades", icon: "chart.bar.xaxis" }],
];

const bottomItems: SidebarItem[] = [
	{ label: "Settings", href: "/settings", icon: "gear" },
	{
		label: "Administration",
		href: "/administration",
		icon: "calendar.badge.lock",
	},
];

export default function Sidebar() {
	const isCompact = useCompactLayout();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const activeMode = searchParams.get("mode") ?? "today";
	const [isAdministrator, setIsAdministrator] = useState(false);
	const [incomingFriendRequestCount, setIncomingFriendRequestCount] =
		useState(0);

	useEffect(() => {
		apiRequest<Account>("v1/account")
			.then((account) => {
				setIsAdministrator(
					account.authority.toLowerCase().includes("admin") ||
						account.authority.toLowerCase().includes("owner"),
				);
			})
			.catch(() => setIsAdministrator(false));

		apiRequest<Friend[]>("v1/friends/requests")
			.then((incomingRequests) =>
				setIncomingFriendRequestCount(incomingRequests.length),
			)
			.catch(() => setIncomingFriendRequestCount(0));
	}, []);

	if (isCompact) {
		return null;
	}

	function isActive(href: string) {
		if (href.startsWith("/?mode=")) {
			return pathname === "/" && href.endsWith(activeMode);
		}

		return pathname === href || pathname.startsWith(`${href}/`);
	}

	function renderItem(item: SidebarItem) {
		return (
			<Link
				key={item.href}
				href={item.href}
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
				<Symbol
					src="/icon.png"
					className={styles.brandIcon}
					alt=""
					aria-hidden="true"
					loading="eager"
					width={44}
					height={44}
				/>
				<div>
					<strong>Timetable</strong>
					<span>School week</span>
				</div>
			</div>

			<nav className={styles.sidebarNav} aria-label="Main navigation">
				{topGroups.map((group, index) => (
					<div key={index} className={styles.sidebarGroup}>
						{group.map(renderItem)}
					</div>
				))}
			</nav>
			<nav className={styles.sidebarBottom} aria-label="Account navigation">
				{bottomItems
					.filter((item) => item.label !== "Administration" || isAdministrator)
					.map(renderItem)}
			</nav>
		</aside>
	);
}
