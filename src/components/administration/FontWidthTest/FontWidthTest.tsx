import styles from "@/components/IOSScreen/IOSScreen.module.css";

export default function FontWidthTest() {
	return (
		<section className={styles.card}>
			{["SF Pro Display", "SF Pro", "SF Rounded", "SF Mono"].map((font) => (
				<div key={font} className={styles.row}>
					<span className={styles.label} style={{ fontFamily: font }}>
						{font}
					</span>
					<span className={styles.detail}>Timetable 012345</span>
				</div>
			))}
		</section>
	);
}
