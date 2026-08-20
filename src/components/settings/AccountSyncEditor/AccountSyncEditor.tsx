"use client";

import { Button } from "@base-ui/react/button";
import { Select } from "@/components/ui/select";
import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import SettingToggle from "@/components/controls/SettingToggle/SettingToggle";
import { apiRequest } from "@/lib/api/client";
import type { Settings } from "@/features/settings/types";
import styles from "@/components/settings/Settings.module.css";

export default function AccountSyncEditor({
	initial,
	onSignOut,
}: {
	initial: Settings;
	onSignOut: () => void;
}) {
	const [draft, setDraft] = useState(initial);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const save = async (changes: Partial<Settings>) => {
		const previous = draft;
		const next = { ...draft, ...changes };
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

	return (
		<>
			<section className={styles.card}>
				<SettingToggle
					label="Live Activities"
					enabled={draft.liveActivitiesEnabled}
					onClick={() =>
						void save({ liveActivitiesEnabled: !draft.liveActivitiesEnabled })
					}
					disabled={saving}
				/>
				<SettingToggle
					label="Class Notifications"
					enabled={draft.notificationsEnabled}
					onClick={() =>
						void save({ notificationsEnabled: !draft.notificationsEnabled })
					}
					disabled={saving}
				/>
				<SettingToggle
					label="Special Event Notifications"
					enabled={draft.broadcastNotificationsEnabled}
					onClick={() =>
						void save({
							broadcastNotificationsEnabled:
								!draft.broadcastNotificationsEnabled,
						})
					}
					disabled={saving}
				/>
				<SettingToggle
					label="Watch Bleed"
					enabled={draft.watchBleedEnabled}
					onClick={() =>
						void save({ watchBleedEnabled: !draft.watchBleedEnabled })
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
							void save({
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
				<Button
					type="button"
					className={styles.rowButton}
					onClick={async () => {
						await apiRequest("auth/logout", { method: "DELETE" });
						onSignOut();
					}}
				>
					<div className={styles.row}>
						<Symbol name="person.2.slash" />
						<span className={styles.label}>Sign Out</span>
					</div>
				</Button>
			</section>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
		</>
	);
}
