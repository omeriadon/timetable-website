import type { TimetableSubject } from "@/features/timetable/types";
import {
  TIMETABLE_DAYS,
  TIMETABLE_SESSIONS,
} from "@/features/timetable/layout";
import styles from "@/app/timetable/page.module.css";

export default function WeekTimetable({
  subjects,
}: {
  subjects: TimetableSubject[];
}) {
  return (
    <section className={styles.week} aria-label="Weekly timetable">
      <div className={styles.weekHeader}>
        {TIMETABLE_DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className={styles.weekGrid}>
        {TIMETABLE_SESSIONS.map((session) => (
          <div key={session.value} className={styles.weekRow}>
            <small>{session.label}</small>
            {TIMETABLE_DAYS.map((day, dayIndex) => {
              const subject = subjects.find((item) =>
                item.slots.some(
                  (slot) =>
                    slot.day === dayIndex && slot.session === session.value,
                ),
              );
              return subject ? (
                <article
                  key={day}
                  className={styles.lesson}
                  style={{
                    background: `rgb(${Math.round(subject.colour.r * 255)} ${Math.round(subject.colour.g * 255)} ${Math.round(subject.colour.b * 255)})`,
                  }}
                >
                  <span>{subject.symbol}</span>
                  <strong>{subject.id}</strong>
                </article>
              ) : (
                <div key={day} />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
