"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import styles from "./page.module.css";
import actionStyles from "@/components/ui/ContentActions.module.css";
import { apiRequest } from "@/lib/api/client";
import type { GradeAssessment, GradeTracker } from "@/features/timetable/types";
import SheetTrigger from "@/components/sheets/SheetTrigger/SheetTrigger";
import GradeAssessmentSheet from "@/components/sheets/GradeAssessmentSheet/GradeAssessmentSheet";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import Symbol from "@/components/controls/Symbol/Symbol";

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
	const createAssessment = (semester: number) => {
		openSheet(
			<GradeAssessmentSheet
				subjectID={subjectID}
				semester={semester}
				onSave={saveAssessment}
				onDelete={deleteAssessment}
			/>,
		);
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
								...tracker.document.assessments.filter(
									(item) => item.id !== assessment.id,
								),
								assessment,
							],
						},
						serverRevision: tracker.document.serverRevision,
					}),
				}),
			);
		} catch (requestError) {
			setError((requestError as Error).message);
			throw requestError;
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
							assessments: tracker.document.assessments.filter(
								(item) => item.id !== assessment.id,
							),
						},
						serverRevision: tracker.document.serverRevision,
					}),
				}),
			);
		} catch (requestError) {
			setError((requestError as Error).message);
			throw requestError;
		} finally {
			setSaving(false);
		}
	};

	const { openSheet } = useSheet();

	return (
		<main className={styles.page}>
			<Link href="/grades" className={styles.backLink}>
				‹ Grades
			</Link>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			{[1, 2].map((semester) => (
				<div key={semester}>
					<h2 className={styles.section}>Semester {semester}</h2>
					<section className={styles.card}>
						{assessments.filter(
							(assessment) => assessment.semester === semester,
						).length ? (
							assessments
								.filter((assessment) => assessment.semester === semester)
								.map((assessment) => (
									<SheetTrigger
										key={assessment.id}
										className={styles.rowButton}
										ariaLabel={`Edit ${assessment.name}`}
										content={
											<GradeAssessmentSheet
												assessment={assessment}
												subjectID={subjectID}
												semester={semester}
												onSave={saveAssessment}
												onDelete={deleteAssessment}
											/>
										}
									>
										<article className={styles.row}>
											<Symbol
												name="list.bullet.rectangle"
												className={styles.symbolIcon}
											/>
											<span>
												<b className={styles.label}>{assessment.name}</b>
												<small className={styles.rowMeta}>
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
											<strong className={styles.scoreEmphasis}>
												{(assessment.score * 100).toFixed(1)}%
											</strong>
										</article>
									</SheetTrigger>
								))
						) : (
							<p className={styles.emptyRow}>No assessments yet.</p>
						)}
						<Button
							unstyled
							type="button"
							className={`${styles.row} ${actionStyles.rowAction}`}
							disabled={saving}
							onClick={() => createAssessment(semester)}
						>
							<Symbol name="plus" className={styles.symbolIcon} />
							<span className={styles.label}>
								{saving ? "Saving…" : "New Assessment"}
							</span>
						</Button>
					</section>
				</div>
			))}
		</main>
	);
}
