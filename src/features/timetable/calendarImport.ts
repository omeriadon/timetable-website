import type {
	TimetableSlot,
	TimetableSubject,
} from "@/features/timetable/types";

export type ParsedCalendarEvent = {
	title: string;
	start: Date;
	end: Date;
	location: string;
	notes: string;
};

type CalendarProperty = {
	parameters: Map<string, string>;
	value: string;
};

type SubjectMetadata = {
	displayName: string;
	colour: TimetableSubject["colour"];
	symbol: string;
	classroom: NonNullable<TimetableSubject["classroom"]>;
	teacher: NonNullable<TimetableSubject["teacher"]>;
};

const periodWindows = [
	{ session: 0, start: 8 * 60 + 50, end: 9 * 60 + 48 },
	{ session: 1, start: 9 * 60 + 48, end: 10 * 60 + 46 },
	{ session: 3, start: 11 * 60 + 8, end: 12 * 60 + 6 },
	{ session: 4, start: 12 * 60 + 6, end: 13 * 60 + 4 },
	{ session: 6, start: 13 * 60 + 34, end: 14 * 60 + 32 },
	{ session: 7, start: 14 * 60 + 32, end: 15 * 60 + 30 },
];

const availableColours: TimetableSubject["colour"][] = [
	{ r: 0.88, g: 0.02, b: 0, a: 1 },
	{ r: 1, g: 0.42, b: 0, a: 1 },
	{ r: 1, g: 0.76, b: 0, a: 1 },
	{ r: 0.71, g: 1, b: 0, a: 1 },
	{ r: 0, g: 0.78, b: 0.32, a: 1 },
	{ r: 0, g: 0.9, b: 1, a: 1 },
	{ r: 0, g: 0.72, b: 0.83, a: 1 },
	{ r: 0.16, g: 0.38, b: 1, a: 1 },
	{ r: 0.24, g: 0, b: 1, a: 1 },
	{ r: 0.56, g: 0.18, b: 0.89, a: 1 },
	{ r: 1, g: 0, b: 0.66, a: 1 },
	{ r: 1, g: 0.18, b: 0.58, a: 1 },
	{ r: 1, g: 0.3, b: 0.3, a: 1 },
	{ r: 0.38, g: 0.49, b: 0.53, a: 1 },
	{ r: 0.04, g: 0.06, b: 0.08, a: 1 },
];

const defaultSymbols = [
	"pencil.and.scribble",
	"paperplane",
	"tray.full.fill",
	"book",
	"book.closed.fill",
	"magazine",
	"bookmark.square.fill",
	"backpack",
	"link",
	"trophy.circle",
	"flag.circle.fill",
	"bell.circle",
	"tag.circle",
	"camera.shutter.button.fill",
	"gearshape.fill",
	"wand.and.outline",
	"pianokeys.inverse",
	"hammer.fill",
	"scroll.fill",
	"printer.fill",
	"case.fill",
	"puzzlepiece.extension",
	"lightbulb.min.fill",
	"headset",
	"helmet",
	"movieclapper",
	"cube.circle.fill",
	"clock.badge",
	"gamecontroller.circle.fill",
	"binoculars.circle",
];

export function parseCalendar(
	text: string,
	now: Date = new Date(),
): ParsedCalendarEvent[] {
	const lines = text.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
	const events: ParsedCalendarEvent[] = [];
	let properties: Map<string, CalendarProperty> | null = null;

	for (const line of lines) {
		if (line === "BEGIN:VEVENT") {
			properties = new Map();
			continue;
		}

		if (line === "END:VEVENT") {
			if (properties) {
				const event = parseEvent(properties);
				if (event) events.push(event);
			}
			properties = null;
			continue;
		}

		if (!properties) continue;
		const property = parseProperty(line);
		if (property) properties.set(property.name, property.property);
	}

	const rangeStart = nextMonday(now);
	const rangeEnd = new Date(rangeStart);
	rangeEnd.setDate(rangeEnd.getDate() + 6 * 7);

	return events.filter(
		(event) => event.start < rangeEnd && event.end > rangeStart,
	);
}

