"use client";

import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import { apiRequest } from "@/lib/api/client";
import AdminBroadcastDetailSheet from "../AdminBroadcastDetailSheet/AdminBroadcastDetailSheet";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

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
	const { openSheet } = useSheet();

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
			<section className={styles.card}>
				{records.length ? (
					records.map((record) => (
						<Button
							unstyled
							key={record.id}
							type="button"
							className={styles.rowButton}
							onClick={() =>
								openSheet(
									<AdminBroadcastDetailSheet
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
							<div className={styles.row}>
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
								<Symbol
									name="chevron.right"
									className={styles.chevronIcon}
								/>
							</div>
						</Button>
					))
				) : (
					<p className={styles.loading}>No broadcast notifications.</p>
				)}
			</section>
		</main>
	);
}
