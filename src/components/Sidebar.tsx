import styles from "./Sidebar.module.css";
import Image from "next/image";

const navItems = ["Overview", "Schedule", "Classes", "Settings"];

export default function Sidebar() {
	return (
		<aside className={styles.sidebar} aria-label="Sidebar navigation">
			<Image src="/icon.png" alt="Photo" width={100} height={100} />

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
