"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar";
import styles from "@/components/IOSScreen.module.css";
import { apiRequest } from "@/lib/api/client";

type Settings = {
  appFontDesign: string;
  appBackground: string;
  notificationsEnabled: boolean;
  broadcastNotificationsEnabled: boolean;
  futureEventRange: string;
  serverRevision: number;
  [key: string]: unknown;
};

const labels: Record<string, string> = {
  appearance: "Appearance",
  notifications: "Updates & Notifications",
  "archived-events": "Archived Events",
  developer: "Developer Tools",
  feedback: "Report Feedback or Bug",
  about: "About Timetable",
};

export default function SettingsSectionPage() {
  const { section } = useParams<{ section: string }>();
  const setToolbar = useToolbar();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setToolbar({ title: labels[section] ?? "Settings" });
    apiRequest<Settings>("v1/settings")
      .then(setSettings)
      .catch((requestError: Error) => setError(requestError.message));
  }, [section, setToolbar]);

  return (
    <main className={styles.page}>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {section === "appearance" && settings ? (
        <section className={styles.card}>
          <div className={styles.row}>
            <span className={styles.symbol}>Aa</span>
            <span className={styles.label}>Font Design</span>
            <span className={styles.detail}>{settings.appFontDesign}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.symbol}>◐</span>
            <span className={styles.label}>Background</span>
            <span className={styles.detail}>{settings.appBackground}</span>
          </div>
        </section>
      ) : null}
      {section === "notifications" && settings ? (
        <section className={styles.card}>
          <div className={styles.row}>
            <span className={styles.symbol}>◌</span>
            <span className={styles.label}>Notifications</span>
            <span className={styles.detail}>
              {settings.notificationsEnabled ? "On" : "Off"}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.symbol}>◫</span>
            <span className={styles.label}>Broadcast Notifications</span>
            <span className={styles.detail}>
              {settings.broadcastNotificationsEnabled ? "On" : "Off"}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.symbol}>◷</span>
            <span className={styles.label}>Show Future Events</span>
            <span className={styles.detail}>{settings.futureEventRange}</span>
          </div>
        </section>
      ) : null}
      {section === "archived-events" ? (
        <section className={styles.card}>
          <div className={styles.row}>
            <span className={styles.symbol}>▣</span>
            <span className={styles.label}>Archived Events</span>
            <span className={styles.detail}>Loaded from pmstt</span>
          </div>
        </section>
      ) : null}
      {section === "developer" ? (
        <section className={styles.card}>
          <div className={styles.row}>
            <span className={styles.symbol}>◈</span>
            <span className={styles.label}>Website platform</span>
            <span className={styles.detail}>Active</span>
          </div>
          <div className={styles.row}>
            <span className={styles.symbol}>⌁</span>
            <span className={styles.label}>Server revision</span>
            <span className={styles.detail}>
              {settings?.serverRevision ?? "—"}
            </span>
          </div>
        </section>
      ) : null}
      {section === "feedback" ? (
        <section className={styles.card}>
          <div className={styles.row}>
            <span className={styles.symbol}>!</span>
            <span className={styles.label}>Feedback endpoint</span>
            <span className={styles.detail}>Authenticated</span>
          </div>
        </section>
      ) : null}
      {section === "about" ? (
        <section className={styles.card}>
          <div className={styles.row}>
            <span className={styles.symbol}>ⓘ</span>
            <span className={styles.label}>Timetable</span>
            <span className={styles.detail}>Website client</span>
          </div>
          <div className={styles.row}>
            <span className={styles.symbol}>⌘</span>
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
