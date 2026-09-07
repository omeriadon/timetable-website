import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createSignal, onMount } from "solid-js";
import type { Account } from "@/lib/api/contracts";
import { apiRequest } from "@/lib/api/client";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/drawers/Drawer/Drawer.module.css";
import { Button } from "@/components/ui/button";
import ConfirmationDrawer from "@/components/drawers/ConfirmationDrawer/ConfirmationDrawer";
import { DrawerFooter } from "@/components/ui/drawer";

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
	const [displayName, setDisplayName] = createSignal(user?.displayName ?? "");
	const [email, setEmail] = createSignal(user?.email ?? "");
	const [password, setPassword] = createSignal("");
	const [authority, setAuthority] = createSignal(user?.authority ?? "user");
	const [saving, setSaving] = createSignal(false);
	const [error, setError] = createSignal<string | null>(null);
	const [rawData, setRawData] = createSignal("");
	const [dataError, setDataError] = createSignal<string | null>(null);

	onMount(() => {
		if (!user) {
			return;
		}

		apiRequest<{ rawData: string }>(`v1/administration/users/${user.id}`)
			.then((response) => setRawData(response.rawData))
			.catch((requestError: Error) => setDataError(requestError.message));
	});

	const save = async () => {
		if (saving() || !displayName().trim() || !email().trim()) return;
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
								displayName: displayName().trim(),
								email: email().trim(),
								password: password() || null,
							}
						: {
								displayName: displayName().trim(),
								email: email().trim(),
								password,
							},
				),
			});
			let finalUser = updated;
			if (
				user &&
				isSystemOwner &&
				authority() !== user.authority &&
				authority() !== "systemOwner"
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
		if (!user || saving()) return;
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
		<div class={styles.detailDrawer}>
			<header class={styles.detailHeader}>
				<Symbol name="person" fallback="●" />
				<div>
					<h2>{user ? "Edit User" : "Add User"}</h2>
					<p>{user?.email ?? "Create an account"}</p>
				</div>
			</header>
			<section class={styles.formCard}>
				<label>
					Display name
					<Input
						value={displayName()}
						onChange={(event) => setDisplayName(event.target.value)}
						autoComplete="name"
					/>
				</label>
				<label>
					Email
					<Input
						type="email"
						value={email()}
						onChange={(event) => setEmail(event.target.value)}
						autoComplete="email"
					/>
				</label>
				<label>
					{user ? "New password (optional)" : "Password"}
					<Input
						type="password"
						value={password()}
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
			{user ? (
				<section class={styles.formCard} aria-labelledby="account-data-title">
					<h3 id="account-data-title">Account Data</h3>
					{dataError() ? (
						<p class={styles.detailMuted} role="alert">
							{dataError()}
						</p>
					) : rawData() ? (
						<pre class={styles.jsonData}>{formatJSON(rawData())}</pre>
					) : (
						<p class={styles.detailMuted}>Loading account data…</p>
					)}
				</section>
			) : null}
			{error() ? (
				<p class={styles.detailMuted} role="alert">
					{error()}
				</p>
			) : null}
			<DrawerFooter class={styles.actionFooter}>
				{user ? (
					<Button
						variant="destructive"
						flexible
						aria-label="Delete user"
						onClick={() =>
							openDrawer(() => (
								<ConfirmationDrawer
									title="Delete account"
									message={`Delete ${user.displayName}'s account? This cannot be undone.`}
									confirmLabel="Delete account"
									onConfirm={remove}
								/>
							))
						}
						disabled={saving()}
					>
						<Symbol name="trash" fallback="×" /> Delete
					</Button>
				) : null}
				<Button
					flexible
					aria-label={user ? "Save user" : "Create user"}
					onClick={() => void save()}
					disabled={
						saving() ||
						!displayName().trim() ||
						!email().trim() ||
						(!user && password.length < 8)
					}
				>
					<Symbol name="checkmark" fallback="✓" />
					{saving() ? "Saving…" : user ? "Save" : "Create"}
				</Button>
			</DrawerFooter>
		</div>
	);
}

function formatJSON(rawData: string) {
	try {
		return JSON.stringify(expandEmbeddedJSON(JSON.parse(rawData)), null, 2);
	} catch {
		return rawData;
	}
}

function expandEmbeddedJSON(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(expandEmbeddedJSON);
	}

	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, child]) => [
				key,
				expandEmbeddedJSON(child),
			]),
		);
	}

	if (typeof value !== "string") {
		return value;
	}

	const parsed = parseEmbeddedJSON(value);
	if (parsed !== null) {
		return expandEmbeddedJSON(parsed);
	}

	try {
		const decoded = window.atob(value);
		const decodedJSON = parseEmbeddedJSON(decoded);
		return decodedJSON === null ? value : expandEmbeddedJSON(decodedJSON);
	} catch {
		return value;
	}
}

function parseEmbeddedJSON(value: string): unknown | null {
	const trimmed = value.trim();
	if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
		return null;
	}

	try {
		return JSON.parse(trimmed);
	} catch {
		return null;
	}
}
