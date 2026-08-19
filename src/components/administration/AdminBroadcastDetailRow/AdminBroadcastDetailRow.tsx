import styles from "@/components/drawers/Drawer/Drawer.module.css";

type AdminBroadcastDetailRowProps = {
	label: string;
	value: string;
};

export default function AdminBroadcastDetailRow({
	label,
	value,
}: AdminBroadcastDetailRowProps) {
	return (
		<div className={styles.detailRow}>
			<span>{label}</span>
			<strong>{value}</strong>
		</div>
	);
}
