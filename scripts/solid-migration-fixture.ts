const account = {
	id: "fixture-owner",
	email: "owner@example.test",
	displayName: "Fixture Owner",
	createdAt: "2026-01-15T08:00:00.000Z",
	authority: "systemOwner",
	revision: 1,
	appearance: {
		version: 1,
		contentKind: "monogram",
		monogram: "FO",
		emoji: "📅",
		foregroundColour: { r: 255, g: 255, b: 255, a: 1 },
		colours: [
			{ r: 116, g: 88, b: 72, a: 1 },
			{ r: 191, g: 147, b: 109, a: 1 },
		],
		fontDesign: "rounded",
		fontWeight: "semibold",
		speed: 1,
		noise: 0,
	},
	photo: null,
	badges: [
		{
			id: "fixture-badge",
			symbol: "star.fill",
			accessibilityLabel: "Fixture tester",
		},
	],
};

let settings = {
	appFontDesign: "default",
	liveActivitiesEnabled: true,
	watchBleedEnabled: false,
	calendarEventAutoDeleteDays: 30,
	notificationsEnabled: true,
	broadcastNotificationsEnabled: true,
	futureEventRange: "twoWeeks",
	serverRevision: 1,
	notificationLeadTimes: [5, 10],
	breakToPeriodNotificationLeadTimes: [5],
	eventNotificationSchedules: [],
};

let timetable = {
	id: "fixture-timetable",
	revision: 1,
	updatedAt: "2026-09-05T08:00:00.000Z",
	isSearchable: true,
	subjects: [
		{
			id: "mathematics",
			symbol: "function",
			colour: { r: 52, g: 120, b: 246, a: 1 },
			slots: [
				{ day: 1, session: 1 },
				{ day: 3, session: 3 },
			],
			teacher: { displayName: "Ms Ada Lovelace" },
			classroom: { room: { building: "A", floor: "1", number: 12 } },
		},
		{
			id: "literature",
			symbol: "book.closed",
			colour: { r: 196, g: 78, b: 82, a: 1 },
			slots: [
				{ day: 2, session: 2 },
				{ day: 4, session: 4 },
			],
			teacher: { displayName: "Mr George Orwell" },
			classroom: "Library",
		},
	],
};

let events = {
	globalEvents: [
		{
			id: "assembly",
			title: "School assembly",
			notes: "Main hall",
			symbol: "person.3",
			date: { year: 2026, month: 9, day: 7 },
			isGlobal: true,
			showsWeather: false,
			tagIDs: ["year-12"],
			revision: 1,
		},
	],
	privateEvents: [
		{
			id: "study",
			title: "Study session",
			notes: "Revise chapter four",
			symbol: "pencil",
			date: { year: 2026, month: 9, day: 8 },
			isGlobal: false,
			showsWeather: true,
			tagIDs: [],
			revision: 1,
		},
	],
	canManageGlobalEvents: true,
};

const friend = {
	relationshipID: "fixture-friendship",
	friend: {
		userID: "fixture-friend",
		displayName: "Fixture Friend",
		email: "friend@example.test",
		appearance: {
			contentKind: "emoji",
			monogram: "FF",
			emoji: "🧪",
			foregroundColour: { r: 255, g: 255, b: 255, a: 1 },
			colours: [{ r: 73, g: 135, b: 102, a: 1 }],
		},
		photo: null,
	},
	state: "friends",
	locationStatus: {
		state: "withinFiveMinutes",
		updatedAt: "2026-09-06T03:45:00.000Z",
	},
	timetable: {
		title: "Fixture Friend",
		subjects: timetable.subjects,
	},
};

let grades = {
	document: {
		assessments: [
			{
				id: "assessment-one",
				subjectID: "mathematics",
				semester: 2,
				name: "Calculus test",
				date: { year: 2026, month: 9, day: 10 },
				score: 84,
				weighting: 20,
				location: "subjectPeriod",
			},
		],
		predictedATAR: 91.25,
		goalATAR: 95,
		serverRevision: 1,
	},
};

