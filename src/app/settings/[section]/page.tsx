"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import ProfileAppearanceEditor from "@/components/settings/ProfileAppearanceEditor/ProfileAppearanceEditor";
import FeedbackEditor from "@/components/settings/FeedbackEditor/FeedbackEditor";
import AboutEditor from "@/components/settings/AboutEditor/AboutEditor";
import ArchivedEventsEditor from "@/components/settings/ArchivedEventsEditor/ArchivedEventsEditor";
import NotificationSettingsEditor from "@/components/settings/NotificationSettingsEditor/NotificationSettingsEditor";
import AccountSyncEditor from "@/components/settings/AccountSyncEditor/AccountSyncEditor";
import AppearanceSettingsEditor from "@/components/settings/AppearanceSettingsEditor/AppearanceSettingsEditor";
import styles from "@/components/IOSScreen/IOSScreen.module.css";
import { apiRequest } from "@/lib/api/client";
import type { ProfileAppearance } from "@/lib/api/contracts";
import type { ProfileResponse, Settings } from "@/features/settings/types";

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
				<p className={`${styles.detail} ${styles.detailNote}`}>
					Restore the selected tab, sidebar, and navigation path when reopening Timetable.
				</p>
			</section>
		) : null}
		{section === "profile-appearance" ? (
			profile ? <ProfileAppearanceEditor profile={profile} save={saveProfile} /> : null
		) : null}
      {section === "feedback" ? (
        <FeedbackEditor />
      ) : null}
      {section === "about" ? (
        <AboutEditor />
      ) : null}
      {!settings && !error ? (
        <p className={styles.loading}>Loading settings…</p>
      ) : null}
    </main>
  );
}
