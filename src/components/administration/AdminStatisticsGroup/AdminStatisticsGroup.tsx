import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

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
      <h2 className={styles.section}>{title}</h2>
      <div className={styles.card}>
        {rows.map(([label, value]) => (
          <div className={styles.row} key={label}>
            <SymbolIcon name={icon} />
            <span className={styles.label}>{label}</span>
            <strong className={styles.detail}>{value}</strong>
          </div>
        ))}
      </div>
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
      <h2 className={styles.section}>{title}</h2>
      <div className={styles.card}>
        {rows.map((row) => (
          <div className={styles.row} key={row.label}>
            <span className={styles.label}>{row.label}</span>
            <strong className={styles.detail}>{row.count}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
