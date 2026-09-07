import { createSignal, onMount } from "solid-js";

import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/administration/Administration.module.css";

import AdminStorageMetric from "@/components/administration/AdminStorageMetric/AdminStorageMetric";
import AdminStorageQuotaCard from "@/components/administration/AdminStorageQuotaCard/AdminStorageQuotaCard";

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
	const [quota, setQuota] = createSignal<StorageQuota | null>(null);
	const [error, setError] = createSignal<string | null>(null);

	onMount(() => {
		apiRequest<StorageQuota>("v1/administration/profile-storage-quota")
			.then(setQuota)
			.catch((requestError: Error) => setError(requestError.message));
	});

	if (error()) {
		return (
			<p class={styles.error} role="alert">
				{error()}
			</p>
		);
	}
	if (!quota()) {
		return <p class={styles.loading}>Loading profile storage…</p>;
	}

	const currentQuota = quota()!;
	const usedBytes = currentQuota.storedBytes + currentQuota.reservedBytes;
	const usedStorage = percentage(usedBytes, currentQuota.storageLimitBytes);
	const usedOperations = percentage(
		currentQuota.monthlyOperations,
		currentQuota.monthlyOperationLimit,
	);

	return (
		<main class={styles.page}>
			<AdminStorageQuotaCard
				title="Storage"
				icon="externaldrive.fill"
				value={usedStorage}
			>
				<AdminStorageMetric
					label="Stored"
					value={formatBytes(currentQuota.storedBytes)}
				/>
				<AdminStorageMetric
					label="Reserved"
					value={formatBytes(currentQuota.reservedBytes)}
				/>
				<AdminStorageMetric
					label="Limit"
					value={formatBytes(currentQuota.storageLimitBytes)}
				/>
			</AdminStorageQuotaCard>
			<AdminStorageQuotaCard
				title="Monthly Operations"
				icon="chart.bar"
				value={usedOperations}
			>
				<AdminStorageMetric
					label="Used"
					value={currentQuota.monthlyOperations.toLocaleString("en-AU")}
				/>
				<AdminStorageMetric
					label="Limit"
					value={currentQuota.monthlyOperationLimit.toLocaleString("en-AU")}
				/>
				<AdminStorageMetric
					label="Write Cutoff"
					value={currentQuota.monthlyWriteCutoff.toLocaleString("en-AU")}
				/>
			</AdminStorageQuotaCard>
			<section class={styles.card}>
				<div class={styles.row}>
					<Symbol
						name={
							currentQuota.writesDisabled
								? "exclamationmark.bubble"
								: "checkmark.icloud"
						}
						fallback={currentQuota.writesDisabled ? "!" : "✓"}
					/>
					<span class={styles.label}>Profile Photo Changes</span>
					<span class={styles.detail}>
						{currentQuota.writesDisabled ? "Disabled" : "Available"}
					</span>
				</div>
				<div class={styles.row}>
					<Symbol name="arrow.clockwise.icloud" fallback="↻" />
					<span class={styles.label}>Cloudflare Reconciliation</span>
					<span class={styles.detail}>
						{currentQuota.reconciliationWarning
							? "Accounting mismatch"
							: "Current"}
					</span>
				</div>
				{currentQuota.reconciledStoredBytes != null ? (
					<div class={styles.row}>
						<span class={styles.label}>Reported Storage</span>
						<span class={styles.detail}>
							{formatBytes(currentQuota.reconciledStoredBytes)}
						</span>
					</div>
				) : null}
				{currentQuota.reconciledAt ? (
					<div class={styles.row}>
						<span class={styles.label}>Last Checked</span>
						<span class={styles.detail}>
							{new Date(currentQuota.reconciledAt).toLocaleString("en-AU")}
						</span>
					</div>
				) : null}
			</section>
		</main>
	);
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
