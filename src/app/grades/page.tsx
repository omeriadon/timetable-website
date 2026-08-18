"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useToolbar } from "@/components/Toolbar";
import styles from "./page.module.css";
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
          <section className={styles.summary} aria-label="Grade summary">
            <div className={styles.summaryTop}>
              <div>
                <strong className={styles.summaryLabel}>Average</strong>
                <div className={styles.summaryValue}>{formatPercent(average)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong className={styles.summaryLabel}>Top 4</strong>
                <div className={styles.summaryValue}>{formatPercent(average)}</div>
              </div>
            </div>
            <div className={styles.summaryStats}>
              <span>
                Predicted ATAR
                <br />
                <b>
                  {grades.document.predictedATAR?.toFixed(2) ?? "—"}
                </b>
              </span>
              <span>
                Goal ATAR
                <br />
                <b>
                  {grades.document.goalATAR?.toFixed(2) ?? "—"}
                </b>
              </span>
              <span>
                Gap
                <br />
                <b>
                  {grades.document.goalATAR !== null && grades.document.predictedATAR !== null
                    ? (grades.document.goalATAR - grades.document.predictedATAR).toFixed(2)
                    : "—"}
                </b>
              </span>
            </div>
          </section>
          <section className={styles.subjects}>
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
                  className={styles.subjectRow}
                >
                  <GradeGauge value={subjectAverage} color={subjectColour(subject)} symbol={subject.symbol} />
                  <span>
                    <b className={styles.subjectName}>{subject.id}</b>
                    <small className={styles.subjectDetail}>
                      {subjectAverage === null
                        ? "No assessments yet"
                        : `${subjectAssessments.length} assessment${subjectAssessments.length === 1 ? "" : "s"}`}
                    </small>
                  </span>
                  <strong className={styles.subjectScore}>
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

function GradeGauge({ value, color, symbol }: { value: number | null; color: string; symbol: string }) {
	const percentage = value === null ? 0 : Math.max(0, Math.min(100, value * 100));
	return (
		<span className={styles.gauge} style={{ "--gauge-value": percentage, "--gauge-color": color } as CSSProperties}>
			<span>{value === null ? symbol : `${Math.round(percentage)}%`}</span>
		</span>
	);
}
