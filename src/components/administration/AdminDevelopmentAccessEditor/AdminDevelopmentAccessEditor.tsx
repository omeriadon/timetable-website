"use client";

import { useEffect, useState } from "react";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import AdminDevelopmentAccessChangeSheet from "@/components/administration/AdminDevelopmentAccessChangeSheet/AdminDevelopmentAccessChangeSheet";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

export default function AdminDevelopmentAccessEditor() {
	const { openSheet } = useSheet();
	const [enabled, setEnabled] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiRequest<{ developmentAccessOnly: boolean }>(
			"_operations/server-access-mode",
		)
			.then((response) => setEnabled(response.developmentAccessOnly))
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	return (
		<main className={styles.page}>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			<section className={styles.card}>
				{enabled === null ? (
					<p className={styles.loading}>Loading server access…</p>
				) : (
					<button
						type="button"
						className={styles.rowButton}
						onClick={() =>
							openSheet(
								<AdminDevelopmentAccessChangeSheet
									enabled={enabled}
									onSaved={setEnabled}
								/>,
							)
						}
					>
						<div className={styles.row}>
							<SymbolIcon name="testtube.2" />
							<span className={styles.label}>
								Restrict Server to System Administrators
							</span>
							<span className={styles.detail}>{enabled ? "On" : "Off"}</span>
						</div>
					</button>
				)}
			</section>
			<p className={styles.detailNote}>
				When enabled, only the two system administrator accounts can use the
				server. Existing sessions remain intact but receive an access error.
			</p>
		</main>
	);
}
