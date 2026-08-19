import styles from "@/components/IOSScreen/IOSScreen.module.css";

type AdminStorageMetricProps = {
	label: string;
	value: string;
};

export default function AdminStorageMetric({
	label,
	value,
}: AdminStorageMetricProps) {
	return (
		<div className={styles.row}>
			<span className={styles.label}>{label}</span>
			<span className={styles.detail}>{value}</span>
		</div>
	);
}