export function buildImportedSubjects(
	events: ParsedCalendarEvent[],
): TimetableSubject[] {
	const scoresBySlot = new Map<string, Map<string, number>>();
	const metadataBySubject = new Map<string, SubjectMetadata>();

	for (const event of events) {
		const title = event.title.trim();
		if (!title) continue;

		const weekday = event.start.getDay();
		if (weekday < 1 || weekday > 5) continue;

		const normalizedTitle = normalizeSubjectName(title);
		if (!normalizedTitle) continue;

		const dayStart = new Date(event.start);
		dayStart.setHours(0, 0, 0, 0);
		const startMinutes = (event.start.getTime() - dayStart.getTime()) / 60_000;
		const endMinutes = (event.end.getTime() - dayStart.getTime()) / 60_000;
		const period = periodWindows.find(
			(window) => startMinutes < window.end && endMinutes > window.start,
		);
		if (!period) continue;

		if (!metadataBySubject.has(normalizedTitle)) {
			metadataBySubject.set(normalizedTitle, {
				displayName: title,
				colour: randomElement(availableColours),
				symbol: translateSymbol(title),
				classroom: classroomFromLocation(event.location),
				teacher: teacherFromNotes(event.notes),
			});
		}

		const slotKey = `${weekday - 1},${period.session}`;
		const scores = scoresBySlot.get(slotKey) ?? new Map<string, number>();
		scores.set(normalizedTitle, (scores.get(normalizedTitle) ?? 0) + 1);
		scoresBySlot.set(slotKey, scores);
	}

	const slotsBySubject = new Map<string, TimetableSlot[]>();
	for (const [slotKey, scores] of scoresBySlot) {
		const winner = [...scores].reduce((best, candidate) =>
			candidate[1] > best[1] ? candidate : best,
		)[0];
		const [day, session] = slotKey.split(",").map(Number);
		const slots = slotsBySubject.get(winner) ?? [];
		slots.push({ day, session });
		slotsBySubject.set(winner, slots);
	}

	const subjects: TimetableSubject[] = [];
	for (const [normalizedTitle, slots] of slotsBySubject) {
		const metadata = metadataBySubject.get(normalizedTitle);
		if (!metadata) continue;

		subjects.push({
			id: translateTitle(metadata.displayName),
			symbol: metadata.symbol,
			colour: metadata.colour,
			slots: slots.sort(
				(left, right) => left.day - right.day || left.session - right.session,
			),
			classroom: metadata.classroom,
			teacher: metadata.teacher,
		});
	}

	return subjects.sort((left, right) =>
		left.id.localeCompare(right.id, undefined, { sensitivity: "accent" }),
	);
}

function parseEvent(
	properties: Map<string, CalendarProperty>,
): ParsedCalendarEvent | null {
	const title = decodeText(properties.get("SUMMARY")?.value ?? "").trim();
	const startProperty = properties.get("DTSTART");
	const endProperty = properties.get("DTEND");
	if (!title || !startProperty || !endProperty) return null;

	const start = parseCalendarDate(startProperty);
	const end = parseCalendarDate(endProperty);
	if (!start || !end || end <= start) return null;

	return {
		title,
		start,
		end,
		location: decodeText(properties.get("LOCATION")?.value ?? ""),
		notes: decodeText(properties.get("DESCRIPTION")?.value ?? ""),
	};
}

function parseProperty(line: string): {
	name: string;
	property: CalendarProperty;
} | null {
	const separator = line.indexOf(":");
	if (separator < 1) return null;

	const [rawName, ...rawParameters] = line.slice(0, separator).split(";");
	const parameters = new Map<string, string>();
	for (const parameter of rawParameters) {
		const equals = parameter.indexOf("=");
		if (equals < 1) continue;
		parameters.set(
			parameter.slice(0, equals).toUpperCase(),
			parameter.slice(equals + 1).replace(/^"|"$/g, ""),
		);
	}

	return {
		name: rawName.toUpperCase(),
		property: { parameters, value: line.slice(separator + 1) },
	};
}

function parseCalendarDate(property: CalendarProperty): Date | null {
	const match =
		/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?)?(Z|[+-]\d{4})?$/.exec(
			property.value,
		);
	if (!match) return null;

	const [
		,
		year,
		month,
		day,
		hours = "00",
		minutes = "00",
		seconds = "00",
		zone,
	] = match;
	const values = [year, month, day, hours, minutes, seconds].map(Number);
	const [yearValue, monthValue, dayValue, hourValue, minuteValue, secondValue] =
		values;

	if (zone === "Z") {
		return new Date(
			Date.UTC(
				yearValue,
				monthValue - 1,
				dayValue,
				hourValue,
				minuteValue,
				secondValue,
			),
		);
	}

	if (zone?.match(/^[+-]\d{4}$/)) {
		const direction = zone.startsWith("+") ? 1 : -1;
		const offset =
			direction * (Number(zone.slice(1, 3)) * 60 + Number(zone.slice(3, 5)));
		return new Date(
			Date.UTC(
				yearValue,
				monthValue - 1,
				dayValue,
				hourValue,
				minuteValue - offset,
				secondValue,
			),
		);
	}

	const timeZone = property.parameters.get("TZID");
	if (timeZone) {
		return dateInTimeZone(values, timeZone);
	}

	return new Date(
		yearValue,
		monthValue - 1,
		dayValue,
		hourValue,
		minuteValue,
		secondValue,
	);
}

