"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import Symbol from "@/components/controls/Symbol/Symbol";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import CalendarImportDrawer from "@/components/drawers/CalendarImportDrawer/CalendarImportDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { List, ListRow } from "@/components/ui/list";
import styles from "./page.module.css";
import { apiRequest } from "@/lib/api/client";
import type { Account } from "@/lib/api/contracts";
import type { OwnerTimetable } from "@/features/timetable/types";
import NavigationRow from "@/components/settings/NavigationRow/NavigationRow";
import VersionDrawer from "@/components/settings/VersionDrawer/VersionDrawer";

type Settings = {
	liveActivitiesEnabled: boolean;
	appFontDesign: string;
	appBackground: string;
	futureEventRange: string;
	watchBleedEnabled: boolean;
	notificationsEnabled: boolean;
	broadcastNotificationsEnabled: boolean;
	notificationLeadTimes: number[];
	breakToPeriodNotificationLeadTimes: number[];
	eventNotificationSchedules: unknown[];
	calendarEventAutoDeleteDays: number;
	serverRevision: number;
};

export default function SettingsPage() {
	const setToolbar = useToolbar();
	const [account, setAccount] = useState<Account | null>(null);
	const [settings, setSettings] = useState<Settings | null>(null);
	const [timetable, setTimetable] = useState<OwnerTimetable | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const { openDrawer } = useDrawer();

	useEffect(() => {
		setToolbar({ title: "Settings" });
		Promise.all([
			apiRequest<Account>("v1/account"),
			apiRequest<Settings>("v1/settings"),
		])
			.then(([user, values]) => {
				setAccount(user);
				setSettings(values);
			})
			.catch((requestError: Error) => setError(requestError.message));
		apiRequest<OwnerTimetable>("v1/timetables/owner")
			.then(setTimetable)
			.catch(() => setTimetable(null));
	}, [setToolbar]);

	const updateFutureEventRange = async (futureEventRange: string) => {
		if (!settings || saving || settings.futureEventRange === futureEventRange) {
			return;
		}
		await saveSettings(settings, { ...settings, futureEventRange });
	};

	const saveSettings = async (current: Settings, next: Settings) => {
		setSettings(next);
		setSaving(true);
		setError(null);

		try {
			const updated = await apiRequest<Settings>("v1/settings", {
				method: "PUT",
				body: JSON.stringify({
					...next,
					serverRevision: current.serverRevision,
				}),
			});
			setSettings(updated);
		} catch (requestError) {
			setSettings(current);
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<main className={styles.page}>
			{account ? (
				<Link
					className={`${styles.rowButton} ${styles.profileButton}`}
					href="/settings/profile-appearance"
					aria-label="Open profile appearance"
				>
					<section className={`${styles.paper} ${styles.profileRow}`}>
						<ProfilePicture profile={account} size={52} />
						<span>
							<b className={styles.profileName}>{account.displayName}</b>
							<small className={styles.profileEmail}>{account.email}</small>
						</span>
						<Symbol name="chevron.right" className={styles.chevronIcon} />
					</section>
				</Link>
			) : null}
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			<h2 className={styles.section}>My Timetable</h2>
			<List>
				<Button
					type="button"
					className={styles.rowButton}
					onClick={() =>
						openDrawer(
							<CalendarImportDrawer
								timetable={timetable}
								onImported={setTimetable}
							/>,
						)
					}
				>
					<div className={styles.row}>
						<Symbol name="calendar" fallback="▦" />
						<span>
							<span className={styles.label}>Re-import from Calendar</span>
							<small className={styles.detail}>
								Subscribe to Compass Schedule in Calendar first.
							</small>
						</span>
						<Symbol name="chevron.right" className={styles.chevronIcon} />
					</div>
				</Button>
				<NavigationRow
					title="Edit"
					description="Update subjects and weekly classes."
					href="/timetable"
					icon="pencil.and.list.clipboard"
					direct
				/>
			</List>
			<h2 className={styles.section}>Preferences</h2>
			<List>
				{settings ? (
					<>
						<NavigationRow
							title="Appearance"
							description="Choose the app font and background material."
							href="/settings/appearance"
							icon="paintpalette"
							direct
						/>
						<NavigationRow
							title="Updates & Notifications"
							description="Control Live Activities, class notifications, event notifications, and sync."
							href="/settings/notifications"
							icon="switch.2"
							direct
						/>
						<ListRow className={styles.row}>
							<Symbol name="calendar.badge.clock" />
							<span className={styles.label}>Show Future Events</span>
							<Select
								value={settings.futureEventRange}
								disabled={saving}
								onValueChange={(value) => {
									if (value !== null) {
										void updateFutureEventRange(value);
									}
								}}
							>
								<SelectTrigger
									className={styles.inlineSelect}
									aria-label="Show Future Events range"
								>
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="oneWeek">1 Week</SelectItem>
									<SelectItem value="twoWeeks">2 Weeks</SelectItem>
									<SelectItem value="oneMonth">1 Month</SelectItem>
									<SelectItem value="twoMonths">2 Months</SelectItem>
									<SelectItem value="threeMonths">3 Months</SelectItem>
									<SelectItem value="endOfYear">Until End of Year</SelectItem>
								</SelectContent>
							</Select>
						</ListRow>
						<NavigationRow
							title="Archived Events"
							description="Review and edit past calendar events."
							href="/settings/archived-events"
							icon="archivebox"
							direct
						/>
					</>
				) : (
					<p className={styles.loading}>Loading preferences…</p>
				)}
			</List>
			<h2 className={styles.section}>Developer</h2>
			<List>
				<NavigationRow
					title="Release App Icon"
					description="Choose the alternate release icon preference for this website installation."
					href="/settings/developer"
					icon="app.badge"
				/>
				<NavigationRow
					title="Debug Offset"
					description="Adjust the local timetable debug clock offset."
					href="/settings/developer"
					icon="clock.arrow.trianglehead.counterclockwise.rotate.90"
				/>
				<NavigationRow
					title="Test Live Activity"
					description="Send authenticated Live Activity debug requests to the server."
					href="/settings/developer"
					icon="rectangle.bottomthird.inset.filled"
				/>
				<NavigationRow
					title="Test status badges"
					description="Exercise progress, success, warning, and error status surfaces."
					href="/settings/developer"
					icon="app.badge"
				/>
				<NavigationRow
					title="Reload widgets now"
					description="Reload website data and refresh the current client state."
					href="/settings/developer"
					icon="widget.large"
				/>
				<NavigationRow
					title="Reset Tips"
					description="Clear locally stored website tip state."
					href="/settings/developer"
					icon="lightbulb"
				/>
				<NavigationRow
					title="Last Server Sync"
					description="Inspect the most recent authenticated settings refresh."
					href="/settings/developer"
					icon="checkmark.icloud"
				/>
			</List>
			<h2 className={styles.section}>Support</h2>
			<List>
				<NavigationRow
					title="Report Feedback or Bug"
					description="Send feedback through the authenticated server."
					href="/settings/feedback"
					icon="exclamationmark.bubble"
					direct
				/>
				<NavigationRow
					title="About Timetable"
					description="View website client information."
					href="/settings/about"
					icon="info.circle"
					direct
				/>
				<Button
					type="button"
					className={styles.rowButton}
					onClick={() => openDrawer(<VersionDrawer />)}
					aria-label="Open version information"
				>
					<div className={styles.row}>
						<Symbol name="hammer" fallback="+" />
						<span className={styles.label}>Version</span>
						<span className={styles.detail}>Web</span>
						<Symbol name="chevron.right" className={styles.chevronIcon} />
					</div>
				</Button>
			</List>
		</main>
	);
}
