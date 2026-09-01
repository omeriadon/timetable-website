import { createServerFn } from "@tanstack/react-start";
import type { Account } from "@/lib/api/contracts";
import type { EventNotificationSchedule } from "@/components/drawers/EventNotificationScheduleDrawer/EventNotificationScheduleDrawer";
import type {
	CalendarEvents,
	Friend,
	GradeTracker,
	OwnerTimetable,
	SchoolCalendar,
	SchoolWeather,
} from "@/features/timetable/types";

export type DashboardData = {
	account: Account;
	timetable: OwnerTimetable;
	events: CalendarEvents;
	friends: Friend[];
	grades: GradeTracker;
	schoolCalendar: SchoolCalendar;
	schoolWeather: SchoolWeather | null;
	settings: DashboardSettings;
};

export type DashboardSettings = {
	appFontDesign: string;
	liveActivitiesEnabled: boolean;
	watchBleedEnabled: boolean;
	calendarEventAutoDeleteDays: number;
	notificationsEnabled: boolean;
	broadcastNotificationsEnabled: boolean;
	futureEventRange: string;
	serverRevision: number;
	notificationLeadTimes: number[];
	breakToPeriodNotificationLeadTimes: number[];
	eventNotificationSchedules: EventNotificationSchedule[];
};

async function read<T>(path: string): Promise<T> {
	const { authenticatedPMSTTRequest } =
		await import("@/lib/server/pmstt.server");
	const { response, tokens } = await authenticatedPMSTTRequest(path);
	if (tokens) {
		const { writeSession } = await import("@/lib/server/pmstt.server");
		writeSession(tokens);
	}
	if (!response.ok) {
		throw new Error(`Request failed: ${path} (${response.status})`);
	}
	return (await response.json()) as T;
}

export const fetchDashboard = createServerFn({ method: "GET" }).handler(
	async () => {
		const [
			timetable,
			events,
			friends,
			grades,
			schoolCalendar,
			schoolWeather,
			settings,
		] = await Promise.all([
			read<OwnerTimetable>("v1/timetables/owner"),
			read<CalendarEvents>("v1/events"),
			read<Friend[]>("v1/friends"),
			read<GradeTracker>("v1/grades"),
			read<SchoolCalendar>("v1/settings/calendar"),
			read<SchoolWeather>("v1/weather").catch(() => null),
			read<DashboardSettings>("v1/settings"),
		]);
		return {
			timetable,
			events,
			friends,
			grades,
			schoolCalendar,
			schoolWeather,
			settings,
		};
	},
);
