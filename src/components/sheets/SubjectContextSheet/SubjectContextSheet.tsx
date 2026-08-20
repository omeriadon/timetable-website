import Symbol from "@/components/controls/Symbol/Symbol";
import { periodLabel } from "@/features/timetable/layout";
import type { TimetableSubject } from "@/features/timetable/types";

type SubjectContextSheetProps = {
	owner: string;
	subject: TimetableSubject;
	day?: string;
	session?: number;
};

export default function SubjectContextSheet({
	subject,
	day,
}: SubjectContextSheetProps) {
	return (
		<div>
			<section>
				<div>
					<span>
						<Symbol name="door.left.hand.open" />
						Classroom
					</span>
					<strong>{classroomName(subject.classroom)}</strong>
				</div>

				<div>
					<span>
						<Symbol name="person.fill" />
						Teacher
					</span>
					<strong>{teacherName(subject.teacher)}</strong>
				</div>

				{!day &&
					subject.slots.map((slot) => (
						<div key={`${slot.day}-${slot.session}`}>
							<span>
								<Symbol name="calendar" />
								{dayName(slot.day)}
							</span>
							<strong>Period {periodLabel(slot.session)}</strong>
						</div>
					))}
			</section>
		</div>
	);
}

function teacherName(teacher: TimetableSubject["teacher"]) {
	if (!teacher) return "Not provided";
	if (typeof teacher === "string") return teacher;
	if (teacher.displayName) return teacher.displayName;
	if (teacher.named) return `Teacher: ${teacher.named.lastName}`;

	return teacher.unknown?.rawNotes ?? "Not provided";
}

function classroomName(classroom: TimetableSubject["classroom"]) {
	if (!classroom) return "Not provided";
	if (typeof classroom === "string") return classroom;
	if (classroom.unknown) return classroom.unknown.rawLocation;

	if (classroom.room) {
		const floor = classroom.room.floor ? `, ${classroom.room.floor}` : "";
		return `${classroom.room.building} ${classroom.room.number}${floor}`;
	}

	return "Not provided";
}

function dayName(day: number) {
	return (
		["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][day] ??
		`Day ${day}`
	);
}
