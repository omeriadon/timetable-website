import Toolbar from "@/components/Toolbar";
import styles from "../page.module.css";

export default function SettingsPage() {
	return (
		<main className={styles.contentPanel}>
			<Toolbar title="Settings" subtitle="Shape the workspace to fit you." />
			<section className={styles.panel}>
				<div className={styles.scheduleItem}>
					<strong>Notifications</strong>
					<span>On</span>
				</div>
				<div className={styles.scheduleItem}>
					<strong>Appearance</strong>
					<span>Dark</span>
				</div>
			</section>
		</main>
	);
}
