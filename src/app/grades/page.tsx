"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useToolbar } from "@/components/Toolbar";
import styles from "@/components/IOSScreen.module.css";
import { apiRequest } from "@/lib/api/client";
import type {
  GradeTracker,
  OwnerTimetable,
  TimetableSubject,
} from "@/features/timetable/types";

function subjectColour(subject: TimetableSubject) {
  const { r, g, b } = subject.colour;
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;
}

function formatPercent(value: number | null) {
	return value === null ? "—" : `${(value * 100).toFixed(1)}%`;
}

export default function GradesPage() {
  const setToolbar = useToolbar();
  const [grades, setGrades] = useState<GradeTracker | null>(null);
  const [timetable, setTimetable] = useState<OwnerTimetable | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setToolbar({ title: "Grades" });
    Promise.all([
      apiRequest<GradeTracker>("v1/grades"),
      apiRequest<OwnerTimetable>("v1/timetables/owner"),
    ])
      .then(([gradeDocument, ownerTimetable]) => {
        setGrades(gradeDocument);
        setTimetable(ownerTimetable);
      })
      .catch((requestError: Error) => setError(requestError.message));
  }, [setToolbar]);

  const scored = useMemo(() => grades?.document.assessments ?? [], [grades]);
  const average = scored.length
    ? scored.reduce(
        (total, assessment) => total + assessment.score * assessment.weighting,
        0,
      ) / scored.reduce((total, assessment) => total + assessment.weighting, 0)
    : null;

  return (
    <main className={styles.page}>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {!grades || !timetable ? (
        <p className={styles.loading}>Loading grades…</p>
      ) : (
        <>
          <section className={styles.paper} aria-label="Grade summary">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 18,
              }}
            >
              <div>
                <strong
                  style={{
                    color: "var(--theme-text-tertiary)",
                    fontSize: "1.12rem",
                  }}
                >
                  Average
                </strong>
                <div style={{ fontSize: "3rem", fontWeight: 740 }}>
                  {formatPercent(average)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong
                  style={{
                    color: "var(--theme-text-tertiary)",
                    fontSize: "1.12rem",
                  }}
                >
                  Top 4
                </strong>
                <div style={{ fontSize: "3rem", fontWeight: 740 }}>
                  {formatPercent(average)}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 30,
                color: "var(--theme-text-tertiary)",
              }}
            >
              <span>
                Predicted ATAR
                <br />
                <b style={{ color: "var(--theme-black)", fontSize: "1.45rem" }}>
                  {grades.document.predictedATAR?.toFixed(2) ?? "—"}
                </b>
              </span>
              <span>
                Goal ATAR
                <br />
                <b style={{ color: "var(--theme-black)", fontSize: "1.45rem" }}>
                  {grades.document.goalATAR?.toFixed(2) ?? "—"}
                </b>
              </span>
              <span>
                Assessments
                <br />
                <b style={{ color: "var(--theme-black)", fontSize: "1.45rem" }}>
                  {scored.length}
                </b>
              </span>
            </div>
          </section>
          <section className={styles.card} style={{ marginTop: 28 }}>
            {timetable.subjects.map((subject) => {
              const subjectAssessments = scored.filter(
                (assessment) => assessment.subjectID === subject.id,
              );
              const subjectAverage = subjectAssessments.length
                ? subjectAssessments.reduce(
                    (sum, assessment) =>
                      sum + assessment.score * assessment.weighting,
                    0,
                  ) /
                  subjectAssessments.reduce(
                    (sum, assessment) => sum + assessment.weighting,
                    0,
                  )
                : null;
              return (
                <Link
                  key={subject.id}
                  href={`/grades/${encodeURIComponent(subject.id)}`}
                  className={styles.row}
                >
                  <span
                    className={styles.symbol}
                    style={{ color: subjectColour(subject) }}
                  >
                    {subject.symbol}
                  </span>
                  <span>
                    <b className={styles.label}>{subject.id}</b>
                    <small
                      style={{
                        display: "block",
                        color: "var(--theme-text-tertiary)",
                        marginTop: 4,
                      }}
                    >
                      {subjectAverage === null
                        ? "No assessments yet"
                        : `${subjectAssessments.length} assessment${subjectAssessments.length === 1 ? "" : "s"}`}
                    </small>
                  </span>
                  <strong style={{ fontSize: "1.7rem" }}>
                    {subjectAverage === null
                      ? "—"
                      : formatPercent(subjectAverage)}
                  </strong>
                </Link>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}