const schoolCalendar = {
	termRanges: [
		{
			label: "Term 3",
			start: { year: 2026, month: 7, day: 20 },
			end: { year: 2026, month: 9, day: 25 },
		},
	],
	skippedDates: [
		{
			date: { year: 2026, month: 9, day: 18 },
			label: "Pupil free day",
		},
	],
};

const tags = {
	sections: [
		{
			id: "year-groups",
			category: "yearGroup",
			displayName: "Year groups",
			sortOrder: 0,
			isArchived: false,
			revision: 1,
			tags: [
				{
					id: "year-12",
					sectionID: "year-groups",
					slug: "year-12",
					displayName: "Year 12",
					category: "yearGroup",
					symbol: "graduationcap",
					colorHex: "#3478f6",
					sortOrder: 0,
					isArchived: false,
					revision: 1,
					associatedNames: ["Year 12"],
				},
			],
		},
	],
};

const users = [
	account,
	{
		...account,
		id: "fixture-user",
		email: "student@example.test",
		displayName: "Fixture Student",
		authority: "user",
		badges: [],
	},
];

const statistics = {
	totalUsers: 12,
	usersWithOwnerTimetable: 10,
	totalAssessments: 28,
	averageAssessmentsPerUser: 2.3,
	averageAssessmentsPerUserWithMultipleAssessments: 3.1,
	totalDevices: 18,
	activeDevicesLast30Days: 16,
	debugDevices: 2,
	testFlightDevices: 3,
	releaseDevices: 13,
	iPhoneDevices: 12,
	iPadDevices: 3,
	macDevices: 2,
	watchDevices: 1,
	legacyDevices: 0,
	acceptedFriendships: 17,
	averageFriendsPerUser: 1.4,
	averageFriendsPerUserWithFriends: 2.1,
	totalCalendarEvents: 9,
	globalCalendarEvents: 4,
	personalCalendarEvents: 5,
	activeEventTagSubscriptions: 8,
	averageArrivalSecondsSinceMidnight: 30_300,
	usersWithAssessments: 8,
	usersWithLocationStatus: 6,
	totalLocationStatusUpdates: 122,
	deviceTypes: [{ label: "iPhone", count: 12 }],
	osVersions: [{ label: "iOS 27", count: 11 }],
	deviceOSVersions: [
		{
			platform: "iOS",
			osMajorVersion: 27,
			osMinorVersion: 0,
			isDebug: false,
			isOSBeta: false,
			count: 11,
		},
	],
	appVersions: [{ label: "1.0.0", count: 12 }],
	appVersionBuilds: [{ label: "100", count: 12 }],
};

const json = (body: unknown, status = 200) =>
	Response.json(body, {
		status,
		headers: { "Cache-Control": "no-store" },
	});

function bodyOf(request: Request) {
	return request.json().catch(() => ({})) as Promise<Record<string, unknown>>;
}

