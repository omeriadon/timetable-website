"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import SettingToggle from "@/components/controls/SettingToggle/SettingToggle";
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
          <section className={styles.paper} style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <ProfilePicture profile={account} size={52} />
            <span>
              <b style={{ fontSize: "1.35rem" }}>{account.displayName}</b>
              <small style={{ display: "block", color: "var(--theme-text-tertiary)" }}>{account.email}</small>
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
				onClick={() => openSheet(<CalendarImportSheet timetable={timetable} onImported={setTimetable} />)}
			>
				<div className={styles.row}>
					<SymbolIcon name="calendar" fallback="▦" />
					<span><span className={styles.label}>Re-import from Calendar</span><small className={styles.detail}>Subscribe to Compass Schedule in Calendar first.</small></span>
					<span className={styles.chevron}>›</span>
				</div>
			</button>
        <NavigationRow
          title="Edit Timetable"
          description="Update subjects and weekly classes."
          href="/timetable"
          icon="pencil.and.list.clipboard"
        />
      </section>
      <h2 className={styles.section}>Preferences</h2>
      <section className={styles.card}>
        <NavigationRow
          title="Account & Sync"
          description="Sync account settings and connected devices."
          href="/settings/account"
          icon="person.2"
        />
        {settings ? (
          <>
            <NavigationRow
              title="Appearance"
              description="Choose the app font and background material."
              href="/settings/appearance"
              icon="paintpalette"
            />
            <NavigationRow
              title="Navigation"
              description="Restore the selected tab and navigation path."
              href="/settings/navigation"
              icon="arrow.down.app"
            />
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
            <NavigationRow
              title="Archived Events"
              description="Review and edit past calendar events."
              href="/settings/archived-events"
              icon="archivebox"
            />
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
        <NavigationRow
          title="Developer Tools"
          description="Inspect website platform and server state."
          href="/settings/developer"
          icon="app.badge"
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
        <div className={styles.row}>
          <SymbolIcon name="textformat.size" fallback="⌘" />
          <span className={styles.label}>Version</span>
          <span className={styles.detail}>Web</span>
        </div>
      </section>
    </main>
  );
}

function NavigationRow({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <SheetTrigger
      className={styles.rowButton}
      ariaLabel={`Open ${title}`}
      content={
        <NavigationSheet
          title={title}
          description={description}
          href={href}
          icon={icon}
        />
      }
    >
      <div className={styles.row}>
        <SymbolIcon name={icon} />
        <span className={styles.label}>{title}</span>
        <span className={styles.chevron}>›</span>
      </div>
    </SheetTrigger>
  );
}
