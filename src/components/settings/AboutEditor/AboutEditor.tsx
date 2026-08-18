import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import styles from "./AboutEditor.module.css";

export default function AboutEditor() {
	return (
		<section className={styles.page}>
			<div className={styles.icon} aria-hidden="true">T</div>
			<h2>Timetable</h2>
			<p className={styles.subtitle}>School week planning for every platform.</p>
			<section className={styles.card}>
				<div><span>Adon Omeri</span><strong>Software Engineer</strong></div>
				<div><span>Bob Han-Busi</span><strong>Human Interface Design</strong></div>
				<div><span>Joshua Gilgallon</span><strong>Infrastructure &amp; Hosting</strong></div>
			</section>
			<div className={styles.version}><SymbolIcon name="hammer" fallback="⌘" /><span>Website client</span><strong>Web</strong></div>
			<p className={styles.copyright}>© {new Date().getFullYear()}, JDCQ. All rights reserved.</p>
		</section>
	);
}
