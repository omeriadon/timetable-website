import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "@/components/administration/Administration.module.css";
import { List, ListRow } from "@/components/ui/list";

export type StatisticCount = {
	label: string;
	count: number;
};

type AdminStatisticsGroupProps = {
	title: string;
	icon: string;
	rows: Array<[string, string | number]>;
};

export function AdminStatisticsGroup({
	title,
	icon,
	rows,
}: AdminStatisticsGroupProps) {
	return (
		<section>
			<h2 class={styles.section}>{title}</h2>
			<List>
				{rows.map(([label, value]) => (
					<ListRow>
						<Symbol name={icon} />
						<span class={styles.label}>{label}</span>
						<strong class={styles.detail}>{value}</strong>
					</ListRow>
				))}
			</List>
		</section>
	);
}

type AdminStatisticsCountGroupProps = {
	title: string;
	rows: StatisticCount[];
};

export function AdminStatisticsCountGroup({
	title,
	rows,
}: AdminStatisticsCountGroupProps) {
	if (!rows.length) {
		return null;
	}

	return (
		<section>
			<h2 class={styles.section}>{title}</h2>
			<List>
				{rows.map((row) => (
					<ListRow>
						<span class={styles.label}>{row.label}</span>
						<strong class={styles.detail}>{row.count}</strong>
					</ListRow>
				))}
			</List>
		</section>
	);
}
