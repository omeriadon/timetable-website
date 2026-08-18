"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { apiRequest } from "@/lib/api/client";
import type { Account } from "@/lib/api/contracts";
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
	const [isAdministrator, setIsAdministrator] = useState(false);

	useEffect(() => {
		apiRequest<Account>("v1/account")
			.then((account) => setIsAdministrator(account.authority.toLowerCase().includes("admin") || account.authority.toLowerCase().includes("owner")))
			.catch(() => setIsAdministrator(false));
	}, []);

	return (
		<nav
			className={styles.tabBar}
			style={{ "--tab-count": isAdministrator ? 5 : 4 } as CSSProperties}
			aria-label="Primary navigation"
		>
			{tabs.filter((tab) => tab.label !== "Admin" || isAdministrator).map((tab) => {
				const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

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
