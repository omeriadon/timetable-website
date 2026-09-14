import { Link } from "@tanstack/solid-router";
import { createMemo, createSignal, onMount } from "solid-js";

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
} from "@/features/timetable/types";

import styles from "./page.module.css";
import StaleIndicator from "@/components/controls/StaleIndicator/StaleIndicator";
import { createCachedResource } from "@/lib/cache/swr";
import { gradeSubjectKey, CACHE_TTLS } from "@/lib/cache/keys";

export default function GradeSubjectPage({
	subject,
	data,
}: {
	subject: string;
	data: GradeSubjectData;
}) {
	const subjectID = subject;

	const setToolbar = useToolbar();
	const { openDrawer } = useDrawer();

	const initial = data;
	const cached = createCachedResource<GradeSubjectData>({
		key: gradeSubjectKey(subjectID),
		initialData: initial,
		ttlMs: CACHE_TTLS.grades,
		fetcher: async () => {
			const [grades, timetable] = await Promise.all([
				apiRequest<GradeTracker>("v1/grades"),
				apiRequest<OwnerTimetable>("v1/timetables/owner"),
			]);
			return { grades, timetable };
		},
	});
	const tracker = () => cached.data()?.grades;
	const timetable = () => cached.data()?.timetable;
	const [saving, setSaving] = createSignal(false);
	// const [error, setError] = createSignal<string | null>(null);

	const persistTracker = (updated: GradeTracker) => {
		const snapshot = cached.data();
		if (snapshot) {
			cached.mutate({ ...snapshot, grades: updated });
		}
	};

	onMount(() => setToolbar({}));

	const assessments = createMemo(
		() =>
			tracker()?.document.assessments.filter(
				(item) => item.subjectID === subjectID,
			) ?? [],
	);
	const timetableSubject = timetable()?.subjects.find(
		(item) => item.id === subjectID,
	);
	const subjects = timetable()?.subjects ?? [];

	const createAssessment = (semester: number) => {
		openDrawer(() => (
			<GradeAssessmentDrawer
				subject={timetableSubject}
				subjects={subjects}
				subjectID={subjectID}
				semester={semester}
				onSave={saveAssessment}
				onDelete={deleteAssessment}
			/>
		));
	};

	const saveAssessment = async (assessment: GradeAssessment) => {
		if (!tracker()) return;
		try {
			persistTracker(
				await apiRequest<GradeTracker>("v1/grades", {
					method: "PUT",
					body: JSON.stringify({
						document: {
							...tracker()!.document,
							assessments: [
								...tracker()!.document.assessments.filter(
									(item) => item.id !== assessment.id,
								),
								assessment,
							],
						},
						serverRevision: tracker()!.document.serverRevision,
					}),
				}),
			);
		} catch (requestError) {
			throw requestError;
		} finally {
			setSaving(false);
		}
	};

	const deleteAssessment = async (assessment: GradeAssessment) => {
		if (!tracker()) return;

		setSaving(true);

		try {
			persistTracker(
				await apiRequest<GradeTracker>("v1/grades", {
					method: "PUT",
					body: JSON.stringify({
						document: {
							...tracker()!.document,
							assessments: tracker()!.document.assessments.filter(
								(item) => item.id !== assessment.id,
							),
						},
						serverRevision: tracker()!.document.serverRevision,
					}),
				}),
			);
		} catch (requestError) {
			throw requestError;
		} finally {
			setSaving(false);
		}
	};

	return (
		<main class={styles.page}>
			<Link to="/grades" class={styles.backLink}>
				‹ Grades
			</Link>
			<StaleIndicator active={!!cached.data() && cached.isRevalidating()} />

			{[1, 2].map((semester) => {
				const semesterAssessments = assessments().filter(
					(assessment) => assessment.semester === semester,
				);

				return (
					<div>
						<h2 class={styles.section}>Semester {semester}</h2>

						<section class={styles.card}>
							{semesterAssessments.length ? (
								semesterAssessments.map((assessment) => (
									<DrawerTrigger
										class={styles.rowButton}
										ariaLabel={`Edit ${assessment.name}`}
										content={() => (
											<GradeAssessmentDrawer
												subject={timetableSubject}
												subjects={subjects}
												assessment={assessment}
												subjectID={subjectID}
												semester={semester}
												onSave={saveAssessment}
												onDelete={deleteAssessment}
											/>
										)}
									>
										<article class={styles.row}>
											<Symbol
												name="list.bullet.rectangle"
												class={styles.symbolIcon}
											/>

											<span>
												<b class={styles.label}>{assessment.name}</b>

												<small class={styles.rowMeta}>
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

											<strong class={styles.scoreEmphasis}>
												{(assessment.score * 100).toFixed(1)}%
											</strong>
										</article>
									</DrawerTrigger>
								))
							) : (
								<p class={styles.emptyRow}>No assessments yet.</p>
							)}

							<Button
								type="button"
								variant="ghost"
								class={styles.row}
								disabled={saving()}
								onClick={() => createAssessment(semester)}
							>
								<Symbol name="plus" class={styles.symbolIcon} />
								<span class={styles.label}>
									{saving() ? "Saving…" : "New Assessment"}
								</span>
							</Button>
						</section>
					</div>
				);
			})}
		</main>
	);
}
