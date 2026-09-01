"use client";

import { useEffect, useMemo, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "../page.module.css";
import { apiRequest } from "@/lib/api/client";
import AdminEventTagsEditor from "@/components/administration/AdminEventTagsEditor/AdminEventTagsEditor";
import AdminCalendarEditor from "@/components/administration/AdminCalendarEditor/AdminCalendarEditor";
import AdminUsersEditor from "@/components/administration/AdminUsersEditor/AdminUsersEditor";
import AdminUserReportsEditor from "@/components/administration/AdminUserReportsEditor/AdminUserReportsEditor";
import AdminAppVersionEditor from "@/components/administration/AdminAppVersionEditor/AdminAppVersionEditor";
import AdminProfileStorageEditor from "@/components/administration/AdminProfileStorageEditor/AdminProfileStorageEditor";
import AdminBroadcastHistoryEditor from "@/components/administration/AdminBroadcastHistoryEditor/AdminBroadcastHistoryEditor";
import AdminStatisticsEditor from "@/components/administration/AdminStatisticsEditor/AdminStatisticsEditor";
import AdminEmailLogEditor from "@/components/administration/AdminEmailLogEditor/AdminEmailLogEditor";
import AdminBadgesEditor from "@/components/administration/AdminBadgesEditor/AdminBadgesEditor";
import AdminAdministratorsEditor from "@/components/administration/AdminAdministratorsEditor/AdminAdministratorsEditor";
import AdminDevelopmentAccessEditor from "@/components/administration/AdminDevelopmentAccessEditor/AdminDevelopmentAccessEditor";
import AdminRecord, {
	type AdminRecordValue,
} from "@/components/administration/AdminRecord/AdminRecord";
import TestEmailButton from "@/components/administration/TestEmailButton/TestEmailButton";
import BroadcastNotificationEditor from "@/components/administration/BroadcastNotificationEditor/BroadcastNotificationEditor";
import AdminAboutContributorsEditor from "@/components/administration/AdminAboutContributorsEditor/AdminAboutContributorsEditor";

const sectionConfig: Record<
	string,
	{ title: string; icon: string; endpoint?: string; kind?: string }
> = {
	statistics: {
		title: "Statistics",
		icon: "chart.bar",
		endpoint: "v1/administration/statistics",
	},
	users: {
		title: "Users",
		icon: "person.2",
	},
	"user-reports": {
		title: "User Reports",
		icon: "exclamationmark.bubble",
	},
	calendar: {
		title: "School Events and Term Dates",
		icon: "calendar.badge.exclamationmark",
		endpoint: "v1/administration/calendar",
	},
	"school-events": {
		title: "School Events",
		icon: "calendar.badge.exclamationmark",
		endpoint: "v1/administration/calendar",
		kind: "event",
	},
	"term-dates": {
		title: "Term Dates",
		icon: "calendar.badge.clock",
		endpoint: "v1/administration/calendar",
		kind: "term",
	},
	"pupil-free-days": {
		title: "Pupil Free Days",
		icon: "calendar.badge.exclamationmark",
		endpoint: "v1/administration/calendar",
		kind: "noSchool",
	},
	"event-tags": {
		title: "Event Tags",
		icon: "tag",
		endpoint: "v1/administration/event-tags",
	},
	"broadcast-notification": {
		title: "Broadcast Notification",
		icon: "megaphone",
	},
	"broadcast-notifications": {
		title: "Broadcast History",
		icon: "clock.arrow.trianglehead.counterclockwise.rotate.90",
		endpoint: "v1/administration/broadcast-notifications",
	},
	"email-log": {
		title: "Email Log",
		icon: "envelope.badge",
		endpoint: "v1/administration/email-log",
	},
	"app-version": {
		title: "App Version",
		icon: "arrow.down.app",
		endpoint: "v1/administration/app-version",
	},
	"profile-storage-quota": {
		title: "Profile Storage",
		icon: "externaldrive.fill",
		endpoint: "v1/administration/profile-storage-quota",
	},
	badges: {
		title: "Badges",
		icon: "rosette",
		endpoint: "v1/administration/badges",
	},
	"test-email": { title: "Send Test Email", icon: "envelope.badge" },
	administrators: {
		title: "Administrators",
		icon: "person.badge.shield.checkmark",
	},
	"server-access": { title: "Debug Testing", icon: "testtube.2" },
	"about-contributors": { title: "About Contributors", icon: "person.3" },
};

export default function AdministrationSectionPage({
	section,
}: {
	section: string;
}) {
	const setToolbar = useToolbar();
	const [data, setData] = useState<unknown>(null);
	const [error, setError] = useState<string | null>(null);
	const config = sectionConfig[section] ?? {
		title: "Administration",
		icon: "calendar.badge.lock",
	};

	useEffect(() => {
		setToolbar({ title: config.title });
		setData(null);
		setError(null);
		if (
			[
				"statistics",
				"email-log",
				"badges",
				"event-tags",
				"app-version",
				"profile-storage-quota",
				"broadcast-notifications",
			].includes(section)
		)
			return;
		if (!config.endpoint) return;
		apiRequest<unknown>(config.endpoint)
			.then(setData)
			.catch((requestError: Error) => setError(requestError.message));
	}, [config.endpoint, config.title, section, setToolbar]);

	const filteredData = useMemo(
		() => filterData(data, config.kind),
		[config.kind, data],
	);
	const records = useMemo(() => normalizeRecords(filteredData), [filteredData]);
	const summary = useMemo(() => scalarEntries(filteredData), [filteredData]);

	return section === "statistics" ? (
		<AdminStatisticsEditor />
	) : section === "email-log" ? (
		<AdminEmailLogEditor />
	) : section === "badges" ? (
		<AdminBadgesEditor />
	) : section === "users" ? (
		<AdminUsersEditor />
	) : section === "administrators" ? (
		<AdminAdministratorsEditor />
	) : section === "server-access" ? (
		<AdminDevelopmentAccessEditor />
	) : section === "user-reports" ? (
		<AdminUserReportsEditor />
	) : section === "event-tags" ? (
		<AdminEventTagsEditor />
	) : section === "school-events" ? (
		<AdminCalendarEditor kind="event" title="School Events" />
	) : section === "term-dates" ? (
		<AdminCalendarEditor kind="term" title="Term Dates" />
	) : section === "pupil-free-days" ? (
		<AdminCalendarEditor kind="noSchool" title="Pupil Free Days" />
	) : section === "app-version" ? (
		<AdminAppVersionEditor />
	) : section === "profile-storage-quota" ? (
		<AdminProfileStorageEditor />
	) : section === "broadcast-notifications" ? (
		<AdminBroadcastHistoryEditor />
	) : section === "about-contributors" ? (
		<AdminAboutContributorsEditor />
	) : (
		<main className={styles.page}>
			<section className={styles.card}>
				<div className={styles.row}>
					<Symbol name={config.icon} fallback="•" />
					<span className={styles.label}>{config.title}</span>
				</div>
			</section>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			{section === "broadcast-notification" ? (
				<BroadcastNotificationEditor />
			) : section === "test-email" ? (
				<section className={styles.card}>
					<div className={styles.row}>
						<TestEmailButton />
					</div>
				</section>
			) : null}
			{summary.length ? (
				<section className={styles.card}>
					{summary.map(([key, value]) => (
						<div key={key} className={styles.row}>
							<span className={styles.label}>{humanize(key)}</span>
							<span className={styles.detail}>{formatValue(value)}</span>
						</div>
					))}
				</section>
			) : null}
			{data && records.length ? (
				<section className={styles.card}>
					{records.map((record, index) => (
						<AdminRecord
							key={String(record.id ?? index)}
							record={record}
							humanize={humanize}
							formatValue={formatValue}
						/>
					))}
				</section>
			) : null}
			{config.endpoint && !data && !error ? (
				<p className={styles.loading}>Loading {config.title.toLowerCase()}…</p>
			) : null}
		</main>
	);
}

function filterData(data: unknown, kind?: string): unknown {
	if (!kind || !data) return data;
	if (Array.isArray(data)) {
		return data.filter((item) => isRecord(item) && item.kind === kind);
	}
	if (isRecord(data)) {
		const arrayKey = Object.keys(data).find((key) => Array.isArray(data[key]));
		if (arrayKey) {
			return { ...data, [arrayKey]: filterData(data[arrayKey], kind) };
		}
	}
	return data;
}

function normalizeRecords(data: unknown): AdminRecordValue[] {
	if (Array.isArray(data)) {
		return data.filter(isRecord);
	}
	if (isRecord(data)) {
		const arrayValue = Object.values(data).find(Array.isArray);
		if (Array.isArray(arrayValue)) {
			return arrayValue.filter(isRecord);
		}
		return [];
	}
	return [];
}

function scalarEntries(data: unknown): [string, unknown][] {
	if (!isRecord(data)) return [];
	return Object.entries(data).filter(([, value]) => {
		return (
			typeof value === "string" ||
			typeof value === "number" ||
			typeof value === "boolean"
		);
	});
}

function isRecord(value: unknown): value is AdminRecordValue {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function humanize(key: string) {
	return key
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/ID$/, " ID")
		.replace(/^./, (value) => value.toUpperCase());
}

function formatValue(value: unknown): string {
	if (Array.isArray(value)) return `${value.length} items`;
	if (typeof value === "boolean") return value ? "On" : "Off";
	if (typeof value === "object" && value !== null) return "Details available";
	return String(value);
}
