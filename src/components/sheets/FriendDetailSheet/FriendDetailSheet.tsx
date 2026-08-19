import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import type { Friend, FriendDetail } from "@/features/timetable/types";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import SettingToggle from "@/components/controls/SettingToggle/SettingToggle";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import {
	TIMETABLE_DAYS,
	TIMETABLE_SESSIONS,
} from "@/features/timetable/layout";
import styles from "../Sheet/Sheet.module.css";

const tabs = [
	{ value: "main", label: "Overview", symbol: "person.crop.circle" },
	{ value: "week", label: "Week", symbol: "7.calendar" },
	{ value: "info", label: "Notifications", symbol: "bell" },
] as const;

export default function FriendDetailSheet({ friend }: { friend: Friend }) {
	const [detail, setDetail] = useState<FriendDetail | null>(null);
	const [tab, setTab] = useState<"main" | "week" | "info">("main");
	const [error, setError] = useState<string | null>(null);
	const status = friend.locationStatus?.state ?? "Unavailable";
	const subjects =
		detail?.timetable?.subjects ?? friend.timetable?.subjects ?? [];

	useEffect(() => {
		apiRequest<FriendDetail>(`v1/friends/${friend.friend.userID}`)
			.then(setDetail)
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

	return (
		<div className={styles.detailSheet}>
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
			<nav className={styles.detailTabs} aria-label="Friend details">
				{tabs.map(({ value, label, symbol }) => (
					<Button
						unstyled
						key={value}
						type="button"
						className={tab === value ? styles.detailTabActive : ""}
						onClick={() => setTab(value)}
						role="tab"
						aria-selected={tab === value}
					>
						<Symbol name={symbol} />
						{label}
					</Button>
				))}
			</nav>
			{tab === "main" ? (
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
						<strong>School&apos;s Out</strong>
					</div>
				</section>
			) : null}
			{tab === "main" ? (
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
			) : null}
			{tab === "week" ? (
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
			) : null}
			{tab === "info" ? (
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
				</section>
			) : null}
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}
