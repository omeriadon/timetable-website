"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar";
import { apiRequest } from "@/lib/api/client";
import type { Friend } from "@/features/timetable/types";
import styles from "./page.module.css";

export default function FriendsPage() {
	const setToolbar = useToolbar();
	const [friends, setFriends] = useState<Friend[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setToolbar({ title: "Friends" });
		apiRequest<Friend[]>("v1/friends")
			.then(setFriends)
			.catch((requestError: Error) => setError(requestError.message));
	}, [setToolbar]);

	return (
		<main className={styles.page}>
			<h1>Friends</h1>
			{error ? <p className={styles.error}>{error}</p> : null}
			<div className={styles.list}>
				{friends.map((friend) => (
					<article key={friend.relationshipID} className={styles.friend}>
						<div className={styles.avatar}>{friend.friend.displayName.slice(0, 2).toUpperCase()}</div>
						<div>
							<h2>{friend.friend.displayName}</h2>
							<p>{friend.locationStatus?.state ?? "Unavailable"}</p>
							<span>Next: {friend.timetable?.subjects[0]?.id ?? "No timetable shared"}</span>
						</div>
						<strong className={styles.status}>{friend.state === "friends" ? "Friends" : "Pending"}</strong>
					</article>
				))}
			</div>
		</main>
	);
}
