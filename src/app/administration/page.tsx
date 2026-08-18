"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar";
import styles from "@/components/IOSScreen.module.css";
import { apiRequest } from "@/lib/api/client";

type Dashboard = {
  isAdmin: boolean;
  authority: string;
  pendingModerationCount: number;
};
const sections = [
  [
    "Overview",
    [
      ["▥", "Statistics", "statistics"],
      ["♧", "Users", "users"],
    ],
  ],
  ["Moderation", [["!", "User Reports", "user-reports"]]],
  [
    "School Content",
    [
      ["▦", "School Events", "calendar"],
      ["◇", "Event Tags", "event-tags"],
      ["▤", "Term Dates", "calendar"],
      ["•", "Pupil Free Days", "calendar"],
    ],
  ],
  [
    "Notifications",
    [
      ["◫", "Broadcast Notification", "broadcast-notification"],
      ["◴", "Broadcast History", "broadcast-notifications"],
      ["✉", "Email Log", "email-log"],
    ],
  ],
];

export default function AdministrationPage() {
  const setToolbar = useToolbar();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setToolbar({ title: "Administration" });
    apiRequest<Dashboard>("v1/administration")
      .then(setDashboard)
      .catch((requestError: Error) => setError(requestError.message));
  }, [setToolbar]);
  return (
    <main className={styles.page}>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {dashboard && !dashboard.isAdmin ? (
        <section className={styles.card}>
          <div className={styles.row}>
            <span className={styles.symbol}>!</span>
            <span className={styles.label}>Administrator access required.</span>
          </div>
        </section>
      ) : null}
      {dashboard?.isAdmin
        ? sections.map(([heading, rows]) => (
            <section key={heading as string}>
              <h2 className={styles.section}>{heading as string}</h2>
              <div className={styles.card}>
                {(rows as string[][]).map(([symbol, label, destination]) => (
                  <a
                    key={label}
                    href={`/administration/${destination}`}
                    className={styles.row}
                  >
                    <span className={styles.symbol}>{symbol}</span>
                    <span className={styles.label}>{label}</span>
                    <span className={styles.chevron}>›</span>
                  </a>
                ))}
              </div>
            </section>
          ))
        : null}
      {!dashboard && !error ? (
        <p className={styles.loading}>Checking administrator access…</p>
      ) : null}
    </main>
  );
}
