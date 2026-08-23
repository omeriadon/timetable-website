"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import styles from "./page.module.css";
import { apiRequest } from "@/lib/api/client";
import DrawerTrigger from "@/components/drawers/DrawerTrigger/DrawerTrigger";
import NavigationDrawer from "@/components/drawers/NavigationDrawer/NavigationDrawer";
import Symbol from "@/components/controls/Symbol/Symbol";
import {
	List,
	ListRow,
	ListSection,
	ListSectionHeader,
} from "@/components/ui/list";

type Dashboard = {
	isAdmin: boolean;
	authority: string;
	pendingModerationCount: number;
};
const sections = [
	[
		"Overview",
		[
			["chart.bar", "Statistics", "statistics"],
			["person.2", "Users", "users"],
		],
	],
	["Moderation", [["exclamationmark.bubble", "User Reports", "user-reports"]]],
	[
		"School Content",
		[
			["calendar.badge.exclamationmark", "School Events", "school-events"],
			["tag", "Event Tags", "event-tags"],
			["calendar.badge.clock", "Term Dates", "term-dates"],
			["calendar.badge.exclamationmark", "Pupil Free Days", "pupil-free-days"],
		],
	],
	[
		"Notifications",
		[
			["megaphone", "Broadcast Notification", "broadcast-notification"],
			[
				"clock.arrow.trianglehead.counterclockwise.rotate.90",
				"Broadcast History",
				"broadcast-notifications",
			],
			["envelope.badge", "Email Log", "email-log"],
		],
	],
	["Testing", [["textformat.size", "Font Width Test", "font-width-test"]]],
	[
		"System Administration",
		[
			["person.3", "About Contributors", "about-contributors"],
			["person.badge.shield.checkmark", "Administrators", "administrators"],
			["arrow.down.app", "App Version", "app-version"],
			["testtube.2", "Debug Testing", "server-access"],
			["externaldrive.fill", "Profile Storage", "profile-storage-quota"],
			["rosette", "Badges", "badges"],
			["envelope.badge", "Send Test Email", "test-email"],
		],
	],
];

export default function AdministrationPage() {
	const setToolbar = useToolbar();
	const [dashboard, setDashboard] = useState<Dashboard | null>(null);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		setToolbar({ title: "Administration" });
		apiRequest<Dashboard>("v1/administration")
			.then(setDashboard)
			.catch((requestError: Error) => setError(requestError.message));
	}, [setToolbar]);
	return (
		<main className={styles.page}>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			{dashboard && !dashboard.isAdmin ? (
				<List>
					<ListRow>
						<Symbol name="exclamationmark.bubble" />
						<span className={styles.label}>Administrator access required.</span>
					</ListRow>
				</List>
			) : null}
			{dashboard?.isAdmin
				? sections
						.filter(
							([heading]) =>
								heading !== "System Administration" ||
								dashboard.authority === "systemOwner",
						)
						.map(([heading, rows]) => (
							<ListSection key={heading as string}>
								<ListSectionHeader className={styles.section}>
									{heading as string}
									{heading === "Moderation" &&
									dashboard.pendingModerationCount > 0
										? ` (${dashboard.pendingModerationCount})`
										: ""}
								</ListSectionHeader>
								{(rows as string[][]).map(([symbol, label, destination]) => (
									<DrawerTrigger
										key={label}
										className={styles.rowButton}
										ariaLabel={`Open ${label}`}
										content={
											<NavigationDrawer
												title={label}
												description={`Manage ${label.toLowerCase()} through the authenticated server.`}
												href={`/administration/${destination}`}
												icon={symbol}
											/>
										}
									>
										<ListRow>
											<Symbol name={symbol} />
											<span className={styles.label}>{label}</span>
											<Symbol name="chevron.right" />
										</ListRow>
									</DrawerTrigger>
								))}
							</ListSection>
						))
				: null}
			{!dashboard && !error ? (
				<p className={styles.loading}>Checking administrator access…</p>
			) : null}
		</main>
	);
}
