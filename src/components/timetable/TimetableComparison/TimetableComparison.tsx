"use client";

import type {
	Friend,
	TimetableSlot,
	TimetableSubject,
} from "@/features/timetable/types";
import ProfilePicture from "@/components/controls/ProfilePicture/ProfilePicture";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "./TimetableComparison.module.css";

type TimetableComparisonProps = {
	selectedSlot: TimetableSlot | null;
	friends: Friend[];
};

export default function TimetableComparison({
	selectedSlot,
	friends,
}: TimetableComparisonProps) {
	if (!selectedSlot) return null;

	const comparableFriends = friends.filter((friend) => friend.timetable);
	if (!comparableFriends.length) {
		return (
			<section className={styles.empty}>
				<strong>No Friend Timetables</strong>
				<span>Add a friend to compare their timetable with yours here.</span>
			</section>
		);
	}

	return (
		<section
			className={styles.comparison}
			aria-label="Friend timetable comparison"
		>
			{comparableFriends.map((friend) => {
				const subject = subjectAtSlot(
					friend.timetable?.subjects ?? [],
					selectedSlot,
				);
				return subject ? (
					<article key={friend.relationshipID} className={styles.friendSubject}>
						<ProfilePicture
							profile={friend.friend}
							size={28}
							label={`${friend.friend.displayName} profile picture`}
						/>
						<span>{friend.friend.displayName}</span>
						<strong>
							<Symbol name={subject.symbol} className={styles.subjectSymbol} />{" "}
							{subject.id}
						</strong>
					</article>
				) : (
					<div key={friend.relationshipID} className={styles.freePeriod}>
						<span>{friend.friend.displayName}</span>
						<strong>Free period</strong>
					</div>
				);
			})}
		</section>
	);
}

function subjectAtSlot(subjects: TimetableSubject[], slot: TimetableSlot) {
	return subjects.find((subject) =>
		subject.slots.some(
			(candidate) =>
				candidate.day === slot.day && candidate.session === slot.session,
		),
	);
}
