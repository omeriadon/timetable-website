import type { TimetableSubject } from "@/features/timetable/types";
import { periodLabel } from "@/features/timetable/layout";
import styles from "../Sheet/Sheet.module.css";

type SubjectContextSheetProps = {
  owner: string;
  subject: TimetableSubject;
  day?: string;
  session?: number;
};

export default function SubjectContextSheet({
  owner,
  subject,
  day,
  session,
}: SubjectContextSheetProps) {
  return (
    <div className={styles.detailSheet}>
      <header className={styles.detailHeader}>
        <div
          className={styles.detailSubjectSymbol}
          style={{ background: subjectColour(subject) }}
        >
          {subject.symbol}
        </div>
        <div>
          <span className={styles.detailEyebrow}>{owner}</span>
          <h2>{subject.id}</h2>
          <p>
            {day && session !== undefined
              ? `${day}, period ${periodLabel(session)}`
              : `${subject.slots.length} classes each week`}
          </p>
        </div>
      </header>
      <section className={styles.detailCard}>
        <div className={styles.detailRow}>
          <span>Classroom</span>
          <strong>{classroomName(subject.classroom)}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Teacher</span>
          <strong>{teacherName(subject.teacher)}</strong>
        </div>
        {!day && subject.slots.length
          ? subject.slots.map((slot) => (
              <div
                key={`${slot.day}-${slot.session}`}
                className={styles.detailRow}
              >
                <span>{dayName(slot.day)}</span>
                <strong>Period {periodLabel(slot.session)}</strong>
              </div>
            ))
          : null}
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

function subjectColour(subject: TimetableSubject) {
  return `rgb(${Math.round(subject.colour.r * 255)} ${Math.round(subject.colour.g * 255)} ${Math.round(subject.colour.b * 255)})`;
}
