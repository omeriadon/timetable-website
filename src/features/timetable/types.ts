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
	revision: number;
};

export type CalendarEvents = {
	globalEvents: CalendarEvent[];
	privateEvents: CalendarEvent[];
	canManageGlobalEvents: boolean;
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
