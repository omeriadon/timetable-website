import { Tabs } from "@base-ui/react/tabs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
	Friend,
	FriendDetail,
	LocationStatus,
} from "@/features/timetable/types";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import SettingToggle from "@/components/controls/SettingToggle/SettingToggle";
import Symbol from "@/components/controls/Symbol/Symbol";
import ConfirmationDrawer from "@/components/drawers/ConfirmationDrawer/ConfirmationDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { apiRequest } from "@/lib/api/client";
import {
	TIMETABLE_DAYS,
	TIMETABLE_SESSIONS,
} from "@/features/timetable/layout";
import styles from "../Drawer/Drawer.module.css";

const tabs = [
	{ value: "main", label: "Overview", symbol: "person.crop.circle" },
	{ value: "week", label: "Week", symbol: "7.calendar" },
	{ value: "info", label: "Notifications", symbol: "bell" },
] as const;

export default function FriendDetailDrawer({ friend }: { friend: Friend }) {
	const [detail, setDetail] = useState<FriendDetail | null>(null);
	const [tab, setTab] = useState<"main" | "week" | "info">("main");
	const [error, setError] = useState<string | null>(null);
	const [friendsSinceDate, setFriendsSinceDate] = useState("");
	const [isSavingFriendsSince, setIsSavingFriendsSince] = useState(false);
	const { openDrawer, closeDrawer } = useDrawer();
	const status = locationStatusTitle(friend.locationStatus?.state);
	const subjects =
		detail?.timetable?.subjects ?? friend.timetable?.subjects ?? [];

	useEffect(() => {
		apiRequest<FriendDetail>(`v1/friends/${friend.friend.userID}`)
			.then((nextDetail) => {
				setDetail(nextDetail);
				setFriendsSinceDate(nextDetail.acceptedAt.slice(0, 10));
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
			<div className={styles.drawerActions}>
				<Button
					type="button"
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
			</div>
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
			<Tabs.Panel value="main">
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
						<strong>{schoolStatus(subjects)}</strong>
					</div>
				</section>
				<section className={styles.detailCard}>
					<h3>Shared Subjects</h3>
					{subjects.length ? (
						subjects.slice(0, 6).map((subject) => (
							<div key={subject.id} className={styles.detailSubject}>
								<Symbol
									name={subject.symbol}
									className={styles.detailSubjectSymbolIcon}
								/>
								<strong>{subject.id}</strong>
							</div>
						))
					) : (
						<p className={styles.detailMuted}>No shared classes.</p>
					)}
				</section>
			</Tabs.Panel>
			<Tabs.Panel value="week">
				<section className={styles.detailCard}>
					<h3>Week</h3>
					<div className={styles.friendWeekGrid}>
						{TIMETABLE_DAYS.map((day, dayIndex) => (
							<div key={day}>
								<strong>{day}</strong>
								{TIMETABLE_SESSIONS.filter(
									(session) => session.value !== 2 && session.value !== 5,
								).map((session) => {
									const subject = subjects.find((item) =>
										item.slots.some(
											(slot) =>
												slot.day === dayIndex && slot.session === session.value,
										),
									);
									return subject ? (
										<span key={session.value}>{subject.id}</span>
									) : null;
								})}
							</div>
						))}
					</div>
				</section>
			</Tabs.Panel>
			<Tabs.Panel value="info">
				<section className={styles.detailCard}>
					<h3>Location notifications</h3>
					<SettingToggle
						label="Within 10 mins"
						enabled={
							detail?.locationNotificationPreferences.includes(
								"withinTenMinutes",
							) ?? false
						}
						onClick={() => void updatePreference("withinTenMinutes")}
					/>
					<SettingToggle
						label="Within 5 mins"
						enabled={
							detail?.locationNotificationPreferences.includes(
								"withinFiveMinutes",
							) ?? false
						}
						onClick={() => void updatePreference("withinFiveMinutes")}
					/>
					<SettingToggle
						label="Arrived"
						enabled={
							detail?.locationNotificationPreferences.includes("arrived") ??
							false
						}
						onClick={() => void updatePreference("arrived")}
					/>
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
					<Button
						type="button"
						onClick={() => void saveFriendsSince()}
						disabled={isSavingFriendsSince || !friendsSinceDate}
						aria-label="Save friends since date"
					>
						<Symbol name="checkmark" />
						{isSavingFriendsSince ? "Saving…" : "Save date"}
					</Button>
				</section>
			</Tabs.Panel>
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
		</Tabs.Root>
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

function schoolStatus(
	subjects: NonNullable<FriendDetail["timetable"]>["subjects"] | undefined,
) {
	if (!subjects?.length) {
		return "No timetable";
	}

	const day = new Date().getDay() - 1;
	if (day < 0 || day > 4) {
		return "School's Out";
	}

	const hasClassesToday = subjects.some((subject) =>
		subject.slots.some((slot) => slot.day === day),
	);

	return hasClassesToday ? "Scheduled today" : "School's Out";
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
