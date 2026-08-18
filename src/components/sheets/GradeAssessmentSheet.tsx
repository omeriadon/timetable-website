"use client";

import { useState } from "react";
import type { GradeAssessment } from "@/features/timetable/types";
import GlassButton from "@/components/controls/GlassButton";
import styles from "./Sheet.module.css";

type GradeAssessmentSheetProps = {
	assessment: GradeAssessment;
	onSave: (assessment: GradeAssessment) => Promise<void>;
	onDelete: (assessment: GradeAssessment) => Promise<void>;
};

export default function GradeAssessmentSheet({
	assessment,
	onSave,
	onDelete,
}: GradeAssessmentSheetProps) {
	const [draft, setDraft] = useState(assessment);
	const [status, setStatus] = useState<string | null>(null);
	const update = (changes: Partial<GradeAssessment>) => setDraft((current) => ({ ...current, ...changes }));
	const save = async () => {
		setStatus("Saving…");
		await onSave(draft);
		setStatus("Saved");
	};
	const remove = async () => {
		setStatus("Deleting…");
		await onDelete(draft);
		setStatus("Deleted");
	};

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<div>
					<h2>Edit Assessment</h2>
					<p>Semester {draft.semester}</p>
				</div>
			</header>
			<section className={styles.formCard}>
				<label>Assessment<input value={draft.name} onChange={(event) => update({ name: event.target.value })} /></label>
				<label>Date<input type="date" value={dateValue(draft)} onChange={(event) => update({ date: parseDate(event.target.value) })} /></label>
				<label>Score (%)<input type="number" min="0" max="100" step="0.1" value={(draft.score * 100).toFixed(1)} onChange={(event) => update({ score: Number(event.target.value) / 100 })} /></label>
				<label>Weighting (%)<input type="number" min="0" max="100" step="0.1" value={(draft.weighting * 100).toFixed(1)} onChange={(event) => update({ weighting: Number(event.target.value) / 100 })} /></label>
				<div className={styles.sheetActions}>
					<GlassButton label="Delete assessment" onClick={remove} size="compact"><span aria-hidden="true">⌫</span></GlassButton>
					<GlassButton label="Save assessment" onClick={save} size="compact"><span aria-hidden="true">✓</span></GlassButton>
				</div>
				{status ? <p className={styles.detailMuted} role="status">{status}</p> : null}
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
