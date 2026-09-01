import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import type { AdministrationData } from "@/lib/server/page-data.functions";
import styles from "./page.module.css";
import { apiRequest } from "@/lib/api/client";
import DrawerTrigger from "@/components/drawers/DrawerTrigger/DrawerTrigger";
import Symbol from "@/components/controls/Symbol/Symbol";
import {
	List,
	ListRow,
	ListSection,
	ListSectionHeader,
} from "@/components/ui/list";
import AdminStatisticsEditor from "@/components/administration/AdminStatisticsEditor/AdminStatisticsEditor";
import AdminUsersEditor from "@/components/administration/AdminUsersEditor/AdminUsersEditor";
import AdminUserReportsEditor from "@/components/administration/AdminUserReportsEditor/AdminUserReportsEditor";
import AdminCalendarEditor from "@/components/administration/AdminCalendarEditor/AdminCalendarEditor";
import AdminEventTagsEditor from "@/components/administration/AdminEventTagsEditor/AdminEventTagsEditor";
import BroadcastNotificationEditor from "@/components/administration/BroadcastNotificationEditor/BroadcastNotificationEditor";
import AdminBroadcastHistoryEditor from "@/components/administration/AdminBroadcastHistoryEditor/AdminBroadcastHistoryEditor";
import AdminEmailLogEditor from "@/components/administration/AdminEmailLogEditor/AdminEmailLogEditor";
import AdminAboutContributorsEditor from "@/components/administration/AdminAboutContributorsEditor/AdminAboutContributorsEditor";
import AdminAdministratorsEditor from "@/components/administration/AdminAdministratorsEditor/AdminAdministratorsEditor";
import AdminAppVersionEditor from "@/components/administration/AdminAppVersionEditor/AdminAppVersionEditor";
import AdminDevelopmentAccessEditor from "@/components/administration/AdminDevelopmentAccessEditor/AdminDevelopmentAccessEditor";
import AdminProfileStorageEditor from "@/components/administration/AdminProfileStorageEditor/AdminProfileStorageEditor";
import AdminBadgesEditor from "@/components/administration/AdminBadgesEditor/AdminBadgesEditor";
import TestEmailButton from "@/components/administration/TestEmailButton/TestEmailButton";

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

export default function AdministrationPage({
	data,
}: {
	data: AdministrationData;
}) {
	const initial = data;
	const setToolbar = useToolbar();
	const [dashboard] = useState<Dashboard>(initial);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => setToolbar({ title: "Administration" }), [setToolbar]);
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
			{dashboard?.isAdmin ? (
				<List>
					{sections
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
										content={administrationDrawerContent(destination)}
									>
										<ListRow>
											<Symbol name={symbol} />
											<span className={styles.label}>{label}</span>
											<Symbol name="chevron.right" />
										</ListRow>
									</DrawerTrigger>
								))}
							</ListSection>
						))}
				</List>
			) : null}
			{!dashboard && !error ? (
				<p className={styles.loading}>Checking administrator access…</p>
			) : null}
		</main>
	);
}

function administrationDrawerContent(destination: string) {
	switch (destination) {
		case "statistics":
			return <AdminStatisticsEditor />;
		case "users":
			return <AdminUsersEditor />;
		case "user-reports":
			return <AdminUserReportsEditor />;
		case "school-events":
			return <AdminCalendarEditor kind="event" title="School Events" />;
		case "event-tags":
			return <AdminEventTagsEditor />;
		case "term-dates":
			return <AdminCalendarEditor kind="term" title="Term Dates" />;
		case "pupil-free-days":
			return <AdminCalendarEditor kind="noSchool" title="Pupil Free Days" />;
		case "broadcast-notification":
			return <BroadcastNotificationEditor />;
		case "broadcast-notifications":
			return <AdminBroadcastHistoryEditor />;
		case "email-log":
			return <AdminEmailLogEditor />;
		case "about-contributors":
			return <AdminAboutContributorsEditor />;
		case "administrators":
			return <AdminAdministratorsEditor />;
		case "app-version":
			return <AdminAppVersionEditor />;
		case "server-access":
			return <AdminDevelopmentAccessEditor />;
		case "profile-storage-quota":
			return <AdminProfileStorageEditor />;
		case "badges":
			return <AdminBadgesEditor />;
		case "test-email":
			return <TestEmailButton />;
		default:
			return null;
	}
}
