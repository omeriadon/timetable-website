import { Tabs } from "@base-ui/react/tabs";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
	Friend,
	FriendDetail,
	LocationStatus,
	OwnerTimetable,
	TimetableSubject,
} from "@/features/timetable/types";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import { Toggle } from "@/components/ui/toggle";
import { List, ListRow } from "@/components/ui/list";
import { DrawerFooter } from "@/components/ui/drawer";
import Symbol from "@/components/controls/Symbol/Symbol";
import ConfirmationDrawer from "@/components/drawers/ConfirmationDrawer/ConfirmationDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import {
	TIMETABLE_DAYS,
	TIMETABLE_SESSIONS,
} from "@/features/timetable/layout";
import styles from "../Drawer/Drawer.module.css";
import { useTimetableNow } from "@/features/timetable/clock";
import { friendScheduleTitle } from "@/features/timetable/friendSchedule";

const tabs = [
	{ value: "main", label: "Overview", symbol: "person.crop.circle" },
	{ value: "week", label: "Week", symbol: "7.calendar" },
	{ value: "info", label: "Notifications", symbol: "bell" },
] as const;

export default function FriendDetailDrawer({ friend }: { friend: Friend }) {
	const [detail, setDetail] = useState<FriendDetail | null>(null);
	const [ownerTimetable, setOwnerTimetable] = useState<OwnerTimetable | null>(
		null,
	);
	const [tab, setTab] = useState<"main" | "week" | "info">("main");
	const [error, setError] = useState<string | null>(null);
	const [friendsSinceDate, setFriendsSinceDate] = useState("");
	const [isSavingFriendsSince, setIsSavingFriendsSince] = useState(false);
	const { openDrawer, closeDrawer } = useDrawer();
	const now = useTimetableNow();
	const status = locationStatusTitle(friend.locationStatus?.state);
	const subjects =
		detail?.timetable?.subjects ?? friend.timetable?.subjects ?? [];
	const sharedSubjects = useMemo(() => {
		const ownerSubjectIDs = new Set(
			ownerTimetable?.subjects.map((subject) => subject.id) ?? [],
		);
		return subjects.filter((subject) => ownerSubjectIDs.has(subject.id));
	}, [ownerTimetable?.subjects, subjects]);
	const sharedClasses = useMemo(
		() => sharedClassRows(sharedSubjects, ownerTimetable?.subjects ?? []),
		[ownerTimetable?.subjects, sharedSubjects],
	);

	useEffect(() => {
		Promise.all([
			apiRequest<FriendDetail>(`v1/friends/${friend.friend.userID}`),
			apiRequest<OwnerTimetable>("v1/timetables/owner"),
		])
			.then(([nextDetail, nextOwnerTimetable]) => {
				setDetail(nextDetail);
				setFriendsSinceDate(nextDetail.acceptedAt.slice(0, 10));
				setOwnerTimetable(nextOwnerTimetable);
			})
			.catch((requestError: Error) => setError(requestError.message));
	}, [friend.friend.userID]);

	const updatePreference = async (
		preference: "withinTenMinutes" | "withinFiveMinutes" | "arrived",
	) => {
		if (!detail) return;
		const previous = detail.locationNotificationPreferences;
		const next = previous.includes(preference)
			? previous.filter((item) => item !== preference)
			: [...previous, preference];
		setDetail({ ...detail, locationNotificationPreferences: next });
		try {
			await apiRequest(
				`v1/friends/${friend.friend.userID}/location-notifications`,
				{
					method: "PUT",
					body: JSON.stringify({ preferences: next }),
				},
			);
		} catch (requestError) {
			setDetail({ ...detail, locationNotificationPreferences: previous });
			setError((requestError as Error).message);
		}
	};

	const saveFriendsSince = async () => {
		if (!friendsSinceDate || isSavingFriendsSince) return;
		setIsSavingFriendsSince(true);
		setError(null);
		try {
			await apiRequest(`v1/friends/${friend.friend.userID}/friends-since`, {
				method: "PUT",
				body: JSON.stringify({
					requestedDate: new Date(
						`${friendsSinceDate}T00:00:00.000Z`,
					).toISOString(),
				}),
			});
			setDetail((current) =>
				current
					? { ...current, acceptedAt: `${friendsSinceDate}T00:00:00.000Z` }
					: current,
			);
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setIsSavingFriendsSince(false);
		}
	};

	const confirmRemove = () => {
		openDrawer(
			<ConfirmationDrawer
				title={`Remove ${friend.friend.displayName}?`}
				message="This removes the friend and their timetable from your account."
				confirmLabel="Remove friend"
				icon="person.badge.minus"
				onConfirm={async () => {
					await apiRequest(`v1/friends/${friend.friend.userID}`, {
						method: "DELETE",
					});
					closeDrawer();
				}}
			/>,
		);
	};

	const confirmReport = () => {
		openDrawer(
			<ConfirmationDrawer
				title={`Report ${friend.friend.displayName}?`}
				message="This sends a report for review. The friend remains visible in your account."
				confirmLabel="Report friend"
				icon="exclamationmark.bubble"
				onConfirm={() =>
					apiRequest("v1/report/user", {
						method: "POST",
						body: JSON.stringify({ reportedAccountID: friend.friend.userID }),
					})
				}
			/>,
		);
	};

	return (
		<Tabs.Root
			className={styles.detailDrawer}
			value={tab}
			onValueChange={(value) => {
				if (value === "main" || value === "week" || value === "info") {
					setTab(value);
				}
			}}
		>
			<header className={styles.detailHeader}>
				<ProfilePicture
					profile={friend.friend}
					size={58}
					label={`${friend.friend.displayName} profile picture`}
				/>
				<div>
					<h2>{friend.friend.displayName}</h2>
					<p>{friend.friend.email}</p>
				</div>
			</header>
			<Tabs.List className={styles.detailTabs} aria-label="Friend details">
				{tabs.map(({ value, label, symbol }) => (
					<Tabs.Tab
						key={value}
						value={value}
						className={
							tab === value
								? `${styles.detailTab} ${styles.detailTabActive}`
								: styles.detailTab
						}
					>
						<Symbol name={symbol} />
						{label}
					</Tabs.Tab>
				))}
			</Tabs.List>
			<Tabs.Panel value="main" className={styles.detailPanel}>
				<section className={styles.detailCard}>
					<div className={styles.detailRow}>
						<span className={styles.detailRowLabel}>
							<Symbol name="location" />
							Location
						</span>
						<strong>{status}</strong>
					</div>
					<div className={styles.detailRow}>
						<span className={styles.detailRowLabel}>
							<Symbol name="building.2" />
							School status
						</span>
						<strong>{friendScheduleTitle(subjects, now)}</strong>
					</div>
				</section>
				<section className={styles.detailSection}>
					<h3>Shared Classes</h3>
					<List>
						{sharedClasses.length ? (
							sharedClasses.map((sharedClass) => (
								<ListRow
									key={`${sharedClass.id}-class`}
									className={styles.detailSubject}
								>
									<Symbol
										name={sharedClass.symbol}
										className={styles.detailSubjectSymbolIcon}
									/>
									<strong>{sharedClass.id}</strong>
									<span>{sharedClass.slotCount} shared classes</span>
								</ListRow>
							))
						) : (
							<p className={styles.detailMuted}>No shared classes.</p>
						)}
					</List>
				</section>
				<section className={styles.detailSection}>
					<h3>Shared Subjects</h3>
					<List>
						{sharedSubjects.length ? (
							sharedSubjects.slice(0, 6).map((subject) => (
								<ListRow key={subject.id} className={styles.detailSubject}>
									<Symbol
										name={subject.symbol}
										className={styles.detailSubjectSymbolIcon}
									/>
									<strong>{subject.id}</strong>
								</ListRow>
							))
						) : (
							<p className={styles.detailMuted}>No shared classes.</p>
						)}
					</List>
				</section>
			</Tabs.Panel>
			<Tabs.Panel value="week" className={styles.detailPanel}>
				<section className={styles.detailCard}>
					<h3>Week</h3>
					<div className={styles.friendWeekGrid}>
						<span aria-hidden="true" />
						{TIMETABLE_DAYS.map((day) => (
							<strong key={day} className={styles.friendWeekDay}>
								{day}
							</strong>
						))}
						{TIMETABLE_SESSIONS.map((session) => (
							<Fragment key={session.value}>
								<strong className={styles.friendWeekSession}>
									{session.label}
								</strong>
								{TIMETABLE_DAYS.map((day, dayIndex) => {
									const subject = subjects.find((item) =>
										item.slots.some(
											(slot) =>
												slot.day === dayIndex && slot.session === session.value,
										),
									);
									return (
										<span
											key={`${day}-${session.value}`}
											className={styles.friendWeekCell}
										>
											{subject?.id ?? ""}
										</span>
									);
								})}
							</Fragment>
						))}
					</div>
				</section>
			</Tabs.Panel>
			<Tabs.Panel value="info" className={styles.detailPanel}>
				<section className={styles.detailCard}>
					<h3>Location notifications</h3>
					<ListRow className={styles.toggleRow}>
						<span>Within 10 mins</span>
						<Toggle
							checked={
								detail?.locationNotificationPreferences.includes(
									"withinTenMinutes",
								) ?? false
							}
							onCheckedChange={() => void updatePreference("withinTenMinutes")}
							aria-label="Within 10 mins"
						/>
					</ListRow>
					<ListRow className={styles.toggleRow}>
						<span>Within 5 mins</span>
						<Toggle
							checked={
								detail?.locationNotificationPreferences.includes(
									"withinFiveMinutes",
								) ?? false
							}
							onCheckedChange={() => void updatePreference("withinFiveMinutes")}
							aria-label="Within 5 mins"
						/>
					</ListRow>
					<ListRow className={styles.toggleRow}>
						<span>Arrived</span>
						<Toggle
							checked={
								detail?.locationNotificationPreferences.includes("arrived") ??
								false
							}
							onCheckedChange={() => void updatePreference("arrived")}
							aria-label="Arrived"
						/>
					</ListRow>
					<div className={styles.detailRow}>
						<span className={styles.detailRowLabel}>
							<Symbol name="person.2" />
							Friends since
						</span>
						<strong>
							{detail?.acceptedAt
								? new Date(detail.acceptedAt).toLocaleDateString("en-AU", {
										day: "numeric",
										month: "short",
										year: "numeric",
									})
								: "—"}
						</strong>
					</div>
					<h3>Average arrival</h3>
					<div className={styles.detailRow}>
						<span>Overall</span>
						<strong>
							{formatArrival(detail?.averageArrivalSecondsSinceMidnight)}
						</strong>
					</div>
					{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
						(day, index) => (
							<div className={styles.detailRow} key={day}>
								<span>{day}</span>
								<strong>
									{formatArrival(
										detail?.weekdayAverageArrivalSecondsSinceMidnight[index],
									)}
								</strong>
							</div>
						),
					)}
					<h3>Friends since</h3>
					<input
						type="date"
						value={friendsSinceDate}
						max={new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)}
						min="2010-01-01"
						aria-label="Friends since date"
						onChange={(event) => setFriendsSinceDate(event.target.value)}
					/>
					<DrawerFooter>
						<Button
							type="button"
							onClick={() => void saveFriendsSince()}
							disabled={isSavingFriendsSince || !friendsSinceDate}
							aria-label="Save friends since date"
						>
							<Symbol name="checkmark" />
							{isSavingFriendsSince ? "Saving…" : "Save date"}
						</Button>
					</DrawerFooter>
				</section>
			</Tabs.Panel>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<DrawerFooter>
				<Button
					type="button"
					variant="destructive"
					onClick={confirmRemove}
					aria-label="Remove friend"
				>
					<Symbol name="person.badge.minus" />
					Remove
				</Button>
				<Button
					type="button"
					onClick={confirmReport}
					aria-label="Report friend"
				>
					<Symbol name="exclamationmark.bubble" />
					Report
				</Button>
			</DrawerFooter>
		</Tabs.Root>
	);
}

function sharedClassRows(
	friendSubjects: TimetableSubject[],
	ownerSubjects: TimetableSubject[],
) {
	return friendSubjects.flatMap((friendSubject) => {
		const ownerSubject = ownerSubjects.find(
			(subject) => subject.id === friendSubject.id,
		);
		if (!ownerSubject) {
			return [];
		}

		const ownerSlots = new Set(
			ownerSubject.slots.map((slot) => `${slot.day}:${slot.session}`),
		);
		const slotCount = friendSubject.slots.filter((slot) =>
			ownerSlots.has(`${slot.day}:${slot.session}`),
		).length;
		return slotCount
			? [{ id: friendSubject.id, symbol: friendSubject.symbol, slotCount }]
			: [];
	});
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
