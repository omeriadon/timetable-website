import Symbol from "@/components/controls/Symbol/Symbol";
import Link from "next/link";
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
		<Link className={styles.rowButton} href={href} aria-label={`Open ${title}`}>
			<div className={styles.row}>
				<Symbol name={icon} />
				<span className={styles.label}>{title}</span>
				<Symbol name="chevron.right" className={styles.chevronIcon} />
			</div>
		</Link>
	);
}
