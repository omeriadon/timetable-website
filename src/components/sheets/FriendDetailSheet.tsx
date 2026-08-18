import type { Friend } from "@/features/timetable/types";
import ProfilePicture from "@/components/controls/ProfilePicture";
import styles from "./Sheet.module.css";

export default function FriendDetailSheet({ friend }: { friend: Friend }) {
	const status = friend.locationStatus?.state ?? "Unavailable";
	const subjects = friend.timetable?.subjects ?? [];

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
				<span className={styles.detailTabActive}>Main</span>
				<span>Week</span>
				<span>Info</span>
			</nav>
			<section className={styles.detailCard}>
				<div className={styles.detailRow}>
					<span>Location</span>
					<strong>{status}</strong>
				</div>
				<div className={styles.detailRow}>
					<span>School status</span>
					<strong>School&apos;s Out</strong>
				</div>
			</section>
			<section className={styles.detailCard}>
				<h3>Shared Subjects</h3>
				{subjects.length ? (
					subjects.slice(0, 6).map((subject) => (
						<div key={subject.id} className={styles.detailSubject}>
							<span>{subject.symbol}</span>
							<strong>{subject.id}</strong>
						</div>
					))
				) : (
					<p className={styles.detailMuted}>No shared classes.</p>
				)}
			</section>
		</div>
	);
}
