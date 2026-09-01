import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import AdminDevelopmentAccessChangeDrawer from "@/components/administration/AdminDevelopmentAccessChangeDrawer/AdminDevelopmentAccessChangeDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/administration/Administration.module.css";
import { List, ListRow } from "@/components/ui/list";

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
			<List rowHover>
				{enabled === null ? (
					<p className={styles.loading}>Loading server access…</p>
				) : (
					<Button
						type="button"
						className={styles.listButton}
						onClick={() =>
							openDrawer(
								<AdminDevelopmentAccessChangeDrawer
									enabled={enabled}
									onSaved={setEnabled}
								/>,
							)
						}
					>
						<ListRow>
							<Symbol name="testtube.2" />
							<span className={styles.label}>
								Restrict Server to System Administrators
							</span>
							<span className={styles.detail}>{enabled ? "On" : "Off"}</span>
						</ListRow>
					</Button>
				)}
			</List>
			<p className={styles.detailNote}>
				When enabled, only the two system administrator accounts can use the
				server. Existing sessions remain intact but receive an access error.
			</p>
		</main>
	);
}
