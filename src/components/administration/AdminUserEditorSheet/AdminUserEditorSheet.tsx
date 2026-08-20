"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useState } from "react";
import type { Account } from "@/lib/api/contracts";
import { apiRequest } from "@/lib/api/client";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/sheets/Sheet/Sheet.module.css";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";
import ConfirmationSheet from "@/components/sheets/ConfirmationSheet/ConfirmationSheet";

export type AdministrationUser = Account & { authority: string };

type AdminUserEditorSheetProps = {
	user?: AdministrationUser;
	isSystemOwner: boolean;
	onSaved: (user: AdministrationUser) => void;
	onDeleted: (userID: string) => void;
};

export default function AdminUserEditorSheet({
	user,
	isSystemOwner,
	onSaved,
	onDeleted,
}: AdminUserEditorSheetProps) {
	const { closeSheet, openSheet } = useSheet();
	const [displayName, setDisplayName] = useState(user?.displayName ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [password, setPassword] = useState("");
	const [authority, setAuthority] = useState(user?.authority ?? "user");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const save = async () => {
		if (saving || !displayName.trim() || !email.trim()) return;
		setSaving(true);
		setError(null);
		try {
			const path = user
				? `v1/administration/users/${user.id}`
				: "v1/administration/users";
			const updated = await apiRequest<AdministrationUser>(path, {
				method: user ? "PUT" : "POST",
				body: JSON.stringify(
					user
						? {
								displayName: displayName.trim(),
								email: email.trim(),
								password: password || null,
							}
						: {
								displayName: displayName.trim(),
								email: email.trim(),
								password,
							},
				),
			});
			let finalUser = updated;
			if (
				user &&
				isSystemOwner &&
				authority !== user.authority &&
				authority !== "systemOwner"
			) {
				finalUser = await apiRequest<AdministrationUser>(
					`v1/administration/users/${user.id}/authority`,
					{ method: "PUT", body: JSON.stringify({ authority }) },
				);
			}
			onSaved(finalUser);
			closeSheet();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const remove = async () => {
		if (!user || saving) return;
		setSaving(true);
		setError(null);
		try {
			await apiRequest(`v1/administration/users/${user.id}`, {
				method: "DELETE",
			});
			onDeleted(user.id);
		} catch (requestError) {
			setError((requestError as Error).message);
			throw requestError;
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<Symbol name="person" fallback="●" />
				<div>
					<h2>{user ? "Edit User" : "Add User"}</h2>
					<p>{user?.email ?? "Create an account"}</p>
				</div>
			</header>
			<section className={styles.formCard}>
				<label>
					Display name
					<Input
						value={displayName}
						onChange={(event) => setDisplayName(event.target.value)}
						autoComplete="name"
					/>
				</label>
				<label>
					Email
					<Input
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						autoComplete="email"
					/>
				</label>
				<label>
					{user ? "New password (optional)" : "Password"}
					<Input
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						autoComplete={user ? "new-password" : "new-password"}
					/>
				</label>
				<label>
					Authority
					<Select
						value={authority}
						onChange={(event) => setAuthority(event.target.value)}
						disabled={!isSystemOwner || user?.authority === "systemOwner"}
					>
						<option value="user">User</option>
						<option value="administrator">Administrator</option>
						{user?.authority === "systemOwner" ? (
							<option value="systemOwner">System owner</option>
						) : null}
					</Select>
				</label>
			</section>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<div className={styles.sheetActions}>
				{user ? (
					<SheetActionButton
						label="Delete user"
						tone="destructive"
						onClick={() =>
							openSheet(
								<ConfirmationSheet
									title="Delete account"
									message={`Delete ${user.displayName}'s account? This cannot be undone.`}
									confirmLabel="Delete account"
									onConfirm={remove}
								/>,
							)
						}
						disabled={saving}
					>
						<Symbol name="trash" fallback="×" /> Delete
					</SheetActionButton>
				) : null}
				<SheetActionButton
					label={user ? "Save user" : "Create user"}
					onClick={() => void save()}
					disabled={
						saving ||
						!displayName.trim() ||
						!email.trim() ||
						(!user && password.length < 8)
					}
				>
					<Symbol name="checkmark" fallback="✓" />
					{saving ? "Saving…" : user ? "Save" : "Create"}
				</SheetActionButton>
			</div>
		</div>
	);
}
