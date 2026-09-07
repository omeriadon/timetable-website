import { createSignal } from "solid-js";
import type { BroadcastNotificationRecord } from "../AdminBroadcastHistoryEditor/AdminBroadcastHistoryEditor";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/drawers/Drawer/Drawer.module.css";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import AdminBroadcastDetailRow from "@/components/administration/AdminBroadcastDetailRow/AdminBroadcastDetailRow";

export default function AdminBroadcastDetailDrawer({
	record,
	onChanged,
}: {
	record: BroadcastNotificationRecord;
	onChanged: (record: BroadcastNotificationRecord) => void;
}) {
	const [status, setStatus] = createSignal<string | null>(null);
	const [deleting, setDeleting] = createSignal(false);

	const remove = async () => {
		if (deleting() || record.isDeleted) return;
		setDeleting(true);
		setStatus(null);
		try {
			const updated = await apiRequest<BroadcastNotificationRecord>(
				`v1/administration/broadcast-notifications/${record.id}`,
				{ method: "DELETE" },
			);
			onChanged(updated);
			setStatus("Notification marked as deleted.");
		} catch (error) {
			setStatus((error as Error).message);
		} finally {
			setDeleting(false);
		}
	};

	return (
		<div class={styles.detailDrawer}>
			<header class={styles.detailHeader}>
				<div>
					<h2>{record.isDeleted ? "Deleted Broadcast" : "Broadcast"}</h2>
					<p>
						{record.createdAt
							? new Date(record.createdAt).toLocaleString("en-AU")
							: "Unknown date"}
					</p>
				</div>
			</header>
			<section class={styles.detailCard}>
				<AdminBroadcastDetailRow label="Title" value={record.title} />
				<AdminBroadcastDetailRow
					label="Subtitle"
					value={record.subtitle ?? "—"}
				/>
				<AdminBroadcastDetailRow label="Body" value={record.body ?? "—"} />
			</section>
			<section class={styles.detailCard}>
				<AdminBroadcastDetailRow label="Sender" value={record.senderEmail} />
				<AdminBroadcastDetailRow
					label="Delivery"
					value={record.deliveryState}
				/>
				<AdminBroadcastDetailRow
					label="Eligible"
					value={String(record.eligibleDeviceCount)}
				/>
				<AdminBroadcastDetailRow
					label="Delivered"
					value={String(record.deliveredDeviceCount)}
				/>
				<AdminBroadcastDetailRow
					label="Invalidated"
					value={String(record.invalidatedDeviceCount)}
				/>
				<AdminBroadcastDetailRow
					label="Failed"
					value={String(record.failedDeviceCount)}
				/>
				{record.failureSummary ? (
					<AdminBroadcastDetailRow
						label="Failure"
						value={record.failureSummary}
					/>
				) : null}
			</section>
			{status() ? (
				<p class={styles.detailMuted} role="status">
					{status()}
				</p>
			) : null}
			{!record.isDeleted ? (
				<DrawerFooter>
					<Button
						fullWidth
						variant="destructive"
						aria-label="Delete notification"
						onClick={() => void remove()}
						disabled={deleting()}
					>
						<Symbol name="trash" fallback="−" />
						{deleting() ? "Deleting…" : "Delete Notification"}
					</Button>
				</DrawerFooter>
			) : null}
		</div>
	);
}
