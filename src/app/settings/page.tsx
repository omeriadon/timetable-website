"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import SheetTrigger from "@/components/sheets/SheetTrigger/SheetTrigger";
import NavigationSheet from "@/components/sheets/NavigationSheet/NavigationSheet";
import CalendarImportSheet from "@/components/sheets/CalendarImportSheet/CalendarImportSheet";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import styles from "@/components/IOSScreen/IOSScreen.module.css";
import { apiRequest } from "@/lib/api/client";
import type { Account } from "@/lib/api/contracts";
import type { OwnerTimetable } from "@/features/timetable/types";
import NavigationRow from "@/components/settings/NavigationRow/NavigationRow";
import VersionSheet from "@/components/settings/VersionSheet/VersionSheet";

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
	const { openSheet } = useSheet();

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
				<SheetTrigger
					className={styles.rowButton}
					ariaLabel="Open profile appearance"
					content={
						<NavigationSheet
							title="Profile Appearance"
							description="Change your profile picture, colours, and monogram style."
							href="/settings/profile-appearance"
							icon="person.2"
						/>
					}
				>
					<section className={`${styles.paper} ${styles.profileRow}`}>
						<ProfilePicture profile={account} size={52} />
						<span>
							<b className={styles.profileName}>{account.displayName}</b>
							<small className={styles.profileEmail}>{account.email}</small>
						</span>
						<span className={styles.chevron}>›</span>
					</section>
				</SheetTrigger>
			) : null}
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			<h2 className={styles.section}>My Timetable</h2>
			<section className={styles.card}>
				<button
					type="button"
					className={styles.rowButton}
					onClick={() =>
						openSheet(
							<CalendarImportSheet
								timetable={timetable}
								onImported={setTimetable}
							/>,
						)
					}
				>
					<div className={styles.row}>
						<SymbolIcon name="calendar" fallback="▦" />
						<span>
							<span className={styles.label}>Re-import from Calendar</span>
							<small className={styles.detail}>
								Subscribe to Compass Schedule in Calendar first.
							</small>
						</span>
						<span className={styles.chevron}>›</span>
					</div>
				</button>
				<NavigationRow
					title="Edit"
					description="Update subjects and weekly classes."
					href="/timetable"
					icon="pencil.and.list.clipboard"
				/>
			</section>
			<h2 className={styles.section}>Preferences</h2>
			<section className={styles.card}>
				{settings ? (
					<>
						<NavigationRow
							title="Appearance"
							description="Choose the app font and background material."
							href="/settings/appearance"
							icon="paintpalette"
						/>
						<NavigationRow
							title="Updates & Notifications"
							description="Control Live Activities, class notifications, event notifications, and sync."
							href="/settings/notifications"
							icon="switch.2"
						/>
						<div className={styles.row}>
							<SymbolIcon name="calendar.badge.clock" />
							<span className={styles.label}>Show Future Events</span>
							<select
								className={styles.inlineSelect}
								value={settings.futureEventRange}
								disabled={saving}
								aria-label="Show Future Events range"
								onChange={(event) =>
									void updateFutureEventRange(event.target.value)
								}
							>
								<option value="oneWeek">1 Week</option>
								<option value="twoWeeks">2 Weeks</option>
								<option value="oneMonth">1 Month</option>
								<option value="twoMonths">2 Months</option>
								<option value="threeMonths">3 Months</option>
								<option value="endOfYear">Until End of Year</option>
							</select>
						</div>
						<NavigationRow
							title="Archived Events"
							description="Review and edit past calendar events."
							href="/settings/archived-events"
							icon="archivebox"
						/>
						<NavigationRow
							title="Navigation Persistence"
							description="Restore the selected tab and navigation path when reopening Timetable."
							href="/settings/navigation"
							icon="arrow.counterclockwise.circle"
						/>
					</>
				) : (
					<p className={styles.loading}>Loading preferences…</p>
				)}
			</section>
			<h2 className={styles.section}>Developer</h2>
			<section className={styles.card}>
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
			</section>
			<h2 className={styles.section}>Support</h2>
			<section className={styles.card}>
				<NavigationRow
					title="Report Feedback or Bug"
					description="Send feedback through the authenticated server."
					href="/settings/feedback"
					icon="exclamationmark.bubble"
				/>
				<NavigationRow
					title="About Timetable"
					description="View website client information."
					href="/settings/about"
					icon="info.circle"
				/>
				<button
					type="button"
					className={styles.rowButton}
					onClick={() => openSheet(<VersionSheet />)}
					aria-label="Open version information"
				>
					<div className={styles.row}>
						<SymbolIcon name="hammer" fallback="+" />
						<span className={styles.label}>Version</span>
						<span className={styles.detail}>Web</span>
						<span className={styles.chevron}>›</span>
					</div>
				</button>
			</section>
		</main>
	);
}
