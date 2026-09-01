import type { GradeAssessment } from "@/features/timetable/types";
import GradeGauge from "@/components/grades/GradeGauge/GradeGauge";
import styles from "@/components/drawers/Drawer/Drawer.module.css";

type GradeSubjectDrawerProps = {
	subjectID: string;
	symbol: string;
	colour: string;
	average: number | null;
	assessments: GradeAssessment[];
};

export default function GradeSubjectDrawer({
	subjectID,
	symbol,
	colour,
	average,
	assessments,
}: GradeSubjectDrawerProps) {
	return (
		<div className={styles.detailDrawer}>
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
