import { createEffect, createSignal, onCleanup } from "solid-js";
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
	}

	return dashboardRequest;
}

export function useDashboard(initialData?: DashboardData) {
	const [data, setData] = createSignal<DashboardData | null>(
		initialData ?? null,
	);
	const [error, setError] = createSignal<string | null>(null);

	createEffect(() => {
		if (initialData) {
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

		onCleanup(() => {
			isCurrent = false;
		});
	});

	return { data, error, isLoading: () => !data() && !error() };
}
