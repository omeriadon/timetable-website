"use client";

import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar";
import { apiRequest } from "@/lib/api/client";
import type { Friend } from "@/features/timetable/types";
import SheetTrigger from "@/components/sheets/SheetTrigger";
import FriendDetailSheet from "@/components/sheets/FriendDetailSheet";
import ProfilePicture from "@/components/controls/ProfilePicture";
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
      {error ? <p className={styles.error}>{error}</p> : null}
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
