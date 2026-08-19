import SheetTrigger from "@/components/sheets/SheetTrigger/SheetTrigger";
import NavigationSheet from "@/components/sheets/NavigationSheet/NavigationSheet";
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
		<SheetTrigger
			className={styles.rowButton}
			ariaLabel={`Open ${title}`}
			content={
				<NavigationSheet
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
		</SheetTrigger>
	);
}
