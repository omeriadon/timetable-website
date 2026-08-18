"use client";

import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import { apiRequest } from "@/lib/api/client";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import TimetableEditorSheet from "@/components/sheets/TimetableEditorSheet/TimetableEditorSheet";
import type {
  OwnerTimetable,
  TimetableSubject,
} from "@/features/timetable/types";
import { TIMETABLE_DAYS, TIMETABLE_SESSIONS } from "@/features/timetable/layout";

export const dynamic = "force-dynamic";

export default function Timetable() {
  const [timetable, setTimetable] = useState<OwnerTimetable | null>(null);
  const [error, setError] = useState<string | null>(null);
  const setToolbar = useToolbar();
  const { openSheet } = useSheet();

  useEffect(() => {
		setToolbar({ title: "Timetable" });
    apiRequest<OwnerTimetable>("v1/timetables/owner")
      .then(setTimetable)
      .catch((requestError: Error) => setError(requestError.message));
  }, [setToolbar]);

  return (
    <main className={styles.contentPanel}>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {timetable ? (
        <>
          <div className={styles.actions}><button type="button" onClick={() => openSheet(<TimetableEditorSheet timetable={timetable} onSaved={setTimetable} />)}>Edit Timetable</button></div>
          <WeekTimetable subjects={timetable.subjects} />
        </>
      ) : (
        <p className={styles.message}>Loading timetable…</p>
      )}
    </main>
  );
}

function WeekTimetable({ subjects }: { subjects: TimetableSubject[] }) {
  const days = TIMETABLE_DAYS;
  return (
    <section className={styles.week} aria-label="Weekly timetable">
      <div className={styles.weekHeader}>
        {days.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className={styles.weekGrid}>
        {TIMETABLE_SESSIONS.map((session) => (
          <div key={session.value} className={styles.weekRow}>
            <small>{session.label}</small>
            {days.map((day, dayIndex) => {
              const subject = subjects.find((item) =>
                item.slots.some(
                  (slot) =>
                    slot.day === dayIndex &&
                    slot.session === session.value,
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
