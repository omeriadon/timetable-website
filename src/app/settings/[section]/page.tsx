"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar";
import SymbolIcon from "@/components/controls/SymbolIcon";
import ProfilePicture from "@/components/controls/ProfilePicture";
import styles from "@/components/IOSScreen.module.css";
import { apiRequest } from "@/lib/api/client";
import type { ProfileAppearance } from "@/lib/api/contracts";

type Settings = {
	appFontDesign: string;
	appBackground: string;
	liveActivitiesEnabled: boolean;
  notificationsEnabled: boolean;
  broadcastNotificationsEnabled: boolean;
  futureEventRange: string;
  serverRevision: number;
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
        <section className={styles.card}>
          <div className={styles.row}>
            <SymbolIcon name="textformat.size" />
            <span className={styles.label}>Font Design</span>
            <span className={styles.detail}>{settings.appFontDesign}</span>
          </div>
          <div className={styles.row}>
            <SymbolIcon name="paintpalette" />
            <span className={styles.label}>Background</span>
            <span className={styles.detail}>{settings.appBackground}</span>
          </div>
        </section>
      ) : null}
		{section === "account" && settings ? (
			<section className={styles.card}>
				<div className={styles.row}>
					<SymbolIcon name="rectangle.bottomthird.inset.filled" />
					<span className={styles.label}>Live Activities</span>
					<span className={styles.detail}>{settings.liveActivitiesEnabled ? "On" : "Off"}</span>
				</div>
				<div className={styles.row}>
					<SymbolIcon name="bell.badge" />
					<span className={styles.label}>Class Notifications</span>
					<span className={styles.detail}>{settings.notificationsEnabled ? "On" : "Off"}</span>
				</div>
				<div className={styles.row}>
					<SymbolIcon name="megaphone" />
					<span className={styles.label}>Special Event Notifications</span>
					<span className={styles.detail}>{settings.broadcastNotificationsEnabled ? "On" : "Off"}</span>
				</div>
				<button
					type="button"
					className={styles.rowButton}
					onClick={async () => {
						await apiRequest("auth/logout", { method: "DELETE" });
						router.replace("/login");
					}}
				>
					<div className={styles.row}>
						<SymbolIcon name="person.2.slash" />
						<span className={styles.label}>Sign Out</span>
					</div>
				</button>
			</section>
		) : null}
      {section === "notifications" && settings ? (
        <section className={styles.card}>
          <div className={styles.row}>
            <SymbolIcon name="switch.2" />
            <span className={styles.label}>Notifications</span>
            <span className={styles.detail}>
              {settings.notificationsEnabled ? "On" : "Off"}
            </span>
          </div>
          <div className={styles.row}>
            <SymbolIcon name="bell.badge" />
            <span className={styles.label}>Broadcast Notifications</span>
            <span className={styles.detail}>
              {settings.broadcastNotificationsEnabled ? "On" : "Off"}
            </span>
          </div>
          <div className={styles.row}>
            <SymbolIcon name="calendar.badge.clock" />
            <span className={styles.label}>Show Future Events</span>
            <span className={styles.detail}>{settings.futureEventRange}</span>
          </div>
        </section>
      ) : null}
      {section === "archived-events" ? (
        <section className={styles.card}>
          <div className={styles.row}>
          <SymbolIcon name="archivebox" />
            <span className={styles.label}>Archived Events</span>
            <span className={styles.detail}>Loaded from pmstt</span>
          </div>
        </section>
      ) : null}
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

function ProfileAppearanceEditor({
	profile,
	save,
}: {
	profile: ProfileResponse;
	save: (appearance: ProfileAppearance) => Promise<void>;
}) {
	const [draft, setDraft] = useState(profile.appearance);
	return (
		<section className={styles.card}>
			<div className={styles.profilePreview}>
				<ProfilePicture profile={{ displayName: profile.displayName, appearance: draft, photo: profile.photo }} size={76} />
				<div>
					<strong>{profile.displayName}</strong>
					<span>Profile appearance</span>
				</div>
			</div>
			<div className={styles.row}>
				<SymbolIcon name="paintpalette" />
				<span className={styles.label}>Content</span>
				<select
					className={styles.inlineSelect}
					value={draft.contentKind}
					onChange={(event) => setDraft({ ...draft, contentKind: event.target.value as ProfileAppearance["contentKind"] })}
				>
					<option value="emoji">Emoji</option>
					<option value="monogram">Monogram</option>
					<option value="photo">Photo</option>
				</select>
			</div>
			{draft.contentKind === "emoji" ? (
				<div className={styles.row}>
					<span className={styles.label}>Emoji</span>
					<input className={styles.inlineInput} value={draft.emoji} onChange={(event) => setDraft({ ...draft, emoji: event.target.value.slice(0, 4) })} />
				</div>
			) : null}
			{draft.contentKind === "monogram" ? (
				<div className={styles.row}>
					<span className={styles.label}>Monogram</span>
					<input className={styles.inlineInput} value={draft.monogram} onChange={(event) => setDraft({ ...draft, monogram: event.target.value.slice(0, 3) })} />
				</div>
			) : null}
			<button type="button" className={styles.profileSave} onClick={() => save(draft)}>
				Save Profile Appearance
			</button>
		</section>
	);
}
