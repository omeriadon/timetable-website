import { createEffect } from "solid-js";
import type { ClassesData } from "@/lib/server/page-data.functions";
import { useToolbar } from "@/components/Toolbar/Toolbar";
import styles from "./page.module.css";
import DrawerTrigger from "@/components/drawers/DrawerTrigger/DrawerTrigger";
import SubjectDetailDrawer from "@/components/drawers/SubjectDetailDrawer/SubjectDetailDrawer";
import Symbol from "@/components/controls/Symbol/Symbol";
import StaleIndicator from "@/components/controls/StaleIndicator/StaleIndicator";
import { CACHE_KEYS, CACHE_TTLS } from "@/lib/cache/keys";
import { createCachedResource } from "@/lib/cache/swr";
import { apiRequest } from "@/lib/api/client";
import type { Friend, OwnerTimetable } from "@/features/timetable/types";
import { For } from "solid-js";

export default function ClassesPage({ data }: { data: ClassesData }) {
	const cached = createCachedResource<ClassesData>({
		key: CACHE_KEYS.classes,
		initialData: data,
		ttlMs: CACHE_TTLS.classes,
		fetcher: async () => {
			const [timetable, friends] = await Promise.all([
				apiRequest<OwnerTimetable>("v1/timetables/owner"),
				apiRequest<Friend[]>("v1/friends"),
			]);
			return { timetable, friends };
		},
	});
	const timetable = () => cached.data()?.timetable ?? data.timetable;
	const friends = () => cached.data()?.friends ?? data.friends;
	const setToolbar = useToolbar();

	createEffect(() => setToolbar({}));

	return (
		<main class={styles.page}>
			<StaleIndicator active={!!cached.data() && cached.isRevalidating()} />
			{
				<section class={styles.card}>
					<For each={timetable().subjects}>
						{(subject) => (
							<DrawerTrigger
								class={styles.rowButton}
								ariaLabel={`Open ${subject.id}`}
								content={() => (
									<SubjectDetailDrawer subject={subject} friends={friends()} />
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
