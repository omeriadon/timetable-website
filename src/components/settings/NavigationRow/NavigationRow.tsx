import Symbol from "@/components/controls/Symbol/Symbol";
import DrawerTrigger from "@/components/drawers/DrawerTrigger/DrawerTrigger";
import { ListRow } from "@/components/ui/list";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import styles from "@/components/settings/Settings.module.css";

export default function NavigationRow({
	title,
	description,
	href,
	icon,
	direct = false,
	drawerContent,
}: {
	title: string;
	description: string;
	href: string;
	icon: string;
	direct?: boolean;
	drawerContent?: ReactNode;
}) {
	const row = (
		<ListRow>
			<Symbol name={icon} />
			<span className={styles.label}>{title}</span>
			<Symbol name="chevron.right" />
		</ListRow>
	);

	if (direct) {
		return (
			<Link className={styles.linkRow} to={href} aria-label={`Open ${title}`}>
				{row}
			</Link>
		);
	}

	return (
		<DrawerTrigger
			className={styles.linkRow}
			ariaLabel={`Open ${title}`}
			content={drawerContent}
		>
			{row}
		</DrawerTrigger>
	);
}
