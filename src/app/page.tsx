import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default function Home() {
	return (
		<main className={styles.contentPanel}>
			<header className={styles.topbar}>
				<h1>Timetable</h1>
			</header>

			<section className={styles.panel}>
				<p>Today’s overview</p>
			</section>
		</main>
	);
}
