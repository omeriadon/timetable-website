"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import styles from "./page.module.css";
import { apiRequest } from "@/lib/api/client";
import type {
	GradeTracker,
	OwnerTimetable,
	TimetableSubject,
} from "@/features/timetable/types";
import GradeGauge from "@/components/grades/GradeGauge/GradeGauge";
import GradeSubjectDrawer from "@/components/grades/GradeSubjectDrawer/GradeSubjectDrawer";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

function subjectColour(subject: TimetableSubject) {
	const { r, g, b } = subject.colour;
	return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;
}

function formatPercent(value: number | null) {
	return value === null ? "—" : `${(value * 100).toFixed(1)}%`;
}

const SNAP_POINTS = ["35rem", 1];

type YearGroupCatalogue = {
	sections: Array<{
		category: string;
		tags: Array<{ id: string; displayName: string }>;
	}>;
};

type YearGroupSubscriptions = {
	tagIDs: string[];
};

function subjectAverage(
	subjectID: string,
	assessments: GradeTracker["document"]["assessments"],
) {
	const subjectAssessments = assessments.filter(
		(assessment) => assessment.subjectID === subjectID,
	);
	const totalWeight = subjectAssessments.reduce(
		(total, assessment) => total + assessment.weighting,
		0,
	);
	if (!totalWeight) {
		return null;
	}

	return (
		subjectAssessments.reduce(
			(total, assessment) => total + assessment.score * assessment.weighting,
			0,
		) / totalWeight
	);
}

function mean(values: number[]) {
	return values.length
		? values.reduce((total, value) => total + value, 0) / values.length
		: null;
}

function supportsGradeTracking(subject: TimetableSubject) {
	const normalizedName = subject.id.trim().toLocaleLowerCase();
	return normalizedName !== "directed study" && normalizedName !== "advocacy";
}

