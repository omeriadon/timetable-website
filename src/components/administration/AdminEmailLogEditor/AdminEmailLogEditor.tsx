import { createSignal, onMount } from "solid-js";
import { apiRequest } from "@/lib/api/client";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/administration/Administration.module.css";
import adminStyles from "@/components/administration/Administration.module.css";
import { List, ListRow } from "@/components/ui/list";

type EmailLogEntry = {
	id: string;
	recipient: string;
	subject: string;
	body: string;
	status: string;
	failureReason: string | null;
	createdAt: string | null;
	updatedAt: string | null;
};

export default function AdminEmailLogEditor() {
	const [entries, setEntries] = createSignal<EmailLogEntry[] | null>(null);
	const [error, setError] = createSignal<string | null>(null);

	onMount(() => {
		apiRequest<EmailLogEntry[]>("v1/administration/email-log")
			.then(setEntries)
			.catch((requestError: Error) => setError(requestError.message));
	});

	return (
		<main class={styles.page}>
			{error() ? (
				<p class={styles.error} role="alert">
					{error()}
				</p>
			) : null}
			{entries() === null && !error() ? (
				<p class={styles.loading}>Loading email log…</p>
			) : null}
			{entries()?.length === 0 ? (
				<p class={styles.emptyRow}>
					No email deliveries have been recorded.
				</p>
			) : null}
			{entries()?.length ? (
				<List>
					{entries()!.map((entry) => (
						<ListRow class={adminStyles.adminRecord}>
							<div class={styles.profileRow}>
								<Symbol name="envelope.badge" />
								<span class={styles.label}>{entry.subject}</span>
								<strong class={styles.detail}>{entry.status}</strong>
							</div>
							<div class={adminStyles.adminField}>
								<span>Recipient</span>
								<strong>{entry.recipient}</strong>
							</div>
							<div class={adminStyles.adminField}>
								<span>Created</span>
								<strong>{formatDate(entry.createdAt)}</strong>
							</div>
							{entry.failureReason ? (
								<div class={adminStyles.adminField}>
									<span>Failure</span>
									<strong>{entry.failureReason}</strong>
								</div>
							) : null}
						</ListRow>
					))}
				</List>
			) : null}
		</main>
	);
}

function formatDate(value: string | null) {
	return value ? new Date(value).toLocaleString("en-AU") : "—";
}
