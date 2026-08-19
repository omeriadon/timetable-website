"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useEffect, useMemo, useState } from "react";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import GlassButton from "@/components/controls/GlassButton/GlassButton";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import AdminUserEditorSheet, {
	type AdministrationUser,
} from "@/components/administration/AdminUserEditorSheet/AdminUserEditorSheet";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

export default function AdminUsersEditor() {
	const { openSheet } = useSheet();
	const [users, setUsers] = useState<AdministrationUser[]>([]);
	const [query, setQuery] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isSystemOwner, setIsSystemOwner] = useState(false);

	useEffect(() => {
		Promise.all([
			apiRequest<AdministrationUser[]>("v1/administration/users"),
			apiRequest<{ authority: string }>("v1/account"),
		])
			.then(([loaded, account]) => {
				setUsers(loaded);
				setIsSystemOwner(account.authority === "systemOwner");
			})
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	const filtered = useMemo(() => {
		const value = query.trim().toLowerCase();
		return value
			? users.filter((user) =>
					`${user.displayName} ${user.email}`.toLowerCase().includes(value),
				)
			: users;
	}, [query, users]);

	const edit = (user?: AdministrationUser) =>
		openSheet(
			<AdminUserEditorSheet
				user={user}
				isSystemOwner={isSystemOwner}
				onSaved={(saved) =>
					setUsers((current) =>
						[...current.filter((item) => item.id !== saved.id), saved].sort(
							(left, right) =>
								left.displayName.localeCompare(right.displayName),
						),
					)
				}
				onDeleted={(id) =>
					setUsers((current) => current.filter((item) => item.id !== id))
				}
			/>,
		);

	return (
		<main className={styles.page}>
			<div className={styles.adminToolbar}>
				<label className={styles.adminSearch}>
					<SymbolIcon name="magnifyingglass" fallback="⌕" />
					<Input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search users"
					/>
				</label>
				<GlassButton label="Add user" size="compact" onClick={() => edit()}>
					<SymbolIcon name="plus" fallback="＋" />
				</GlassButton>
			</div>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			<section className={styles.card}>
				{filtered.map((user) => (
					<Button
						unstyled
						key={user.id}
						type="button"
						className={styles.rowButton}
						onClick={() => edit(user)}
					>
						<div className={styles.userRow}>
							<ProfilePicture
								profile={user}
								size={38}
								label={`${user.displayName} profile picture`}
							/>
							<span>
								<b className={styles.label}>{user.displayName}</b>
								<small className={styles.userMeta}>
									{user.authority} · {user.email}
								</small>
							</span>
							<SymbolIcon name="chevron.right" className={styles.chevronIcon} />
						</div>
					</Button>
				))}
				{!filtered.length ? (
					<p className={styles.loading}>
						{users.length ? "No matching users." : "Loading users…"}
					</p>
				) : null}
			</section>
		</main>
	);
}
