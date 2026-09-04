import { Link } from "@tanstack/react-router";
import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "./page.module.css";

type Friend = {
	id: string;
	name: string;
	initials: string;
	colour: string;
	subject: string;
	room: string;
	top: string;
	left: string;
};

const friends: Friend[] = [
	{
		id: "maya",
		name: "Maya Chen",
		initials: "MC",
		colour: "#f4b8a7",
		subject: "Methods",
		room: "BL4",
		top: "28%",
		left: "31%",
	},
	{
		id: "oliver",
		name: "Oliver James",
		initials: "OJ",
		colour: "#bad2c2",
		subject: "Geography",
		room: "TMSC",
		top: "57%",
		left: "65%",
	},
	{
		id: "aisha",
		name: "Aisha Patel",
		initials: "AP",
		colour: "#c6c0df",
		subject: "Visual Arts",
		room: "VA2",
		top: "72%",
		left: "24%",
	},
];

const lessons = [
	{ time: "08:30", subject: "English", room: "E14", state: "done" },
	{ time: "09:35", subject: "Methods", room: "BL4", state: "current" },
	{ time: "10:40", subject: "Geography", room: "TMSC", state: "upcoming" },
	{ time: "12:55", subject: "Chemistry", room: "SC3", state: "upcoming" },
];

const featureCards = [
	{
		label: "01 / Today",
		title: "Know what is next.",
		copy: "Your current period, your next room, and the shape of the day at a glance.",
		image: "/landing/timetable-today.webp",
		alt: "Timetable Today view showing the school day",
	},
	{
		label: "02 / Week",
		title: "Make the week legible.",
		copy: "A calm view of every class, with enough space to see patterns before they become problems.",
		image: "/landing/timetable-week.webp",
		alt: "Timetable Week view showing classes across the week",
	},
	{
		label: "03 / Planner",
		title: "Leave room for life.",
		copy: "Keep school events and your own plans together, without rebuilding the calendar by hand.",
		image: "/landing/timetable-planner.webp",
		alt: "Timetable Planner view with upcoming events",
	},
	{
		label: "04 / Grades",
		title: "See the whole picture.",
		copy: "Subject results and assessment history, arranged to help you understand your progress.",
		image: "/landing/grades.webp",
		alt: "Timetable Grades view showing subject results",
	},
];

function Arrow() {
	return (
		<Symbol name="arrow.up.right" className={styles.arrow} aria-hidden="true" />
	);
}

