import type { ReactNode } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/administration/Administration.module.css";
import adminStyles from "@/components/administration/Administration.module.css";

type AdminStorageQuotaCardProps = {
	title: string;
	icon: string;
	value: number;
	children: ReactNode;
};

export default function AdminStorageQuotaCard({
	title,
	icon,
	value,
	children,
}: AdminStorageQuotaCardProps) {
	const percentage = Math.round(value * 100);

	return (
		<section className={styles.card}>
			<div className={styles.row}>
				<Symbol name={icon} />
				<strong className={styles.label}>{title}</strong>
				<strong className={styles.detail}>{percentage}% used</strong>
			</div>
			<div
				className={adminStyles.quotaTrack}
				aria-label={`${title}: ${percentage} percent used`}
			/>
			{children}
		</section>
	);
}
