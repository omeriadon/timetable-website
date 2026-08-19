"use client";

import { useState } from "react";
import type { AdministrationUser } from "@/components/administration/AdminUserEditorSheet/AdminUserEditorSheet";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/sheets/Sheet/Sheet.module.css";

export default function AdminAuthorityChangeSheet({
	user,
	makeAdministrator,
	onSaved,
}: {
	user: AdministrationUser;
	makeAdministrator: boolean;
	onSaved: (user: AdministrationUser) => void;
}) {
	const { closeSheet } = useSheet();
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
			<div className={styles.sheetActions}>
				<SheetActionButton
					label="Cancel authority change"
					tone="destructive"
					onClick={closeSheet}
					disabled={saving}
				>
					Cancel
				</SheetActionButton>
				<SheetActionButton
					label={
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
				</SheetActionButton>
			</div>
		</div>
	);
}
