"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import type { Account } from "@/lib/api/contracts";
import type {
	CalendarEvents,
	Friend,
	GradeTracker,
	OwnerTimetable,
	SchoolCalendar,
	SchoolWeather,
} from "./types";

export type DashboardData = {
	account: Account;
	timetable: OwnerTimetable;
	events: CalendarEvents;
	friends: Friend[];
	grades: GradeTracker;
	schoolCalendar: SchoolCalendar;
	schoolWeather: SchoolWeather | null;
};

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
		]).then(
			([
				account,
				timetable,
				events,
				friends,
				grades,
				schoolCalendar,
				schoolWeather,
			]) => {
				const data = {
					account,
					timetable,
					events,
					friends,
					grades,
					schoolCalendar,
					schoolWeather,
				};

				cachedDashboardData = data;
				return data;
			},
		);
	}

	return dashboardRequest;
}

export function useDashboard() {
	const [data, setData] = useState<DashboardData | null>(cachedDashboardData);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
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
	}, []);

	return { data, error, isLoading: !data && !error };
}