export async function responseFor(request: Request) {
	const url = new URL(request.url);
	const path = url.pathname.replace(/^\/api\//, "");

	if (path === "__fixture__/health") {
		return json({ ok: true });
	}

	if (path === "v1/auth/login" || path === "v1/auth/verify-code-register") {
		return json({
			accessToken: "fixture-access",
			refreshToken: "fixture-refresh",
			user: account,
		});
	}

	if (path === "v1/auth/request-code") {
		return new Response(null, { status: 204 });
	}

	if (path === "v1/auth/refresh") {
		return json({
			accessToken: "fixture-access-refreshed",
			refreshToken: "fixture-refresh-refreshed",
			user: account,
		});
	}

	if (path === "v1/auth/logout") {
		return new Response(null, { status: 204 });
	}

	if (path === "v1/account") {
		return json(account);
	}

	if (path === "v1/account/status") {
		if (request.method === "GET") {
			return json({
				item: {
					state: "withinFiveMinutes",
					updatedAt: "2026-09-06T03:45:00.000Z",
				},
			});
		}
		return json(await bodyOf(request));
	}

	if (path === "v1/account/status/statistics") {
		return json({
			averageArrivalSecondsSinceMidnight: 30_300,
			weekdayAverageArrivalSecondsSinceMidnight: [
				30_100,
				30_200,
				30_300,
				30_400,
				30_500,
			],
		});
	}

	if (path === "v1/timetables/owner") {
		if (request.method !== "GET") {
			timetable = { ...timetable, ...(await bodyOf(request)), revision: 2 };
		}
		return json(timetable);
	}

	if (path === "v1/events") {
		return json(events);
	}

	if (path.startsWith("v1/events/")) {
		return new Response(null, { status: 204 });
	}

	if (path === "v1/friends") {
		return json([friend]);
	}

	if (path === "v1/friends/order") {
		return json([friend]);
	}

	if (path === "v1/friends/requests") {
		return request.method === "GET"
			? json([{ ...friend, state: "pendingIncoming" }])
			: json(friend);
	}

	if (path === "v1/friends/requests/outgoing") {
		return json([{ ...friend, relationshipID: "fixture-outgoing", state: "pendingOutgoing" }]);
	}

	if (path === "v1/friends/search") {
		return json([{ profile: friend.friend, relationship: null }]);
	}

	if (/^v1\/friends\/[^/]+$/.test(path)) {
		if (request.method === "GET") {
			return json({
				...friend,
				acceptedAt: "2026-08-15T08:00:00.000Z",
				averageArrivalSecondsSinceMidnight: 30_200,
				weekdayAverageArrivalSecondsSinceMidnight: [30_000, 30_100, 30_200, 30_300, 30_400],
				locationNotificationPreferences: ["withinFiveMinutes", "arrived"],
			});
		}
		return json(friend);
	}

	if (path.includes("/friends-since")) {
		return json(friend);
	}

	if (path === "v1/grades") {
		if (request.method !== "GET") {
			grades = { ...grades, ...(await bodyOf(request)) };
		}
		return json(grades);
	}

	if (path === "v1/settings") {
		if (request.method !== "GET") {
			settings = { ...settings, ...(await bodyOf(request)), serverRevision: settings.serverRevision + 1 };
		}
		return json(settings);
	}

	if (path === "v1/settings/notifications") {
		if (request.method !== "GET") {
			settings = { ...settings, ...(await bodyOf(request)), serverRevision: settings.serverRevision + 1 };
		}
		return json(settings);
	}

	if (path === "v1/settings/calendar") {
		return json(schoolCalendar);
	}

	if (path === "v1/weather") {
		return json({
			temperatureCelsius: 22,
			conditionCode: "partlyCloudy",
			uvIndex: 4,
			precipitationChance: 0.2,
			isStale: false,
		});
	}

	if (path === "v1/tags" || path === "v1/administration/event-tags") {
		return json(tags);
	}

	if (path === "v1/tags/subscriptions") {
		return json({ tagIDs: ["year-12"] });
	}

	if (path === "v1/friends/profile") {
		return json({
			displayName: account.displayName,
			appearance: account.appearance,
			photo: null,
			revision: account.revision,
			...(request.method === "GET" ? {} : await bodyOf(request)),
		});
	}

	if (path === "v1/friends/profile/photo") {
		return new Response(null, { status: 204 });
	}

	if (path === "v1/about" || path === "v1/administration/about-contributors") {
		return json([
			{
				id: "fixture-contributor",
				name: "Fixture Contributor",
				role: "Testing",
				sortOrder: 0,
			},
		]);
	}

	if (path === "v1/administration") {
		return json({
			isAdmin: true,
			authority: "systemOwner",
			pendingModerationCount: 1,
		});
	}

	if (path === "v1/administration/statistics") {
		return json(statistics);
	}

	if (path === "v1/administration/users") {
		return json(users);
	}

	if (/^v1\/administration\/users\//.test(path)) {
		return request.method === "GET"
			? json(path.endsWith("/raw-data") ? { rawData: "fixture" } : users[1])
			: json(users[1]);
	}

	if (path === "v1/administration/user-reports") {
		return json([
			{
				id: "fixture-report",
				reporterID: account.id,
				reporterDisplayName: account.displayName,
				reportedUserID: users[1]!.id,
				reportedUserDisplayName: users[1]!.displayName,
				action: "pending",
				createdAt: "2026-09-05T08:00:00.000Z",
			},
		]);
	}

	if (/^v1\/administration\/user-reports\//.test(path)) {
		return json({
			id: "fixture-report",
			reporterID: account.id,
			reportedUserID: users[1]!.id,
			action: "noAction",
		});
	}

	if (path === "v1/administration/calendar") {
		return json([
			{
				id: "fixture-term",
				kind: "term",
				label: "Term 3",
				startDate: { year: 2026, month: 7, day: 20 },
				endDate: { year: 2026, month: 9, day: 25 },
			},
			{
				id: "fixture-school-event",
				kind: "event",
				label: "School assembly",
				startDate: { year: 2026, month: 9, day: 7 },
				endDate: null,
			},
		]);
	}

	if (path === "v1/administration/broadcast-notifications") {
		return json([
			{
				id: "fixture-broadcast",
				senderEmail: account.email,
				senderAuthority: account.authority,
				title: "Fixture notice",
				subtitle: "Synthetic data",
				body: "This message was not sent.",
				eligibleDeviceCount: 3,
				deliveredDeviceCount: 3,
				invalidatedDeviceCount: 0,
				failedDeviceCount: 0,
				deliveryState: "delivered",
				isDeleted: false,
				createdAt: "2026-09-05T08:00:00.000Z",
			},
		]);
	}

	if (path === "v1/administration/email-log") {
		return json([
			{
				id: "fixture-email",
				recipient: "recipient@example.test",
				subject: "Fixture email",
				body: "Synthetic message",
				status: "delivered",
				failureReason: null,
				createdAt: "2026-09-05T08:00:00.000Z",
				updatedAt: "2026-09-05T08:00:01.000Z",
			},
		]);
	}

	if (path === "v1/administration/app-version") {
		return json({
			appVersion: "1.0.0",
			appBuild: 100,
			macVersion: "1.0.0",
			macBuild: 100,
		});
	}

	if (path === "v1/administration/profile-storage-quota") {
		return json({
			storedBytes: 2_000_000,
			reservedBytes: 500_000,
			storageLimitBytes: 10_000_000,
			monthlyOperations: 120,
			monthlyOperationLimit: 1_000,
			monthlyWriteCutoff: 900,
			writesDisabled: false,
			reconciledStoredBytes: 2_000_000,
			reconciliationWarning: false,
			reconciledAt: "2026-09-05T08:00:00.000Z",
		});
	}

	if (path === "v1/administration/badges") {
		return json([
			{
				id: "fixture-badge",
				symbol: "star.fill",
				accessibilityLabel: "Fixture tester",
				backgroundColors: ["#3478f6", "#7357c0"],
				foregroundColor: "#ffffff",
				userIDs: [account.id],
			},
		]);
	}

	if (path === "v1/administration/development-access") {
		return json({ developmentAccessOnly: false });
	}

	if (path.startsWith("v1/administration/") || path.startsWith("v1/report/")) {
		return request.method === "DELETE"
			? new Response(null, { status: 204 })
			: json(await bodyOf(request));
	}

	return json({ error: { reason: `No fixture for ${request.method} ${path}` } }, 404);
}

if (import.meta.main) {
	const port = Number(Bun.env.FIXTURE_PORT ?? 3100);

	Bun.serve({
		port,
		fetch: responseFor,
	});

	console.log(`PMSTT fixture listening on http://127.0.0.1:${port}/api`);
}
