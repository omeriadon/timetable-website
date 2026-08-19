"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import type { Account } from "@/lib/api/contracts";
import type { Friend } from "@/features/timetable/types";
import { useCompactLayout } from "@/lib/ui/useCompactLayout";
import Symbol from "@/components/controls/Symbol/Symbol";

type TabItem = {
	href: string;
	label: string;
	icon: string;
	badge?: boolean;
};

const tabs: TabItem[] = [
	{ href: "/", label: "Home", icon: "house" },
	{ href: "/friends", label: "Friends", icon: "person.2", badge: true },
	{ href: "/grades", label: "Grades", icon: "chart.bar.xaxis" },
	{ href: "/settings", label: "Settings", icon: "gear" },
	{ href: "/administration", label: "Admin", icon: "calendar.badge.lock" },
];

export default function MobileTabBar() {
	const isCompact = useCompactLayout();
	const pathname = usePathname();
	const [isAdministrator, setIsAdministrator] = useState(false);
	const [incomingFriendRequestCount, setIncomingFriendRequestCount] =
		useState(0);

	useEffect(() => {
		apiRequest<Account>("v1/account")
			.then((account) =>
				setIsAdministrator(
					account.authority.toLowerCase().includes("admin") ||
						account.authority.toLowerCase().includes("owner"),
				),
			)
			.catch(() => setIsAdministrator(false));
		apiRequest<Friend[]>("v1/friends/requests")
			.then((incomingRequests) =>
				setIncomingFriendRequestCount(incomingRequests.length),
			)
			.catch(() => setIncomingFriendRequestCount(0));
	}, []);

	if (!isCompact) {
		return null;
	}

	return (
		<nav aria-label="Primary navigation">
			{tabs
				.filter((tab) => tab.label !== "Admin" || isAdministrator)
				.map((tab) => {
					const active =
						tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

					return (
						<Link
							key={tab.href}
							href={tab.href}
							aria-current={active ? "page" : undefined}
						>
							<Symbol name={tab.icon} />
							<span>{tab.label}</span>
							{tab.badge && incomingFriendRequestCount > 0 ? (
								<span aria-hidden="true">{incomingFriendRequestCount}</span>
							) : null}
						</Link>
					);
				})}
		</nav>
	);
}
