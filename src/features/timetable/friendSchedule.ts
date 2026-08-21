import type { TimetableSubject } from "./types";

const friendPeriods = [
	{ session: 0, start: 8 * 60 + 50, end: 9 * 60 + 48 },
	{ session: 1, start: 9 * 60 + 48, end: 10 * 60 + 46 },
	{ session: 3, start: 11 * 60 + 8, end: 12 * 60 + 6 },
	{ session: 4, start: 12 * 60 + 6, end: 13 * 60 + 4 },
	{ session: 6, start: 13 * 60 + 34, end: 14 * 60 + 32 },
	{ session: 7, start: 14 * 60 + 32, end: 15 * 60 + 30 },
] as const;

export function friendScheduleTitle(subjects: TimetableSubject[], now: Date) {
	if (!subjects.length) {
		return "No timetable shared";
	}

	const day = now.getDay() - 1;
	if (day < 0 || day > 4) {
		return "School's Out";
	}

	const currentMinutes = now.getHours() * 60 + now.getMinutes();
	const currentPeriod = friendPeriods.find(
		(period) =>
			currentMinutes >= period.start && currentMinutes < period.end,
	);

	if (currentPeriod) {
		const subject = subjectAtPeriod(subjects, day, currentPeriod.session);
		return subject ? `In class: ${subject.id}` : "Free period";
	}

	const nextPeriod = friendPeriods.find(
		(period) => period.start > currentMinutes,
	);
	if (nextPeriod) {
		const subject = subjectAtPeriod(subjects, day, nextPeriod.session);
		return subject ? `Next: ${subject.id}` : "Free period next";
	}

	return "School's Out";
}

function subjectAtPeriod(
	subjects: TimetableSubject[],
	day: number,
	session: number,
) {
	return subjects.find((subject) =>
		subject.slots.some((slot) => slot.day === day && slot.session === session),
	);
}
