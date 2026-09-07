import type { JSX } from "solid-js";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/administration/Administration.module.css";
import adminStyles from "@/components/administration/Administration.module.css";

type AdminStorageQuotaCardProps = {
	title: string;
	icon: string;
	value: number;
	children: JSX.Element | JSX.Element[];
};

export default function AdminStorageQuotaCard({
	title,
	icon,
	value,
	children,
}: AdminStorageQuotaCardProps) {
	const percentage = Math.round(value * 100);

	return (
		<section class={styles.card}>
			<div class={styles.row}>
				<Symbol name={icon} />
				<strong class={styles.label}>{title}</strong>
				<strong class={styles.detail}>{percentage}% used</strong>
			</div>
			<div
				class={adminStyles.quotaTrack}
				aria-label={`${title}: ${percentage} percent used`}
			/>
			{children}
		</section>
	);
}
