import Link from "next/link";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "./page.module.css";

const lessons = [
	{
		time: "8:45",
		title: "Mathematics",
		detail: "Room 4 · Mr Bennett",
		colour: "blue",
	},
	{
		time: "10:10",
		title: "English",
		detail: "Room 12 · Ms Harris",
		colour: "red",
	},
	{
		time: "11:45",
		title: "Chemistry",
		detail: "Lab 2 · Dr Chen",
		colour: "green",
	},
] as const;

const features = [
	{
		icon: "calendar",
		title: "Your whole week",
		description: "Classes, events and term dates stay together.",
	},
	{
		icon: "chart.bar",
		title: "Grades at a glance",
		description: "See what is due and how every subject is tracking.",
	},
	{
		icon: "person.2",
		title: "Built for friends",
		description: "Compare free periods without sharing everything.",
	},
] as const;

export default function LandingPage() {
	return (
		<main className={styles.page}>
			<nav className={styles.navigation} aria-label="Main navigation">
				<Link className={styles.brand} href="/" aria-label="Timetable home">
					<span className={styles.logo} aria-hidden="true">
						T
					</span>
					<span>Timetable</span>
				</Link>
				<Link className={styles.signIn} href="/login">
					<Symbol name="person.crop.circle" />
					<span>Sign in</span>
				</Link>
			</nav>

			<section className={styles.hero} aria-labelledby="landing-title">
				<div className={styles.heroCopy}>
					<p className={styles.eyebrow}>Made for the school day</p>
					<h1 id="landing-title">
						Your week,
						<br />
						without the mess.
					</h1>
					<p className={styles.introduction}>
						Timetable puts classes, plans, grades and friends in one quiet,
						focused place.
					</p>
					<Link className={styles.primaryAction} href="/login">
						<span>Open Timetable</span>
						<Symbol name="arrow.right" />
					</Link>
				</div>

				<div className={styles.preview} aria-label="Example day in Timetable">
					<div className={styles.previewHeader}>
						<div>
							<span className={styles.previewLabel}>Tuesday</span>
							<strong>27 August</strong>
						</div>
						<span className={styles.todayBadge}>Today</span>
					</div>
					<div className={styles.lessonList}>
						{lessons.map((lesson) => (
							<div className={styles.lesson} key={lesson.title}>
								<time>{lesson.time}</time>
								<span
									className={`${styles.lessonColour} ${styles[lesson.colour]}`}
									aria-hidden="true"
								/>
								<div>
									<strong>{lesson.title}</strong>
									<span>{lesson.detail}</span>
								</div>
								<Symbol name="chevron.right" />
							</div>
						))}
					</div>
					<div className={styles.nextEvent}>
						<Symbol name="clock" />
						<span>Next class in 24 minutes</span>
					</div>
				</div>
			</section>

			<section className={styles.features} aria-label="Timetable features">
				{features.map((feature) => (
					<article className={styles.feature} key={feature.title}>
						<div className={styles.featureIcon} aria-hidden="true">
							<Symbol name={feature.icon} />
						</div>
						<div>
							<h2>{feature.title}</h2>
							<p>{feature.description}</p>
						</div>
					</article>
				))}
			</section>

			<footer className={styles.footer}>
				<span>Timetable</span>
				<span>© {new Date().getFullYear()} JDCQ</span>
			</footer>
		</main>
	);
}
