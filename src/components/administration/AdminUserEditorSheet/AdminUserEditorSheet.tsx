"use client";

import { useRef, useState } from "react";

import type { Account } from "@/lib/api/contracts";
import { apiRequest } from "@/lib/api/client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

import Symbol from "@/components/controls/Symbol/Symbol";
import { Button } from "@/components/ui/button";
import styles from "@/components/sheets/Sheet/Sheet.module.css";

export type AdministrationUser = Account & {
	authority: string;
};

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
	const parentCloseRef = useRef<HTMLButtonElement>(null);

	const [displayName, setDisplayName] = useState(user?.displayName ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [password, setPassword] = useState("");
	const [authority, setAuthority] = useState(user?.authority ?? "user");

	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const closeParentSheet = () => {
		parentCloseRef.current?.click();
	};

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
					{
						method: "PUT",
						body: JSON.stringify({ authority }),
					},
				);
			}

			onSaved(finalUser);
			closeParentSheet();
		} catch (requestError) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "Failed to save user",
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
			closeParentSheet();
		} catch (requestError) {
			setError(
				requestError instanceof Error
					? requestError.message
					: "Failed to delete user",
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<div className={styles.detailSheet}>
				<SheetClose
					ref={parentCloseRef}
					className="hidden"
					aria-hidden="true"
					tabIndex={-1}
				/>

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
							autoComplete="new-password"
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
							<option value="user">User</option>
							<option value="administrator">Administrator</option>

							{user?.authority === "systemOwner" && (
								<option value="systemOwner">System owner</option>
							)}
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
							variant="destructive"
							onClick={() => setDeleteOpen(true)}
							disabled={saving}
						>
							<Symbol name="trash" fallback="×" />
							Delete
						</Button>
					)}

					<Button
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

			{user && (
				<Sheet open={deleteOpen} onOpenChange={setDeleteOpen}>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Delete account</SheetTitle>
							<SheetDescription>
								Delete {user.displayName}&apos;s account? This cannot be undone.
							</SheetDescription>
						</SheetHeader>

						<SheetFooter>
							<SheetClose
								render={
									<SheetClose
										render={<Button variant="outline" disabled={saving} />}
									>
										Cancel
									</SheetClose>
								}
							>
								Cancel
							</SheetClose>

							<Button
								variant="destructive"
								onClick={() => void remove()}
								disabled={saving}
							>
								<Symbol name="trash" fallback="×" />
								{saving ? "Deleting…" : "Delete account"}
							</Button>
						</SheetFooter>
					</SheetContent>
				</Sheet>
			)}
		</>
	);
}
