import type { DashboardData } from "@/features/timetable/useDashboard";
import type {
	ClassesData,
	FriendsData,
	GradeSubjectData,
	GradesData,
	ProfileSettingsSectionData,
	SettingsData,
	SettingsSectionData,
} from "@/lib/server/page-data.functions";
import TodayPage from "@/pages/today/page";
import WeekPage from "@/pages/week/page";
import TimetablePage from "@/pages/timetable/page";
import PlannerPage from "@/pages/planner/page";
import GradesPage from "@/pages/grades/page";
import GradeSubjectPage from "@/pages/grades/[subject]/page";
import FriendsPage from "@/pages/friends/page";
import ClassesPage from "@/pages/classes/page";
import SettingsPage from "@/pages/settings/page";
import SettingsSectionPage from "@/pages/settings/[section]/page";
import { CACHE_KEYS, gradeSubjectKey, settingsSectionKey } from "./keys";
import { readCacheEntry } from "./storage";

// Route loaders block their page from mounting until they resolve, so the
// page-level cache never gets a chance on cold navigations (new tab, expired
// router data). These pending components run while the loader is in flight
// and render the real page from localStorage when a snapshot exists —
// stale-while-revalidate at the route level. On the server (SSR shells) the
// guarded read returns null and the plain fallback is used.

function lastPathSegment(): string | null {
	if (typeof window === "undefined") return null;
	const parts = window.location.pathname.split("/").filter(Boolean);
	if (!parts.length) return null;
	try {
		return decodeURIComponent(parts[parts.length - 1]);
	} catch {
		return parts[parts.length - 1];
	}
}

export function TodayPending() {
	const cached = readCacheEntry<DashboardData>(CACHE_KEYS.dashboard);
	if (cached) return <TodayPage dashboard={cached.payload} />;
	return <p>Loading your timetable…</p>;
}

export function WeekPending() {
	const cached = readCacheEntry<DashboardData>(CACHE_KEYS.dashboard);
	if (cached) return <WeekPage dashboard={cached.payload} />;
	return <p>Loading your timetable…</p>;
}

export function TimetablePending() {
	const cached = readCacheEntry<DashboardData>(CACHE_KEYS.dashboard);
	if (cached) return <TimetablePage dashboard={cached.payload} />;
	return <p>Loading your timetable…</p>;
}

export function PlannerPending() {
	const cached = readCacheEntry<DashboardData>(CACHE_KEYS.dashboard);
	if (cached) return <PlannerPage dashboard={cached.payload} />;
	return <p>Loading your planner…</p>;
}

export function GradesPending() {
	const cached = readCacheEntry<GradesData>(CACHE_KEYS.grades);
	if (cached) return <GradesPage data={cached.payload} />;
	return <p role="status">Loading grades…</p>;
}

export function GradeSubjectPending() {
	const subject = lastPathSegment();
	if (subject) {
		const scoped = readCacheEntry<GradeSubjectData>(gradeSubjectKey(subject));
		if (scoped)
			return <GradeSubjectPage subject={subject} data={scoped.payload} />;
		const grades = readCacheEntry<GradesData>(CACHE_KEYS.grades);
		if (grades) {
			return (
				<GradeSubjectPage
					subject={subject}
					data={{
						grades: grades.payload.grades,
						timetable: grades.payload.timetable,
					}}
				/>
			);
		}
	}
	return <p role="status">Loading subject grades…</p>;
}

export function FriendsPending() {
	const cached = readCacheEntry<FriendsData>(CACHE_KEYS.friends);
	if (cached) return <FriendsPage data={cached.payload} />;
	return <p role="status">Loading friends…</p>;
}

export function ClassesPending() {
	const cached = readCacheEntry<ClassesData>(CACHE_KEYS.classes);
	if (cached) return <ClassesPage data={cached.payload} />;
	return <p role="status">Loading classes…</p>;
}

export function SettingsPending() {
	const cached = readCacheEntry<SettingsData>(CACHE_KEYS.settings);
	if (cached) return <SettingsPage data={cached.payload} />;
	return <p role="status">Loading settings…</p>;
}

export function SettingsSectionPending() {
	const section = lastPathSegment();
	if (section) {
		const scoped = readCacheEntry<
			SettingsSectionData | ProfileSettingsSectionData
		>(settingsSectionKey(section));
		if (scoped)
			return <SettingsSectionPage section={section} data={scoped.payload} />;
	}
	const settings = readCacheEntry<SettingsData>(CACHE_KEYS.settings);
	if (settings && section && section !== "profile-appearance") {
		return (
			<SettingsSectionPage
				section={section}
				data={{ settings: settings.payload.settings }}
			/>
		);
	}
	return <p role="status">Loading settings section…</p>;
}
