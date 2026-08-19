"use client";

import { useRouter } from "next/navigation";
import type { GradeAssessment } from "@/features/timetable/types";
import GradeGauge from "@/components/grades/GradeGauge/GradeGauge";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import styles from "@/components/sheets/Sheet/Sheet.module.css";

type GradeSubjectSheetProps = {
  subjectID: string;
  symbol: string;
  colour: string;
  average: number | null;
  assessments: GradeAssessment[];
};

export default function GradeSubjectSheet({
  subjectID,
  symbol,
  colour,
  average,
  assessments,
}: GradeSubjectSheetProps) {
  const { closeSheet } = useSheet();
  const router = useRouter();

  return (
    <div className={styles.detailSheet}>
      <header className={styles.detailHeader}>
        <GradeGauge value={average} color={colour} symbol={symbol} />
        <div>
          <h2>{subjectID}</h2>
          <p>
            {average === null
              ? "No assessments yet"
              : `${formatPercent(average)} average`}
          </p>
        </div>
      </header>
      <section
        className={styles.detailCard}
        aria-label={`${subjectID} assessments`}
      >
        {assessments.length === 0 ? (
          <p className={styles.detailMuted}>No assessments yet.</p>
        ) : (
          assessments.slice(0, 5).map((assessment) => (
            <div className={styles.detailRow} key={assessment.id}>
              <span>
                <strong>{assessment.name}</strong>
                <small className={styles.detailMuted}>
                  {formatDate(assessment)} · {formatPercent(assessment.score)}
                </small>
              </span>
              <span>{assessment.weighting.toFixed(1)}%</span>
            </div>
          ))
        )}
      </section>
      <SheetActionButton
        label={`Open ${subjectID}`}
        onClick={() => {
          closeSheet();
          router.push(`/grades/${encodeURIComponent(subjectID)}`);
        }}
      >
        <SymbolIcon name="arrow.up.right" fallback="->" />
        Open Subject
      </SheetActionButton>
    </div>
  );
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatDate(assessment: GradeAssessment) {
  return new Date(
    assessment.date.year,
    assessment.date.month - 1,
    assessment.date.day,
  ).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
  });
}
