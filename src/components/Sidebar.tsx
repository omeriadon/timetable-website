import styles from "./Sidebar.module.css";

const navItems = ["Overview", "Schedule", "Classes", "Settings"];

export default function Sidebar() {
	return (
		<aside className={styles.sidebar} aria-label="Sidebar navigation">
			<img src="icon.png" alt="Description of the image"></img>

			<nav className={styles.sidebarNav} aria-label="Main navigation">
				{navItems.map((item, index) => (
					<a
						key={item}
						href="#"
						className={
							index === 0
								? `${styles.sidebarLink} ${styles.active}`
								: styles.sidebarLink
						}
					>
						{item}
					</a>
				))}
			</nav>
		</aside>
	);
}
