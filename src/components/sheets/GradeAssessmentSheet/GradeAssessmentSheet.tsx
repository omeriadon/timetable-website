"use client";

import { useState } from "react";
import type { GradeAssessment } from "@/features/timetable/types";
import GlassButton from "@/components/controls/GlassButton/GlassButton";
import { useSheet } from "../Sheet/Sheet";
import styles from "../Sheet/Sheet.module.css";

type GradeAssessmentSheetProps = {
  assessment?: GradeAssessment;
  subjectID: string;
  semester: number;
  onSave: (assessment: GradeAssessment) => Promise<void>;
  onDelete?: (assessment: GradeAssessment) => Promise<void>;
};

export default function GradeAssessmentSheet({
  assessment,
  subjectID,
  semester,
  onSave,
  onDelete,
}: GradeAssessmentSheetProps) {
  const { closeSheet } = useSheet();
  const [draft, setDraft] = useState(assessment);
  const [status, setStatus] = useState<string | null>(null);
  const initialDraft = assessment ?? {
    id: crypto.randomUUID(),
    subjectID,
    semester,
    name: "",
    date: nextWeekday(),
    score: 0,
    weighting: 1,
    location: "exam" as const,
  };
  const current = draft ?? initialDraft;
  const update = (changes: Partial<GradeAssessment>) =>
    setDraft((value) => ({ ...(value ?? initialDraft), ...changes }));
  const save = async () => {
    setStatus("Saving…");
    try {
      await onSave(current);
      setStatus("Saved");
      closeSheet();
    } catch (error) {
      setStatus((error as Error).message);
    }
  };
  const remove = async () => {
    if (!onDelete || !assessment) return;
    setStatus("Deleting…");
    try {
      await onDelete(current);
      setStatus("Deleted");
      closeSheet();
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  return (
    <div className={styles.detailSheet}>
      <header className={styles.detailHeader}>
        <div>
          <h2>{assessment ? "Edit Assessment" : "New Assessment"}</h2>
          <p>Semester {current.semester}</p>
        </div>
      </header>
      <section className={styles.formCard}>
        <label>
          Assessment
          <input
            value={current.name}
            onChange={(event) => update({ name: event.target.value })}
          />
        </label>
        <label>
          Date
          <input
            type="date"
            value={dateValue(current)}
            onChange={(event) =>
              update({ date: parseDate(event.target.value) })
            }
          />
        </label>
        <label>
          Assessment period
          <select
            value={current.location}
            onChange={(event) =>
              update({
                location: event.target.value as GradeAssessment["location"],
              })
            }
          >
            <option value="exam">Exam</option>
            <option value="directedStudy">Directed Study</option>
            <option value="subjectPeriod">Subject Period</option>
          </select>
        </label>
        <label>
          Score (%)
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={(current.score * 100).toFixed(1)}
            onChange={(event) =>
              update({ score: Number(event.target.value) / 100 })
            }
          />
        </label>
        <label>
          Weighting (%)
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={(current.weighting * 100).toFixed(1)}
            onChange={(event) =>
              update({ weighting: Number(event.target.value) / 100 })
            }
          />
        </label>
        <div className={styles.sheetActions}>
          {assessment && onDelete ? (
            <GlassButton
              label="Delete assessment"
              onClick={remove}
              size="compact"
            >
              <span aria-hidden="true">⌫</span>
            </GlassButton>
          ) : null}
          <GlassButton
            label={assessment ? "Save assessment" : "Add assessment"}
            onClick={save}
            size="compact"
          >
            <span aria-hidden="true">✓</span>
          </GlassButton>
        </div>
        {status ? (
          <p className={styles.detailMuted} role="status">
            {status}
          </p>
        ) : null}
      </section>
    </div>
  );
}

function dateValue(assessment: GradeAssessment) {
  return `${assessment.date.year}-${String(assessment.date.month).padStart(2, "0")}-${String(assessment.date.day).padStart(2, "0")}`;
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

function nextWeekday() {
  const date = new Date();
  if (date.getDay() === 6) date.setDate(date.getDate() + 2);
  if (date.getDay() === 0) date.setDate(date.getDate() + 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}
