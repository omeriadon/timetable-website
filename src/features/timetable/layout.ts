export const TIMETABLE_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

export const TIMETABLE_SESSIONS = [
	{ value: 0, label: "1" },
	{ value: 1, label: "2" },
	{ value: 2, label: "R" },
	{ value: 3, label: "3" },
	{ value: 4, label: "4" },
	{ value: 5, label: "L" },
	{ value: 6, label: "5" },
	{ value: 7, label: "6" },
] as const;

export function periodLabel(session: number) {
	return (
		TIMETABLE_SESSIONS.find((item) => item.value === session)?.label ??
		String(session)
	);
}
