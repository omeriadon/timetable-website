export const CACHE_TTLS = {
	dashboard: 5 * 60 * 1000,
	weather: 10 * 60 * 1000,
	grades: 10 * 60 * 1000,
	friends: 3 * 60 * 1000,
	classes: 15 * 60 * 1000,
	settings: 30 * 60 * 1000,
	schoolCalendar: 24 * 60 * 60 * 1000,
} as const;

export const CACHE_KEYS = {
	dashboard: "dashboard",
	grades: "grades",
	friends: "friends",
	classes: "classes",
	settings: "settings",
} as const;

export function gradeSubjectKey(subjectID: string) {
	return `grade-subject:${subjectID.toLocaleLowerCase()}`;
}

export function settingsSectionKey(section: string) {
	return `settings-section:${section}`;
}
