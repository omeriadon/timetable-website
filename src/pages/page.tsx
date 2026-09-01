import { Link } from "@tanstack/react-router";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "./page.module.css";
import { useEffect, useState, type ReactNode } from "react";

type CardProps = {
	title?: string;
	maskNumber: number;
	screenshot: string;
	screenshotAlt: string;
	screenshotCrop: ScreenshotCrop;
	children: ReactNode;
};

type ScreenshotCrop = {
	sourceWidth: number;
	sourceHeight: number;
	left: number;
	top: number;
};

const SCREENSHOT_VISIBLE_WIDTH = 776;
const SCREENSHOT_VISIBLE_HEIGHT = 1686;

const landingCards = [
	{
		title: "Today",
		maskNumber: 1,
		screenshot: "/landing/timetable-today.webp",
		screenshotAlt: "Timetable Today view",
		screenshotCrop: {
			sourceWidth: 832,
			sourceHeight: 1734,
			left: 34,
			top: 20,
		},
		description:
			"Check your current period, see your next lesson, and view the rest of your day at a glance.",
	},
	{
		title: "Week",
		maskNumber: 2,
		screenshot: "/landing/timetable-week.webp",
		screenshotAlt: "Timetable Week view",
		screenshotCrop: {
			sourceWidth: 852,
			sourceHeight: 1750,
			left: 40,
			top: 42,
		},
		description:
			"See every class across the week in one clear view, including your friends' shared lessons.",
	},
	{
		title: "Planner",
		maskNumber: 7,
		screenshot: "/landing/timetable-planner.webp",
		screenshotAlt: "Timetable Planner view",
		screenshotCrop: {
			sourceWidth: 868,
			sourceHeight: 1742,
			left: 64,
			top: 28,
		},
		description:
			"Keep upcoming events and term dates together without manually rebuilding your school calendar.",
	},
	{
		title: "Grades",
		maskNumber: 4,
		screenshot: "/landing/grades.webp",
		screenshotAlt: "Timetable Grades view",
		screenshotCrop: {
			sourceWidth: 878,
			sourceHeight: 1764,
			left: 66,
			top: 42,
		},
		description:
			"Track subject results, your average, and your predicted ATAR as new assessments arrive.",
	},
	{
		title: "Friends",
		maskNumber: 5,
		screenshot: "/landing/friends.webp",
		screenshotAlt: "Timetable Friends view",
		screenshotCrop: {
			sourceWidth: 852,
			sourceHeight: 1756,
			left: 46,
			top: 36,
		},
		description:
			"Find your friends, compare schedules, and see where everyone is throughout the school day.",
	},
] as const;

function Card({
	title,
	maskNumber,
	screenshot,
	screenshotAlt,
	screenshotCrop,
	children,
}: CardProps) {
	return (
		<div className={styles.card}>
			{title && (
				<header className={styles.cardTitle}>
					<h2
						style={{
							backgroundImage: `url(/landing/mask/${maskNumber}.webp)`,
						}}
					>
						{title}
					</h2>
				</header>
			)}
			<div className={styles.cardContent}>
				<div
					className={styles.cardScreenshotFrame}
					style={{
						aspectRatio: SCREENSHOT_VISIBLE_WIDTH / SCREENSHOT_VISIBLE_HEIGHT,
					}}
				>
					<div className={styles.cardScreenshotBody}>
						<img
							src={screenshot}
							alt={screenshotAlt}
							className={styles.cardScreenshot}
							width={screenshotCrop.sourceWidth}
							height={screenshotCrop.sourceHeight}
							loading="lazy"
							decoding="async"
							style={{
								width: `${(screenshotCrop.sourceWidth / SCREENSHOT_VISIBLE_WIDTH) * 100}%`,
								height: `${(screenshotCrop.sourceHeight / SCREENSHOT_VISIBLE_HEIGHT) * 100}%`,
								left: `${(-screenshotCrop.left / SCREENSHOT_VISIBLE_WIDTH) * 100}%`,
								top: `${(-screenshotCrop.top / SCREENSHOT_VISIBLE_HEIGHT) * 100}%`,
							}}
						/>
					</div>
				</div>
				<div className={styles.cardCopy}>{children}</div>
			</div>
		</div>
	);
}

