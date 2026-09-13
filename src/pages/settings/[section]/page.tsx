import { useNavigate } from "@tanstack/solid-router";
import { createSignal, onMount } from "solid-js";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import type {
	SettingsSectionData,
	ProfileSettingsSectionData,
} from "@/lib/server/page-data.functions";
import Symbol from "@/components/controls/Symbol/Symbol";
import ProfileAppearanceEditor from "@/components/settings/ProfileAppearanceEditor/ProfileAppearanceEditor";
import FeedbackEditor from "@/components/settings/FeedbackEditor/FeedbackEditor";
import AboutEditor from "@/components/settings/AboutEditor/AboutEditor";
import ArchivedEventsEditor from "@/components/settings/ArchivedEventsEditor/ArchivedEventsEditor";
import NotificationSettingsEditor from "@/components/settings/NotificationSettingsEditor/NotificationSettingsEditor";
import AccountSyncEditor from "@/components/settings/AccountSyncEditor/AccountSyncEditor";
import AppearanceSettingsEditor from "@/components/settings/AppearanceSettingsEditor/AppearanceSettingsEditor";
import styles from "../page.module.css";
import StaleIndicator from "@/components/controls/StaleIndicator/StaleIndicator";
import { createCachedResource } from "@/lib/cache/swr";
import { settingsSectionKey, CACHE_TTLS } from "@/lib/cache/keys";
import { apiRequest } from "@/lib/api/client";
import type { ProfileAppearance } from "@/lib/api/contracts";
import type { ProfileResponse, Settings } from "@/features/settings/types";

export default function SettingsSectionPage({
	section,
	data,
}: {
	section: string;
	data: SettingsSectionData | ProfileSettingsSectionData;
}) {
	const initial = data;
	const setToolbar = useToolbar();
	const navigate = useNavigate();
	const cached = createCachedResource<
		SettingsSectionData | ProfileSettingsSectionData
	>({
		key: settingsSectionKey(section),
		initialData: initial,
		ttlMs: CACHE_TTLS.settings,
		fetcher: async () => {
			const settings = await apiRequest<Settings>("v1/settings");
			if ("profile" in initial) {
				const profile = await apiRequest<ProfileResponse>("v1/friends/profile");
				return { settings, profile } as ProfileSettingsSectionData;
			}
			return { settings } as SettingsSectionData;
		},
	});
	const settings = () =>
		cached.data()?.settings as unknown as Settings | undefined;
	const profile = () =>
		cached.data() && "profile" in cached.data()!
			? ((cached.data() as ProfileSettingsSectionData).profile ?? null)
			: null;
	const [error, setError] = createSignal<string | null>(null);

	onMount(() => setToolbar({}));

	const saveProfile = async (appearance: ProfileAppearance) => {
		if (!profile()) return;
		try {
			const updated = await apiRequest<ProfileResponse>("v1/friends/profile", {
				method: "PUT",
				body: JSON.stringify({ appearance, baseRevision: profile()!.revision }),
			});
			const snapshot = cached.data();
			if (snapshot && "profile" in snapshot) {
				cached.mutate({ ...snapshot, profile: updated });
			}
		} catch (requestError) {
			setError((requestError as Error).message);
		}
	};

	return (
		<main class={styles.page}>
			<StaleIndicator active={!!cached.data() && cached.isRevalidating()} />
			{error() ? (
				<p class={styles.error} role="alert">
					{error()}
				</p>
			) : null}
			{section === "appearance" && settings() ? (
				<AppearanceSettingsEditor initial={settings()!} />
			) : null}
			{section === "account" && settings() ? (
				<AccountSyncEditor
					initial={settings()!}
					onSignOut={() => navigate({ to: "/login" })}
				/>
			) : null}
			{section === "notifications" && settings() ? (
				<NotificationSettingsEditor initial={settings()!} />
			) : null}
			{section === "archived-events" ? <ArchivedEventsEditor /> : null}
			{section === "profile-appearance" ? (
				profile ? (
					<ProfileAppearanceEditor profile={profile()!} save={saveProfile} />
				) : null
			) : null}
			{section === "feedback" ? <FeedbackEditor /> : null}
			{section === "about" ? <AboutEditor /> : null}
			{!settings() && !error() ? (
				<p class={styles.loading}>Loading settings…</p>
			) : null}
		</main>
	);
}
