import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createSignal, onMount } from "solid-js";
import { useRouter } from "@tanstack/solid-router";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import type { SettingsData } from "@/lib/server/page-data.functions";
import Symbol from "@/components/controls/Symbol/Symbol";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import CalendarImportDrawer from "@/components/drawers/CalendarImportDrawer/CalendarImportDrawer";
import DrawerTrigger from "@/components/drawers/DrawerTrigger/DrawerTrigger";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { List, ListRow } from "@/components/ui/list";
import styles from "./page.module.css";
import { apiRequest } from "@/lib/api/client";
import type { Account } from "@/lib/api/contracts";
import type { ProfileAppearance } from "@/lib/api/contracts";
import type { OwnerTimetable } from "@/features/timetable/types";
import NavigationRow from "@/components/settings/NavigationRow/NavigationRow";
import type { Settings } from "@/features/settings/types";
import AppearanceSettingsEditor from "@/components/settings/AppearanceSettingsEditor/AppearanceSettingsEditor";
import NotificationSettingsEditor from "@/components/settings/NotificationSettingsEditor/NotificationSettingsEditor";
import ArchivedEventsEditor from "@/components/settings/ArchivedEventsEditor/ArchivedEventsEditor";
import FeedbackEditor from "@/components/settings/FeedbackEditor/FeedbackEditor";
import ProfileAppearanceEditor from "@/components/settings/ProfileAppearanceEditor/ProfileAppearanceEditor";

export default function SettingsPage({ data }: { data: SettingsData }) {
	const initial = data;
	const setToolbar = useToolbar();
	const router = useRouter();
	const [account, setAccount] = createSignal<Account>(initial.account);
	const [settings, setSettings] = createSignal<Settings>(
		initial.settings as Settings,
	);
	const [timetable, setTimetable] = createSignal<OwnerTimetable>(initial.timetable);
	const [error, setError] = createSignal<string | null>(null);
	const [saving, setSaving] = createSignal(false);
	const { openDrawer } = useDrawer();

	onMount(() => setToolbar({ title: "Settings" }));

	const updateFutureEventRange = async (futureEventRange: string) => {
		if (!settings() || saving() || settings().futureEventRange === futureEventRange) {
			return;
		}
		await saveSettings(settings(), { ...settings(), futureEventRange });
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
			await router.invalidate();
		} catch (requestError) {
			setSettings(current);
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const saveProfileAppearance = async (appearance: ProfileAppearance) => {
		if (!account()) {
			return;
		}

		const updated = await apiRequest<{
			displayName: string;
			appearance: ProfileAppearance;
			photo?: Account["photo"];
			revision: number;
		}>("v1/friends/profile", {
			method: "PUT",
			body: JSON.stringify({
				appearance,
				baseRevision: account().revision,
			}),
		});
		setAccount((current) =>
			current
				? {
						...current,
						appearance: updated.appearance,
						photo: updated.photo,
						revision: updated.revision,
					}
				: current,
		);
		await router.invalidate();
	};

	return (
		<main class={styles.page}>
			{account() ? (
				<DrawerTrigger
					class={`${styles.rowButton} ${styles.profileButton}`}
					ariaLabel="Open profile appearance"
					content={() =>
						account().appearance ? (
							<ProfileAppearanceEditor
								profile={{
									displayName: account().displayName,
									appearance: account().appearance!,
									photo: account().photo,
									revision: account().revision,
								}}
								save={saveProfileAppearance}
							/>
						) : null
					}
				>
					<section class={`${styles.paper} ${styles.profileRow}`}>
						<ProfilePicture profile={account()} size={52} />
						<span>
							<b class={styles.profileName}>{account().displayName}</b>
							<small class={styles.profileEmail}>{account().email}</small>
						</span>
						<Symbol name="chevron.right" />
					</section>
				</DrawerTrigger>
			) : null}
			{error() ? (
				<p class={styles.error} role="alert">
					{error()}
				</p>
			) : null}
			<h2 class={styles.section}>My Timetable</h2>
			<List rowHover>
				<Button
					type="button"
					class={styles.listButton}
					onClick={() =>
						openDrawer(
							() => (<CalendarImportDrawer
								timetable={timetable()}
								onImported={setTimetable}
							/>),
						)
					}
				>
					<ListRow>
						<Symbol name="calendar" fallback="▦" />
						<span class={styles.label}>
							Re-import from Calendar
							<small class={styles.detail}>
								Subscribe to Compass Schedule in Calendar first.
							</small>
						</span>
						<Symbol name="chevron.right" />
					</ListRow>
				</Button>
				<NavigationRow
					title="Edit"
					description="Update subjects and weekly classes."
					href="/timetable"
					icon="pencil.and.list.clipboard"
					direct
				/>
			</List>
			<h2 class={styles.section}>Preferences</h2>
			<List rowHover>
				{settings() ? (
					<>
						<AppearanceSettingsEditor initial={settings()} inline />
						<NavigationRow
							title="Updates & Notifications"
							description="Control Live Activities, class notifications, event notifications, and sync."
							href="/settings/notifications"
							icon="switch.2"
							drawerContent={() => (
								<NotificationSettingsEditor initial={settings()} />
							)}
						/>
						<ListRow>
							<Symbol name="calendar.badge.clock" />
							<span class={styles.label}>Show Future Events</span>
							<Select
								value={settings().futureEventRange}
								disabled={saving()}
								onValueChange={(value) => {
									if (value !== null) {
										void updateFutureEventRange(value);
									}
								}}
							>
								<SelectTrigger
									class={styles.inlineSelect}
									aria-label="Show Future Events range"
								>
									<SelectValue>
										{futureEventRangeLabel(settings().futureEventRange)}
									</SelectValue>
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
							drawerContent={() => <ArchivedEventsEditor />}
						/>
					</>
				) : (
					<p class={styles.loading}>Loading preferences…</p>
				)}
			</List>
			<h2 class={styles.section}>Support</h2>
			<List rowHover>
				<NavigationRow
					title="Report Feedback or Bug"
					description="Send feedback through the authenticated server."
					href="/settings/feedback"
					icon="exclamationmark.bubble"
					drawerContent={() => <FeedbackEditor />}
				/>
				<NavigationRow
					title="About Timetable"
					description="View website client information."
					href="/settings/about"
					icon="info.circle"
					direct
				/>
			</List>
		</main>
	);
}

function futureEventRangeLabel(value: string) {
	switch (value) {
		case "oneWeek":
			return "1 Week";
		case "twoWeeks":
			return "2 Weeks";
		case "oneMonth":
			return "1 Month";
		case "twoMonths":
			return "2 Months";
		case "threeMonths":
			return "3 Months";
		case "endOfYear":
			return "Until End of Year";
		default:
			return value;
	}
}
