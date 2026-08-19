"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

type EmailLogEntry = {
	id: string;
	recipient: string;
	subject: string;
	body: string;
	status: string;
	failureReason: string | null;
	createdAt: string | null;
	updatedAt: string | null;
};

export default function AdminEmailLogEditor() {
	const [entries, setEntries] = useState<EmailLogEntry[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiRequest<EmailLogEntry[]>("v1/administration/email-log")
			.then(setEntries)
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	return (
		<main className={styles.page}>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			{entries === null && !error ? (
				<p className={styles.loading}>Loading email log…</p>
			) : null}
			{entries?.length === 0 ? (
				<p className={styles.emptyRow}>
					No email deliveries have been recorded.
				</p>
			) : null}
			{entries?.length ? (
				<section className={styles.card}>
					{entries.map((entry) => (
						<article className={styles.adminRecord} key={entry.id}>
							<div className={styles.profileRow}>
								<SymbolIcon name="envelope.badge" />
								<span className={styles.label}>{entry.subject}</span>
								<strong className={styles.detail}>{entry.status}</strong>
							</div>
							<div className={styles.adminField}>
								<span>Recipient</span>
								<strong>{entry.recipient}</strong>
							</div>
							<div className={styles.adminField}>
								<span>Created</span>
								<strong>{formatDate(entry.createdAt)}</strong>
							</div>
							{entry.failureReason ? (
								<div className={styles.adminField}>
									<span>Failure</span>
									<strong>{entry.failureReason}</strong>
								</div>
							) : null}
						</article>
					))}
				</section>
			) : null}
		</main>
	);
}

function formatDate(value: string | null) {
	return value ? new Date(value).toLocaleString("en-AU") : "—";
}
