import { Button } from "@/components/ui/button";
import { createSignal, onMount } from "solid-js";
import Symbol from "@/components/controls/Symbol/Symbol";
import AdminDevelopmentAccessChangeDrawer from "@/components/administration/AdminDevelopmentAccessChangeDrawer/AdminDevelopmentAccessChangeDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/administration/Administration.module.css";
import { List, ListRow } from "@/components/ui/list";

export default function AdminDevelopmentAccessEditor() {
	const { openDrawer } = useDrawer();
	const [enabled, setEnabled] = createSignal<boolean | null>(null);
	const [error, setError] = createSignal<string | null>(null);

	onMount(() => {
		apiRequest<{ developmentAccessOnly: boolean }>(
			"_operations/server-access-mode",
		)
			.then((response) => setEnabled(response.developmentAccessOnly))
			.catch((requestError: Error) => setError(requestError.message));
	});

	return (
		<main class={styles.page}>
			{error() ? (
				<p class={styles.error} role="alert">
					{error()}
				</p>
			) : null}
			<List rowHover>
				{enabled() === null ? (
					<p class={styles.loading}>Loading server access…</p>
				) : (
					<Button
						type="button"
						class={styles.listButton}
						onClick={() =>
							openDrawer(
								() => (<AdminDevelopmentAccessChangeDrawer
									enabled={enabled()!}
									onSaved={setEnabled}
								/>),
							)
						}
					>
						<ListRow>
							<Symbol name="testtube.2" />
							<span class={styles.label}>
								Restrict Server to System Administrators
							</span>
							<span class={styles.detail}>{enabled() ? "On" : "Off"}</span>
						</ListRow>
					</Button>
				)}
			</List>
			<p class={styles.detailNote}>
				When enabled, only the two system administrator accounts can use the
				server. Existing sessions remain intact but receive an access error.
			</p>
		</main>
	);
}
