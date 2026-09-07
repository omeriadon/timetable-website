import { createSignal, onCleanup, onMount, type JSX } from "solid-js";
import fitty from "fitty";
import styles from "./page.module.css";

type CardProps = {
	title?: string;
	maskNumber: number;
	screenshot: string;
	screenshotAlt: string;
	screenshotCrop: ScreenshotCrop;
	children: JSX.Element;
};

type ScreenshotCrop = {
	sourceWidth: number;
	sourceHeight: number;
	left: number;
	top: number;
};

type LandingSymbolProps = {
	name?: string;
	fallback?: JSX.Element;
	className?: string;
	class?: string;
	alt?: string;
	style?: JSX.CSSProperties;
};

function LandingSymbol({
	name,
	fallback,
	className,
	class: classValue,
	alt,
	style,
}: LandingSymbolProps) {
	const source = name
		? `/icons/${encodeURIComponent(name.replace(/\.svg$/i, ""))}.svg`
		: undefined;

	return (
		<span
			class={classValue ?? className}
			aria-hidden={alt ? undefined : true}
			aria-label={alt}
			role={alt ? "img" : undefined}
			style={
				source
					? {
							...style,
							"background-image": `url("${source}")`,
							"background-position": "center",
							"background-repeat": "no-repeat",
							"background-size": "contain",
						}
					: style
			}
		>
			{source ? null : fallback}
		</span>
	);
}

const SCREENSHOT_VISIBLE_WIDTH = 776;
const SCREENSHOT_VISIBLE_HEIGHT = 1686;

const landingCards = [
	{
		title: "Today",
		maskNumber: 1,
		screenshot: "/landing/timetable-today.png",
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
		screenshot: "/landing/timetable-week.png",
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
		screenshot: "/landing/timetable-planner.png",
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
		screenshot: "/landing/grades.png",
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
		screenshot: "/landing/friends.png",
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
		<div class={styles.card}>
			{title && (
				<header class={styles.cardTitle}>
					<h2
						style={{
							"background-image": `url(/landing/mask/${maskNumber}.png)`,
						}}
					>
						{title}
					</h2>
				</header>
			)}
			<div class={styles.cardContent}>
				<div
					class={styles.cardScreenshotFrame}
					style={{
						"aspect-ratio": SCREENSHOT_VISIBLE_WIDTH / SCREENSHOT_VISIBLE_HEIGHT,
					}}
				>
					<div class={styles.cardScreenshotBody}>
						<img
							src={screenshot}
							alt={screenshotAlt}
							class={styles.cardScreenshot}
							width={screenshotCrop.sourceWidth}
							height={screenshotCrop.sourceHeight}
							style={{
								width: `${(screenshotCrop.sourceWidth / SCREENSHOT_VISIBLE_WIDTH) * 100}%`,
								height: `${(screenshotCrop.sourceHeight / SCREENSHOT_VISIBLE_HEIGHT) * 100}%`,
								left: `${(-screenshotCrop.left / SCREENSHOT_VISIBLE_WIDTH) * 100}%`,
								top: `${(-screenshotCrop.top / SCREENSHOT_VISIBLE_HEIGHT) * 100}%`,
							}}
						/>
					</div>
				</div>
				<div class={styles.cardCopy}>{children}</div>
			</div>
		</div>
	);
}

