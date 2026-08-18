"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

type Badge = {
	id: string;
	symbol: string;
	backgroundColor: { red: number; green: number; blue: number; alpha: number } | null;
	symbolColor: { red: number; green: number; blue: number; alpha: number } | null;
	priority: number;
	accessibilityLabel: string;
	assignedUserIDs: string[];
};

type BadgeDraft = {
	symbol: string;
	accessibilityLabel: string;
	priority: string;
};

const emptyDraft: BadgeDraft = {
	symbol: "star.fill",
	accessibilityLabel: "New badge",
	priority: "0",
};

export default function AdminBadgesEditor() {
	const [badges, setBadges] = useState<Badge[] | null>(null);
	const [draft, setDraft] = useState<BadgeDraft>(emptyDraft);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const load = () => {
		setError(null);
		apiRequest<Badge[]>("v1/administration/badges")
			.then(setBadges)
			.catch((requestError: Error) => setError(requestError.message));
	};

	useEffect(load, []);

	const create = async () => {
		if (!draft.symbol.trim() || !draft.accessibilityLabel.trim() || saving) {
			return;
		}

		setSaving(true);
		setError(null);
		try {
			await apiRequest<Badge>("v1/administration/badges", {
				method: "POST",
				body: JSON.stringify({
					symbol: draft.symbol.trim(),
					accessibilityLabel: draft.accessibilityLabel.trim(),
					priority: Number(draft.priority) || 0,
					backgroundColor: null,
					symbolColor: null,
				}),
			});
			setDraft(emptyDraft);
			load();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const remove = async (id: string) => {
		if (saving) {
			return;
		}

		setSaving(true);
		setError(null);
		try {
			await apiRequest(`v1/administration/badges/${id}`, { method: "DELETE" });
			load();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<main className={styles.page}>
			{error ? <p className={styles.error} role="alert">{error}</p> : null}
			<section>
				<h2 className={styles.section}>Create badge</h2>
				<div className={styles.formCard}>
					<label>
						SF Symbol
						<input value={draft.symbol} onChange={(event) => setDraft({ ...draft, symbol: event.target.value })} />
					</label>
					<label>
						Accessibility label
						<input value={draft.accessibilityLabel} onChange={(event) => setDraft({ ...draft, accessibilityLabel: event.target.value })} />
					</label>
					<label>
						Priority
						<input type="number" value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value })} />
					</label>
					<button type="button" className={styles.adminAction} onClick={create} disabled={saving}>
						<SymbolIcon name="rosette" />
						<span>{saving ? "Saving…" : "Create badge"}</span>
					</button>
				</div>
			</section>
			<section>
				<h2 className={styles.section}>Existing badges</h2>
				{badges === null ? <p className={styles.loading}>Loading badges…</p> : null}
				{badges?.length === 0 ? <p className={styles.emptyRow}>No custom badges have been created.</p> : null}
				{badges?.length ? (
					<div className={styles.card}>
						{badges.map((badge) => (
							<div className={styles.row} key={badge.id}>
								<span className={styles.symbol}>{badge.symbol}</span>
								<span>
									<strong className={styles.label}>{badge.accessibilityLabel}</strong>
									<small className={styles.detail}>{badge.assignedUserIDs.length} assigned · priority {badge.priority}</small>
								</span>
								<button type="button" className={styles.rowAction} onClick={() => void remove(badge.id)} disabled={saving} aria-label={`Delete ${badge.accessibilityLabel}`}>
									<SymbolIcon name="archivebox" />
								</button>
							</div>
						))}
					</div>
				) : null}
			</section>
		</main>
	);
}
