"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import type {
	CurrentLocationStatus,
	Friend,
	LocationStatus,
} from "@/features/timetable/types";
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
	const [locationStatus, setLocationStatus] =
		useState<CurrentLocationStatus["item"]>(null);
	const [error, setError] = useState<string | null>(null);
	const { openDrawer } = useDrawer();

	useEffect(() => {
		setToolbar({ title: "Friends" });
		Promise.all([
			apiRequest<Friend[]>("v1/friends"),
			apiRequest<Account>("v1/account"),
			apiRequest<CurrentLocationStatus>("v1/account/status"),
		])
			.then(([friendList, currentAccount, currentLocationStatus]) => {
				setFriends(friendList);
				setAccount(currentAccount);
				setLocationStatus(currentLocationStatus.item);
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
				<Button
					type="button"
					className={styles.selfCard}
					aria-label="Open your arrival statistics"
					onClick={() => openDrawer(<PersonalArrivalDrawer />)}
				>
					<ProfilePicture profile={account} size={68} />
					<div>
						<strong>{account.displayName}</strong>
						<span>{locationStatusTitle(locationStatus?.state)}</span>
					</div>
					<em>{locationStatusTime(locationStatus)}</em>
				</Button>
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

function PersonalArrivalDrawer() {
	type ArrivalStatistics = {
		averageArrivalSecondsSinceMidnight: number | null;
		weekdayAverageArrivalSecondsSinceMidnight: Array<number | null>;
	};
	const [statistics, setStatistics] = useState<ArrivalStatistics | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiRequest<ArrivalStatistics>("v1/account/status/statistics")
			.then(setStatistics)
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	return (
		<section aria-labelledby="arrival-statistics-title">
			<h2 id="arrival-statistics-title">Average arrival</h2>
			<div>
				<strong>Overall</strong>
				<span>
					{formatArrival(statistics?.averageArrivalSecondsSinceMidnight)}
				</span>
			</div>
			{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
				(day, index) => (
					<div key={day}>
						<strong>{day}</strong>
						<span>
							{formatArrival(
								statistics?.weekdayAverageArrivalSecondsSinceMidnight[index],
							)}
						</span>
					</div>
				),
			)}
			{error ? <p role="alert">{error}</p> : null}
		</section>
	);
}

function locationStatusTitle(state?: LocationStatus) {
	switch (state) {
		case "onCampus":
			return "On Campus";
		case "withinFiveMinutes":
			return "Within 5 mins";
		case "withinTenMinutes":
			return "Within 10 mins";
		case "offCampus":
			return "Off Campus";
		default:
			return "Unavailable";
	}
}

function locationStatusTime(status: CurrentLocationStatus["item"]) {
	if (!status) {
		return "Status unavailable";
	}

	const prefix =
		status.state === "onCampus"
			? "Arrived"
			: status.state === "offCampus"
				? "Left"
				: "Updated";

	return `${prefix}: ${new Date(status.updatedAt).toLocaleTimeString("en-AU", {
		hour: "numeric",
		minute: "2-digit",
	})}`;
}

function formatArrival(seconds?: number | null) {
	if (seconds == null) {
		return "No data";
	}

	const totalMinutes = Math.round(seconds / 60);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	const period = hours >= 12 ? "pm" : "am";
	const displayHour = hours % 12 || 12;

	return `${displayHour}:${String(minutes).padStart(2, "0")} ${period}`;
}
