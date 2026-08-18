"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import SettingToggle from "@/components/controls/SettingToggle/SettingToggle";
import ProfileAppearanceEditor from "@/components/settings/ProfileAppearanceEditor/ProfileAppearanceEditor";
import styles from "@/components/IOSScreen/IOSScreen.module.css";
import { apiRequest } from "@/lib/api/client";
import type { ProfileAppearance } from "@/lib/api/contracts";
import type { CalendarEvent, CalendarEvents } from "@/features/timetable/types";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import CalendarEventSheet from "@/components/sheets/CalendarEventSheet/CalendarEventSheet";
import EventNotificationScheduleSheet, { type EventNotificationSchedule } from "@/components/sheets/EventNotificationScheduleSheet/EventNotificationScheduleSheet";

type Settings = {
	appFontDesign: string;
	appBackground: string;
	liveActivitiesEnabled: boolean;
	watchBleedEnabled: boolean;
	calendarEventAutoDeleteDays: number;
  notificationsEnabled: boolean;
  broadcastNotificationsEnabled: boolean;
  futureEventRange: string;
	serverRevision: number;
	notificationLeadTimes: number[];
	breakToPeriodNotificationLeadTimes: number[];
	eventNotificationSchedules: EventNotificationSchedule[];
  [key: string]: unknown;
};

type ProfileResponse = {
	displayName: string;
	appearance: ProfileAppearance;
	photo?: { url: string; revision: number } | null;
	revision: number;
};

const labels: Record<string, string> = {
	account: "Account & Sync",
	appearance: "Appearance",
  notifications: "Updates & Notifications",
  "archived-events": "Archived Events",
  developer: "Developer Tools",
  feedback: "Report Feedback or Bug",
	about: "About Timetable",
	navigation: "Navigation",
	"profile-appearance": "Profile Appearance",
};

export default function SettingsSectionPage() {
  const { section } = useParams<{ section: string }>();
  const setToolbar = useToolbar();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setToolbar({ title: labels[section] ?? "Settings" });
    apiRequest<Settings>("v1/settings")
      .then(setSettings)
      .catch((requestError: Error) => setError(requestError.message));
		if (section === "profile-appearance") {
			apiRequest<ProfileResponse>("v1/friends/profile")
				.then(setProfile)
				.catch((requestError: Error) => setError(requestError.message));
		}
	}, [section, setToolbar]);

	const saveProfile = async (appearance: ProfileAppearance) => {
		if (!profile) return;
		try {
			const updated = await apiRequest<ProfileResponse>("v1/friends/profile", {
				method: "PUT",
				body: JSON.stringify({ appearance, baseRevision: profile.revision }),
			});
			setProfile(updated);
		} catch (requestError) {
			setError((requestError as Error).message);
		}
	};

  return (
    <main className={styles.page}>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {section === "appearance" && settings ? (
        <AppearanceSettingsEditor initial={settings} />
      ) : null}
		{section === "account" && settings ? <AccountSyncEditor initial={settings} onSignOut={() => router.replace("/login")} /> : null}
      {section === "notifications" && settings ? (
			<NotificationSettingsEditor initial={settings} />
      ) : null}
      {section === "archived-events" ? <ArchivedEventsEditor /> : null}
      {section === "developer" ? (
        <section className={styles.card}>
          <div className={styles.row}>
          <SymbolIcon name="app.badge" />
            <span className={styles.label}>Website platform</span>
            <span className={styles.detail}>Active</span>
          </div>
          <div className={styles.row}>
            <SymbolIcon name="clock.arrow.trianglehead.counterclockwise.rotate.90" />
            <span className={styles.label}>Server revision</span>
            <span className={styles.detail}>
              {settings?.serverRevision ?? "—"}
            </span>
          </div>
        </section>
      ) : null}
		{section === "navigation" ? (
			<section className={styles.card}>
				<div className={styles.row}>
					<SymbolIcon name="arrow.down.app" />
					<span className={styles.label}>Restore Navigation</span>
					<span className={styles.detail}>On</span>
				</div>
				<p className={styles.detail} style={{ padding: "0 16px 14px", textAlign: "left" }}>
					Restore the selected tab, sidebar, and navigation path when reopening Timetable.
				</p>
			</section>
		) : null}
		{section === "profile-appearance" ? (
			profile ? <ProfileAppearanceEditor profile={profile} save={saveProfile} /> : null
		) : null}
      {section === "feedback" ? (
        <section className={styles.card}>
          <div className={styles.row}>
          <SymbolIcon name="exclamationmark.bubble" />
            <span className={styles.label}>Feedback endpoint</span>
            <span className={styles.detail}>Authenticated</span>
          </div>
        </section>
      ) : null}
      {section === "about" ? (
        <section className={styles.card}>
          <div className={styles.row}>
          <SymbolIcon name="info.circle" />
            <span className={styles.label}>Timetable</span>
            <span className={styles.detail}>Website client</span>
          </div>
          <div className={styles.row}>
          <SymbolIcon name="textformat.size" />
            <span className={styles.label}>Version</span>
            <span className={styles.detail}>Web</span>
          </div>
        </section>
      ) : null}
      {!settings && !error ? (
        <p className={styles.loading}>Loading settings…</p>
      ) : null}
    </main>
  );
}

