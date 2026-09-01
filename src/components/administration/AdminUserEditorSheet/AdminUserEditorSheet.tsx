import { useState } from "react";

import Symbol from "@/components/controls/Symbol/Symbol";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/api/client";
import type { Account } from "@/lib/api/contracts";

import styles from "@/components/administration/Administration.module.css";

export type AdministrationUser = Account & {
	authority: string;
};

type AdminUserEditorSheetProps = {
	user?: AdministrationUser;
	isSystemOwner: boolean;
	onSaved: (user: AdministrationUser) => void;
	onDeleted: (userID: string) => void;
	onClose?: () => void;
};

export default function AdminUserEditorSheet({
	user,
	isSystemOwner,
	onSaved,
	onDeleted,
	onClose,
}: AdminUserEditorSheetProps) {
	const [displayName, setDisplayName] = useState(user?.displayName ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [password, setPassword] = useState("");
	const [authority, setAuthority] = useState(user?.authority ?? "user");

	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const canSave =
		!saving &&
		displayName.trim().length > 0 &&
		email.trim().length > 0 &&
		(user !== undefined || password.length >= 8);

	const save = async () => {
		if (!canSave) return;

		setSaving(true);
		setError(null);

		try {
			const path = user
				? `v1/administration/users/${user.id}`
				: "v1/administration/users";

			let updated = await apiRequest<AdministrationUser>(path, {
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

			if (
				user &&
				isSystemOwner &&
				authority !== user.authority &&
				authority !== "systemOwner"
			) {
				updated = await apiRequest<AdministrationUser>(
					`v1/administration/users/${user.id}/authority`,
					{
						method: "PUT",
						body: JSON.stringify({ authority }),
					},
				);
			}

			onSaved(updated);
			onClose?.();
		} catch (requestError) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "Failed to save user.",
			);
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
			setDeleteOpen(false);
			onClose?.();
		} catch (requestError) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "Failed to delete user.",
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
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
							disabled={saving}
						/>
					</label>

					<label>
						Email
						<Input
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							autoComplete="email"
							disabled={saving}
						/>
					</label>

					<label>
						{user ? "New password (optional)" : "Password"}
						<Input
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							autoComplete="new-password"
							minLength={8}
							disabled={saving}
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
							disabled={
								saving || !isSystemOwner || user?.authority === "systemOwner"
							}
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

				{error && (
					<p className={styles.detailMuted} role="alert">
						{error}
					</p>
				)}

				<div className={styles.sheetActions}>
					{user && (
						<Button
							type="button"
							variant="destructive"
							onClick={() => setDeleteOpen(true)}
							disabled={saving}
						>
							<Symbol name="trash" fallback="×" />
							Delete
						</Button>
					)}

					<Button type="button" onClick={() => void save()} disabled={!canSave}>
						<Symbol name="checkmark" fallback="✓" />
						{saving ? "Saving…" : user ? "Save" : "Create"}
					</Button>
				</div>
			</div>

			{user && (
				<Drawer open={deleteOpen} onOpenChange={setDeleteOpen}>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Delete account</DrawerTitle>
							<DrawerDescription>
								Delete {user.displayName}&apos;s account? This cannot be undone.
							</DrawerDescription>
						</DrawerHeader>

						<DrawerFooter>
							<DrawerClose variant="outline" disabled={saving}>
								Cancel
							</DrawerClose>

							<Button
								type="button"
								variant="destructive"
								onClick={() => void remove()}
								disabled={saving}
							>
								<Symbol name="trash" fallback="×" />
								{saving ? "Deleting…" : "Delete account"}
							</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			)}
		</>
	);
}