function dateInTimeZone(values: number[], timeZone: string): Date | null {
	const [year, month, day, hour, minute, second] = values;
	const expected = Date.UTC(year, month - 1, day, hour, minute, second);
	let timestamp = expected;

	try {
		const formatter = new Intl.DateTimeFormat("en-US", {
			timeZone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hourCycle: "h23",
		});

		for (let attempt = 0; attempt < 2; attempt += 1) {
			const parts = Object.fromEntries(
				formatter
					.formatToParts(new Date(timestamp))
					.filter((part) => part.type !== "literal")
					.map((part) => [part.type, Number(part.value)]),
			);
			const rendered = Date.UTC(
				parts.year,
				parts.month - 1,
				parts.day,
				parts.hour,
				parts.minute,
				parts.second,
			);
			timestamp += expected - rendered;
		}
		return new Date(timestamp);
	} catch {
		return null;
	}
}

function nextMonday(now: Date): Date {
	const result = new Date(now);
	result.setHours(0, 0, 0, 0);
	const daysUntilMonday = (8 - result.getDay()) % 7;
	result.setDate(
		result.getDate() + (daysUntilMonday === 0 ? 1 : daysUntilMonday),
	);
	return result;
}

function normalizeSubjectName(name: string): string {
	return name
		.normalize("NFKD")
		.replace(/\p{M}/gu, "")
		.toLocaleLowerCase("en-US")
		.trim()
		.split(/\s+/)
		.join(" ");
}

function translateSymbol(title: string): string {
	const upper = title.toUpperCase();
	const translations: Array<[string, string]> = [
		["DS", "graduationcap"],
		["AEMAM", "radicand.squareroot"],
		["AEPHY", "atom"],
		["AEEST", "building.columns"],
		["AEPAL", "laurel.leading"],
		["AECSC", "laptopcomputer"],
		["ADV", "person.3"],
		["AEPAE", "brain"],
		["AEHBY", "brain.head.profile"],
		["AEENG", "textformat.characters"],
		["AEMAS", "function"],
		["MUSOS", "music.note"],
		["AECHE", "testtube.2"],
		["AEISL", "translate"],
		["AEFSL1", "translate"],
		["AELIT", "books.vertical"],
		["AEBLY", "leaf"],
		["MUP", "mouth"],
	];
	return (
		translations.find(([code]) => upper.includes(code))?.[1] ??
		randomElement(defaultSymbols)
	);
}

function translateTitle(title: string): string {
	const upper = title.toUpperCase();
	const translations: Array<[string, string]> = [
		["DS", "Directed Study"],
		["AEMAM", "Methods"],
		["AEPAL", "Politics & Law"],
		["AEPHY", "Physics"],
		["AEEST", "Engineering"],
		["AECSC", "Computer Science"],
		["ADV", "Advocacy"],
		["AEPAE", "Philosophy"],
		["AEENG", "English"],
		["AEMAS", "Specialist"],
		["MUSOS", "Music"],
		["AEFSL1", "French"],
		["AECHE", "Chemistry"],
		["AEHBY", "Human Bio"],
		["AEISL", "Italian"],
		["AELIT", "Literature"],
		["AEBLY", "Biology"],
		["MUP", "Chorale"],
	];
	return translations.find(([code]) => upper.includes(code))?.[1] ?? title;
}

function classroomFromLocation(
	rawLocation: string,
): NonNullable<TimetableSubject["classroom"]> {
	const raw = rawLocation.trim().toUpperCase();
	const buildingNames: Record<string, string> = {
		M: "mills",
		A: "andrews",
		B: "beasley",
		G: "gardham",
		E: "embletonMusicCentre",
		S: "stokes",
	};
	const buildingCode = raw[0];
	const building = buildingNames[buildingCode];
	if (!building) return { unknown: { rawLocation } };

	const hasFloors = ["M", "A", "B"].includes(buildingCode);
	const floorCode = hasFloors ? raw[1] : null;
	const floor =
		floorCode === "U" ? "upper" : floorCode === "L" ? "lower" : null;
	if (hasFloors && !floor) return { unknown: { rawLocation } };

	const numberText = raw.slice(hasFloors ? 2 : 1);
	if (!/^\d{1,2}$/.test(numberText)) {
		return { unknown: { rawLocation } };
	}

	return {
		room: {
			building,
			floor,
			number: Number(numberText),
		},
	};
}

function teacherFromNotes(
	rawNotes: string,
): NonNullable<TimetableSubject["teacher"]> {
	const prefix = "Attending Staff : ";
	const trimmed = rawNotes.trim();
	if (!trimmed.startsWith(prefix)) return { unknown: { rawNotes } };

	const staffCode = trimmed.slice(prefix.length);
	if (staffCode.length < 2 || !/^\p{L}+$/u.test(staffCode)) {
		return { unknown: { rawNotes } };
	}

	const surname = staffCode
		.slice(1)
		.toLocaleLowerCase()
		.replace(/^./u, (letter) => letter.toLocaleUpperCase());
	return { named: { lastName: surname } };
}

function decodeText(value: string): string {
	return value
		.replace(/\\n/gi, "\n")
		.replace(/\\,/g, ",")
		.replace(/\\;/g, ";")
		.replace(/\\\\/g, "\\");
}

function randomElement<T>(values: T[]): T {
	return values[Math.floor(Math.random() * values.length)];
}
