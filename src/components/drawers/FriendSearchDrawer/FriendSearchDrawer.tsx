import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEffect, createSignal } from "solid-js";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import { apiRequest } from "@/lib/api/client";
import type { FriendSearchResult } from "@/features/timetable/types";
import styles from "../Drawer/Drawer.module.css";

export default function FriendSearchDrawer() {
	const [query, setQuery] = createSignal("");
	const [results, setResults] = createSignal<FriendSearchResult[]>([]);
	const [status, setStatus] = createSignal<string | null>(null);

	createEffect(() => {
		if (query().trim().length < 2) {
			setResults([]);
			return;
		}
		const timer = window.setTimeout(() => {
			apiRequest<FriendSearchResult[]>(
				`v1/friends/search?q=${encodeURIComponent(query().trim())}`,
			)
				.then(setResults)
				.catch((error: Error) => setStatus(error.message));
		}, 180);
		return () => window.clearTimeout(timer);
	});

	const requestFriend = async (userID: string) => {
		setStatus(null);
		try {
			await apiRequest("v1/friends/requests", {
				method: "POST",
				body: JSON.stringify({ userID }),
			});
			setStatus("Friend request sent.");
			setResults((current) =>
				current.map((result) =>
					result.profile.userID === userID
						? { ...result, relationship: "pendingOutgoing" }
						: result,
				),
			);
		} catch (error) {
			setStatus((error as Error).message);
		}
	};

	return (
		<div class={styles.detailDrawer}>
			<header class={styles.detailHeader}>
				<div>
					<h2>Add Friend</h2>
					<p>Search by name or school email.</p>
				</div>
			</header>
			<Input
				class={styles.drawerInput}
				value={query()}
				placeholder="Search friends"
				aria-label="Search friends"
				onChange={(event) => setQuery(event.target.value)}
			/>
			<section class={styles.detailCard}>
				{results().length ? (
					results().map((result) => (
						<div class={styles.searchResult}>
							<ProfilePicture profile={result.profile} size={42} />
							<div>
								<strong>{result.profile.displayName}</strong>
								<span>{result.profile.email}</span>
							</div>
							<Button
								type="button"
								onClick={() => requestFriend(result.profile.userID)}
								disabled={result.relationship !== null}
							>
								{result.relationship === "friends"
									? "Friends"
									: result.relationship
										? "Requested"
										: "Add"}
							</Button>
						</div>
					))
				) : (
					<p class={styles.detailMuted}>
						Enter at least two characters to search.
					</p>
				)}
			</section>
			{status() ? (
				<p class={styles.detailMuted} role="status">
					{status()}
				</p>
			) : null}
		</div>
	);
}
