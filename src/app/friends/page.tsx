"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import type { Friend } from "@/features/timetable/types";
import DrawerTrigger from "@/components/drawers/DrawerTrigger/DrawerTrigger";
import FriendDetailDrawer from "@/components/drawers/FriendDetailDrawer/FriendDetailDrawer";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import Symbol from "@/components/controls/Symbol/Symbol";
import FriendSearchDrawer from "@/components/drawers/FriendSearchDrawer/FriendSearchDrawer";
import FriendRequestsDrawer from "@/components/drawers/FriendRequestsDrawer/FriendRequestsDrawer";
import type { Account } from "@/lib/api/contracts";
import styles from "./page.module.css";

export default function FriendsPage() {
	const setToolbar = useToolbar();
	const [friends, setFriends] = useState<Friend[]>([]);
	const [account, setAccount] = useState<Account | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { openDrawer } = useDrawer();

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
				<Button
					type="button"
					aria-label="Friend requests"
					onClick={() => openDrawer(<FriendRequestsDrawer />)}
				>
					<Symbol name="bell.badge" className={styles.friendActionIcon} />
				</Button>
				<Button
					type="button"
					aria-label="Add friend"
					onClick={() => openDrawer(<FriendSearchDrawer />)}
				>
					<Symbol name="plus" className={styles.friendActionIcon} />
				</Button>
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
					<DrawerTrigger
						key={friend.relationshipID}
						className={styles.friendButton}
						ariaLabel={`Open ${friend.friend.displayName}`}
						content={<FriendDetailDrawer friend={friend} />}
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
					</DrawerTrigger>
				))}
			</div>
		</main>
	);
}
