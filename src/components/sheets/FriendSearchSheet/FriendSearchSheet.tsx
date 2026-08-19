"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useEffect, useState } from "react";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import { apiRequest } from "@/lib/api/client";
import type { FriendSearchResult } from "@/features/timetable/types";
import styles from "../Sheet/Sheet.module.css";

export default function FriendSearchSheet() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<FriendSearchResult[]>([]);
	const [status, setStatus] = useState<string | null>(null);

	useEffect(() => {
		if (query.trim().length < 2) {
			setResults([]);
			return;
		}
		const timer = window.setTimeout(() => {
			apiRequest<FriendSearchResult[]>(
				`v1/friends/search?q=${encodeURIComponent(query.trim())}`,
			)
				.then(setResults)
				.catch((error: Error) => setStatus(error.message));
		}, 180);
		return () => window.clearTimeout(timer);
	}, [query]);

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
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<div>
					<h2>Add Friend</h2>
					<p>Search by name or school email.</p>
				</div>
			</header>
			<Input
				className={styles.sheetInput}
				value={query}
				placeholder="Search friends"
				aria-label="Search friends"
				onChange={(event) => setQuery(event.target.value)}
			/>
			<section className={styles.detailCard}>
				{results.length ? (
					results.map((result) => (
						<div key={result.profile.userID} className={styles.searchResult}>
							<ProfilePicture profile={result.profile} size={42} />
							<div>
								<strong>{result.profile.displayName}</strong>
								<span>{result.profile.email}</span>
							</div>
							<Button
								unstyled
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
					<p className={styles.detailMuted}>
						Enter at least two characters to search.
					</p>
				)}
			</section>
			{status ? (
				<p className={styles.detailMuted} role="status">
					{status}
				</p>
			) : null}
		</div>
	);
}