function ATARSettingsDrawer({
	grades,
	onSaved,
}: {
	grades: GradeTracker;
	onSaved: (grades: GradeTracker) => void;
}) {
	const { closeDrawer } = useDrawer();
	const [predictedATAR, setPredictedATAR] = useState(
		grades.document.predictedATAR?.toString() ?? "",
	);
	const [goalATAR, setGoalATAR] = useState(
		grades.document.goalATAR?.toString() ?? "",
	);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const save = async () => {
		setSaving(true);
		setError(null);
		try {
			const updated = await apiRequest<GradeTracker>("v1/grades", {
				method: "PUT",
				body: JSON.stringify({
					document: {
						...grades.document,
						predictedATAR: predictedATAR ? Number(predictedATAR) : null,
						goalATAR: goalATAR ? Number(goalATAR) : null,
					},
					serverRevision: grades.document.serverRevision,
				}),
			});
			onSaved(updated);
			closeDrawer();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<section aria-labelledby="atar-settings-title">
			<h2 id="atar-settings-title">ATAR</h2>
			<label>
				Predicted ATAR
				<Input
					type="number"
					step="0.01"
					value={predictedATAR}
					onChange={(event) => setPredictedATAR(event.target.value)}
				/>
			</label>
			<label>
				Goal ATAR
				<Input
					type="number"
					step="0.01"
					value={goalATAR}
					onChange={(event) => setGoalATAR(event.target.value)}
				/>
			</label>
			<Button
				type="button"
				onClick={() => void save()}
				disabled={saving}
				aria-label="Save ATAR settings"
			>
				<Symbol name="checkmark" />
				Save
			</Button>
			{error ? <p role="alert">{error}</p> : null}
		</section>
	);
}

export default function GradesPage() {
	const setToolbar = useToolbar();
	const [grades, setGrades] = useState<GradeTracker | null>(null);
	const [timetable, setTimetable] = useState<OwnerTimetable | null>(null);
	const [isSenior, setIsSenior] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { openDrawer } = useDrawer();

	useEffect(() => {
		setToolbar({ title: "Grades" });
		Promise.all([
			apiRequest<GradeTracker>("v1/grades"),
			apiRequest<OwnerTimetable>("v1/timetables/owner"),
			apiRequest<YearGroupCatalogue>("v1/tags"),
			apiRequest<YearGroupSubscriptions>("v1/tags/subscriptions"),
		])
			.then(([gradeDocument, ownerTimetable, catalogue, subscriptions]) => {
				setGrades(gradeDocument);
				setTimetable(ownerTimetable);
				const yearGroups = catalogue.sections
					.filter((section) => section.category === "yearGroup")
					.flatMap((section) => section.tags);
				setIsSenior(
					yearGroups
						.filter((tag) => subscriptions.tagIDs.includes(tag.id))
						.some((tag) => /11|12/.test(tag.displayName)),
				);
			})
			.catch((requestError: Error) => setError(requestError.message));
	}, [setToolbar]);

	const scored = useMemo(() => grades?.document.assessments ?? [], [grades]);
	const gradeSubjects = timetable
		? timetable.subjects.filter(supportsGradeTracking)
		: [];
	const subjectAverages = timetable
		? gradeSubjects
				.map((subject) => subjectAverage(subject.id, scored))
				.filter((value): value is number => value !== null)
		: [];
	const average = mean(subjectAverages);
	const topFour = mean(
		subjectAverages
			.slice()
			.sort((left, right) => right - left)
			.slice(0, 4),
	);

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
								<div className={styles.summaryValue}>
									{formatPercent(average)}
								</div>
							</div>
							{isSenior ? (
								<div>
									<strong className={styles.summaryLabel}>Top 4</strong>
									<div className={styles.summaryValue}>
										{formatPercent(topFour)}
									</div>
								</div>
							) : null}
						</div>
						{isSenior ? (
							<div className={styles.summaryStats}>
								<span>
									Predicted ATAR
									<br />
									<b>{grades.document.predictedATAR?.toFixed(2) ?? "—"}</b>
								</span>
								<span>
									Goal ATAR
									<br />
									<b>{grades.document.goalATAR?.toFixed(2) ?? "—"}</b>
								</span>
								<span>
									Gap
									<br />
									<b>
										{grades.document.goalATAR !== null &&
										grades.document.predictedATAR !== null
											? (
													grades.document.goalATAR -
													grades.document.predictedATAR
												).toFixed(2)
											: "—"}
									</b>
								</span>
							</div>
						) : null}
					</section>
					{isSenior ? (
						<Button
							type="button"
							aria-label="Edit ATAR settings"
							onClick={() =>
								openDrawer(
									<ATARSettingsDrawer grades={grades} onSaved={setGrades} />,
								)
							}
						>
							<Symbol name="chart.line.uptrend.xyaxis" />
							Edit ATAR
						</Button>
					) : null}
					{gradeSubjects.length ? (
						<section className={styles.subjects}>
							{gradeSubjects.map((subject) => {
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
									<Drawer
										key={subject.id}
										swipeDirection="right"
										snapPoints={SNAP_POINTS}
									>
										<DrawerTrigger
											render={
												<Button
													type="button"
													className={styles.subjectRow}
													aria-label={`Open ${subject.id} grades`}
												/>
											}
										>
											<GradeGauge
												value={subjectAverage}
												color={subjectColour(subject)}
												symbol={subject.symbol}
											/>
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
										</DrawerTrigger>
										<DrawerContent>
											<DrawerHeader>
												<DrawerTitle>{subject.id}</DrawerTitle>
												<DrawerDescription>
													{subjectAverage === null
														? "No assessments yet"
														: `${subjectAssessments.length} assessment${subjectAssessments.length === 1 ? "" : "s"} recorded`}
												</DrawerDescription>
											</DrawerHeader>
											<GradeSubjectDrawer
												subjectID={subject.id}
												symbol={subject.symbol}
												colour={subjectColour(subject)}
												average={subjectAverage}
												assessments={subjectAssessments}
											/>
										</DrawerContent>
									</Drawer>
								);
							})}
						</section>
					) : (
						<section className={styles.emptyState}>
							<Symbol name="book.closed" />
							<strong>No Subjects Yet</strong>
							<span>
								Add subjects to your timetable before tracking grades.
							</span>
						</section>
					)}
				</>
			)}
		</main>
	);
}
