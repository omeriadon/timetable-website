import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMemo, createSignal, onMount } from "solid-js";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import AdminUserEditorDrawer, {
	type AdministrationUser,
} from "@/components/administration/AdminUserEditorDrawer/AdminUserEditorDrawer";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/administration/Administration.module.css";
import adminStyles from "@/components/administration/Administration.module.css";
import { List, ListRow } from "@/components/ui/list";

export default function AdminUsersEditor() {
	const { openDrawer } = useDrawer();
	const [users, setUsers] = createSignal<AdministrationUser[]>([]);
	const [query, setQuery] = createSignal("");
	const [error, setError] = createSignal<string | null>(null);
	const [isSystemOwner, setIsSystemOwner] = createSignal(false);

	onMount(() => {
		Promise.all([
			apiRequest<AdministrationUser[]>("v1/administration/users"),
			apiRequest<{ authority: string }>("v1/account"),
		])
			.then(([loaded, account]) => {
				setUsers(loaded);
				setIsSystemOwner(account.authority === "systemOwner");
			})
			.catch((requestError: Error) => setError(requestError.message));
	});

	const filtered = createMemo(() => {
		const value = query().trim().toLowerCase();
		return value
			? users().filter((user) =>
					`${user.displayName} ${user.email}`.toLowerCase().includes(value),
				)
			: users();
	});

	const edit = (user?: AdministrationUser) =>
		openDrawer(() => (
			<AdminUserEditorDrawer
				user={user}
				isSystemOwner={isSystemOwner()}
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
			/>
		));

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
				<Button
					type="button"
					size="icon"
					class={styles.addButton}
					aria-label="Add user"
					onClick={() => edit()}
				>
					<Symbol name="plus" fallback="＋" />
				</Button>
			</div>
			{error() ? (
				<p class={styles.error} role="alert">
					{error()}
				</p>
			) : null}
			<List rowHover>
				{filtered().map((user) => (
					<Button
						type="button"
						class={styles.listButton}
						onClick={() => edit(user)}
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
									{user.authority} · {user.email}
								</small>
							</span>
							<Symbol name="chevron.right" />
						</ListRow>
					</Button>
				))}
				{!filtered().length ? (
					<p class={styles.loading}>
						{users().length ? "No matching users." : "Loading users…"}
					</p>
				) : null}
			</List>
		</main>
	);
}