export default function LandingPage() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [hasScrolled, setHasScrolled] = useState(false);

	useEffect(() => {
		const updateScrollState = () => {
			setHasScrolled(window.scrollY >= 20);
		};

		updateScrollState();
		window.addEventListener("scroll", updateScrollState, { passive: true });

		return () => window.removeEventListener("scroll", updateScrollState);
	}, []);

	return (
		<div className={styles.shell}>
			<div className={styles.blur}>
				{/* <ProgressiveBlur position="top" backgroundColor="#000000" /> */}
			</div>

			<div className={styles.page}>
				<nav className={styles.nav}>
					<div className={styles.navLinkWrapper}>
						<div
							className={styles.navLink}
							data-scrolled={hasScrolled}
							onMouseEnter={() => setIsMenuOpen(true)}
							onMouseLeave={() => setIsMenuOpen(false)}

							style={{
								maxHeight: isMenuOpen ? "264.2px" : "calc(1rem + 14px * 2)",
							}}
						>
							<div className={`${styles.navRowThing} ${styles.navTop}`}>
								<div
									style={{
										opacity: isMenuOpen ? 0.5 : 1,
										transition: "opacity 0.2s ease-out",
										paddingLeft: "5px",
									}}
								>
									Open Timetable
								</div>
								<Symbol
									name="chevron.right"
									className={styles.navLinkIcon}
									style={{
										opacity: isMenuOpen ? 0.5 : 1,
										rotate: isMenuOpen ? "90deg" : "0deg",
										transition: "all 0.2s ease-in-out",
									}}
								/>
							</div>

							<a
								className={styles.navRowThing2}
								href="https://testflight.apple.com/join/DDUXPSq3"
								target="_blank"
								rel="noopener noreferrer"
							>
								<div>
									<div>Get the app</div>
									<div className={styles.navSubtitle}>iOS, watchOS, macOS</div>
								</div>
								<Symbol name="chevron.right" className={styles.navLinkIcon} />
							</a>

							<Link className={styles.navRowThing2} to="/login">
								<div>
									<div>For Web</div>
								</div>
								<Symbol name="chevron.right" className={styles.navLinkIcon} />
							</Link>
						</div>
					</div>
				</nav>

				<main>
					<div className={styles.hero}>
						<div className={styles.titleFrame}>
							<h1 className={`${styles.title} ${styles.titleWithHDR}`}>
								Timetable
							</h1>
						</div>

						<div className={styles.iconPin}>
							<div className={styles.titleContent}>
								<div className={`${styles.rect3} ${styles.gradientBorder}`}>
									<span className={styles.grainOverlay} aria-hidden="true" />
								</div>

								<div className={`${styles.rect1} ${styles.gradientBorder}`}>
									<span className={styles.grainOverlay} aria-hidden="true" />
								</div>

								<div className={`${styles.frontLayer} ${styles.rotatingShape}`}>
									<div className={`${styles.rect2} ${styles.gradientBorder}`}>
										<span className={styles.grainOverlay} aria-hidden="true" />
									</div>

									<div className={styles.detailPanels} aria-hidden="true">
										<span
											className={`${styles.detailPanel} ${styles.detailPanelTop}`}
										>
											<span className={styles.lessonPreview}>
												<Symbol
													name="function"
													className={styles.lessonPreviewIcon}
												/>
												<span>
													<strong>Methods</strong>
													<span>Mr Uphill</span>
													<span>BL4</span>
												</span>
											</span>
										</span>
										<span
											className={`${styles.detailPanel} ${styles.detailPanelMiddle}`}
										>
											<span className={styles.lessonPreview}>
												<Symbol
													fallback="🐸"
													className={styles.lessonPreviewIcon}
													alt="Frog"
												/>
												<span>
													<strong>Geography</strong>
													<span>Mr McMahon</span>
													<span>TMSC</span>
												</span>
											</span>
										</span>
										<span className={styles.detailPanelOutline}></span>
									</div>

									<div className={styles.circles}>
										{[0, 1, 2, 3, 4].map((i) => (
											<div
												key={i}
												className={`${styles.circle} ${styles.gradientBorder}`}
												style={{
													opacity: i === 2 ? 0 : 1,
												}}
											></div>
										))}
									</div>

									<div
										className={styles.activeIndicator}
										aria-hidden="true"
									></div>
								</div>
							</div>
						</div>
					</div>

					<h4 className={styles.summaryTitle}>
						Timetable has everything you need to thrive at Perth Mod:
					</h4>
					<div className={styles.summary}>
						<div className={styles.rightSummary}>
							<ul>
								{landingCards.map((card) => (
									<li key={card.title}>
										<Card
											title={card.title}
											maskNumber={card.maskNumber}
											screenshot={card.screenshot}
											screenshotAlt={card.screenshotAlt}
											screenshotCrop={card.screenshotCrop}
										>
											<p>{card.description}</p>
										</Card>
									</li>
								))}
							</ul>
						</div>
					</div>
				</main>

				<footer className={styles.footer}>
					<span>Timetable</span>
					<span>©{new Date().getFullYear()} JDQC</span>
				</footer>
			</div>
		</div>
	);
}
