"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

type StorageQuota = {
	storedBytes: number;
	reservedBytes: number;
	storageLimitBytes: number;
	monthlyOperations: number;
	monthlyOperationLimit: number;
	monthlyWriteCutoff: number;
	writesDisabled: boolean;
	reconciledStoredBytes?: number | null;
	reconciliationWarning?: boolean | null;
	reconciledAt?: string | null;
};

export default function AdminProfileStorageEditor() {
	const [quota, setQuota] = useState<StorageQuota | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiRequest<StorageQuota>("v1/administration/profile-storage-quota")
			.then(setQuota)
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	if (error) {
		return <p className={styles.error} role="alert">{error}</p>;
	}
	if (!quota) {
		return <p className={styles.loading}>Loading profile storage…</p>;
	}

	const usedBytes = quota.storedBytes + quota.reservedBytes;
	const usedStorage = percentage(usedBytes, quota.storageLimitBytes);
	const usedOperations = percentage(quota.monthlyOperations, quota.monthlyOperationLimit);

	return (
		<main className={styles.page}>
			<QuotaCard title="Storage" icon="externaldrive.fill" value={usedStorage}>
				<Metric label="Stored" value={formatBytes(quota.storedBytes)} />
				<Metric label="Reserved" value={formatBytes(quota.reservedBytes)} />
				<Metric label="Limit" value={formatBytes(quota.storageLimitBytes)} />
			</QuotaCard>
			<QuotaCard title="Monthly Operations" icon="chart.bar" value={usedOperations}>
				<Metric label="Used" value={quota.monthlyOperations.toLocaleString("en-AU")} />
				<Metric label="Limit" value={quota.monthlyOperationLimit.toLocaleString("en-AU")} />
				<Metric label="Write Cutoff" value={quota.monthlyWriteCutoff.toLocaleString("en-AU")} />
			</QuotaCard>
			<section className={styles.card}>
				<div className={styles.row}>
					<SymbolIcon name={quota.writesDisabled ? "exclamationmark.bubble" : "checkmark.icloud"} fallback={quota.writesDisabled ? "!" : "✓"} />
					<span className={styles.label}>Profile Photo Changes</span>
					<span className={styles.detail}>{quota.writesDisabled ? "Disabled" : "Available"}</span>
				</div>
				<div className={styles.row}>
					<SymbolIcon name="arrow.clockwise.icloud" fallback="↻" />
					<span className={styles.label}>Cloudflare Reconciliation</span>
					<span className={styles.detail}>{quota.reconciliationWarning ? "Accounting mismatch" : "Current"}</span>
				</div>
				{quota.reconciledStoredBytes != null ? <div className={styles.row}><span className={styles.label}>Reported Storage</span><span className={styles.detail}>{formatBytes(quota.reconciledStoredBytes)}</span></div> : null}
				{quota.reconciledAt ? <div className={styles.row}><span className={styles.label}>Last Checked</span><span className={styles.detail}>{new Date(quota.reconciledAt).toLocaleString("en-AU")}</span></div> : null}
			</section>
		</main>
	);
}

function QuotaCard({ title, icon, value, children }: { title: string; icon: string; value: number; children: ReactNode }) {
	return (
		<section className={styles.card}>
			<div className={styles.row}>
				<SymbolIcon name={icon} />
				<strong className={styles.label}>{title}</strong>
				<strong className={styles.detail}>{Math.round(value * 100)}% used</strong>
			</div>
			<div className={styles.quotaTrack} aria-label={`${title}: ${Math.round(value * 100)} percent used`}><span style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }} /></div>
			{children}
		</section>
	);
}

function Metric({ label, value }: { label: string; value: string }) {
	return <div className={styles.row}><span className={styles.label}>{label}</span><span className={styles.detail}>{value}</span></div>;
}

function percentage(value: number, limit: number) {
	return limit > 0 ? value / limit : 0;
}

function formatBytes(value: number) {
	if (value < 1024) return `${value} B`;
	const units = ["KB", "MB", "GB", "TB"];
	let amount = value;
	let unit = "B";
	for (const nextUnit of units) {
		amount /= 1024;
		unit = nextUnit;
		if (amount < 1024) break;
	}
	return `${amount.toFixed(amount >= 10 ? 0 : 1)} ${unit}`;
}
