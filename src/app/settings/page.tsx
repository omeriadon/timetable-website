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

  const toggle = async (
    key: "notificationsEnabled" | "liveActivitiesEnabled",
  ) => {
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
          <span
            style={{
              display: "grid",
              width: 56,
              height: 56,
              placeItems: "center",
              borderRadius: "50%",
              color: "var(--theme-text)",
              background: "var(--theme-surface-elevated)",
              fontSize: "1.7rem",
            }}
          >
            {account.displayName.slice(0, 2).toUpperCase()}
          </span>
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
          <SettingsIcon name="pencil.and.list.clipboard" />
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
        {settings ? (
          <>
            <a href="/settings/appearance" className={styles.row}>
              <SettingsIcon name="paintpalette" />
              <span className={styles.label}>Appearance</span>
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
              <SettingsIcon name="calendar.badge.clock" />
              <span className={styles.label}>Show Future Events</span>
              <span className={styles.detail}>{settings.futureEventRange}</span>
            </div>
            <a href="/settings/archived-events" className={styles.row}>
              <SettingsIcon name="archivebox" />
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
          <SettingsIcon name="app.badge" fallback="◌" />
          <span className={styles.label}>Last Server Sync</span>
          <span className={styles.detail}>Live</span>
        </div>
        <a href="/settings/developer" className={styles.row}>
          <SettingsIcon name="app.badge" />
          <span className={styles.label}>Developer Tools</span>
          <span className={styles.chevron}>›</span>
        </a>
      </section>
      <h2 className={styles.section}>Support</h2>
      <section className={styles.card}>
        <a href="/settings/feedback" className={styles.row}>
          <SettingsIcon name="exclamationmark.bubble" />
          <span className={styles.label}>Report Feedback or Bug</span>
          <span className={styles.chevron}>›</span>
        </a>
        <a href="/settings/about" className={styles.row}>
          <SettingsIcon name="info.circle" />
          <span className={styles.label}>About Timetable</span>
          <span className={styles.chevron}>›</span>
        </a>
        <div className={styles.row}>
          <SettingsIcon name="textformat.size" fallback="⌘" />
          <span className={styles.label}>Version</span>
          <span className={styles.detail}>Web</span>
        </div>
      </section>
    </main>
  );
}

function SettingToggle({
  label,
  enabled,
  onClick,
  disabled,
}: {
  label: string;
  enabled: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      className={styles.row}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        border: 0,
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <SettingsIcon name="switch.2" />
      <span className={styles.label}>{label}</span>
      <span
        aria-label={enabled ? "Enabled" : "Disabled"}
        style={{
          width: 54,
          height: 32,
          padding: 3,
          borderRadius: 99,
          background: enabled ? "#27d65b" : "var(--theme-text-tertiary)",
        }}
      >
        <span
          style={{
            display: "block",
            width: 26,
            height: 26,
            marginLeft: enabled ? 22 : 0,
            borderRadius: "50%",
            background: "white",
            transition: "margin .15s",
          }}
        />
      </span>
    </button>
  );
}

function SettingsIcon({ name, fallback }: { name: string; fallback?: string }) {
  return (
    <img
      className={styles.symbolIcon}
      src={`/icons/${name}.svg`}
      alt=""
      onError={(event) => {
        if (fallback) {
          event.currentTarget.replaceWith(document.createTextNode(fallback));
        }
      }}
    />
  );
}
