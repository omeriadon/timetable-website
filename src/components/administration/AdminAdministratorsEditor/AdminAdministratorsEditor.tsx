"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import Symbol from "@/components/controls/Symbol/Symbol";
import AdminAuthorityChangeDrawer from "@/components/administration/AdminAuthorityChangeDrawer/AdminAuthorityChangeDrawer";
import type { AdministrationUser } from "@/components/administration/AdminUserEditorDrawer/AdminUserEditorDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/administration/Administration.module.css";
import adminStyles from "@/components/administration/Administration.module.css";

export default function AdminAdministratorsEditor() {
	const { openDrawer } = useDrawer();
	const [users, setUsers] = useState<AdministrationUser[]>([]);
	const [query, setQuery] = useState("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiRequest<AdministrationUser[]>("v1/administration/users")
			.then(setUsers)
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		return normalized
			? users.filter((user) =>
					`${user.displayName} ${user.email}`
						.toLowerCase()
						.includes(normalized),
				)
			: users;
	}, [query, users]);

	const saveUser = (updated: AdministrationUser) => {
		setUsers((current) =>
			current.map((user) => (user.id === updated.id ? updated : user)),
		);
	};

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
			</div>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			<section className={styles.card}>
				{filtered.map((user) => {
					const isSystemOwner = user.authority === "systemOwner";
					const isAdministrator = user.authority === "administrator";
					return (
						<Button
							key={user.id}
							type="button"
							className={styles.rowButton}
							disabled={isSystemOwner}
							onClick={() =>
								openDrawer(
									<AdminAuthorityChangeDrawer
										user={user}
										makeAdministrator={!isAdministrator}
										onSaved={saveUser}
									/>,
								)
							}
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
										{isSystemOwner ? "System Administrator" : user.email}
									</small>
								</span>
								<span className={styles.detail}>
									{isSystemOwner ? "Owner" : isAdministrator ? "On" : "Off"}
								</span>
							</div>
						</Button>
					);
				})}
				{!filtered.length ? (
					<p className={styles.loading}>
						{users.length ? "No matching users." : "Loading administrators…"}
					</p>
				) : null}
			</section>
			<p className={styles.detailNote}>
				Only system administrators can change administrator access. System
				administrators cannot be changed here.
			</p>
		</main>
	);
}
