"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import { apiRequest } from "@/lib/api/client";
import type { Friend } from "@/features/timetable/types";
import SheetTrigger from "@/components/sheets/SheetTrigger/SheetTrigger";
import FriendDetailSheet from "@/components/sheets/FriendDetailSheet/FriendDetailSheet";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import FriendSearchSheet from "@/components/sheets/FriendSearchSheet/FriendSearchSheet";
import FriendRequestsSheet from "@/components/sheets/FriendRequestsSheet/FriendRequestsSheet";
import type { Account } from "@/lib/api/contracts";
import styles from "./page.module.css";

export default function FriendsPage() {
	const setToolbar = useToolbar();
	const [friends, setFriends] = useState<Friend[]>([]);
	const [account, setAccount] = useState<Account | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { openSheet } = useSheet();

	useEffect(() => {
		setToolbar({ title: "Friends" });
		Promise.all([
			apiRequest<Friend[]>("v1/friends"),
			apiRequest<Account>("v1/account"),
		])
			.then(([friendList, currentAccount]) => {
				setFriends(friendList);
				setAccount(currentAccount);
			})
			.catch((requestError: Error) => setError(requestError.message));
	}, [setToolbar]);

	return (
		<main className={styles.page}>
			<div className={styles.friendActions}>
				<button
					type="button"
					className={styles.circleAction}
					aria-label="Friend requests"
					onClick={() => openSheet(<FriendRequestsSheet />)}
				>
					<SymbolIcon name="bell.badge" />
				</button>
				<button
					type="button"
					className={styles.circleAction}
					aria-label="Add friend"
					onClick={() => openSheet(<FriendSearchSheet />)}
				>
					＋
				</button>
			</div>
			{error ? <p className={styles.error}>{error}</p> : null}
			{account ? (
				<section className={styles.selfCard}>
					<ProfilePicture profile={account} size={68} />
					<div>
						<strong>{account.displayName}</strong>
						<span>Off Campus</span>
					</div>
					<em>Left: 6:54 pm</em>
				</section>
			) : null}
			<div className={styles.list}>
				{friends.map((friend) => (
					<SheetTrigger
						key={friend.relationshipID}
						className={styles.friendButton}
						ariaLabel={`Open ${friend.friend.displayName}`}
						content={<FriendDetailSheet friend={friend} />}
					>
						<article className={styles.friend}>
							<ProfilePicture
								profile={friend.friend}
								size={64}
								label={`${friend.friend.displayName} profile picture`}
							/>
							<div>
								<h2>{friend.friend.displayName}</h2>
								<p>{friend.locationStatus?.state ?? "Unavailable"}</p>
								<span>
									Next:{" "}
									{friend.timetable?.subjects[0]?.id ?? "No timetable shared"}
								</span>
							</div>
							<strong className={styles.status}>
								{friend.state === "friends" ? "Friends" : "Pending"}
							</strong>
						</article>
					</SheetTrigger>
				))}
			</div>
		</main>
	);
}