export default function LandingPage() {
	const [selectedFriendID, setSelectedFriendID] = useState(friends[0].id);
	const selectedFriend =
		friends.find((friend) => friend.id === selectedFriendID) ?? friends[0];

	return (
		<div className={styles.shell}>
			<header className={styles.header}>
				<a className={styles.wordmark} href="#top" aria-label="Timetable home">
					<span className={styles.wordmarkMark}>T</span>
					<span>Timetable</span>
				</a>
				<nav className={styles.nav} aria-label="Main navigation">
					<a href="#features">Features</a>
					<a href="#map">Friends</a>
					<Link className={styles.navLogin} to="/login">
						<span>Log in</span>
						<Arrow />
					</Link>
				</nav>
			</header>

			<main id="top">
				<section className={styles.hero} aria-labelledby="hero-title">
					<div className={styles.heroCopy}>
						<p className={styles.kicker}>A better school day / Perth Modern</p>
						<h1 id="hero-title">
							Make your week <em>make sense.</em>
						</h1>
						<p className={styles.heroIntro}>
							Timetable brings your classes, plans, grades, and friends into one
							considered place.
						</p>
						<div className={styles.heroActions}>
							<a
								className={styles.primaryButton}
								href="https://testflight.apple.com/join/DDUXPSq3"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Symbol name="apple.logo" aria-hidden="true" />
								<span>Try the iOS app</span>
							</a>
							<Link className={styles.textButton} to="/login">
								<span>Open Timetable on web</span>
								<Arrow />
							</Link>
						</div>
					</div>
					<div className={styles.heroArt} aria-hidden="true">
						<div className={styles.artNote}>
							Monday
							<br />
							<strong>Week 04</strong>
						</div>
						<div className={styles.artCircle} />
						<div className={styles.artCard}>
							<span>09:35</span>
							<strong>Methods</strong>
							<small>BL4 · with Maya</small>
						</div>
						<div className={styles.artRule} />
					</div>
				</section>

				<section className={styles.statement} aria-labelledby="statement-title">
					<p className={styles.kicker}>The useful middle</p>
					<h2 id="statement-title">
						The school day is already full. Your tools should feel{" "}
						<em>lighter.</em>
					</h2>
					<p>
						Designed around the small decisions that make a difference: where to
						be, what to bring, and what deserves your attention next.
					</p>
				</section>

				<section
					className={styles.featureSection}
					id="features"
					aria-labelledby="features-title"
				>
					<div className={styles.sectionHeading}>
						<p className={styles.kicker}>01 — Overview</p>
						<h2 id="features-title">Everything in its place.</h2>
					</div>
					<div className={styles.featureGrid}>
						{featureCards.map((card) => (
							<article className={styles.featureCard} key={card.label}>
								<div className={styles.featureImageWrap}>
									<img src={card.image} alt={card.alt} loading="lazy" />
								</div>
								<div className={styles.featureCardCopy}>
									<p className={styles.cardLabel}>{card.label}</p>
									<h3>{card.title}</h3>
									<p>{card.copy}</p>
								</div>
							</article>
						))}
					</div>
				</section>

				<section className={styles.daySection} aria-labelledby="day-title">
					<div>
						<p className={styles.kicker}>02 — Timetable</p>
						<h2 id="day-title">A day with a rhythm.</h2>
						<p className={styles.sectionCopy}>
							Current period, next period, and enough context to move through
							the day with confidence.
						</p>
					</div>
					<div className={styles.dayCard}>
						<div className={styles.dayCardHeader}>
							<span>Tuesday, 12 August</span>
							<span className={styles.livePill}>
								<i /> Period 2 now
							</span>
						</div>
						<div className={styles.lessonList}>
							{lessons.map((lesson) => (
								<div
									className={`${styles.lesson} ${lesson.state === "current" ? styles.currentLesson : ""}`}
									key={lesson.time}
								>
									<span className={styles.lessonTime}>{lesson.time}</span>
									<strong>{lesson.subject}</strong>
									<span className={styles.lessonRoom}>{lesson.room}</span>
									{lesson.state === "current" && (
										<span className={styles.nowLabel}>Now</span>
									)}
								</div>
							))}
						</div>
					</div>
				</section>

				<section
					className={styles.plannerSection}
					aria-labelledby="planner-title"
				>
					<div className={styles.plannerBlock}>
						<p className={styles.kicker}>03 — Planner</p>
						<h2 id="planner-title">Hold the moving parts.</h2>
						<p>
							Term dates, assessments, and events live alongside your timetable,
							so plans stay connected to the week they belong to.
						</p>
						<Link className={styles.textButton} to="/login">
							<span>See the planner</span>
							<Arrow />
						</Link>
					</div>
					<div
						className={styles.plannerList}
						aria-label="Example planned events"
					>
						<div>
							<span>MON 18</span>
							<strong>Maths assignment</strong>
							<small>Due tomorrow · Methods</small>
						</div>
						<div>
							<span>WED 20</span>
							<strong>Cross country carnival</strong>
							<small>All day · School event</small>
						</div>
						<div>
							<span>FRI 22</span>
							<strong>Study session</strong>
							<small>3:30 pm · Library</small>
						</div>
					</div>
				</section>

				<section
					className={styles.mapSection}
					id="map"
					aria-labelledby="map-title"
				>
					<div className={styles.mapIntro}>
						<p className={styles.kicker}>04 — Friends</p>
						<h2 id="map-title">Find your people.</h2>
						<p>
							Compare schedules and share your current class. The map below is
							an interactive demo using fictional data, not GPS-level tracking.
						</p>
						<div className={styles.selectedFriend} aria-live="polite">
							<span
								className={styles.avatar}
								style={{ backgroundColor: selectedFriend.colour }}
							>
								{selectedFriend.initials}
							</span>
							<div>
								<strong>{selectedFriend.name}</strong>
								<span>
									{selectedFriend.subject} · {selectedFriend.room}
								</span>
							</div>
						</div>
					</div>
					<div
						className={styles.mapDemo}
						role="group"
						aria-label="Interactive campus map demo with fictional friend locations"
					>
						<div className={styles.mapTopline}>
							<span>Campus demo</span>
							<span>Tuesday · 09:35</span>
						</div>
						<div className={styles.mapRoad} />
						<div className={`${styles.mapPath} ${styles.mapPathVertical}`} />
						<div className={`${styles.mapPath} ${styles.mapPathDiagonal}`} />
						<div
							className={styles.mapBuilding}
							style={{ top: "14%", left: "12%", width: "30%", height: "23%" }}
						>
							Library
						</div>
						<div
							className={styles.mapBuilding}
							style={{ top: "42%", left: "42%", width: "38%", height: "22%" }}
						>
							Science
						</div>
						<div
							className={styles.mapBuilding}
							style={{ top: "70%", left: "8%", width: "30%", height: "18%" }}
						>
							Arts
						</div>
						{friends.map((friend) => (
							<button
								type="button"
								key={friend.id}
								className={styles.friendMarker}
								style={{
									top: friend.top,
									left: friend.left,
									backgroundColor: friend.colour,
								}}
								aria-label={`Select ${friend.name}, currently in ${friend.subject} at ${friend.room}`}
								aria-pressed={selectedFriendID === friend.id}
								data-selected={selectedFriendID === friend.id}
								onClick={() => setSelectedFriendID(friend.id)}
							>
								{friend.initials}
							</button>
						))}
						<div className={styles.mapLegend}>
							<span>
								<i className={styles.legendDot} /> Fictional friend
							</span>
							<span>
								<i className={styles.legendLine} /> Campus buildings
							</span>
						</div>
					</div>
				</section>

				<section className={styles.ctaSection} aria-labelledby="cta-title">
					<p className={styles.kicker}>Make a start</p>
					<h2 id="cta-title">Your week, with less noise.</h2>
					<div className={styles.ctaActions}>
						<a
							className={styles.primaryButton}
							href="https://testflight.apple.com/join/DDUXPSq3"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Symbol name="apple.logo" aria-hidden="true" />
							<span>Join the TestFlight</span>
						</a>
						<Link className={styles.textButton} to="/login">
							<span>Open the web app</span>
							<Arrow />
						</Link>
					</div>
				</section>
			</main>

			<footer className={styles.footer}>
				<span>Timetable / JDQC</span>
				<span>© {new Date().getFullYear()} JDQC</span>
				<span>
					Timetable is an independent project and is not affiliated with,
					endorsed by, or sponsored by Perth Modern School.
				</span>
			</footer>
		</div>
	);
}
