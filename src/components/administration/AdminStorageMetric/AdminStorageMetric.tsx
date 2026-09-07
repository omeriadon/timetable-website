import styles from "@/components/administration/Administration.module.css";

type AdminStorageMetricProps = {
	label: string;
	value: string;
};

export default function AdminStorageMetric({
	label,
	value,
}: AdminStorageMetricProps) {
	return (
		<div class={styles.row}>
			<span class={styles.label}>{label}</span>
			<span class={styles.detail}>{value}</span>
		</div>
	);
}
