import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMemo, createSignal, onMount } from "solid-js";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import Symbol from "@/components/controls/Symbol/Symbol";
import AdminAuthorityChangeDrawer from "@/components/administration/AdminAuthorityChangeDrawer/AdminAuthorityChangeDrawer";
import type { AdministrationUser } from "@/components/administration/AdminUserEditorDrawer/AdminUserEditorDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/administration/Administration.module.css";
import adminStyles from "@/components/administration/Administration.module.css";
import { List, ListRow } from "@/components/ui/list";

export default function AdminAdministratorsEditor() {
	const { openDrawer } = useDrawer();
	const [users, setUsers] = createSignal<AdministrationUser[]>([]);
	const [query, setQuery] = createSignal("");
	const [error, setError] = createSignal<string | null>(null);

	onMount(() => {
		apiRequest<AdministrationUser[]>("v1/administration/users")
			.then(setUsers)
			.catch((requestError: Error) => setError(requestError.message));
	});

	const filtered = createMemo(() => {
		const normalized = query().trim().toLowerCase();
		return normalized
			? users().filter((user) =>
					`${user.displayName} ${user.email}`
						.toLowerCase()
						.includes(normalized),
				)
			: users();
	});

	const saveUser = (updated: AdministrationUser) => {
		setUsers((current) =>
			current.map((user) => (user.id === updated.id ? updated : user)),
		);
	};

	return (
		<main class={styles.page}>
			<div class={adminStyles.adminToolbar}>
				<label class={adminStyles.adminSearch}>
					<Symbol name="magnifyingglass" fallback="⌕" />
					<Input
						value={query()}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search users"
					/>
				</label>
			</div>
			{error() ? (
				<p class={styles.error} role="alert">
					{error()}
				</p>
			) : null}
			<List rowHover>
				{filtered().map((user) => {
					const isSystemOwner = user.authority === "systemOwner";
					const isAdministrator = user.authority === "administrator";
					return (
						<Button

							type="button"
							class={styles.listButton}
							disabled={isSystemOwner}
							onClick={() =>
								openDrawer(
									() => (<AdminAuthorityChangeDrawer
										user={user}
										makeAdministrator={!isAdministrator}
										onSaved={saveUser}
									/>),
								)
							}
						>
							<ListRow class={adminStyles.userRow}>
								<ProfilePicture
									profile={user}
									size={38}
									label={`${user.displayName} profile picture`}
								/>
								<span>
									<b class={styles.label}>{user.displayName}</b>
									<small class={adminStyles.userMeta}>
										{isSystemOwner ? "System Administrator" : user.email}
									</small>
								</span>
								<span class={styles.detail}>
									{isSystemOwner ? "Owner" : isAdministrator ? "On" : "Off"}
								</span>
							</ListRow>
						</Button>
					);
				})}
				{!filtered().length ? (
					<p class={styles.loading}>
						{users().length ? "No matching users." : "Loading administrators…"}
					</p>
				) : null}
			</List>
			<p class={styles.detailNote}>
				Only system administrators can change administrator access. System
				administrators cannot be changed here.
			</p>
		</main>
	);
}
