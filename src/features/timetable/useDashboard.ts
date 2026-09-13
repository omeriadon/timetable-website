import { apiRequest } from "@/lib/api/client";
import type { DashboardData as ServerDashboardData } from "@/lib/server/dashboard.functions";
import type { Account } from "@/lib/api/contracts";
import type { Settings } from "@/features/settings/types";
import { CACHE_KEYS, CACHE_TTLS } from "@/lib/cache/keys";
import { createCachedResource } from "@/lib/cache/swr";
import { writeCacheEntry } from "@/lib/cache/storage";
import type {
	CalendarEvents,
	Friend,
	GradeTracker,
	OwnerTimetable,
	SchoolCalendar,
	SchoolWeather,
} from "./types";

export type DashboardData = ServerDashboardData;

let dashboardRequest: Promise<DashboardData> | null = null;

export function resetDashboardCache() {
	dashboardRequest = null;
}

function requestDashboard() {
	if (!dashboardRequest) {
		dashboardRequest = Promise.all([
			apiRequest<Account>("v1/account"),
			apiRequest<OwnerTimetable>("v1/timetables/owner"),
			apiRequest<CalendarEvents>("v1/events"),
			apiRequest<Friend[]>("v1/friends"),
			apiRequest<GradeTracker>("v1/grades"),
			apiRequest<SchoolCalendar>("v1/settings/calendar"),
			apiRequest<SchoolWeather>("v1/weather").catch(() => null),
			apiRequest<Settings>("v1/settings"),
		]).then(
			([
				account,
				timetable,
				events,
				friends,
				grades,
				schoolCalendar,
				schoolWeather,
				settings,
			]) => {
				const data = {
					account,
					timetable,
					events,
					friends,
					grades,
					schoolCalendar,
					schoolWeather,
					settings,
				};

				return data;
			},
		);
		dashboardRequest.catch(() => {
			dashboardRequest = null;
		});
	}

	return dashboardRequest;
}

export function primeDashboardCache(data: DashboardData) {
	writeCacheEntry(CACHE_KEYS.dashboard, data, data.account?.id ?? null);
}

export function useDashboard(initialData?: DashboardData) {
	const cached = createCachedResource<DashboardData>({
		key: CACHE_KEYS.dashboard,
		fetcher: requestDashboard,
		initialData: initialData ?? null,
		userId: initialData?.account?.id ?? null,
		ttlMs: CACHE_TTLS.dashboard,
	});

	return {
		data: cached.data,
		error: cached.error,
		isLoading: cached.isLoading,
		isRevalidating: cached.isRevalidating,
		refresh: cached.refresh,
	};
}