function ArchivedEventsEditor() {
	const { openSheet } = useSheet();
	const [events, setEvents] = useState<CalendarEvents | null>(null);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		apiRequest<CalendarEvents>("v1/events")
			.then(setEvents)
			.catch((requestError: Error) => setError(requestError.message));
	}, []);
	const today = new Date();
	const archived = [...(events?.globalEvents ?? []), ...(events?.privateEvents ?? [])]
		.filter((event) => new Date(event.date.year, event.date.month - 1, event.date.day) < new Date(today.getFullYear(), today.getMonth(), today.getDate()))
		.sort((left, right) => new Date(right.date.year, right.date.month - 1, right.date.day).getTime() - new Date(left.date.year, left.date.month - 1, left.date.day).getTime());
	const update = (event: CalendarEvent | null, removedID?: string) => {
		setEvents((current) => current ? {
			...current,
			globalEvents: event ? current.globalEvents.map((item) => item.id === event.id ? event : item) : current.globalEvents.filter((item) => item.id !== removedID),
			privateEvents: event ? current.privateEvents.map((item) => item.id === event.id ? event : item) : current.privateEvents.filter((item) => item.id !== removedID),
		} : current);
	};
	return (
		<>
			{error ? <p className={styles.error} role="alert">{error}</p> : null}
			<section className={styles.card}>
				{archived.length ? archived.map((event) => (
					<button key={event.id} type="button" className={styles.rowButton} onClick={() => openSheet(<CalendarEventSheet event={event} onChanged={(updated) => update(updated, event.id)} />)}>
						<div className={styles.row}><SymbolIcon name="archivebox" /><span><b className={styles.label}>{event.title}</b><small style={{ display: "block", color: "var(--theme-text-secondary)" }}>{new Date(event.date.year, event.date.month - 1, event.date.day).toLocaleDateString("en-AU", { dateStyle: "long" })}</small></span><span className={styles.chevron}>›</span></div>
					</button>
				)) : <p className={styles.loading}>{events ? "No archived events." : "Loading archived events…"}</p>}
			</section>
		</>
	);
}

function NotificationSettingsEditor({ initial }: { initial: Settings }) {
	const [draft, setDraft] = useState(initial);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { openSheet } = useSheet();
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
					breakToPeriodNotificationLeadTimes: next.breakToPeriodNotificationLeadTimes,
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
	const update = (changes: Partial<Settings>) => void save({ ...draft, ...changes });
	const toggleLeadTime = (key: "notificationLeadTimes" | "breakToPeriodNotificationLeadTimes", value: number) => {
		const values = draft[key].includes(value) ? draft[key].filter((item) => item !== value) : [...draft[key], value].sort((left, right) => left - right);
		update({ [key]: values });
	};
	const addSchedule = (schedule: EventNotificationSchedule) => {
		if (draft.eventNotificationSchedules.some((item) => item.hour === schedule.hour && item.minute === schedule.minute && item.dayOffset === schedule.dayOffset)) {
			return;
		}
		update({ eventNotificationSchedules: [...draft.eventNotificationSchedules, schedule] });
	};
	const removeSchedule = (schedule: EventNotificationSchedule) => {
		update({ eventNotificationSchedules: draft.eventNotificationSchedules.filter((item) => item.hour !== schedule.hour || item.minute !== schedule.minute || item.dayOffset !== schedule.dayOffset) });
	};
	const formatTime = (schedule: EventNotificationSchedule) => new Date(2026, 0, 1, schedule.hour, schedule.minute).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" });
	const formatOffset = (days: number) => days === 0 ? "on the day" : days === 7 ? "1 week before" : `${days} day${days === 1 ? "" : "s"} before`;
	return (
		<>
			<section className={styles.card}>
				<SettingToggle label="Allow Class Notifications" enabled={draft.notificationsEnabled} onClick={() => update({ notificationsEnabled: !draft.notificationsEnabled })} disabled={saving} />
				<SettingToggle label="Special Event Notifications" enabled={draft.broadcastNotificationsEnabled} onClick={() => update({ broadcastNotificationsEnabled: !draft.broadcastNotificationsEnabled })} disabled={saving} />
				<div className={styles.row}><SymbolIcon name="bell.badge" /><span className={styles.label}>Send Notifications Early By</span></div>
				<div className={styles.choiceGrid}>
					{[0, 1, 2, 3, 5, 10].map((value) => <button key={value} type="button" className={draft.notificationLeadTimes.includes(value) ? styles.choiceActive : styles.choice} onClick={() => toggleLeadTime("notificationLeadTimes", value)} disabled={saving}>{value} min</button>)}
				</div>
				<div className={styles.row}><SymbolIcon name="clock.arrow.trianglehead.counterclockwise.rotate.90" /><span className={styles.label}>Before Class or From a Break</span></div>
				<div className={styles.choiceGrid}>
					{[0, 1, 2, 3, 5, 10].map((value) => <button key={value} type="button" className={draft.breakToPeriodNotificationLeadTimes.includes(value) ? styles.choiceActive : styles.choice} onClick={() => toggleLeadTime("breakToPeriodNotificationLeadTimes", value)} disabled={saving}>{value} min</button>)}
				</div>
				<div className={styles.row}>
					<SymbolIcon name="calendar.badge.clock" />
					<span className={styles.label}>Event Notifications</span>
				</div>
				<div className={styles.scheduleList}>
					{draft.eventNotificationSchedules
						.slice()
						.sort((left, right) => left.dayOffset - right.dayOffset || left.hour - right.hour || left.minute - right.minute)
						.map((schedule) => (
							<div key={`${schedule.dayOffset}-${schedule.hour}-${schedule.minute}`} className={styles.scheduleRow}>
								<span>{formatTime(schedule)}</span>
								<small>{formatOffset(schedule.dayOffset)}</small>
								<button type="button" onClick={() => removeSchedule(schedule)} disabled={saving} aria-label={`Remove ${formatTime(schedule)} event notification`}>−</button>
							</div>
						))}
					<button type="button" className={styles.rowButton} onClick={() => openSheet(<EventNotificationScheduleSheet onSave={addSchedule} />)}>
						<div className={styles.row}><span className={styles.symbol}>＋</span><span className={styles.label}>Add Event Notification</span></div>
					</button>
				</div>
			</section>
			{error ? <p className={styles.error} role="alert">{error}</p> : null}
		</>
	);
}

