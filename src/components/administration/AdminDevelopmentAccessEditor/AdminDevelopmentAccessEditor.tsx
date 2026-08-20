"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import AdminDevelopmentAccessChangeDrawer from "@/components/administration/AdminDevelopmentAccessChangeDrawer/AdminDevelopmentAccessChangeDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/administration/Administration.module.css";

export default function AdminDevelopmentAccessEditor() {
	const { openDrawer } = useDrawer();
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
					<Button
						type="button"
						className={styles.rowButton}
						onClick={() =>
							openDrawer(
								<AdminDevelopmentAccessChangeDrawer
									enabled={enabled}
									onSaved={setEnabled}
								/>,
							)
						}
					>
						<div className={styles.row}>
							<Symbol name="testtube.2" />
							<span className={styles.label}>
								Restrict Server to System Administrators
							</span>
							<span className={styles.detail}>{enabled ? "On" : "Off"}</span>
						</div>
					</Button>
				)}
			</section>
			<p className={styles.detailNote}>
				When enabled, only the two system administrator accounts can use the
				server. Existing sessions remain intact but receive an access error.
			</p>
		</main>
	);
}
