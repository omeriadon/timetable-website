"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDashboard } from "@/features/timetable/useDashboard";
import styles from "./page.module.css";

const destinations = [
	{
		href: "/today",
		label: "Today",
		description: "See your school day and what is coming up.",
		icon: "calendar.day.timeline.left",
	},
	{
		href: "/week",
		label: "Week",
		description: "View every class across the school week.",
		icon: "calendar.badge.clock",
	},
	{
		href: "/planner",
		label: "Planner",
		description: "Keep events, assessments, and term dates together.",
		icon: "pencil.and.list.clipboard",
	},
];

export default function Home() {
	const setToolbar = useToolbar();
	const { data, error, isLoading } = useDashboard();

	useEffect(() => {
		setToolbar({ title: "Home" });
	}, [setToolbar]);

	const displayName = data?.account.displayName ?? "there";
	const eventCount = data
		? data.events.globalEvents.length + data.events.privateEvents.length
		: 0;

	return (
		<main className={styles.homePage}>
			<header className={styles.homeHeader}>
				<p className={styles.homeEyebrow}>Timetable</p>
				<h1>Good to see you, {displayName}.</h1>
				<p>Everything for your school day, in one place.</p>
			</header>

			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}

			<section className={styles.homeStats} aria-label="Your overview">
				<div className={styles.homeStat}>
					<strong>
						{isLoading ? "—" : data?.timetable.subjects.length ?? 0}
					</strong>
					<span>Classes</span>
				</div>
				<div className={styles.homeStat}>
					<strong>{isLoading ? "—" : eventCount}</strong>
					<span>Events</span>
				</div>
				<div className={styles.homeStat}>
					<strong>{isLoading ? "—" : data?.friends.length ?? 0}</strong>
					<span>Friends</span>
				</div>
			</section>

			<section className={styles.destinationList} aria-label="Timetable views">
				{destinations.map((destination) => (
					<Link
						key={destination.href}
						href={destination.href}
						className={styles.destination}
					>
						<Symbol name={destination.icon} className={styles.destinationIcon} />
						<span>
							<strong>{destination.label}</strong>
							<small>{destination.description}</small>
						</span>
						<Symbol
							name="chevron.right"
							className={styles.destinationChevron}
						/>
					</Link>
				))}
			</section>
		</main>
	);
}
