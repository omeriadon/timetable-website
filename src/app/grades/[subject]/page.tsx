"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import styles from "@/components/IOSScreen.module.css";
import { apiRequest } from "@/lib/api/client";
import type { GradeAssessment, GradeTracker } from "@/features/timetable/types";
import SheetTrigger from "@/components/sheets/SheetTrigger";
import GradeAssessmentSheet from "@/components/sheets/GradeAssessmentSheet";

export default function GradeSubjectPage() {
  const { subject } = useParams<{ subject: string }>();
  const subjectID = decodeURIComponent(subject);
  const setToolbar = useToolbar();
  const [tracker, setTracker] = useState<GradeTracker | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setToolbar({ title: subjectID });
    apiRequest<GradeTracker>("v1/grades")
      .then(setTracker)
      .catch((requestError: Error) => setError(requestError.message));
  }, [setToolbar, subjectID]);

  const assessments = useMemo(
    () =>
      tracker?.document.assessments.filter(
        (item) => item.subjectID === subjectID,
      ) ?? [],
    [tracker, subjectID],
  );
  const createAssessment = async () => {
    if (!tracker) return;
    setSaving(true);
    setError(null);
    const now = new Date();
    const assessment: GradeAssessment = {
      id: crypto.randomUUID(),
      subjectID,
      semester: 1,
      name: "New Assessment",
      date: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      },
      score: 0,
      weighting: 0,
      location: "subjectPeriod",
    };
    try {
      setTracker(
        await apiRequest<GradeTracker>("v1/grades", {
          method: "PUT",
          body: JSON.stringify({
            document: {
              ...tracker.document,
              assessments: [...tracker.document.assessments, assessment],
            },
            serverRevision: tracker.document.serverRevision,
          }),
        }),
      );
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setSaving(false);
    }
  };

	const saveAssessment = async (assessment: GradeAssessment) => {
		if (!tracker) return;
		setSaving(true);
		setError(null);
		try {
			setTracker(
				await apiRequest<GradeTracker>("v1/grades", {
					method: "PUT",
					body: JSON.stringify({
						document: {
							...tracker.document,
							assessments: [
								...tracker.document.assessments.filter((item) => item.id !== assessment.id),
								assessment,
							],
						},
						serverRevision: tracker.document.serverRevision,
					}),
				}),
			);
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const deleteAssessment = async (assessment: GradeAssessment) => {
		if (!tracker) return;
		setSaving(true);
		setError(null);
		try {
			setTracker(
				await apiRequest<GradeTracker>("v1/grades", {
					method: "PUT",
					body: JSON.stringify({
						document: {
							...tracker.document,
							assessments: tracker.document.assessments.filter((item) => item.id !== assessment.id),
						},
						serverRevision: tracker.document.serverRevision,
					}),
				}),
			);
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

  return (
    <main className={styles.page}>
      <Link href="/grades" style={{ color: "#aaa", textDecoration: "none" }}>
        ‹ Grades
      </Link>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <h2 className={styles.section}>Semester 1</h2>
      <section className={styles.card}>
        {assessments.length ? (
          assessments.map((assessment) => (
							<SheetTrigger
								key={assessment.id}
								className={styles.rowButton}
								ariaLabel={`Edit ${assessment.name}`}
								content={
									<GradeAssessmentSheet
										assessment={assessment}
										onSave={saveAssessment}
										onDelete={deleteAssessment}
									/>
								}
							>
							<article className={styles.row}>
              <span className={styles.symbol}>◌</span>
              <span>
                <b className={styles.label}>{assessment.name}</b>
                <small
                  style={{
                    display: "block",
                    color: "var(--theme-text-secondary)",
                    marginTop: 4,
                  }}
                >
                  {new Date(
                    assessment.date.year,
                    assessment.date.month - 1,
                    assessment.date.day,
                  ).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  · Weighting {assessment.weighting.toFixed(1)}%
                </small>
              </span>
              <strong style={{ fontSize: "1.55rem" }}>
                  {(assessment.score * 100).toFixed(1)}%
                </strong>
              </article>
							</SheetTrigger>
            ))
        ) : (
          <p style={{ padding: "22px", color: "#999" }}>No assessments yet.</p>
        )}
        <button
          type="button"
          className={styles.row}
          style={{
            width: "100%",
            border: 0,
            background: "transparent",
            cursor: "pointer",
            textAlign: "left",
          }}
          disabled={saving}
          onClick={createAssessment}
        >
          <span className={styles.symbol}>＋</span>
          <span className={styles.label}>
            {saving ? "Saving…" : "New Assessment"}
          </span>
        </button>
      </section>
    </main>
  );
}
