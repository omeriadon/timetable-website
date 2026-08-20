"use client";

import { Button } from "@base-ui/react/button";
import { Input } from "@/components/ui/Input";
import { NativeSelect as Select } from "@/components/ui/NativeSelect";
import { useState } from "react";
import type { GradeAssessment } from "@/features/timetable/types";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "../Drawer/Drawer";
import styles from "../Drawer/Drawer.module.css";

type GradeAssessmentDrawerProps = {
	assessment?: GradeAssessment;
	subjectID: string;
	semester: number;
	onSave: (assessment: GradeAssessment) => Promise<void>;
	onDelete?: (assessment: GradeAssessment) => Promise<void>;
};

export default function GradeAssessmentDrawer({
	assessment,
	subjectID,
	semester,
	onSave,
	onDelete,
}: GradeAssessmentDrawerProps) {
	const { closeDrawer } = useDrawer();
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
			closeDrawer();
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
			closeDrawer();
		} catch (error) {
			setStatus((error as Error).message);
		}
	};

	return (
		<div className={styles.detailDrawer}>
			<header className={styles.detailHeader}>
				<div>
					<h2>{assessment ? "Edit Assessment" : "New Assessment"}</h2>
					<p>Semester {current.semester}</p>
				</div>
			</header>
			<section className={styles.formCard}>
				<label>
					Assessment
					<Input
						value={current.name}
						onChange={(event) => update({ name: event.target.value })}
					/>
				</label>
				<label>
					Date
					<Input
						type="date"
						value={dateValue(current)}
						onChange={(event) =>
							update({ date: parseDate(event.target.value) })
						}
					/>
				</label>
				<label>
					Assessment period
					<Select
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
					</Select>
				</label>
				<label>
					Score (%)
					<Input
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
					<Input
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
				<div className={styles.drawerActions}>
					{assessment && onDelete ? (
						<Button
							type="button"
							aria-label="Delete assessment"
							onClick={remove}
						>
							<Symbol name="trash" />
						</Button>
					) : null}
					<Button
						type="button"
						aria-label={assessment ? "Save assessment" : "Add assessment"}
						onClick={save}
					>
						<Symbol name="checkmark" />
					</Button>
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
