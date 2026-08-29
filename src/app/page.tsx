"use client";

import Link from "next/link";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ProgressiveBlur } from "@/components/ui/skiper-ui/skiper41";
import Noise from "@/components/Noise";

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

	useEffect(() => {
		const shape = document.querySelector<HTMLElement>("[data-rotate-shape]");

		const clearRotation = () => {
			if (shape) {
				shape.dataset.rotated = "false";
			}
		};

		const updateRotation = (event: PointerEvent) => {
			if (!shape) {
				return;
			}

			if (event.pointerType !== "mouse") {
				clearRotation();
				return;
			}

			const bounds = shape.getBoundingClientRect();
			const isInside =
				event.clientX >= bounds.left &&
				event.clientX <= bounds.right &&
				event.clientY >= bounds.top &&
				event.clientY <= bounds.bottom;
			const wasInside = shape.dataset.rotated === "true";

			if (isInside && !wasInside) {
				const direction = Math.random() < 0.5 ? -1 : 1;
				const rotation = direction * (3 + Math.random() * 4);
				shape.style.setProperty("--shape-hover-rotation", `${rotation}deg`);
			}

			shape.dataset.rotated = String(isInside);
		};

		window.addEventListener("pointermove", updateRotation, { passive: true });
		window.addEventListener("blur", clearRotation);
		document.documentElement.addEventListener("pointerleave", clearRotation);

		return () => {
			window.removeEventListener("pointermove", updateRotation);
			window.removeEventListener("blur", clearRotation);
			document.documentElement.removeEventListener(
				"pointerleave",
				clearRotation,
			);
		};
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
					<h1 className={styles.title}>Timetable</h1>

					<div className={styles.titleContent}>
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

						<div
							className={`${styles.rect2} ${styles.gradientBorder} ${styles.rotatingShape}`}
							data-rotate-shape
							data-rotated="false"
						>
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
