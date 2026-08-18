export type TimetableSlot = {
	day: number;
	session: number;
};

export type TimetableSubject = {
	id: string;
	symbol: string;
	colour: {
		r: number;
		g: number;
		b: number;
		a: number;
	};
	slots: TimetableSlot[];
};

export type OwnerTimetable = {
	id: string | null;
	subjects: TimetableSubject[];
	revision: number;
	updatedAt: string | null;
	isSearchable: boolean;
};

export type CalendarEvent = {
	id: string;
	title: string;
	notes?: string;
	symbol: string;
	date: {
		year: number;
		month: number;
		day: number;
	};
	isGlobal: boolean;
	showsWeather: boolean;
	tagIDs?: string[];
	weather?: SchoolWeather | null;
	revision: number;
};

export type CalendarEvents = {
	globalEvents: CalendarEvent[];
	privateEvents: CalendarEvent[];
	canManageGlobalEvents: boolean;
};

export type SchoolCalendarDate = { year: number; month: number; day: number };

export type SchoolCalendar = {
	termRanges: { label: string; start: SchoolCalendarDate; end: SchoolCalendarDate }[];
	skippedDates: { date: SchoolCalendarDate; label: string }[];
};

export type SchoolWeather = {
	temperatureCelsius: number;
	conditionCode: string;
	uvIndex: number;
	precipitationChance: number;
	isStale?: boolean;
};

export type GradeAssessment = {
	id: string;
	subjectID: string;
	semester: number;
	name: string;
	date: { year: number; month: number; day: number };
	score: number;
	weighting: number;
	location: "exam" | "directedStudy" | "subjectPeriod";
};

export type GradeTracker = {
	document: {
		assessments: GradeAssessment[];
		predictedATAR: number | null;
		goalATAR: number | null;
		serverRevision: number;
	};
};

export type Friend = {
	relationshipID: string;
	friend: {
		userID: string;
		displayName: string;
		email: string;
		appearance?: {
			contentKind: "photo" | "monogram" | "emoji";
			monogram: string;
			emoji: string;
			foregroundColour: { r: number; g: number; b: number; a: number };
			colours: { r: number; g: number; b: number; a: number }[];
		};
		photo?: { url: string; revision: number } | null;
	};
	state: "pendingOutgoing" | "pendingIncoming" | "friends";
	locationStatus?: {
		state: string;
		updatedAt: string;
	};
	timetable?: {
		title: string;
		subjects: TimetableSubject[];
	};
};

export type FriendSearchResult = {
	profile: {
		userID: string;
		displayName: string;
		email: string;
		appearance?: Friend["friend"]["appearance"];
		photo?: Friend["friend"]["photo"];
	};
	relationship: "pendingOutgoing" | "pendingIncoming" | "friends" | null;
};

export type FriendDetail = {
	relationshipID: string;
	friend: Friend["friend"];
	acceptedAt: string;
	timetable?: Friend["timetable"];
	averageArrivalSecondsSinceMidnight?: number | null;
	weekdayAverageArrivalSecondsSinceMidnight: Array<number | null>;
	locationNotificationPreferences: Array<"withinTenMinutes" | "withinFiveMinutes" | "arrived">;
};
