import { Button } from "@/components/ui/button";
import { createSignal, onMount } from "solid-js";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import { apiRequest } from "@/lib/api/client";
import type { Friend } from "@/features/timetable/types";
import styles from "../Drawer/Drawer.module.css";

export default function FriendRequestsDrawer() {
	const [incoming, setIncoming] = createSignal<Friend[]>([]);
	const [outgoing, setOutgoing] = createSignal<Friend[]>([]);
	const [status, setStatus] = createSignal<string | null>(null);

	onMount(() => {
		Promise.all([
			apiRequest<Friend[]>("v1/friends/requests"),
			apiRequest<Friend[]>("v1/friends/requests/outgoing"),
		])
			.then(([received, sent]) => {
				setIncoming(received);
				setOutgoing(sent);
			})
			.catch((error: Error) => setStatus(error.message));
	});

	const accept = async (relationshipID: string) => {
		try {
			await apiRequest(`v1/friends/requests/${relationshipID}/accept`, {
				method: "POST",
			});
			setIncoming((current) =>
				current.filter((friend) => friend.relationshipID !== relationshipID),
			);
		} catch (error) {
			setStatus((error as Error).message);
		}
	};

	const remove = async (relationshipID: string, incomingRequest: boolean) => {
		try {
			await apiRequest(`v1/friends/requests/${relationshipID}`, {
				method: "DELETE",
			});
			if (incomingRequest) {
				setIncoming((current) =>
					current.filter((friend) => friend.relationshipID !== relationshipID),
				);
			} else {
				setOutgoing((current) =>
					current.filter((friend) => friend.relationshipID !== relationshipID),
				);
			}
		} catch (error) {
			setStatus((error as Error).message);
		}
	};

	return (
		<div class={styles.detailDrawer}>
			<header class={styles.detailHeader}>
				<div>
					<h2>Friend Requests</h2>
					<p>Review incoming requests and pending invitations.</p>
				</div>
			</header>
			<section class={styles.detailCard}>
				<h3>Incoming</h3>
				{incoming().length ? (
					incoming().map((friend) => (
						<div class={styles.searchResult}>
							<ProfilePicture profile={friend.friend} size={40} />
							<div>
								<strong>{friend.friend.displayName}</strong>
								<span>{friend.friend.email}</span>
							</div>
							<Button
								type="button"
								onClick={() => void accept(friend.relationshipID)}
							>
								Accept
							</Button>
							<Button
								type="button"
								onClick={() => void remove(friend.relationshipID, true)}
							>
								Decline
							</Button>
						</div>
					))
				) : (
					<p class={styles.detailMuted}>No incoming requests.</p>
				)}
			</section>
			<section class={styles.detailCard}>
				<h3>Outgoing</h3>
				{outgoing().length ? (
					outgoing().map((friend) => (
						<div class={styles.searchResult}>
							<ProfilePicture profile={friend.friend} size={40} />
							<div>
								<strong>{friend.friend.displayName}</strong>
								<span>{friend.friend.email}</span>
							</div>
							<Button
								type="button"
								onClick={() => void remove(friend.relationshipID, false)}
							>
								Cancel
							</Button>
						</div>
					))
				) : (
					<p class={styles.detailMuted}>No outgoing requests.</p>
				)}
			</section>
			{status() ? (
				<p class={styles.detailMuted} role="alert">
					{status()}
				</p>
			) : null}
		</div>
	);
}
