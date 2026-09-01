import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import Symbol from "@/components/controls/Symbol/Symbol";
import DrawerTrigger from "@/components/drawers/DrawerTrigger/DrawerTrigger";
import GradeAssessmentDrawer from "@/components/drawers/GradeAssessmentDrawer/GradeAssessmentDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import type { GradeSubjectData } from "@/lib/server/page-data.functions";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api/client";
import type {
	GradeAssessment,
	GradeTracker,
	OwnerTimetable,
	TimetableSubject,
} from "@/features/timetable/types";

import styles from "./page.module.css";

export default function GradeSubjectPage({
	subject,
	data,
}: {
	subject: string;
	data: GradeSubjectData;
}) {
	const subjectID = subject;

	const setToolbar = useToolbar();
	const router = useRouter();
	const { openDrawer } = useDrawer();

	const initial = data;
	const [tracker, setTracker] = useState<GradeTracker>(initial.grades);
	const [timetable, setTimetable] = useState<OwnerTimetable>(initial.timetable);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => setToolbar({ title: subjectID }), [setToolbar, subjectID]);

	const assessments = useMemo(
		() =>
			tracker?.document.assessments.filter(
				(item) => item.subjectID === subjectID,
			) ?? [],
		[tracker, subjectID],
	);
	const timetableSubject = timetable?.subjects.find(
		(item) => item.id === subjectID,
	);
	const subjects = timetable?.subjects ?? [];

	const createAssessment = (semester: number) => {
		openDrawer(
			<GradeAssessmentDrawer
				subject={timetableSubject}
				subjects={subjects}
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
			await router.invalidate();
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
			await router.invalidate();
		} catch (requestError) {
			setError((requestError as Error).message);
			throw requestError;
		} finally {
			setSaving(false);
		}
	};

	return (
		<main className={styles.page}>
			<Link to="/grades" className={styles.backLink}>
				‹ Grades
			</Link>

			{error && (
				<p className={styles.error} role="alert">
					{error}
				</p>
			)}

			{[1, 2].map((semester) => {
				const semesterAssessments = assessments.filter(
					(assessment) => assessment.semester === semester,
				);

				return (
					<div key={semester}>
						<h2 className={styles.section}>Semester {semester}</h2>

						<section className={styles.card}>
							{semesterAssessments.length ? (
								semesterAssessments.map((assessment) => (
									<DrawerTrigger
										key={assessment.id}
										className={styles.rowButton}
										ariaLabel={`Edit ${assessment.name}`}
										content={
											<GradeAssessmentDrawer
												subject={timetableSubject}
												subjects={subjects}
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
									</DrawerTrigger>
								))
							) : (
								<p className={styles.emptyRow}>No assessments yet.</p>
							)}

							<Button
								type="button"
								variant="ghost"
								className={styles.row}
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
				);
			})}
		</main>
	);
}
