import type { ProfileAppearance } from "@/lib/api/contracts";
import type { EventNotificationSchedule } from "@/components/sheets/EventNotificationScheduleSheet/EventNotificationScheduleSheet";

export type Settings = {
	appFontDesign: string;
	appBackground: string;
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
	[key: string]: unknown;
};

export type ProfileResponse = {
	displayName: string;
	appearance: ProfileAppearance;
	photo?: { url: string; revision: number } | null;
	revision: number;
};
