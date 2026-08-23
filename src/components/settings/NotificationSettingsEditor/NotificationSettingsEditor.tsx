"use client";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import SettingToggle from "@/components/controls/SettingToggle/SettingToggle";
import EventNotificationScheduleDrawer, {
	type EventNotificationSchedule,
} from "@/components/drawers/EventNotificationScheduleDrawer/EventNotificationScheduleDrawer";
import NotificationLeadTimesDrawer from "@/components/drawers/NotificationLeadTimesDrawer/NotificationLeadTimesDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import type { Settings } from "@/features/settings/types";
import { List, ListRow } from "@/components/ui/list";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import styles from "@/components/settings/Settings.module.css";

export default function NotificationSettingsEditor({
	initial,
	onSignOut,
}: {
	initial: Settings;
	onSignOut?: () => void;
}) {
	const [draft, setDraft] = useState(initial);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { openDrawer } = useDrawer();

	const saveGeneral = async (next: Settings) => {
		const previous = draft;
		setDraft(next);
		setSaving(true);
		setError(null);
		try {
			const updated = await apiRequest<Settings>("v1/settings", {
				method: "PUT",
				body: JSON.stringify({
					...next,
					serverRevision: previous.serverRevision,
				}),
			});
			setDraft(updated);
		} catch (requestError) {
			setDraft(previous);
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const saveNotifications = async (next: Settings) => {
		const previous = draft;
		setDraft(next);
		setSaving(true);
		setError(null);
		try {
			const updated = await apiRequest<Settings>("v1/settings/notifications", {
				method: "PUT",
				body: JSON.stringify({
					notificationsEnabled: next.notificationsEnabled,
					broadcastNotificationsEnabled: next.broadcastNotificationsEnabled,
					notificationLeadTimes: next.notificationLeadTimes,
					breakToPeriodNotificationLeadTimes:
						next.breakToPeriodNotificationLeadTimes,
					eventNotificationSchedules: next.eventNotificationSchedules,
					serverRevision: previous.serverRevision,
				}),
			});
			setDraft(updated);
		} catch (requestError) {
			setDraft(previous);
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const updateGeneral = (changes: Partial<Settings>) =>
		void saveGeneral({ ...draft, ...changes });
	const updateNotifications = (changes: Partial<Settings>) =>
		void saveNotifications({ ...draft, ...changes });
	const formatLeadTimes = (values: number[]) =>
		values.length ? values.map((value) => `${value}m`).join(", ") : "None";
	const openLeadTimes = (
		key: "notificationLeadTimes" | "breakToPeriodNotificationLeadTimes",
		title: string,
		description: string,
	) => {
		openDrawer(
			<NotificationLeadTimesDrawer
				title={title}
				description={description}
				selection={draft[key]}
				onSave={async (selection) => updateNotifications({ [key]: selection })}
			/>,
		);
	};
	const addSchedule = (schedule: EventNotificationSchedule) => {
		if (
			draft.eventNotificationSchedules.some(
				(item) =>
					item.hour === schedule.hour &&
					item.minute === schedule.minute &&
					item.dayOffset === schedule.dayOffset,
			)
		) {
			return;
		}
		updateNotifications({
			eventNotificationSchedules: [
				...draft.eventNotificationSchedules,
				schedule,
			],
		});
	};
	const removeSchedule = (schedule: EventNotificationSchedule) => {
		updateNotifications({
			eventNotificationSchedules: draft.eventNotificationSchedules.filter(
				(item) =>
					item.hour !== schedule.hour ||
					item.minute !== schedule.minute ||
					item.dayOffset !== schedule.dayOffset,
			),
		});
	};
	const formatTime = (schedule: EventNotificationSchedule) =>
		new Date(2026, 0, 1, schedule.hour, schedule.minute).toLocaleTimeString(
			"en-AU",
			{ hour: "numeric", minute: "2-digit" },
		);
	const formatOffset = (days: number) =>
		days === 0
			? "on the day"
			: days === 7
				? "1 week before"
				: `${days} day${days === 1 ? "" : "s"} before`;

	return (
		<>
			<List rowHover>
				<SettingToggle
					label="Live Activities"
					enabled={draft.liveActivitiesEnabled}
					onClick={() =>
						updateGeneral({
							liveActivitiesEnabled: !draft.liveActivitiesEnabled,
						})
					}
					disabled={saving}
				/>
				<SettingToggle
					label="Watch Bleed"
					enabled={draft.watchBleedEnabled}
					onClick={() =>
						updateGeneral({ watchBleedEnabled: !draft.watchBleedEnabled })
					}
					disabled={saving}
				/>
				<ListRow>
					<Symbol name="calendar.badge.clock" />
					<span className={styles.label}>Delete Past Calendar Events</span>
					<Select
						value={draft.calendarEventAutoDeleteDays}
						disabled={saving}
						onValueChange={(value) => {
							if (value !== null) {
								updateGeneral({
									calendarEventAutoDeleteDays: Number(value),
								});
							}
						}}
					>
						<SelectTrigger aria-label="Delete Past Calendar Events">
							<SelectValue>
								{deleteEventLabel(draft.calendarEventAutoDeleteDays)}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="0">Never</SelectItem>
							<SelectItem value="7">After 1 week</SelectItem>
							<SelectItem value="30">After 1 month</SelectItem>
							<SelectItem value="365">After 1 year</SelectItem>
						</SelectContent>
					</Select>
				</ListRow>
				<SettingToggle
					label="Allow Class Notifications"
					enabled={draft.notificationsEnabled}
					onClick={() =>
						updateNotifications({
							notificationsEnabled: !draft.notificationsEnabled,
						})
					}
					disabled={saving}
				/>
				<SettingToggle
					label="Special Event Notifications"
					enabled={draft.broadcastNotificationsEnabled}
					onClick={() =>
						updateNotifications({
							broadcastNotificationsEnabled:
								!draft.broadcastNotificationsEnabled,
						})
					}
					disabled={saving}
				/>
				<Button
					type="button"
					className={styles.listButton}
					onClick={() =>
						openLeadTimes(
							"notificationLeadTimes",
							"Notify Me",
							"Send notifications early by these intervals.",
						)
					}
					disabled={saving}
				>
					<ListRow>
						<Symbol name="bell.badge" />
						<span className={styles.label}>Send Notifications Early By</span>
						<span className={styles.detail}>
							{formatLeadTimes(draft.notificationLeadTimes)}
						</span>
						<Symbol name="chevron.right" />
					</ListRow>
				</Button>
				<Button
					type="button"
					className={styles.listButton}
					onClick={() =>
						openLeadTimes(
							"breakToPeriodNotificationLeadTimes",
							"Notify Me",
							"Applies before first period and after recess or lunch.",
						)
					}
					disabled={saving}
				>
					<ListRow>
						<Symbol name="clock.arrow.trianglehead.counterclockwise.rotate.90" />
						<span className={styles.label}>Before Class or From a Break</span>
						<span className={styles.detail}>
							{formatLeadTimes(draft.breakToPeriodNotificationLeadTimes)}
						</span>
						<Symbol name="chevron.right" />
					</ListRow>
				</Button>
				<ListRow>
					<Symbol name="calendar.badge.clock" />
					<span className={styles.label}>Event Notifications</span>
				</ListRow>
				<div className={styles.scheduleList}>
					{draft.eventNotificationSchedules
						.slice()
						.sort(
							(left, right) =>
								left.dayOffset - right.dayOffset ||
								left.hour - right.hour ||
								left.minute - right.minute,
						)
						.map((schedule) => (
							<ListRow
								key={`${schedule.dayOffset}-${schedule.hour}-${schedule.minute}`}
								className={styles.scheduleRow}
							>
								<span>{formatTime(schedule)}</span>
								<small>{formatOffset(schedule.dayOffset)}</small>
								<Button
									type="button"
									onClick={() => removeSchedule(schedule)}
									disabled={saving}
									aria-label={`Remove ${formatTime(schedule)} event notification`}
								>
									<Symbol name="minus" />
								</Button>
							</ListRow>
						))}
					<Button
						type="button"
						className={styles.listButton}
						onClick={() =>
							openDrawer(
								<EventNotificationScheduleDrawer onSave={addSchedule} />,
							)
						}
					>
						<ListRow>
							<Symbol name="plus" />
							<span className={styles.label}>Add Event Notification</span>
						</ListRow>
					</Button>
				</div>
				{onSignOut ? (
					<Button
						type="button"
						className={styles.listButton}
						onClick={async () => {
							await apiRequest("auth/logout", { method: "DELETE" });
							onSignOut();
						}}
						disabled={saving}
					>
						<ListRow>
							<Symbol name="person.2.slash" />
							<span className={styles.label}>Sign Out</span>
						</ListRow>
					</Button>
				) : null}
			</List>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
		</>
	);
}

function deleteEventLabel(value: number) {
	switch (value) {
		case 7:
			return "After 1 week";
		case 30:
			return "After 1 month";
		case 365:
			return "After 1 year";
		default:
			return "Never";
	}
}