export default function LandingPage() {
	const [isMenuOpen, setIsMenuOpen] = createSignal(false);
	const [hasScrolled, setHasScrolled] = createSignal(false);
	let titleRef: HTMLHeadingElement | undefined;

	onMount(() => {
		const updateScrollState = () => setHasScrolled(window.scrollY >= 20);
		updateScrollState();
		window.addEventListener("scroll", updateScrollState, { passive: true });
		onCleanup(() => window.removeEventListener("scroll", updateScrollState));

		if (titleRef) {
			const title = fitty(titleRef, {
				minSize: 16,
				maxSize: 1000,
				multiLine: false,
			});
			document.fonts.ready.then(() => title.fit());
			onCleanup(() => title.unsubscribe());
		}
	});

	return (
		<div class={styles.shell}>
			<div class={styles.blur}>
				{/* <ProgressiveBlur position="top" backgroundColor="#000000" /> */}
			</div>

			<div class={styles.page}>
				<nav class={styles.nav}>
					<div class={styles.navLinkWrapper}>
						<div
							class={styles.navLink}
							data-scrolled={hasScrolled()}
							onMouseEnter={() => setIsMenuOpen(true)}
							onMouseLeave={() => setIsMenuOpen(false)}

							style={{
								"max-height": isMenuOpen() ? "264.2px" : "calc(1rem + 14px * 2)",
								transition: "all 0.2s ease-in-out",
							}}
						>
							<div class={`${styles.navRowThing} ${styles.navTop}`}>
								<div
									style={{
										opacity: isMenuOpen() ? 0.5 : 1,
										transition: "opacity 0.2s ease-out",
										"padding-left": "5px",
									}}
								>
									Open Timetable
								</div>
								<LandingSymbol
									name="chevron.right"
									class={styles.navLinkIcon}
									style={{
										opacity: isMenuOpen() ? 0.5 : 1,
										rotate: isMenuOpen() ? "90deg" : "0deg",
										transition: "all 0.2s ease-in-out",
									}}
								/>
							</div>

							<a
								class={styles.navRowThing2}
								href="https://testflight.apple.com/join/DDUXPSq3"
								target="_blank"
								rel="noopener noreferrer"
							>
								<div>
									<div>Get the app</div>
									<div class={styles.navSubtitle}>iOS, watchOS, macOS</div>
								</div>
								<LandingSymbol
									name="chevron.right"
									class={styles.navLinkIcon}
								/>
							</a>

							<a class={styles.navRowThing2} href="/login">
								<div>
									<div>For Web</div>
								</div>
								<LandingSymbol
									name="chevron.right"
									class={styles.navLinkIcon}
								/>
							</a>
						</div>
					</div>
				</nav>

				<main>
					<div class={styles.hero}>
						<div class={styles.titleFrame}>
							<h1
								ref={(element) => (titleRef = element)}
								class={`${styles.title} ${styles.titleWithHDR}`}
							>
								Timetable
							</h1>
						</div>

						<div class={styles.iconPin}>
							<div class={styles.titleContent}>
								<div class={`${styles.rect3} ${styles.gradientBorder}`}>
									<span class={styles.grainOverlay} aria-hidden="true" />
								</div>
								<div class={`${styles.rect1} ${styles.gradientBorder}`}>
									<span class={styles.grainOverlay} aria-hidden="true" />
								</div>
								<div class={`${styles.frontLayer} ${styles.rotatingShape}`}>
									<div class={`${styles.rect2} ${styles.gradientBorder}`}>
										<span class={styles.grainOverlay} aria-hidden="true" />
									</div>

									<div class={styles.detailPanels} aria-hidden="true">
										<span
											class={`${styles.detailPanel} ${styles.detailPanelTop}`}
										>
											<span class={styles.lessonPreview}>
												<LandingSymbol
													name="function"
													class={styles.lessonPreviewIcon}
												/>
												<span>
													<strong>Methods</strong>
													<span>Mr Uphill</span>
													<span>BL4</span>
												</span>
											</span>
										</span>
										<span
											class={`${styles.detailPanel} ${styles.detailPanelMiddle}`}
										>
											<span class={styles.lessonPreview}>
												<LandingSymbol
													fallback="🐸"
													class={styles.lessonPreviewIcon}
													alt="Frog"
												/>
												<span>
													<strong>Geography</strong>
													<span>Mr McMahon</span>
													<span>TMSC</span>
												</span>
											</span>
										</span>
										<span class={styles.detailPanelOutline}></span>
									</div>

									<div class={styles.circles}>
										{[0, 1, 2, 3, 4].map((i) => (
											<div

												class={`${styles.circle} ${styles.gradientBorder}`}
												style={{
													opacity: i === 2 ? 0 : 1,
												}}
											></div>
										))}
									</div>

									<div
										class={styles.activeIndicator}
										aria-hidden="true"
									></div>
								</div>
							</div>
						</div>
					</div>

					<h4 class={styles.summaryTitle}>
						Timetable has everything you need to thrive at Perth Mod:
					</h4>
					<div class={styles.summary}>
						<div class={styles.rightSummary}>
							<ul>
								{landingCards.map((card) => (
									<li>
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

				<footer class={styles.footer}>
					<span>Timetable</span>
					<span>©{new Date().getFullYear()} JDQC</span>
				</footer>
			</div>
		</div>
	);
}