function AccountSyncEditor({ initial, onSignOut }: { initial: Settings; onSignOut: () => void }) {
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
			const updated = await apiRequest<Settings>("v1/settings", { method: "PUT", body: JSON.stringify({ ...next, serverRevision: previous.serverRevision }) });
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
				<SettingToggle label="Live Activities" enabled={draft.liveActivitiesEnabled} onClick={() => void save({ liveActivitiesEnabled: !draft.liveActivitiesEnabled })} disabled={saving} />
				<SettingToggle label="Class Notifications" enabled={draft.notificationsEnabled} onClick={() => void save({ notificationsEnabled: !draft.notificationsEnabled })} disabled={saving} />
				<SettingToggle label="Special Event Notifications" enabled={draft.broadcastNotificationsEnabled} onClick={() => void save({ broadcastNotificationsEnabled: !draft.broadcastNotificationsEnabled })} disabled={saving} />
				<SettingToggle label="Watch Bleed" enabled={draft.watchBleedEnabled} onClick={() => void save({ watchBleedEnabled: !draft.watchBleedEnabled })} disabled={saving} />
				<div className={styles.row}><SymbolIcon name="calendar.badge.clock" /><span className={styles.label}>Delete Past Calendar Events</span><select className={styles.inlineSelect} value={draft.calendarEventAutoDeleteDays} disabled={saving} onChange={(event) => void save({ calendarEventAutoDeleteDays: Number(event.target.value) })}><option value={0}>Never</option><option value={7}>After 1 week</option><option value={30}>After 1 month</option><option value={365}>After 1 year</option></select></div>
				<button type="button" className={styles.rowButton} onClick={async () => { await apiRequest("auth/logout", { method: "DELETE" }); onSignOut(); }}><div className={styles.row}><SymbolIcon name="person.2.slash" /><span className={styles.label}>Sign Out</span></div></button>
			</section>
			{error ? <p className={styles.error} role="alert">{error}</p> : null}
		</>
	);
}

function AppearanceSettingsEditor({ initial }: { initial: Settings }) {
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
				body: JSON.stringify({ ...next, serverRevision: previous.serverRevision }),
			});
			setDraft(updated);
			window.dispatchEvent(new CustomEvent("timetable:theme", { detail: updated }));
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
				<div className={styles.row}>
					<SymbolIcon name="textformat.size" />
					<label className={styles.label} htmlFor="app-font-design">App Font</label>
					<select
						id="app-font-design"
						className={styles.inlineSelect}
						value={draft.appFontDesign}
						disabled={saving}
						onChange={(event) => void save({ appFontDesign: event.target.value })}
					>
						<option value="monospaced">Monospaced</option>
						<option value="rounded">Rounded</option>
						<option value="expanded">Expanded</option>
					</select>
				</div>
				<div className={styles.row}>
					<SymbolIcon name="paintpalette" />
					<label className={styles.label} htmlFor="app-background">Background</label>
					<select
						id="app-background"
						className={styles.inlineSelect}
						value={draft.appBackground}
						disabled={saving}
						onChange={(event) => void save({ appBackground: event.target.value })}
					>
						<option value="solid">Solid</option>
						<option value="paper">Paper</option>
					</select>
				</div>
			</section>
			{error ? <p className={styles.error} role="alert">{error}</p> : null}
		</>
	);
}
