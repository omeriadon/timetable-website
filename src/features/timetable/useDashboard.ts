import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import type { DashboardData as ServerDashboardData } from "@/lib/server/dashboard.functions";
import type { Account } from "@/lib/api/contracts";
import type { Settings } from "@/features/settings/types";
import type {
	CalendarEvents,
	Friend,
	GradeTracker,
	OwnerTimetable,
	SchoolCalendar,
	SchoolWeather,
} from "./types";

export type DashboardData = ServerDashboardData;

let cachedDashboardData: DashboardData | null = null;
let dashboardRequest: Promise<DashboardData> | null = null;

export function resetDashboardCache() {
	cachedDashboardData = null;
	dashboardRequest = null;
}

function requestDashboard() {
	if (cachedDashboardData) {
		return Promise.resolve(cachedDashboardData);
	}

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

				cachedDashboardData = data;
				return data;
			},
		);
	}

	return dashboardRequest;
}

export function useDashboard(initialData?: DashboardData) {
	const [data, setData] = useState<DashboardData | null>(
		initialData ?? cachedDashboardData,
	);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (initialData) {
			cachedDashboardData = initialData;
			return;
		}
		let isCurrent = true;

		requestDashboard()
			.then((dashboard) => {
				if (isCurrent) {
					setData(dashboard);
				}
			})
			.catch((requestError: Error) => {
				if (isCurrent) {
					setError(requestError.message);
					dashboardRequest = null;
				}
			});

		return () => {
			isCurrent = false;
		};
	}, [initialData]);

	return { data, error, isLoading: !data && !error };
}
