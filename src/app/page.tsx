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
					<Link
						className={styles.navLink}
						href="/login"
						onMouseEnter={() => setIsMenuOpen(true)}
						onMouseLeave={() => setIsMenuOpen(false)}

						style={{
							height: !isMenuOpen ? "calc(1rem + 14px * 2)" : "100px",
						}}
					>
						<div>Open Timetable</div>
						<Symbol name="arrow.right" className={styles.navLinkIcon} />
					</Link>
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
