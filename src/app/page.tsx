"use client";

import Link from "next/link";
import fitty from "fitty";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ProgressiveBlur } from "@/components/ui/skiper-ui/skiper41";
import Noise from "@/components/Noise";

export default function LandingPage() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [hasScrolled, setHasScrolled] = useState(false);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const iconPinRef = useRef<HTMLDivElement>(null);
	const titleContentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const updateScrollState = () => {
			setHasScrolled(window.scrollY >= 20);
		};

		updateScrollState();
		window.addEventListener("scroll", updateScrollState, { passive: true });

		return () => window.removeEventListener("scroll", updateScrollState);
	}, []);

	useEffect(() => {
		const iconPin = iconPinRef.current;
		const titleContent = titleContentRef.current;

		if (!iconPin || !titleContent) {
			return;
		}

		gsap.registerPlugin(ScrollTrigger);

		const finalScale = Number.parseFloat(
			getComputedStyle(titleContent).getPropertyValue("--icon-final-scale"),
		);
		const topMarginValue = getComputedStyle(iconPin)
			.getPropertyValue("--icon-top-margin")
			.trim();
		const topMargin = topMarginValue.endsWith("rem")
			? Number.parseFloat(topMarginValue) *
				Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
			: Number.parseFloat(topMarginValue);
		const scaleDistance = () => Math.max(iconPin.offsetHeight * 0.65, 1);
		const start = () => `top top+=${topMargin}`;
		const motion = gsap.matchMedia();

		motion.add("(prefers-reduced-motion: no-preference)", () => {
			const pin = ScrollTrigger.create({
				trigger: iconPin,
				start,
				end: "max",
				pin: iconPin,
				pinSpacing: false,
				anticipatePin: 1,
				invalidateOnRefresh: true,
			});

			const scale = gsap.to(titleContent, {
				scale: finalScale,
				ease: "none",
				scrollTrigger: {
					trigger: iconPin,
					start,
					end: () => `+=${scaleDistance()}`,
					scrub: 0.35,
					invalidateOnRefresh: true,
				},
			});

			return () => {
				pin.kill();
				scale.kill();
			};
		});

		return () => {
			motion.revert();
		};
	}, []);

	useEffect(() => {
		if (!titleRef.current) {
			return;
		}

		const title = fitty(titleRef.current, {
			minSize: 16,
			maxSize: 1000,
			multiLine: false,
		});

		document.fonts.ready.then(() => title.fit());

		return () => title.unsubscribe();
	}, []);

	const numbers = [...Array(100)].map((_, i) => i + 1);

	return (
		<div className={styles.shell}>
			<div className={styles.blur}>
				<ProgressiveBlur position="top" backgroundColor="#000000" />
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
								transition: "all 0.2s ease-in-out",
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

							<Link
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
							</Link>

							<Link className={styles.navRowThing2} href="/login">
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
							<h1 ref={titleRef} className={styles.title}>
								Timetable
							</h1>
						</div>

						<div ref={iconPinRef} className={styles.iconPin}>
							<div ref={titleContentRef} className={styles.titleContent}>
								<div className={`${styles.rect3} ${styles.gradientBorder}`}>
									<Noise
										patternSize={250}
										patternScaleX={2}
										patternScaleY={2}
										patternRefreshInterval={9999999999999999999999999999}
										patternAlpha={15}
									/>
								</div>

								<div className={`${styles.rect1} ${styles.gradientBorder}`}>
									<Noise
										patternSize={250}
										patternScaleX={2}
										patternScaleY={2}
										patternRefreshInterval={9999999999999999999999999999}
										patternAlpha={15}
									/>
								</div>

								<div className={`${styles.frontLayer} ${styles.rotatingShape}`}>
									<div className={`${styles.rect2} ${styles.gradientBorder}`}>
										<Noise
											patternSize={250}
											patternScaleX={2}
											patternScaleY={2}
											patternRefreshInterval={9999999999999999999999999999}
											patternAlpha={15}
										/>
									</div>

									<div className={styles.detailPanels} aria-hidden="true">
										<span
											className={`${styles.detailPanel} ${styles.detailPanelTop}`}
										>
											<Noise
												patternSize={250}
												patternScaleX={2}
												patternScaleY={2}
												patternRefreshInterval={9999999999999999999999999999}
												patternAlpha={15}
											/>
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
											<Noise
												patternSize={250}
												patternScaleX={2}
												patternScaleY={2}
												patternRefreshInterval={9999999999999999999999999999}
												patternAlpha={15}
											/>
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
										<span className={styles.detailPanelOutline}>
											<Noise
												patternSize={250}
												patternScaleX={2}
												patternScaleY={2}
												patternRefreshInterval={9999999999999999999999999999}
												patternAlpha={15}
											/>
										</span>
									</div>

									<div className={styles.circles}>
										{[0, 1, 2, 3, 4].map((i) => (
											<div
												key={i}
												className={`${styles.circle} ${styles.gradientBorder}`}
												style={{
													opacity: i === 2 ? 0 : 1,
												}}
											>
												<Noise
													patternSize={250}
													patternScaleX={2}
													patternScaleY={2}
													patternRefreshInterval={9999999999999999999999999999}
													patternAlpha={15}
												/>
											</div>
										))}
									</div>

									<div className={styles.activeIndicator} aria-hidden="true">
										<Noise
											patternSize={250}
											patternScaleX={2}
											patternScaleY={2}
											patternRefreshInterval={9999999999999999999999999999}
											patternAlpha={15}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					<ul>
						{numbers.map((num) => (
							<li key={num}>Component {num}</li>
						))}
					</ul>
				</main>

				<footer className={styles.footer}>
					<span>Timetable</span>
					<span>© {new Date().getFullYear()} JDCQ</span>
				</footer>
			</div>
		</div>
	);
}
