import { Link } from "@tanstack/solid-router";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "../Drawer/Drawer";
import styles from "../Drawer/Drawer.module.css";

type NavigationDrawerProps = {
	title: string;
	description: string;
	href: string;
	icon: string;
};

export default function NavigationDrawer({
	title,
	description,
	href,
	icon,
}: NavigationDrawerProps) {
	const { closeDrawer } = useDrawer();

	return (
		<div class={styles.detailDrawer}>
			<header class={styles.detailHeader}>
				<div class={styles.detailSubjectSymbol}>
					<Symbol name={icon} />
				</div>
				<div>
					<h2>{title}</h2>
					<p>{description}</p>
				</div>
			</header>
			<Link class={styles.drawerLink} to={href} onClick={closeDrawer}>
				Open {title}
			</Link>
		</div>
	);
}
