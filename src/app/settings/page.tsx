"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar";
import styles from "@/components/IOSScreen.module.css";
import { apiRequest } from "@/lib/api/client";
import type { Account } from "@/lib/api/contracts";

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
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

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
	}, [setToolbar]);

	const toggle = async (key: "notificationsEnabled" | "liveActivitiesEnabled") => {
		if (!settings || saving) {
			return;
		}

		const current = settings;
		const next = { ...current, [key]: !current[key] };
		setSettings(next);
		setSaving(true);
		setError(null);

		try {
			const updated = await apiRequest<Settings>("v1/settings", {
				method: "PUT",
				body: JSON.stringify({ ...next, serverRevision: current.serverRevision }),
			});
			setSettings(updated);
		} catch (requestError) {
			setSettings(current);
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return <main className={styles.page}>
		<h1 className={styles.title}>Settings</h1>
		{account ? <section className={styles.paper} style={{ display: "flex", gap: 16, alignItems: "center" }}><span style={{ display: "grid", width: 56, height: 56, placeItems: "center", borderRadius: "50%", color: "#fff", background: "#3e3e42", fontSize: "1.7rem" }}>{account.displayName.slice(0, 2).toUpperCase()}</span><span><b style={{ fontSize: "1.8rem" }}>{account.displayName}</b><small style={{ display: "block", color: "#666" }}>{account.email}</small></span></section> : null}
		{error ? <p className={styles.error} role="alert">{error}</p> : null}
		<h2 className={styles.section}>My Timetable</h2>
		<section className={styles.card}><a href="/timetable" className={styles.row}><span className={styles.symbol}>▤</span><span><b className={styles.label}>Edit Timetable</b><small style={{ display: "block", color: "#929299", marginTop: 4 }}>Update subjects and weekly classes.</small></span><span className={styles.chevron}>›</span></a></section>
		<h2 className={styles.section}>Preferences</h2>
		<section className={styles.card}>{settings ? <><SettingToggle label="Updates & Notifications" enabled={settings.notificationsEnabled} onClick={() => toggle("notificationsEnabled")} disabled={saving} /><SettingToggle label="Live Activities" enabled={settings.liveActivitiesEnabled} onClick={() => toggle("liveActivitiesEnabled")} disabled={saving} /><div className={styles.row}><span className={styles.symbol}>◐</span><span className={styles.label}>Show Future Events</span><span className={styles.detail}>{settings.futureEventRange}</span></div></> : <p className={styles.loading}>Loading preferences…</p>}</section>
	</main>;
}

function SettingToggle({ label, enabled, onClick, disabled }: { label: string; enabled: boolean; onClick: () => void; disabled: boolean }) {
	return <button type="button" className={styles.row} onClick={onClick} disabled={disabled} style={{ width: "100%", border: 0, background: "transparent", cursor: "pointer", textAlign: "left" }}><span className={styles.symbol}>◌</span><span className={styles.label}>{label}</span><span aria-label={enabled ? "Enabled" : "Disabled"} style={{ width: 54, height: 32, padding: 3, borderRadius: 99, background: enabled ? "#27d65b" : "#555" }}><span style={{ display: "block", width: 26, height: 26, marginLeft: enabled ? 22 : 0, borderRadius: "50%", background: "white", transition: "margin .15s" }} /></span></button>;
}
