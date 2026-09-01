import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import AdminBroadcastDetailDrawer from "../AdminBroadcastDetailDrawer/AdminBroadcastDetailDrawer";
import styles from "@/components/administration/Administration.module.css";
import { List, ListRow } from "@/components/ui/list";

export type BroadcastNotificationRecord = {
	id: string;
	senderEmail: string;
	senderAuthority: string;
	title: string;
	subtitle?: string | null;
	body?: string | null;
	eligibleDeviceCount: number;
	deliveredDeviceCount: number;
	invalidatedDeviceCount: number;
	failedDeviceCount: number;
	deliveryState: string;
	isDeleted: boolean;
	failureSummary?: string | null;
	createdAt?: string | null;
};

export default function AdminBroadcastHistoryEditor() {
	const [records, setRecords] = useState<BroadcastNotificationRecord[] | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const { openDrawer } = useDrawer();

	useEffect(() => {
		apiRequest<BroadcastNotificationRecord[]>(
			"v1/administration/broadcast-notifications",
		)
			.then(setRecords)
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	if (error)
		return (
			<p className={styles.error} role="alert">
				{error}
			</p>
		);
	if (!records)
		return <p className={styles.loading}>Loading broadcast history…</p>;

	return (
		<main className={styles.page}>
			<List rowHover>
				{records.length ? (
					records.map((record) => (
						<Button
							key={record.id}
							type="button"
							className={styles.listButton}
							onClick={() =>
								openDrawer(
									<AdminBroadcastDetailDrawer
										record={record}
										onChanged={(updated) =>
											setRecords(
												(current) =>
													current?.map((item) =>
														item.id === updated.id ? updated : item,
													) ?? current,
											)
										}
									/>,
								)
							}
						>
							<ListRow>
								<Symbol
									name={
										record.isDeleted
											? "trash"
											: record.deliveryState === "failed"
												? "exclamationmark.triangle"
												: "megaphone"
									}
									fallback="•"
								/>
								<span>
									<strong className={styles.label}>{record.title}</strong>
									<small className={styles.detail}>
										{record.createdAt
											? new Date(record.createdAt).toLocaleString("en-AU")
											: "Unknown date"}
									</small>
								</span>
								<Symbol name="chevron.right" />
							</ListRow>
						</Button>
					))
				) : (
					<p className={styles.loading}>No broadcast notifications.</p>
				)}
			</List>
		</main>
	);
}
