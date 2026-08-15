import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default function Home() {
	return (
		<main className={styles.contentPanel}>
			<header className={styles.topbar}>blur here</header>

			<section className={styles.panel}>
				<p>Today’s overview</p>

				<div>
					{Array.from({ length: 100 }, (_, index) => (
						<span
							key={index}
							style={{
								display: "block",
								margin: "4px",
								padding: "8px",
							}}
						>
							{index + 1}
						</span>
					))}
				</div>
			</section>
		</main>
	);
}
