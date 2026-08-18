"use client";

import { useState } from "react";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/sheets/Sheet/Sheet.module.css";

export default function AdminDevelopmentAccessChangeSheet({ enabled, onSaved }: { enabled: boolean; onSaved: (enabled: boolean) => void }) {
	const { closeSheet } = useSheet();
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const nextValue = !enabled;

	const save = async () => {
		setSaving(true);
		setError(null);
		try {
			const response = await apiRequest<{ developmentAccessOnly: boolean }>("_operations/server-access-mode", {
				method: "PUT",
				body: JSON.stringify({ developmentAccessOnly: nextValue }),
			});
			onSaved(response.developmentAccessOnly);
			closeSheet();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<SymbolIcon name={nextValue ? "lock.fill" : "lock.open"} fallback="▣" />
				<div>
					<h2>{nextValue ? "Restrict Server Access?" : "Restore Normal Access?"}</h2>
					<p>Development Access</p>
				</div>
			</header>
			<section className={styles.detailCard}>
				<p className={styles.detailMuted}>{nextValue ? "Only system administrators will be able to use the server. Existing sessions remain intact." : "All accounts will be able to use the server again."}</p>
			</section>
			{error ? <p className={styles.detailMuted} role="alert">{error}</p> : null}
			<div className={styles.sheetActions}>
				<SheetActionButton label="Cancel server access change" tone="destructive" onClick={closeSheet} disabled={saving}>Cancel</SheetActionButton>
				<SheetActionButton label={nextValue ? "Restrict access" : "Restore access"} onClick={() => void save()} disabled={saving}>{saving ? "Saving…" : nextValue ? "Restrict Access" : "Restore Access"}</SheetActionButton>
			</div>
		</div>
	);
}
