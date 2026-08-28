"use client";

import Link from "next/link";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ProgressiveBlur } from "@/components/ui/skiper-ui/skiper41";

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
					<div className={styles.titleContent}>
						<h1 className={styles.first}>Timetable</h1>

						<Image
							src="/icon.png"
							width={400}
							height={250}
							className={`${styles.brandIcon} ${styles.second}`}
							alt=""
							aria-hidden="true"
						/>
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
