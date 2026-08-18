"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import SettingToggle from "@/components/controls/SettingToggle";
import SymbolIcon from "@/components/controls/SymbolIcon";
import ProfilePicture from "@/components/controls/ProfilePicture";
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

  const toggle = async (
    key: "notificationsEnabled" | "liveActivitiesEnabled",
  ) => {
    if (!settings || saving) {
      return;
    }

	    const current = settings;
	    const next = { ...current, [key]: !current[key] };
	    await saveSettings(current, next);
	};

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
        <section
          className={styles.paper}
          style={{ display: "flex", gap: 16, alignItems: "center" }}
        >
          <ProfilePicture profile={account} size={56} />
          <span>
            <b style={{ fontSize: "1.8rem" }}>{account.displayName}</b>
            <small
              style={{ display: "block", color: "var(--theme-text-tertiary)" }}
            >
              {account.email}
            </small>
          </span>
        </section>
      ) : null}
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <h2 className={styles.section}>My Timetable</h2>
      <section className={styles.card}>
        <a href="/timetable" className={styles.row}>
          <SymbolIcon name="pencil.and.list.clipboard" />
          <span>
            <b className={styles.label}>Edit Timetable</b>
            <small
              style={{
                display: "block",
                color: "var(--theme-text-secondary)",
                marginTop: 4,
              }}
            >
              Update subjects and weekly classes.
            </small>
          </span>
          <span className={styles.chevron}>›</span>
        </a>
      </section>
      <h2 className={styles.section}>Preferences</h2>
      <section className={styles.card}>
        <a href="/settings/account" className={styles.row}>
          <SymbolIcon name="person.2" />
          <span className={styles.label}>Account &amp; Sync</span>
          <span className={styles.chevron}>›</span>
        </a>
        {settings ? (
          <>
            <a href="/settings/appearance" className={styles.row}>
              <SymbolIcon name="paintpalette" />
              <span className={styles.label}>Appearance</span>
              <span className={styles.chevron}>›</span>
            </a>
            <a href="/settings/navigation" className={styles.row}>
              <SymbolIcon name="arrow.down.app" />
              <span className={styles.label}>Navigation</span>
              <span className={styles.chevron}>›</span>
            </a>
            <SettingToggle
              label="Updates & Notifications"
              enabled={settings.notificationsEnabled}
              onClick={() => toggle("notificationsEnabled")}
              disabled={saving}
            />
            <SettingToggle
              label="Live Activities"
              enabled={settings.liveActivitiesEnabled}
              onClick={() => toggle("liveActivitiesEnabled")}
              disabled={saving}
            />
            <div className={styles.row}>
              <SymbolIcon name="calendar.badge.clock" />
              <span className={styles.label}>Show Future Events</span>
              <select
                className={styles.inlineSelect}
                value={settings.futureEventRange}
                disabled={saving}
                aria-label="Show Future Events range"
                onChange={(event) => void updateFutureEventRange(event.target.value)}
              >
                <option value="oneWeek">1 Week</option>
                <option value="twoWeeks">2 Weeks</option>
                <option value="oneMonth">1 Month</option>
                <option value="twoMonths">2 Months</option>
                <option value="threeMonths">3 Months</option>
                <option value="endOfYear">Until End of Year</option>
              </select>
            </div>
            <a href="/settings/archived-events" className={styles.row}>
              <SymbolIcon name="archivebox" />
              <span className={styles.label}>Archived Events</span>
              <span className={styles.chevron}>›</span>
            </a>
          </>
        ) : (
          <p className={styles.loading}>Loading preferences…</p>
        )}
      </section>
      <h2 className={styles.section}>Developer</h2>
      <section className={styles.card}>
        <div className={styles.row}>
          <SymbolIcon name="app.badge" />
          <span className={styles.label}>Release App Icon</span>
          <span className={styles.detail}>Web</span>
        </div>
        <div className={styles.row}>
          <SymbolIcon name="clock.arrow.trianglehead.counterclockwise.rotate.90" />
          <span className={styles.label}>Debug Offset</span>
          <span className={styles.detail}>0</span>
        </div>
        <div className={styles.row}>
          <SymbolIcon name="rectangle.bottomthird.inset.filled" />
          <span className={styles.label}>Test Live Activity</span>
          <span className={styles.detail}>Unavailable on web</span>
        </div>
        <div className={styles.row}>
          <SymbolIcon name="app.badge" />
          <span className={styles.label}>Test status badges</span>
          <span className={styles.detail}>Ready</span>
        </div>
        <div className={styles.row}>
          <SymbolIcon name="widget.large" />
          <span className={styles.label}>Reload widgets now</span>
          <span className={styles.detail}>Unavailable on web</span>
        </div>
        <div className={styles.row}>
          <SymbolIcon name="lightbulb" fallback="i" />
          <span className={styles.label}>Reset Tips</span>
          <span className={styles.detail}>Ready</span>
        </div>
        <div className={styles.row}>
          <SymbolIcon name="app.badge" fallback="◌" />
          <span className={styles.label}>Last Server Sync</span>
          <span className={styles.detail}>Live</span>
        </div>
        <a href="/settings/developer" className={styles.row}>
          <SymbolIcon name="app.badge" />
          <span className={styles.label}>Developer Tools</span>
          <span className={styles.chevron}>›</span>
        </a>
      </section>
      <h2 className={styles.section}>Support</h2>
      <section className={styles.card}>
        <a href="/settings/feedback" className={styles.row}>
          <SymbolIcon name="exclamationmark.bubble" />
          <span className={styles.label}>Report Feedback or Bug</span>
          <span className={styles.chevron}>›</span>
        </a>
        <a href="/settings/about" className={styles.row}>
          <SymbolIcon name="info.circle" />
          <span className={styles.label}>About Timetable</span>
          <span className={styles.chevron}>›</span>
        </a>
        <div className={styles.row}>
          <SymbolIcon name="textformat.size" fallback="⌘" />
          <span className={styles.label}>Version</span>
          <span className={styles.detail}>Web</span>
        </div>
      </section>
    </main>
  );
}
