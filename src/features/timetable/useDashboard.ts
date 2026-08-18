"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import type { Account } from "@/lib/api/contracts";
import type { CalendarEvents, Friend, GradeTracker, OwnerTimetable } from "./types";

export type DashboardData = {
	account: Account;
	timetable: OwnerTimetable;
	events: CalendarEvents;
	friends: Friend[];
	grades: GradeTracker;
};

export function useDashboard() {
	const [data, setData] = useState<DashboardData | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isCurrent = true;

		Promise.all([
			apiRequest<Account>("v1/account"),
			apiRequest<OwnerTimetable>("v1/timetables/owner"),
			apiRequest<CalendarEvents>("v1/events"),
			apiRequest<Friend[]>("v1/friends"),
			apiRequest<GradeTracker>("v1/grades"),
		])
			.then(([account, timetable, events, friends, grades]) => {
				if (isCurrent) {
					setData({ account, timetable, events, friends, grades });
				}
			})
			.catch((requestError: Error) => {
				if (isCurrent) {
					setError(requestError.message);
				}
			});

		return () => {
			isCurrent = false;
		};
	}, []);

	return { data, error, isLoading: !data && !error };
}
