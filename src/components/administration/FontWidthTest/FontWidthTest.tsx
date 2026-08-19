import styles from "@/components/administration/Administration.module.css";

export default function FontWidthTest() {
	return (
		<section className={styles.card}>
			{["SF Pro Display", "SF Pro", "SF Rounded", "SF Mono"].map((font) => (
				<div key={font} className={styles.row}>
					<span className={styles.label}>{font}</span>
					<span className={styles.detail}>Timetable 012345</span>
				</div>
			))}
		</section>
	);
}
