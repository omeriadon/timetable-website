"use client";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { Account } from "@/lib/api/contracts";
import { apiRequest } from "@/lib/api/client";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/drawers/Drawer/Drawer.module.css";
import { Button } from "@/components/ui/button";
import ConfirmationDrawer from "@/components/drawers/ConfirmationDrawer/ConfirmationDrawer";

export type AdministrationUser = Account & { authority: string };

type AdminUserEditorDrawerProps = {
	user?: AdministrationUser;
	isSystemOwner: boolean;
	onSaved: (user: AdministrationUser) => void;
	onDeleted: (userID: string) => void;
};

export default function AdminUserEditorDrawer({
	user,
	isSystemOwner,
	onSaved,
	onDeleted,
}: AdminUserEditorDrawerProps) {
	const { closeDrawer, openDrawer } = useDrawer();
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
			closeDrawer();
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
		<div className={styles.detailDrawer}>
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
						onValueChange={(value) => {
							if (value !== null) {
								setAuthority(value);
							}
						}}
						disabled={!isSystemOwner || user?.authority === "systemOwner"}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="user">User</SelectItem>
							<SelectItem value="administrator">Administrator</SelectItem>

							{user?.authority === "systemOwner" && (
								<SelectItem value="systemOwner">System owner</SelectItem>
							)}
						</SelectContent>
					</Select>
				</label>
			</section>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<div className={styles.drawerActions}>
				{user ? (
					<Button
						aria-label="Delete user"
						onClick={() =>
							openDrawer(
								<ConfirmationDrawer
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
					</Button>
				) : null}
				<Button
					aria-label={user ? "Save user" : "Create user"}
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
				</Button>
			</div>
		</div>
	);
}
