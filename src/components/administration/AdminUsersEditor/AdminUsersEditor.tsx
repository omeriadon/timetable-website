"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import AdminUserEditorDrawer, {
	type AdministrationUser,
} from "@/components/administration/AdminUserEditorDrawer/AdminUserEditorDrawer";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/administration/Administration.module.css";
import adminStyles from "@/components/administration/Administration.module.css";

export default function AdminUsersEditor() {
	const { openDrawer } = useDrawer();
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
		openDrawer(
			<AdminUserEditorDrawer
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
			<div className={adminStyles.adminToolbar}>
				<label className={adminStyles.adminSearch}>
					<Symbol name="magnifyingglass" fallback="⌕" />
					<Input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search users"
					/>
				</label>
				<Button type="button" aria-label="Add user" onClick={() => edit()}>
					<Symbol name="plus" fallback="＋" />
				</Button>
			</div>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			<section className={styles.card}>
				{filtered.map((user) => (
					<Button
						key={user.id}
						type="button"
						className={styles.rowButton}
						onClick={() => edit(user)}
					>
						<div className={adminStyles.userRow}>
							<ProfilePicture
								profile={user}
								size={38}
								label={`${user.displayName} profile picture`}
							/>
							<span>
								<b className={styles.label}>{user.displayName}</b>
								<small className={adminStyles.userMeta}>
									{user.authority} · {user.email}
								</small>
							</span>
							<Symbol name="chevron.right" className={styles.chevronIcon} />
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
