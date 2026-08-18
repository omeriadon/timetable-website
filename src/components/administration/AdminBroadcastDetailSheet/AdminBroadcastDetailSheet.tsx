"use client";

import { useState } from "react";
import type { BroadcastNotificationRecord } from "../AdminBroadcastHistoryEditor/AdminBroadcastHistoryEditor";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/sheets/Sheet/Sheet.module.css";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";

export default function AdminBroadcastDetailSheet({ record, onChanged }: { record: BroadcastNotificationRecord; onChanged: (record: BroadcastNotificationRecord) => void }) {
	const [status, setStatus] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	const remove = async () => {
		if (deleting || record.isDeleted) return;
		setDeleting(true);
		setStatus(null);
		try {
			const updated = await apiRequest<BroadcastNotificationRecord>(`v1/administration/broadcast-notifications/${record.id}`, { method: "DELETE" });
			onChanged(updated);
			setStatus("Notification marked as deleted.");
		} catch (error) {
			setStatus((error as Error).message);
		} finally {
			setDeleting(false);
		}
	};

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}><div><h2>{record.isDeleted ? "Deleted Broadcast" : "Broadcast"}</h2><p>{record.createdAt ? new Date(record.createdAt).toLocaleString("en-AU") : "Unknown date"}</p></div></header>
			<section className={styles.detailCard}>
				<DetailRow label="Title" value={record.title} />
				<DetailRow label="Subtitle" value={record.subtitle ?? "—"} />
				<DetailRow label="Body" value={record.body ?? "—"} />
			</section>
			<section className={styles.detailCard}>
				<DetailRow label="Sender" value={record.senderEmail} />
				<DetailRow label="Delivery" value={record.deliveryState} />
				<DetailRow label="Eligible" value={String(record.eligibleDeviceCount)} />
				<DetailRow label="Delivered" value={String(record.deliveredDeviceCount)} />
				<DetailRow label="Invalidated" value={String(record.invalidatedDeviceCount)} />
				<DetailRow label="Failed" value={String(record.failedDeviceCount)} />
				{record.failureSummary ? <DetailRow label="Failure" value={record.failureSummary} /> : null}
			</section>
			{!record.isDeleted ? <SheetActionButton label="Delete notification" tone="destructive" onClick={() => void remove()} disabled={deleting}><SymbolIcon name="trash" fallback="−" />{deleting ? "Deleting…" : "Delete Notification"}</SheetActionButton> : null}
			{status ? <p className={styles.detailMuted} role="status">{status}</p> : null}
		</div>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return <div className={styles.detailRow}><span>{label}</span><strong>{value}</strong></div>;
}
