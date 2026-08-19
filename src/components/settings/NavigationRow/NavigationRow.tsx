import DrawerTrigger from "@/components/drawers/DrawerTrigger/DrawerTrigger";
import NavigationDrawer from "@/components/drawers/NavigationDrawer/NavigationDrawer";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/settings/Settings.module.css";

export default function NavigationRow({
	title,
	description,
	href,
	icon,
}: {
	title: string;
	description: string;
	href: string;
	icon: string;
}) {
	return (
		<DrawerTrigger
			className={styles.rowButton}
			ariaLabel={`Open ${title}`}
			content={
				<NavigationDrawer
					title={title}
					description={description}
					href={href}
					icon={icon}
				/>
			}
		>
			<div className={styles.row}>
				<Symbol name={icon} />
				<span className={styles.label}>{title}</span>
				<Symbol name="chevron.right" className={styles.chevronIcon} />
			</div>
		</DrawerTrigger>
	);
}
