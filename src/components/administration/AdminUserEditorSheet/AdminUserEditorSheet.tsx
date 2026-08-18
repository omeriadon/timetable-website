"use client";

import { useState } from "react";
import type { Account } from "@/lib/api/contracts";
import { apiRequest } from "@/lib/api/client";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import styles from "@/components/sheets/Sheet/Sheet.module.css";

export type AdministrationUser = Account & { authority: string };

type AdminUserEditorSheetProps = {
	user?: AdministrationUser;
	isSystemOwner: boolean;
	onSaved: (user: AdministrationUser) => void;
	onDeleted: (userID: string) => void;
};

export default function AdminUserEditorSheet({ user, isSystemOwner, onSaved, onDeleted }: AdminUserEditorSheetProps) {
	const { closeSheet } = useSheet();
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
			const path = user ? `v1/administration/users/${user.id}` : "v1/administration/users";
			const updated = await apiRequest<AdministrationUser>(path, {
				method: user ? "PUT" : "POST",
				body: JSON.stringify(user ? { displayName: displayName.trim(), email: email.trim(), password: password || null } : { displayName: displayName.trim(), email: email.trim(), password }),
			});
			let finalUser = updated;
			if (user && isSystemOwner && authority !== user.authority && authority !== "systemOwner") {
				finalUser = await apiRequest<AdministrationUser>(`v1/administration/users/${user.id}/authority`, { method: "PUT", body: JSON.stringify({ authority }) });
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
		if (!user || saving || !window.confirm(`Delete ${user.displayName}'s account?`)) return;
		setSaving(true);
		setError(null);
		try {
			await apiRequest(`v1/administration/users/${user.id}`, { method: "DELETE" });
			onDeleted(user.id);
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
				<SymbolIcon name="person" fallback="●" />
				<div><h2>{user ? "Edit User" : "Add User"}</h2><p>{user?.email ?? "Create an account"}</p></div>
			</header>
			<section className={styles.formCard}>
				<label>Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" /></label>
				<label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>
				<label>{user ? "New password (optional)" : "Password"}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={user ? "new-password" : "new-password"} /></label>
				<label>Authority<select value={authority} onChange={(event) => setAuthority(event.target.value)} disabled={!isSystemOwner || user?.authority === "systemOwner"}><option value="user">User</option><option value="administrator">Administrator</option>{user?.authority === "systemOwner" ? <option value="systemOwner">System owner</option> : null}</select></label>
			</section>
			{error ? <p className={styles.detailMuted} role="alert">{error}</p> : null}
			<div className={styles.sheetActions}>
				{user ? <button type="button" className={styles.destructiveButton} onClick={() => void remove()} disabled={saving}><SymbolIcon name="trash" fallback="×" /> Delete</button> : null}
				<button type="button" className={styles.primaryButton} onClick={() => void save()} disabled={saving || !displayName.trim() || !email.trim() || (!user && password.length < 8)}><SymbolIcon name="checkmark" fallback="✓" />{saving ? "Saving…" : user ? "Save" : "Create"}</button>
			</div>
		</div>
	);
}
