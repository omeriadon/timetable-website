import { createServerFn } from "@tanstack/react-start";
import { authenticatedPMSTTRequest } from "@/lib/server/pmstt.server";
import type { Account } from "@/lib/api/contracts";
import type {
	Friend,
	OwnerTimetable,
	GradeTracker,
	CurrentLocationStatus,
} from "@/features/timetable/types";
import type { Settings, ProfileResponse } from "@/features/settings/types";

type JsonValue =
	string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type SerializableSettings = { [key: string]: JsonValue };

async function get<T>(path: string): Promise<T> {
	const { response, tokens } = await authenticatedPMSTTRequest(path);
	const { writeSession, clearSession } =
		await import("@/lib/server/pmstt.server");
	if (tokens) writeSession(tokens);
	if (response.status === 401) clearSession();
	if (!response.ok) throw new Error(`Request failed (${response.status})`);
	return (await response.json()) as T;
}

export const loadClasses = createServerFn({ method: "GET" }).handler(
	async () => {
		const [timetable, friends] = await Promise.all([
			get<OwnerTimetable>("v1/timetables/owner"),
			get<Friend[]>("v1/friends"),
		]);
		return { timetable, friends };
	},
);
export type ClassesData = Awaited<ReturnType<typeof loadClasses>>;

export const loadFriends = createServerFn({ method: "GET" }).handler(
	async () => {
		const [friends, location, requests] = await Promise.all([
			get<Friend[]>("v1/friends"),
			get<CurrentLocationStatus>("v1/account/status"),
			get<Friend[]>("v1/friends/requests"),
		]);
		return {
			friends,
			locationStatus: location.item,
			incomingRequestCount: requests.length,
		};
	},
);
export type FriendsData = Awaited<ReturnType<typeof loadFriends>> & {
	account: Account;
};

export const loadGrades = createServerFn({ method: "GET" }).handler(
	async () => {
		const [grades, timetable, yearGroups, subscriptions] = await Promise.all([
			get<GradeTracker>("v1/grades"),
			get<OwnerTimetable>("v1/timetables/owner"),
			get<{
				sections: Array<{
					category: string;
					tags: Array<{ id: string; displayName: string }>;
				}>;
			}>("v1/tags"),
			get<{ tagIDs: string[] }>("v1/tags/subscriptions"),
		]);
		return { grades, timetable, yearGroups, subscriptions };
	},
);
export type GradesData = Awaited<ReturnType<typeof loadGrades>>;

export const loadGradeSubject = createServerFn({ method: "GET" }).handler(
	async () => {
		const [grades, timetable] = await Promise.all([
			get<GradeTracker>("v1/grades"),
			get<OwnerTimetable>("v1/timetables/owner"),
		]);
		return { grades, timetable };
	},
);
export type GradeSubjectData = Awaited<ReturnType<typeof loadGradeSubject>>;

export const loadSettings = createServerFn({ method: "GET" }).handler(
	async () => {
		const [settings, timetable] = await Promise.all([
			get<Settings>("v1/settings"),
			get<OwnerTimetable>("v1/timetables/owner"),
		]);
		return {
			settings: settings as SerializableSettings,
			timetable,
		};
	},
);
export type SettingsData = Awaited<ReturnType<typeof loadSettings>> & {
	account: Account;
};

export const loadSettingsSection = createServerFn({ method: "GET" }).handler(
	async () => ({
		settings: (await get<Settings>("v1/settings")) as SerializableSettings,
	}),
);
export type SettingsSectionData = Awaited<
	ReturnType<typeof loadSettingsSection>
>;

export const loadProfileSettingsSection = createServerFn({
	method: "GET",
}).handler(async () => ({
	settings: (await get<Settings>("v1/settings")) as SerializableSettings,
	profile: await get<ProfileResponse>("v1/friends/profile"),
}));
export type ProfileSettingsSectionData = Awaited<
	ReturnType<typeof loadProfileSettingsSection>
>;

export const loadAdministration = createServerFn({ method: "GET" }).handler(
	async () =>
		get<{
			isAdmin: boolean;
			authority: string;
			pendingModerationCount: number;
		}>("v1/administration"),
);
export type AdministrationData = Awaited<ReturnType<typeof loadAdministration>>;

export const loadAdministrationSection = createServerFn({ method: "GET" })
	.validator((input: { endpoint?: string }) => input)
	.handler(async ({ data }) =>
		data.endpoint ? await get<JsonValue>(data.endpoint) : null,
	);
export type AdministrationSectionData = Awaited<
	ReturnType<typeof loadAdministrationSection>
>;
