import { createEffect, For } from "solid-js";
import type { ClassesData } from "@/lib/server/page-data.functions";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import styles from "./page.module.css";
import DrawerTrigger from "@/components/drawers/DrawerTrigger/DrawerTrigger";
import SubjectDetailDrawer from "@/components/drawers/SubjectDetailDrawer/SubjectDetailDrawer";
import Symbol from "@/components/controls/Symbol/Symbol";

export default function ClassesPage({ data }: { data: ClassesData }) {
	const { timetable, friends } = data;
	const setToolbar = useToolbar();

	createEffect(() => setToolbar({ title: "Classes" }));

	return (
		<main class={styles.page}>
			{
				<section class={styles.card}>
					<For each={timetable.subjects}>
						{(subject) => (
							<DrawerTrigger
								class={styles.rowButton}
								ariaLabel={`Open ${subject.id}`}
								content={() => (
									<SubjectDetailDrawer subject={subject} friends={friends} />
								)}
							>
								<article class={styles.row}>
									<span class={styles.symbol}>
										<Symbol name={subject.symbol} class={styles.symbolIcon} />
									</span>
									<span>
										<b class={styles.label}>{subject.id}</b>
										<small>
											{subject.slots.length} class
											{subject.slots.length === 1 ? "" : "es"} each week
										</small>
									</span>
									<Symbol name="chevron.right" class={styles.chevronIcon} />
								</article>
							</DrawerTrigger>
						)}
					</For>
				</section>
			}
		</main>
	);
}
