"use client";

import Link from "next/link";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "./page.module.css";
import { useState } from "react";
import { ProgressiveBlur } from "@/components/ui/skiper-ui/skiper41";

export default function LandingPage() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

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

							<div className={styles.navRowThing2}>
								<div>
									<div>Get the app</div>
									<div className={styles.navSubtitle}>iOS, watchOS, macOS</div>
								</div>
								<Symbol name="chevron.right" className={styles.navLinkIcon} />
							</div>

							<div className={styles.navRowThing2}>
								<div>
									<div>For Web</div>
								</div>
								<Symbol name="chevron.right" className={styles.navLinkIcon} />
							</div>
						</div>
					</div>
				</nav>

				<main>
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
