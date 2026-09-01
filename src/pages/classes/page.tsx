import { useEffect } from "react";
import type { ClassesData } from "@/lib/server/page-data.functions";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import styles from "./page.module.css";
import DrawerTrigger from "@/components/drawers/DrawerTrigger/DrawerTrigger";
import SubjectDetailDrawer from "@/components/drawers/SubjectDetailDrawer/SubjectDetailDrawer";
import Symbol from "@/components/controls/Symbol/Symbol";

export default function ClassesPage({ data }: { data: ClassesData }) {
	const { timetable, friends } = data;
	const setToolbar = useToolbar();

	useEffect(() => setToolbar({ title: "Classes" }), [setToolbar]);

	return (
		<main className={styles.page}>
			{
				<section className={styles.card}>
					{timetable.subjects.map((subject) => (
						<DrawerTrigger
							key={subject.id}
							className={styles.rowButton}
							ariaLabel={`Open ${subject.id}`}
							content={
								<SubjectDetailDrawer subject={subject} friends={friends} />
							}
						>
							<article className={styles.row}>
								<span className={styles.symbol}>
									<Symbol name={subject.symbol} className={styles.symbolIcon} />
								</span>
								<span>
									<b className={styles.label}>{subject.id}</b>
									<small>
										{subject.slots.length} class
										{subject.slots.length === 1 ? "" : "es"} each week
									</small>
								</span>
								<Symbol name="chevron.right" className={styles.chevronIcon} />
							</article>
						</DrawerTrigger>
					))}
				</section>
			}
		</main>
	);
}
