import Link from "next/link";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "./page.module.css";

const features = [
	{
		title: "See your day",
		description: "Know what is next, where it is, and when you need to leave.",
		icon: "calendar.day.timeline.left",
	},
	{
		title: "Plan ahead",
		description: "Keep classes, assessments, events, and term dates together.",
		icon: "calendar.badge.clock",
	},
	{
		title: "Stay connected",
		description: "Share your timetable and coordinate with friends at school.",
		icon: "person.2",
	},
] as const;

export default function LandingPage() {
	return (
		<main className={styles.landingPage}>
			<nav className={styles.navigation} aria-label="Main navigation">
				<Link className={styles.wordmark} href="/" aria-label="Timetable home">
					<span className={styles.wordmarkMark}>T</span>
					<span>Timetable</span>
				</Link>
				<Link className={styles.signInLink} href="/login">
					Sign in
					<Symbol name="arrow.up.right" />
				</Link>
			</nav>

			<section className={styles.hero} aria-labelledby="landing-heading">
				<div className={styles.heroCopy}>
					<p className={styles.eyebrow}>Your school week, in one place.</p>
					<h1 id="landing-heading">Make time for what matters.</h1>
					<p className={styles.introduction}>
						Timetable brings your classes, plans, grades, events, and friends
						into one calm, focused space.
					</p>
					<Link className={styles.primaryAction} href="/login">
						<span>Open Timetable</span>
						<Symbol name="arrow.right" />
					</Link>
				</div>
				<div className={styles.heroMark} aria-hidden="true">
					<div className={styles.heroMarkGlow} />
					<span>T</span>
				</div>
			</section>

			<section
				className={styles.featureSection}
				aria-labelledby="features-heading"
			>
				<div className={styles.sectionHeading}>
					<p className={styles.eyebrow}>Everything in sync</p>
					<h2 id="features-heading">A clearer school day.</h2>
				</div>
				<div className={styles.featureGrid}>
					{features.map((feature) => (
						<article className={styles.feature} key={feature.title}>
							<div className={styles.featureIcon} aria-hidden="true">
								<Symbol name={feature.icon} />
							</div>
							<h3>{feature.title}</h3>
							<p>{feature.description}</p>
						</article>
					))}
				</div>
			</section>

			<footer className={styles.footer}>
				<span>Timetable</span>
				<span>© {new Date().getFullYear()}, JDCQ.</span>
			</footer>
		</main>
	);
}
