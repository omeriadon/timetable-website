"use client";

import { useEffect, useState } from "react";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

type StatisticCount = {
	label: string;
	count: number;
};

type AdministrationStatistics = {
	totalUsers: number;
	usersWithOwnerTimetable: number;
	totalAssessments: number;
	averageAssessmentsPerUser: number | null;
	averageAssessmentsPerUserWithMultipleAssessments: number | null;
	totalDevices: number;
	activeDevicesLast30Days: number;
	debugDevices: number;
	testFlightDevices: number;
	releaseDevices: number;
	iPhoneDevices: number;
	iPadDevices: number;
	macDevices: number;
	watchDevices: number;
	legacyDevices: number;
	acceptedFriendships: number;
	averageFriendsPerUser: number | null;
	averageFriendsPerUserWithFriends: number | null;
	totalCalendarEvents: number;
	globalCalendarEvents: number;
	personalCalendarEvents: number;
	activeEventTagSubscriptions: number;
	averageArrivalSecondsSinceMidnight: number | null;
	usersWithAssessments: number;
	usersWithLocationStatus: number;
	totalLocationStatusUpdates: number;
	deviceTypes: StatisticCount[];
	osVersions: StatisticCount[];
	appVersions: StatisticCount[];
	appVersionBuilds: StatisticCount[];
};

export default function AdminStatisticsEditor() {
	const [statistics, setStatistics] = useState<AdministrationStatistics | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiRequest<AdministrationStatistics>("v1/administration/statistics")
			.then(setStatistics)
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	if (error) {
		return <p className={styles.error} role="alert">{error}</p>;
	}

	if (!statistics) {
		return <p className={styles.loading}>Loading statistics…</p>;
	}

	return (
		<main className={styles.page}>
			<StatisticGroup
				title="Overview"
				icon="chart.bar"
				rows={[
					["Users", statistics.totalUsers],
					["Users with timetable", statistics.usersWithOwnerTimetable],
					["Assessments", statistics.totalAssessments],
					["Users with assessments", statistics.usersWithAssessments],
					["Average assessments per user", formatDecimal(statistics.averageAssessmentsPerUser)],
				]}
			/>
			<StatisticGroup
				title="Friends and calendar"
				icon="person.2"
				rows={[
					["Accepted friendships", statistics.acceptedFriendships],
					["Average friends per user", formatDecimal(statistics.averageFriendsPerUser)],
					["Calendar events", statistics.totalCalendarEvents],
					["Global events", statistics.globalCalendarEvents],
					["Personal events", statistics.personalCalendarEvents],
					["Active tag subscriptions", statistics.activeEventTagSubscriptions],
				]}
			/>
			<StatisticGroup
				title="Devices"
				icon="externaldrive.fill"
				rows={[
					["Total devices", statistics.totalDevices],
					["Active in the last 30 days", statistics.activeDevicesLast30Days],
					["Release devices", statistics.releaseDevices],
					["TestFlight devices", statistics.testFlightDevices],
					["Debug devices", statistics.debugDevices],
					["iPhone", statistics.iPhoneDevices],
					["iPad", statistics.iPadDevices],
					["Mac", statistics.macDevices],
					["Apple Watch", statistics.watchDevices],
				]}
			/>
			<StatisticGroup
				title="Location notifications"
				icon="calendar.badge.clock"
				rows={[
					["Users with location status", statistics.usersWithLocationStatus],
					["Location updates", statistics.totalLocationStatusUpdates],
					["Average arrival", formatArrival(statistics.averageArrivalSecondsSinceMidnight)],
				]}
			/>
			<CountGroup title="Device types" rows={statistics.deviceTypes} />
			<CountGroup title="App versions" rows={statistics.appVersions} />
			<CountGroup title="App builds" rows={statistics.appVersionBuilds} />
		</main>
	);
}

function StatisticGroup({
	title,
	icon,
	rows,
}: {
	title: string;
	icon: string;
	rows: Array<[string, string | number]>;
}) {
	return (
		<section>
			<h2 className={styles.section}>{title}</h2>
			<div className={styles.card}>
				{rows.map(([label, value]) => (
					<div className={styles.row} key={label}>
						<SymbolIcon name={icon} />
						<span className={styles.label}>{label}</span>
						<strong className={styles.detail}>{value}</strong>
					</div>
				))}
			</div>
		</section>
	);
}

function CountGroup({ title, rows }: { title: string; rows: StatisticCount[] }) {
	if (!rows.length) {
		return null;
	}

	return (
		<section>
			<h2 className={styles.section}>{title}</h2>
			<div className={styles.card}>
				{rows.map((row) => (
					<div className={styles.row} key={row.label}>
						<span className={styles.label}>{row.label}</span>
						<strong className={styles.detail}>{row.count}</strong>
					</div>
				))}
			</div>
		</section>
	);
}

function formatDecimal(value: number | null) {
	return value === null ? "—" : value.toFixed(2);
}

function formatArrival(value: number | null) {
	if (value === null) {
		return "—";
	}

	const hours = Math.floor(value / 3600);
	const minutes = Math.round((value % 3600) / 60);
	const suffix = hours >= 12 ? "pm" : "am";
	const displayHour = hours % 12 || 12;
	return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}
