"use client";

import { Button } from "@base-ui/react/button";
import { NativeSelect as Select } from "@/components/ui/NativeSelect";
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
import styles from "@/components/settings/Settings.module.css";
import settingsStyles from "@/components/settings/Settings.module.css";

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

	const save = async (next: Settings) => {
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
					serverRevision: next.serverRevision,
				}),
			});
			setDraft(updated);
		} catch (requestError) {
			setDraft(initial);
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const update = (changes: Partial<Settings>) =>
		void save({ ...draft, ...changes });
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
				onSave={async (selection) => update({ [key]: selection })}
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
		update({
			eventNotificationSchedules: [
				...draft.eventNotificationSchedules,
				schedule,
			],
		});
	};
	const removeSchedule = (schedule: EventNotificationSchedule) => {
		update({
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
			<section className={styles.card}>
				<SettingToggle
					label="Live Activities"
					enabled={draft.liveActivitiesEnabled}
					onClick={() =>
						update({ liveActivitiesEnabled: !draft.liveActivitiesEnabled })
					}
					disabled={saving}
				/>
				<SettingToggle
					label="Watch Bleed"
					enabled={draft.watchBleedEnabled}
					onClick={() =>
						update({ watchBleedEnabled: !draft.watchBleedEnabled })
					}
					disabled={saving}
				/>
				<div className={styles.row}>
					<Symbol name="calendar.badge.clock" />
					<span className={styles.label}>Delete Past Calendar Events</span>
					<Select
						className={styles.inlineSelect}
						value={draft.calendarEventAutoDeleteDays}
						disabled={saving}
						onChange={(event) =>
							update({
								calendarEventAutoDeleteDays: Number(event.target.value),
							})
						}
					>
						<option value={0}>Never</option>
						<option value={7}>After 1 week</option>
						<option value={30}>After 1 month</option>
						<option value={365}>After 1 year</option>
					</Select>
				</div>
				<SettingToggle
					label="Allow Class Notifications"
					enabled={draft.notificationsEnabled}
					onClick={() =>
						update({ notificationsEnabled: !draft.notificationsEnabled })
					}
					disabled={saving}
				/>
				<SettingToggle
					label="Special Event Notifications"
					enabled={draft.broadcastNotificationsEnabled}
					onClick={() =>
						update({
							broadcastNotificationsEnabled:
								!draft.broadcastNotificationsEnabled,
						})
					}
					disabled={saving}
				/>
				<Button
					type="button"
					className={styles.rowButton}
					onClick={() =>
						openLeadTimes(
							"notificationLeadTimes",
							"Notify Me",
							"Send notifications early by these intervals.",
						)
					}
					disabled={saving}
				>
					<div className={styles.row}>
						<Symbol name="bell.badge" />
						<span className={styles.label}>Send Notifications Early By</span>
						<span className={styles.detail}>
							{formatLeadTimes(draft.notificationLeadTimes)}
						</span>
						<Symbol name="chevron.right" className={styles.chevronIcon} />
					</div>
				</Button>
				<Button
					type="button"
					className={styles.rowButton}
					onClick={() =>
						openLeadTimes(
							"breakToPeriodNotificationLeadTimes",
							"Notify Me",
							"Applies before first period and after recess or lunch.",
						)
					}
					disabled={saving}
				>
					<div className={styles.row}>
						<Symbol name="clock.arrow.trianglehead.counterclockwise.rotate.90" />
						<span className={styles.label}>Before Class or From a Break</span>
						<span className={styles.detail}>
							{formatLeadTimes(draft.breakToPeriodNotificationLeadTimes)}
						</span>
						<Symbol name="chevron.right" className={styles.chevronIcon} />
					</div>
				</Button>
				<div className={styles.row}>
					<Symbol name="calendar.badge.clock" />
					<span className={styles.label}>Event Notifications</span>
				</div>
				<div className={settingsStyles.scheduleList}>
					{draft.eventNotificationSchedules
						.slice()
						.sort(
							(left, right) =>
								left.dayOffset - right.dayOffset ||
								left.hour - right.hour ||
								left.minute - right.minute,
						)
						.map((schedule) => (
							<div
								key={`${schedule.dayOffset}-${schedule.hour}-${schedule.minute}`}
								className={settingsStyles.scheduleRow}
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
							</div>
						))}
					<Button
						type="button"
						className={styles.rowButton}
						onClick={() =>
							openDrawer(
								<EventNotificationScheduleDrawer onSave={addSchedule} />,
							)
						}
					>
						<div className={styles.row}>
							<Symbol name="plus" />
							<span className={styles.label}>Add Event Notification</span>
						</div>
					</Button>
				</div>
				{onSignOut ? (
					<Button
						type="button"
						className={styles.rowButton}
						onClick={async () => {
							await apiRequest("auth/logout", { method: "DELETE" });
							onSignOut();
						}}
						disabled={saving}
					>
						<div className={styles.row}>
							<Symbol name="person.2.slash" />
							<span className={styles.label}>Sign Out</span>
						</div>
					</Button>
				) : null}
			</section>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
		</>
	);
}
