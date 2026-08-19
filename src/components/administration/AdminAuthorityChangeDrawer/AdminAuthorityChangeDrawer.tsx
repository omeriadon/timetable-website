"use client";

import { useState } from "react";
import type { AdministrationUser } from "@/components/administration/AdminUserEditorDrawer/AdminUserEditorDrawer";
import { Button } from "@base-ui/react/button";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/drawers/Drawer/Drawer.module.css";

export default function AdminAuthorityChangeDrawer({
	user,
	makeAdministrator,
	onSaved,
}: {
	user: AdministrationUser;
	makeAdministrator: boolean;
	onSaved: (user: AdministrationUser) => void;
}) {
	const { closeDrawer } = useDrawer();
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const save = async () => {
		setSaving(true);
		setError(null);
		try {
			const updated = await apiRequest<AdministrationUser>(
				`v1/administration/users/${user.id}/authority`,
				{
					method: "PUT",
					body: JSON.stringify({
						authority: makeAdministrator ? "administrator" : "user",
					}),
				},
			);
			onSaved(updated);
			closeDrawer();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className={styles.detailDrawer}>
			<header className={styles.detailHeader}>
				<Symbol
					name={
						makeAdministrator
							? "person.badge.shield.checkmark"
							: "person.2.slash"
					}
				/>
				<div>
					<h2>
						{makeAdministrator
							? "Make Administrator?"
							: "Remove Administrator?"}
					</h2>
					<p>{user.displayName}</p>
				</div>
			</header>
			<section className={styles.detailCard}>
				<p className={styles.detailMuted}>
					Change administrator access for {user.displayName}.
				</p>
			</section>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<div className={styles.drawerActions}>
				<Button
					aria-label="Cancel authority change"
					onClick={closeDrawer}
					disabled={saving}
				>
					Cancel
				</Button>
				<Button
					aria-label={
						makeAdministrator ? "Make administrator" : "Remove administrator"
					}
					onClick={() => void save()}
					disabled={saving}
				>
					{saving
						? "Saving…"
						: makeAdministrator
							? "Make Administrator"
							: "Remove Administrator"}
				</Button>
			</div>
		</div>
	);
}
