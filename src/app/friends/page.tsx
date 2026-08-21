"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
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
import { useTimetableNow } from "@/features/timetable/clock";
import { friendScheduleTitle } from "@/features/timetable/friendSchedule";

export default function FriendsPage() {
	const setToolbar = useToolbar();
	const [friends, setFriends] = useState<Friend[]>([]);
	const [account, setAccount] = useState<Account | null>(null);
	const [locationStatus, setLocationStatus] =
		useState<CurrentLocationStatus["item"]>(null);
	const [incomingRequestCount, setIncomingRequestCount] = useState(0);
	const [searchText, setSearchText] = useState("");
	const [movingFriendID, setMovingFriendID] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const { openDrawer } = useDrawer();
	const now = useTimetableNow();
	const filteredFriends = useMemo(() => {
		const query = searchText.trim().toLocaleLowerCase();
		if (!query) {
			return friends;
		}

		return friends.filter((friend) =>
			[friend.friend.displayName, friend.friend.email].some((value) =>
				value.toLocaleLowerCase().includes(query),
			),
		);
	}, [friends, searchText]);

	const moveFriend = async (friendID: string, offset: -1 | 1) => {
		const index = friends.findIndex(
			(friend) => friend.friend.userID === friendID,
		);
		const targetIndex = index + offset;
		if (index < 0 || targetIndex < 0 || targetIndex >= friends.length) return;

		const next = [...friends];
		[next[index], next[targetIndex]] = [next[targetIndex], next[index]];
		setFriends(next);
		setMovingFriendID(friendID);
		try {
			const saved = await apiRequest<Friend[]>("v1/friends/order", {
				method: "PUT",
				body: JSON.stringify({
					friendIDs: next.map((friend) => friend.friend.userID),
				}),
			});
			setFriends(saved);
		} catch (requestError) {
			setFriends(friends);
			setError((requestError as Error).message);
		} finally {
			setMovingFriendID(null);
		}
	};

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
		apiRequest<Friend[]>("v1/friends/requests")
			.then((requests) => setIncomingRequestCount(requests.length))
			.catch(() => setIncomingRequestCount(0));
	}, [setToolbar]);

	return (
		<main className={styles.page}>
			<div className={styles.friendActions}>
				<Button
					type="button"
					aria-label={
						incomingRequestCount
							? `${incomingRequestCount} pending friend requests`
							: "Friend requests, no pending requests"
					}
					onClick={() => openDrawer(<FriendRequestsDrawer />)}
				>
					<Symbol
						name={incomingRequestCount ? "bell.badge" : "bell"}
						className={styles.friendActionIcon}
					/>
					{incomingRequestCount ? (
						<span className={styles.requestCount} aria-hidden="true">
							{incomingRequestCount}
						</span>
					) : null}
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
			<label className={styles.searchLabel} htmlFor="friends-search">
				Search friends
			</label>
			<Input
				id="friends-search"
				className={styles.searchInput}
				value={searchText}
				placeholder="Search by name or school email"
				onChange={(event) => setSearchText(event.target.value)}
			/>
			{account ? (
				<Button
					type="button"
					className={styles.selfCard}
					aria-label="Open your arrival statistics"
					onClick={() =>
						openDrawer(
							<PersonalArrivalDrawer onStatusUpdated={setLocationStatus} />,
						)
					}
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
				{filteredFriends.length ? (
					filteredFriends.map((friend) => {
						const index = friends.indexOf(friend);
						return (
					<div key={friend.relationshipID} className={styles.friendRow}>
						<DrawerTrigger
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
									<p>{locationStatusTitle(friend.locationStatus?.state)}</p>
									<span>
										{friendScheduleTitle(friend.timetable?.subjects ?? [], now)}
									</span>
								</div>
								<strong className={styles.status}>
									{friend.state === "friends" ? "Friends" : "Pending"}
								</strong>
							</article>
						</DrawerTrigger>
						<div className={styles.reorderActions}>
							<Button
								type="button"
								size="icon-xs"
								disabled={index === 0 || movingFriendID !== null}
								aria-label={`Move ${friend.friend.displayName} up`}
								onClick={() => void moveFriend(friend.friend.userID, -1)}
							>
								<Symbol name="chevron.up" />
							</Button>
							<Button
								type="button"
								size="icon-xs"
								disabled={
									index === friends.length - 1 || movingFriendID !== null
								}
								aria-label={`Move ${friend.friend.displayName} down`}
								onClick={() => void moveFriend(friend.friend.userID, 1)}
							>
								<Symbol name="chevron.down" />
							</Button>
						</div>
						</div>
						);
					})
				) : (
					<p className={styles.emptyState}>
						{friends.length ? "No friends match your search." : "No friends yet."}
					</p>
				)}
			</div>
		</main>
	);
}

function PersonalArrivalDrawer({
	onStatusUpdated,
}: {
	onStatusUpdated: (status: CurrentLocationStatus["item"]) => void;
}) {
	type ArrivalStatistics = {
		averageArrivalSecondsSinceMidnight: number | null;
		weekdayAverageArrivalSecondsSinceMidnight: Array<number | null>;
	};
	const [statistics, setStatistics] = useState<ArrivalStatistics | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [updatingLocation, setUpdatingLocation] = useState(false);

	useEffect(() => {
		apiRequest<ArrivalStatistics>("v1/account/status/statistics")
			.then(setStatistics)
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	const updateLocation = () => {
		if (!navigator.geolocation) {
			setError("Location updates are not supported by this browser.");
			return;
		}

		setUpdatingLocation(true);
		setError(null);
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const item = {
					state: locationStateForDistance(
						distanceFromSchool(
							position.coords.latitude,
							position.coords.longitude,
						),
					),
					updatedAt: new Date(position.timestamp).toISOString(),
				};

				void apiRequest("v1/account/status", {
					method: "POST",
					body: JSON.stringify(item),
				})
					.then(() => onStatusUpdated(item))
					.catch((requestError: Error) => setError(requestError.message))
					.finally(() => setUpdatingLocation(false));
			},
			(positionError) => {
				setUpdatingLocation(false);
				setError(locationErrorMessage(positionError));
			},
			{ enableHighAccuracy: false, maximumAge: 60_000, timeout: 15_000 },
		);
	};

	return (
		<section aria-labelledby="arrival-statistics-title">
			<h2 id="arrival-statistics-title">Average arrival</h2>
			<Button
				type="button"
				onClick={updateLocation}
				disabled={updatingLocation}
				aria-label="Update your location status"
			>
				<Symbol name="location.fill" />
				{updatingLocation ? "Updating location…" : "Update location status"}
			</Button>
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

const schoolLocation = {
	latitude: -31.944462605584388,
	longitude: 115.8380028573902,
};

function distanceFromSchool(latitude: number, longitude: number) {
	const earthRadius = 6_371_000;
	const latitudeDelta = degreesToRadians(latitude - schoolLocation.latitude);
	const longitudeDelta = degreesToRadians(longitude - schoolLocation.longitude);
	const firstLatitude = degreesToRadians(schoolLocation.latitude);
	const secondLatitude = degreesToRadians(latitude);
	const haversine =
		Math.sin(latitudeDelta / 2) ** 2 +
		Math.cos(firstLatitude) *
			Math.cos(secondLatitude) *
			Math.sin(longitudeDelta / 2) ** 2;

	return (
		2 *
		earthRadius *
		Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
	);
}

function degreesToRadians(value: number) {
	return (value * Math.PI) / 180;
}

function locationStateForDistance(distance: number): LocationStatus {
	if (distance <= 225) return "onCampus";
	if (distance <= 1_500) return "withinFiveMinutes";
	if (distance <= 3_500) return "withinTenMinutes";
	return "offCampus";
}

function locationErrorMessage(error: GeolocationPositionError) {
	switch (error.code) {
		case error.PERMISSION_DENIED:
			return "Location permission was denied. Allow it in your browser settings to update status.";
		case error.POSITION_UNAVAILABLE:
			return "Your location is currently unavailable.";
		case error.TIMEOUT:
			return "Location lookup timed out. Try again.";
		default:
			return "Timetable could not determine your location.";
	}
}
