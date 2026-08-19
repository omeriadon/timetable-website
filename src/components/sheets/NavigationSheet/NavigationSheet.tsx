"use client";

import Link from "next/link";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useSheet } from "../Sheet/Sheet";
import styles from "../Sheet/Sheet.module.css";

type NavigationSheetProps = {
	title: string;
	description: string;
	href: string;
	icon: string;
};

export default function NavigationSheet({
	title,
	description,
	href,
	icon,
}: NavigationSheetProps) {
	const { closeSheet } = useSheet();

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<div className={styles.detailSubjectSymbol}>
					<Symbol name={icon} />
				</div>
				<div>
					<h2>{title}</h2>
					<p>{description}</p>
				</div>
			</header>
			<Link className={styles.sheetLink} href={href} onClick={closeSheet}>
				Open {title}
			</Link>
		</div>
	);
}
