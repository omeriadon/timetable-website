import { Link } from "@tanstack/solid-router";
import { useDrawer } from "../Drawer/Drawer";
import { List } from "@/components/ui/list";
import styles from "../Drawer/Drawer.module.css";

const links = [
	{ label: "Settings", href: "/settings" },
	{ label: "Appearance", href: "/settings/appearance" },
	{ label: "Updates & Notifications", href: "/settings/notifications" },
];

export default function QuickSettingsDrawer() {
	const { closeDrawer } = useDrawer();

	return (
		<nav class={styles.drawerLinkList} aria-label="Quick settings">
			<List>
				{links.map((link) => (
					<Link class={styles.drawerLink} to={link.href} onClick={closeDrawer}>
						{link.label}
					</Link>
				))}
			</List>
		</nav>
	);
}
